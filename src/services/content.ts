import { core } from "@dsnp/sdk";
import { RegistryUpdateLogData } from "@dsnp/sdk/core/contracts/registry";
import {
  addFeedItem,
  addReply,
  clearFeedItems,
} from "../redux/slices/feedSlice";
import { upsertProfile } from "../redux/slices/profileSlice";
import { AnyAction, ThunkDispatch } from "@reduxjs/toolkit";
import {
  ActivityContentNote,
  ActivityContentProfile,
  createProfile,
  requireIsActivityContentNoteType,
  requireIsActivityContentProfileType,
} from "@dsnp/sdk/core/activityContent";
import {
  DSNPGraphChangeType,
  isBroadcastAnnouncement,
  isGraphChangeAnnouncement,
  isProfileAnnouncement,
  isReplyAnnouncement,
  isSignedAnnouncement,
} from "@dsnp/sdk/core/announcements";
import { BatchPublicationLogData } from "@dsnp/sdk/core/contracts/subscription";
import { upsertGraph } from "../redux/slices/graphSlice";
import * as dsnp from "./dsnp";
import { keccak256 } from "web3-utils";
import { HexString } from "@dsnp/sdk/types/Strings";
import { DSNPAnnouncementURI, DSNPUserId } from "@dsnp/sdk/core/identifiers";
import { FeedItem, User } from "../utilities/types";
import { useQuery, UseQueryResult } from "react-query";
import { Permission } from "@dsnp/sdk/core/contracts/identity";
import { buildBaseUploadHostUrl } from "../utilities/buildBaseUploadHostUrl";

//
// Content Package
// This package manages content interaction between the DSNP network, storage, and the redux store.
// It also provides functions to initiate the creation of new content.
//

//
// Parameter types
//

type Dispatch = ThunkDispatch<any, Record<string, any>, AnyAction>;

//
// Exported Functions
//

/**
 * startSubscription initializes subscriptions for DSNP content, processes the
 * results, and routes them to the redux store.
 * @param dispatch thunk dispatch used to interact with the redux store when content arrives
 * @returns unsubscribe function that can be used to stop the subscriptions.
 */
export const startSubscriptions = async (
  dispatch: Dispatch
): Promise<dsnp.UnsubscribeFunction> => {
  dispatch(clearFeedItems());

  return dsnp.startSubscriptions(
    handleBatchAnnouncement(dispatch),
    handleRegistryUpdate(dispatch)
  );
};

/**
 * sendPost stores a post, creates an announcement for it, stores that in a batch, and publishes the batch.
 * @param fromId Id of DSNP user sending post (probably currently logged in user)
 * @param post the post content to add
 * @returns a promise pending completion
 */
export const sendPost = async (
  fromId: HexString,
  post: ActivityContentNote
): Promise<void> => {
  const hash = await storeActivityContent(post);
  const announcement = await dsnp.buildAndSignPostAnnouncement(
    fromId,
    buildBaseUploadHostUrl(`${hash}.json`).toString(),
    hash
  );

  await dsnp.batchAnnouncement(`${hash}.parquet`, announcement);
};

/**
 * sendReply stores a reply, creates an announcement for it, stores that in a batch, and publishes the batch.
 * @param fromId - Who is this from?
 * @param reply - Content for the reply
 * @param parentURI - What is it in reply to?
 * @returns a promise pending completion
 */
export const sendReply = async (
  fromId: string,
  reply: ActivityContentNote,
  parentURI: DSNPAnnouncementURI
): Promise<void> => {
  const hash = await storeActivityContent(reply);
  const announcement = await dsnp.buildAndSignReplyAnnouncement(
    fromId,
    parentURI,
    buildBaseUploadHostUrl(`${hash}.json`).toString(),
    hash
  );

  await dsnp.batchAnnouncement(`${hash}.parquet`, announcement);
};

/**
 * sendProfile stores a profile, creates an announcement for it, stores that in a batch, and publishes the batch.
 * @param fromId - Who is it from?
 * @param profile - What is the profile
 * @returns a promise pending completion
 */
export const saveProfile = async (
  fromId: DSNPUserId,
  profile: ActivityContentProfile
): Promise<void> => {
  const hash = await storeActivityContent(profile);
  const announcement = await dsnp.buildAndSignProfile(
    fromId,
    buildBaseUploadHostUrl(`${hash}.json`).toString(),
    hash
  );

  await dsnp.batchAnnouncement(`${hash}.parquet`, announcement);
};

/**
 * followUser creates and announces a DSNP follow graph change event.
 * @param fromId DSNP Id of user doing the following
 * @param followee DSNP Id of the user being followed
 */
export const followUser = async (
  fromId: DSNPUserId,
  followee: DSNPUserId
): Promise<void> => {
  const announcement = await dsnp.buildAndSignFollowAnnouncement(
    fromId,
    followee
  );
  const hash = core.announcements.serialize(announcement);
  await dsnp.batchAnnouncement(hash, announcement);
};

/**
 * unfollowUser creates and announces a DSNP unfollow graph change event.
 * @param fromId DSNP Id of user doing the unfollowing
 * @param followee DSNP Id of the user being unfollowed
 */
export const unfollowUser = async (
  fromId: DSNPUserId,
  followee: DSNPUserId
): Promise<void> => {
  const announcement = await dsnp.buildAndSignUnfollowAnnouncement(
    fromId,
    followee
  );
  const hash = core.announcements.serialize(announcement);
  await dsnp.batchAnnouncement(hash, announcement);
};

//
// Content Queries
//

// hold on to activity content for 3 minutes before attempting to refresh
const timeToCache = 3 * 60 * 1000;

/**
 * PostQuery returns a query used to retrieve the content of a post or reply
 * @param feedItem item representing announcement of content.
 * @return query result that updates as the query progresses
 */
export const PostQuery = (
  feedItem: FeedItem
): UseQueryResult<ActivityContentNote, Error> => {
  return useQuery(
    ["activityContentPost", feedItem.url],
    async () => {
      const res = await fetch(feedItem.url);
      const maybeNote = await res.json();
      try {
        requireIsActivityContentNoteType(maybeNote);
      } catch (e) {
        console.log(e);
        throw e;
      }
      return maybeNote;
    },
    {
      staleTime: timeToCache,
    }
  );
};

/**
 * ProfileQuery returns a query used to retrieve the content of a profile
 * @param userInfo announcement of a profile containing lookup information
 * @return query result that updates as the query progresses
 */
export const ProfileQuery = (
  userInfo: User | undefined
): UseQueryResult<ActivityContentProfile, Error> => {
  return useQuery(
    ["activityContentProfile", userInfo?.url],
    async () => {
      if (!userInfo?.url) {
        return createProfile({ name: "" });
      }

      const res = await fetch(userInfo.url);
      const maybeProfile = await res.json();
      try {
        requireIsActivityContentProfileType(maybeProfile);
      } catch (e) {
        console.log(e);
        throw e;
      }
      return maybeProfile;
    },
    {
      staleTime: timeToCache,
    }
  );
};

//
// Content subscription dispatch
//

/**
 * handleRegistryUpdate dispatches a profile update for the handle when a registry update is made.
 * @param dispatch function used to dispatch to store
 */
const handleRegistryUpdate = (dispatch: Dispatch) => (
  update: RegistryUpdateLogData
) => {
  dispatch(
    upsertProfile({
      ...createProfile(),
      fromId: core.identifiers
        .convertToDSNPUserId(update.dsnpUserURI)
        .toString(),
      handle: update.handle,
      blockNumber: update.blockNumber,
      blockIndex: update.transactionIndex,
      batchIndex: 0, // batchIndex doesn't apply to registry updates
    })
  );
};

/**
 * handleBatchAnnouncement retrieves and parses a batch and then routes its contents
 * to the redux store.
 * @param dispatch function used to dispatch to the store
 */
const handleBatchAnnouncement = (dispatch: Dispatch) => (
  batchAnnouncement: BatchPublicationLogData
) => {
  dsnp.readBatchFile(batchAnnouncement, async (announcementRow, batchIndex) => {
    try {
      const announcement = announcementRow as unknown;

      if (!isSignedAnnouncement(announcement)) {
        console.log(
          "batched announcement is not signed announcment",
          announcement
        );
        return;
      }

      if (
        !(await core.contracts.registry.isSignatureAuthorizedTo(
          announcement.signature,
          announcement,
          BigInt(announcement.fromId),
          Permission.ANNOUNCE
        ))
      ) {
        console.log(
          "batched announcment has unauthorized signature",
          announcement
        );
        return;
      }

      if (isGraphChangeAnnouncement(announcement)) {
        dispatch(
          upsertGraph({
            follower: announcement.fromId.toString(),
            followee: announcement.objectId.toString(),
            unfollow: announcement.changeType === DSNPGraphChangeType.Unfollow,
            blockNumber: batchAnnouncement.blockNumber,
            blockIndex: batchAnnouncement.transactionIndex,
            batchIndex,
          })
        );
      } else if (isBroadcastAnnouncement(announcement)) {
        let publishedDate;
        if (announcement.createdAt > (2 ^ 53) - 1) {
          publishedDate = new Date(
            Number(announcement.createdAt)
          ).toISOString();
        }
        dispatch(
          addFeedItem({
            fromId: announcement.fromId.toString(),
            blockNumber: batchAnnouncement.blockNumber,
            blockIndex: batchAnnouncement.transactionIndex,
            batchIndex: batchIndex,
            contentHash: announcement.contentHash,
            url: announcement.url,
            published: publishedDate ? publishedDate : undefined,
          })
        );
      } else if (isReplyAnnouncement(announcement)) {
        dispatch(
          addReply({
            fromId: announcement.fromId.toString(),
            inReplyTo: announcement.inReplyTo,
            blockNumber: batchAnnouncement.blockNumber,
            blockIndex: batchAnnouncement.transactionIndex,
            batchIndex: batchIndex,
            contentHash: announcement.contentHash,
            url: announcement.url,
          })
        );
      } else if (isProfileAnnouncement(announcement)) {
        dispatch(
          upsertProfile({
            fromId: announcement.fromId.toString(),
            url: announcement.url,
            blockNumber: batchAnnouncement.blockNumber,
            blockIndex: batchAnnouncement.transactionIndex,
            batchIndex,
          })
        );
      }
      batchIndex++;
    } catch (err) {
      console.log(err);
    }
  });
};

/**
 * storeActivityContent stores activity content on the static server
 * @param content the content to store
 * @returns hash of content (from which url can be derived)
 */
const storeActivityContent = async (
  content: ActivityContentNote | ActivityContentProfile
): Promise<string> => {
  const hash = keccak256(JSON.stringify(content));
  await fetch(
    buildBaseUploadHostUrl(
      `/upload?filename=${encodeURIComponent(hash + ".json")}`
    ).toString(),
    {
      method: "POST",
      mode: "cors",
      body: JSON.stringify(content),
    }
  );
  return hash;
};
