import { FeedItem, HexString, Profile, Reply } from "../utilities/types";
import * as fakesdk from "./fakesdk";
import { setConfig, core } from "@dsnp/sdk";
import { Publication } from "@dsnp/sdk/core/contracts/publisher";
import {
  Registration,
  RegistryUpdateLogData,
} from "@dsnp/sdk/core/contracts/registry";
import { providers, utils as ethUtils } from "ethers";
import { keccak256 } from "web3-utils";
import { addFeedItem, clearFeedItems } from "../redux/slices/feedSlice";
import { upsertProfile } from "../redux/slices/profileSlice";
import { AnyAction, ThunkDispatch } from "@reduxjs/toolkit";
import { Store } from "./Storage";
import {
  ActivityContentNote,
  ActivityContentProfile,
  isActivityContentNoteType,
  isActivityContentProfileType,
  createProfile,
} from "@dsnp/sdk/core/activityContent";
import {
  BroadcastAnnouncement,
  AnnouncementType,
  SignedBroadcastAnnouncement,
  SignedReplyAnnouncement,
  ReplyAnnouncement,
  GraphChangeAnnouncement,
  DSNPGraphChangeType,
  SignedProfileAnnouncement,
  SignedAnnouncement,
} from "@dsnp/sdk/core/announcements";
import { BatchPublicationLogData } from "@dsnp/sdk/core/contracts/subscription";
import { WalletType } from "./wallets/wallet";
import torusWallet from "./wallets/torus";
import { upsertGraph } from "../redux/slices/graphSlice";
import { DSNPUserId } from "@dsnp/sdk/dist/types/core/identifiers";

interface BatchFileData {
  url: URL;
  hash: HexString;
}

type Dispatch = ThunkDispatch<any, Record<string, any>, AnyAction>;

export const getSocialIdentities =
  core.contracts.registry.getRegistrationsByWalletAddress;

export const getProfile = async (fromId: HexString): Promise<Profile> => {
  const profile = await fakesdk.getProfileFromSocialIdentity(fromId);
  if (!profile) throw new Error("Invalid Social Identity Address");
  return profile;
};

const batchAnnouncement = async (
  hash: HexString,
  announcement: SignedAnnouncement
): Promise<void> => {
  const batchData = await core.batch.createFile(hash + ".parquet", [
    announcement,
  ]);

  const publication = buildPublication(
    batchData,
    core.announcements.AnnouncementType.Broadcast
  );

  await core.contracts.publisher.publish([publication]);
};

export const sendPost = async (post: FeedItem): Promise<void> => {
  if (!post.content) return;
  const hash = await storeActivityContent(post.content);
  const announcement = await buildAndSignPostAnnouncement(hash, post);

  await batchAnnouncement(hash, announcement);
};

export const sendReply = async (
  reply: Reply,
  inReplyTo: HexString
): Promise<void> => {
  if (!reply.content || !inReplyTo) return;

  const hash = await storeActivityContent(reply.content);
  const announcement = await buildAndSignReplyAnnouncement(
    hash,
    reply.fromId,
    inReplyTo
  );

  await batchAnnouncement(hash, announcement);
};

export const saveProfile = async (
  fromId: DSNPUserId,
  profile: ActivityContentProfile
): Promise<void> => {
  const hash = await storeActivityContent(profile);
  const announcement = await buildAndSignProfile(fromId, hash);

  await batchAnnouncement(hash, announcement);
};

export const startSubscriptions = async (
  dispatch: ThunkDispatch<any, Record<string, any>, AnyAction>
): Promise<Record<string, any>> => {
  dispatch(clearFeedItems());

  // subscribe to all announcements
  let blockNumber: number;
  let blockIndex = 0;
  const unsubscribeToBatchPublications = await core.contracts.subscription.subscribeToBatchPublications(
    (announcement: BatchPublicationLogData) => {
      if (announcement.blockNumber !== blockNumber) {
        blockNumber = announcement.blockNumber;
        blockIndex = 0;
      } else {
        blockIndex++;
      }
      handleBatchAnnouncement(dispatch, announcement, blockIndex);
    },
    {
      fromBlock: 1,
    }
  );

  // subscribe to registry events
  const unsubscribeToRegistryUpdate = await core.contracts.subscription.subscribeToRegistryUpdates(
    handleRegistryUpdate(dispatch),
    {
      fromBlock: 1,
    }
  );

  return {
    unsubscribeToRegistryUpdate,
    unsubscribeToBatchPublications,
  };
};

export const setupProvider = (walletType: WalletType): void => {
  let eth;

  if (walletType === WalletType.TORUS) {
    eth = torusWallet.getWeb3().currentProvider;
  } else if (walletType === WalletType.METAMASK) {
    const global: any = window;
    eth = global.ethereum;

    if (!eth) {
      throw new Error(
        "Could not create provider, because ethereum has not been set"
      );
    }
  } else {
    throw new Error(
      `Unknown walletType attempting to setup provider: ${walletType}`
    );
  }

  const provider = new providers.Web3Provider(eth);
  setConfig({
    provider: provider,
    signer: provider.getSigner(),
    store: new Store(),
  });
};

const buildPublication = (
  batchData: BatchFileData,
  type: AnnouncementType.Broadcast | AnnouncementType.Reply
): Publication => {
  return {
    announcementType: type,
    fileUrl: batchData.url.toString(),
    fileHash: batchData.hash,
  };
};

// TODO: move this dispatch code into a callback for subscribe
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

export const isGraphChangeAnnouncement = (
  obj: unknown
): obj is GraphChangeAnnouncement => {
  return (
    (obj as Record<string, unknown>)["announcementType"] ===
    AnnouncementType.GraphChange
  );
};

export const isBroadcastAnnouncement = (
  obj: unknown
): obj is BroadcastAnnouncement => {
  const type = (obj as Record<string, unknown>)["announcementType"];
  return (
    type === AnnouncementType.Profile ||
    type === AnnouncementType.Broadcast ||
    type === AnnouncementType.Reply
  );
};

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

const handleBatchAnnouncement = (
  dispatch: Dispatch,
  batchAnnouncement: BatchPublicationLogData,
  blockIndex: number
) => {
  let batchIndex = 0;
  core.batch
    .openURL((batchAnnouncement.fileUrl.toString() as any) as URL)
    .then((reader: any) =>
      core.batch.readFile(reader, (announcementRow: AnnouncementType) => {
        const announcement = announcementRow as unknown;
        if (isGraphChangeAnnouncement(announcement)) {
          dispatchGraphChange(dispatch, announcement);
        } else if (isBroadcastAnnouncement(announcement)) {
          fetchAndDispatchContent(
            dispatch,
            announcement,
            batchAnnouncement.blockNumber,
            blockIndex,
            batchIndex++
          );
        }
      })
    )
    .catch((err) => console.log(err));
};

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

const buildAndSignPostAnnouncement = async (
  hash: string,
  post: FeedItem
): Promise<SignedBroadcastAnnouncement> => ({
  ...core.announcements.createBroadcast(
    post.fromId,
    `${process.env.REACT_APP_UPLOAD_HOST}/${hash}.json`,
    hash
  ),
  signature: "0x00000000", // TODO: call out to wallet to get this signed
});

const buildAndSignReplyAnnouncement = async (
  hash: string,
  replyFromId: HexString,
  replyInReplyTo: HexString
): Promise<SignedReplyAnnouncement> => ({
  ...core.announcements.createReply(
    replyFromId,
    `${process.env.REACT_APP_UPLOAD_HOST}/${hash}.json`,
    hash,
    replyInReplyTo
  ),
  signature: "0x00000000", // TODO: call out to wallet to get this signed
});

const buildAndSignProfile = async (
  fromId: DSNPUserId,
  hash: string
): Promise<SignedProfileAnnouncement> => ({
  ...core.announcements.createProfile(
    fromId,
    `${process.env.REACT_APP_UPLOAD_HOST}/${hash}.json`,
    hash
  ),
  signature: "0x00000000", // TODO: call out to wallet to get this signed
});
