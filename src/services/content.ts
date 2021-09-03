import { FeedItem, Profile, Reply } from "../utilities/types";
import { core } from "@dsnp/sdk";
import { RegistryUpdateLogData } from "@dsnp/sdk/core/contracts/registry";
import { addFeedItem, clearFeedItems } from "../redux/slices/feedSlice";
import { upsertProfile } from "../redux/slices/profileSlice";
import { AnyAction, ThunkDispatch } from "@reduxjs/toolkit";
import {
  ActivityContentNote,
  ActivityContentProfile,
  isActivityContentNoteType,
  isActivityContentProfileType,
  createProfile,
} from "@dsnp/sdk/core/activityContent";
import {
  BroadcastAnnouncement,
  ReplyAnnouncement,
  GraphChangeAnnouncement,
  DSNPGraphChangeType,
} from "@dsnp/sdk/core/announcements";
import { BatchPublicationLogData } from "@dsnp/sdk/core/contracts/subscription";
import { upsertGraph } from "../redux/slices/graphSlice";
import * as dsnp from "./dsnp";
import { UnsubscribeFunction } from "@dsnp/sdk/dist/types/core/contracts/utilities";
import { keccak256 } from "web3-utils";
import { HexString } from "@dsnp/sdk/dist/types/types/Strings";
import { DSNPUserId } from "@dsnp/sdk/dist/types/core/identifiers";

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
): Promise<UnsubscribeFunction> => {
  dispatch(clearFeedItems());

  return dsnp.startSubscriptions(
    handleBatchAnnouncement(dispatch),
    handleRegistryUpdate(dispatch)
  );
};

/**
 * sendPost stores a post, creates an announcement for it, stores that in a batch, and publishes the batch.
 * @param post the post content to add
 * @returns a promise pending completion
 */
export const sendPost = async (post: FeedItem): Promise<void> => {
  if (!post.content) return;
  const hash = await storeActivityContent(post.content);
  const announcement = await dsnp.buildAndSignPostAnnouncement(
    post.fromId,
    `${process.env.REACT_APP_UPLOAD_HOST}/${hash}.json`,
    hash
  );

  await dsnp.batchAnnouncement(`${hash}.parquet`, announcement);
};

/**
 * sendReply stores a reply, creates an announcement for it, stores that in a batch, and publishes the batch.
 * @param post the post content to add
 * @returns a promise pending completion
 */
export const sendReply = async (
  reply: Reply,
  inReplyTo: HexString
): Promise<void> => {
  if (!reply.content || !inReplyTo) return;

  const hash = await storeActivityContent(reply.content);
  const announcement = await dsnp.buildAndSignReplyAnnouncement(
    reply.fromId,
    inReplyTo,
    `${process.env.REACT_APP_UPLOAD_HOST}/${hash}.json`,
    hash
  );

  await dsnp.batchAnnouncement(`${hash}.parquet`, announcement);
};

/**
 * sendProfile stores a profile, creates an announcement for it, stores that in a batch, and publishes the batch.
 * @param post the profile content to add
 * @returns a promise pending completion
 */
export const saveProfile = async (
  fromId: DSNPUserId,
  profile: ActivityContentProfile
): Promise<void> => {
  const hash = await storeActivityContent(profile);
  const announcement = await dsnp.buildAndSignProfile(
    fromId,
    `${process.env.REACT_APP_UPLOAD_HOST}/${hash}.json`,
    hash
  );

  await dsnp.batchAnnouncement(`${hash}.parquet`, announcement);
};

//
// Internal Functions
//

/**
 * dispatchActivityContent determines what type of content its receiving and
 * routes it to the correct redux store
 * @param dispatch function used to dispatch to store
 * @param message announcment information from batch
 * @param activityContent activity content retrieved from announcment
 * @param blockNumber number of block containing the publication
 * @param blockIndex index of log message (relative to other DSNP logs) within the block
 * @param batchIndex index of announcment within the batch
 */
const dispatchActivityContent = (
  dispatch: Dispatch,
  message: BroadcastAnnouncement,
  activityContent: ActivityContentNote | ActivityContentProfile,
  blockNumber: number,
  blockIndex: number,
  batchIndex: number
) => {
  if (isActivityContentNoteType(activityContent)) {
    return dispatchFeedItem(
      dispatch,
      message,
      activityContent as ActivityContentNote,
      blockNumber
    );
  } else if (isActivityContentProfileType(activityContent)) {
    return dispatchProfile(
      dispatch,
      message,
      activityContent as ActivityContentProfile,
      blockNumber,
      blockIndex,
      batchIndex
    );
  }
};

/**
 * dispatchFeedItem dispatches a feed item to the redux store
 * @param dispatch function used to dispatch to store
 * @param message announcment information from batch
 * @param content activity content retrieved from announcment
 * @param blockNumber number of block containing the publication
 */
const dispatchFeedItem = (
  dispatch: Dispatch,
  message: BroadcastAnnouncement | ReplyAnnouncement,
  content: ActivityContentNote,
  blockNumber: number
) => {
  const decoder = new TextDecoder();
  dispatch(
    addFeedItem({
      fromId: decoder.decode((message.fromId as any) as Uint8Array),
      blockNumber: blockNumber,
      hash: decoder.decode((message.contentHash as any) as Uint8Array),
      published: content.published,
      uri: decoder.decode((message.url as any) as Uint8Array),
      content: content,
      inReplyTo:
        message.announcementType === core.announcements.AnnouncementType.Reply
          ? decoder.decode((message.inReplyTo as any) as Uint8Array)
          : undefined,
    })
  );
};

/**
 * dispatchProfile dispatches a profile to the redux store
 * @param dispatch function used to dispatch to store
 * @param message announcment information from batch
 * @param profile profile to dispatch
 * @param blockNumber number of block containing the publication
 * @param blockIndex index of log message (relative to other DSNP logs) within the block
 * @param batchIndex index of announcment within the batch
 */
const dispatchProfile = (
  dispatch: Dispatch,
  message: BroadcastAnnouncement,
  profile: ActivityContentProfile,
  blockNumber: number,
  blockIndex: number,
  batchIndex: number
) => {
  const decoder = new TextDecoder();

  dispatch(
    upsertProfile({
      ...profile,
      fromId: decoder.decode((message.fromId as any) as Uint8Array),
      blockNumber,
      blockIndex,
      batchIndex,
    } as Profile)
  );
};

/**
 * handleRegistryUpdate dispatches a profile update for the handle when a registry update is made.
 * @param dispatch function used to dispatch to store
 * @param update registry log message containg DSNP uri and handle
 */
const handleRegistryUpdate = (dispatch: Dispatch) => (
  update: RegistryUpdateLogData
) => {
  dispatch(
    upsertProfile({
      ...createProfile(),
      fromId: core.identifiers.convertDSNPUserURIToDSNPUserId(
        update.dsnpUserURI
      ),
      handle: update.handle,
    } as Profile)
  );
};

/**
 * fetchAndDispatchContent retrieves activity content for an annoucement and then dispatches
 * it to the redux store.
 * @param dispatch function used to dispatch to store
 * @param message broadcast annoucnement containing activity content url
 * @param blockNumber block number of block containing publication
 * @param blockIndex index of publication within block
 * @param batchIndex index of announcment within batch
 * @throws if content cannot be retrieved
 */
const fetchAndDispatchContent = async (
  dispatch: Dispatch,
  message: BroadcastAnnouncement,
  blockNumber: number,
  blockIndex: number,
  batchIndex: number
) => {
  const decoder = new TextDecoder();

  try {
    const url = decoder.decode((message.url as any) as Uint8Array);
    const res = await fetch(url);
    const activityContent = await res.json();
    dispatchActivityContent(
      dispatch,
      message,
      activityContent,
      blockNumber,
      blockIndex,
      batchIndex
    );
  } catch (err) {
    console.log(err);
  }
};

/**
 * dipatchGraphChange updates the social graph in redux with a graph change announcment.
 * @param dispatch function used to dispatch to store
 * @param graphChange graph change announcment
 */
const dispatchGraphChange = (
  dispatch: Dispatch,
  graphChange: GraphChangeAnnouncement
) => {
  const decoder = new TextDecoder();
  dispatch(
    upsertGraph({
      follower: decoder.decode((graphChange.fromId as any) as Uint8Array),
      followee: decoder.decode((graphChange.objectId as any) as Uint8Array),
      unfollow: graphChange.changeType === DSNPGraphChangeType.Unfollow,
    })
  );
};

/**
 * handleBatchAnnouncment retrieves and parses a batch and then routes its contents
 * to the redux store.
 * @param dispatch function used to dispatch to the store
 * @param blockIndex index of publication within block
 */
const handleBatchAnnouncement = (dispatch: Dispatch) => (
  batchAnnouncement: BatchPublicationLogData,
  blockIndex: number
) => {
  dsnp.readBatchFile(batchAnnouncement, (announcementRow, batchIndex) => {
    try {
      const announcement = announcementRow as unknown;
      if (dsnp.isGraphChangeAnnouncement(announcement)) {
        dispatchGraphChange(dispatch, announcement);
      } else if (dsnp.isBroadcastAnnouncement(announcement)) {
        fetchAndDispatchContent(
          dispatch,
          announcement,
          batchAnnouncement.blockNumber,
          blockIndex,
          batchIndex++
        );
      }
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
  const hash = keccak256(core.activityContent.serialize(content));
  await fetch(
    `${process.env.REACT_APP_UPLOAD_HOST}/upload?filename=${encodeURIComponent(
      hash + ".json"
    )}`,
    {
      method: "POST",
      mode: "cors",
      body: JSON.stringify(content),
    }
  );
  return hash;
};