import { generateRandomGraph } from "../test/testGraphs";
import { generateProfile } from "../test/testProfiles";
import { Graph, HexString, Profile } from "../utilities/types";
import { getPrefabSocialAddress } from "../test/testAddresses";
import { BaseFilters } from "@unfinishedlabs/sdk/dist/types/social/search";
//import { ActionType } from "@unfinishedlabs/sdk/dist/types/batch/actionType";
import {
  Broadcast,
  Reply,
  MessageType,
} from "@unfinishedlabs/sdk/dist/types/types/DSNP";
import { FetchFilters } from "./sdk";

export const createSocialIdentityfromWalletAddress = async (
  walletAddress: HexString
): Promise<HexString> => {
  return walletAddress;
};

export const getSocialIdentityfromWalletAddress = async (
  walletAddress: HexString
): Promise<HexString> => {
  return walletAddress;
};

export const getGraphFromSocialIdentity = async (
  socialAddress: HexString
): Promise<Graph | null> => {
  return generateRandomGraph(socialAddress);
};

export const getProfileFromSocialIdentity = async (
  socialAddress: HexString
): Promise<Profile | null> => {
  return generateProfile(socialAddress, socialAddress);
};
export const fetchEvents = async (
  filter: FetchFilters
): Promise<MessageType[]> => {
  const events = await fakeFeed.slice(filter.from, filter.to);
  return events;
};

export function subscribe(
  filter: BaseFilters,
  callback: (event: MessageType) => void
): string {
  let id = "";
  for (let i = 1; i < 6; i++) {
    id += setTimeout(function () {
      callback(createFakeBroadcast(i, i + 50));
    }, i * 10000 + 10000);
    id += "_";
  }
  return id;
}

export function unsubscribe(id: string): void {
  const idList: string[] = id.split("_");
  idList.forEach((string) => clearTimeout(Number(string)));
}

enum ActionType {
  Private = 0,
  GraphChange = 1,
  Broadcast = 2,
  Profile = 3,
  KeyList = 4,
  PrivateGraphKeyList = 5,
  EncryptionKeyList = 6,
  Reaction = 7,
  PrivateGraphChange = 8,
  Drop = 9,
  EncryptedInbox = 10,
  PrivateBroadcast = 11,
  Reply = 12,
  Batch = 13,
}

const createFakeBroadcast = (from: number, id: number): Broadcast => {
  const actionType = ActionType.Broadcast;
  const fromAddress = getPrefabSocialAddress(from);
  const messageID = "" + id;
  const uri = "fakeuri.com/" + id;
  return {
    actionType,
    fromAddress,
    messageID,
    uri,
  };
};

const createFakeReply = (from: number, id: number, to: number): Reply => {
  const actionType = ActionType.Reply;
  const fromAddress = getPrefabSocialAddress(from);
  const inReplyTo = getPrefabSocialAddress(to);
  const messageID = "" + id;
  const uri = "fakeuri.com/" + id;
  return {
    actionType,
    fromAddress,
    inReplyTo,
    messageID,
    uri,
  };
};

// This array of Broadcasts and Replies is meant to mimic
// posts on the blockchain. For now, the assumption is that
// each index of the array is equivalent to 1 block. I know
// this is a bad equivalency but it makes things easier for
// mocking out the data
// Note beginning of array is equivalent to first block of the chain
export const fakeFeed: MessageType[] = [
  createFakeBroadcast(0, 0), // Profile 0, post ID 0
  createFakeBroadcast(1, 1), // Profile 1, post ID 1
  createFakeReply(1, 2, 0), // Profile 1, post ID 2, replyTo 0
  createFakeReply(3, 3, 0), // Profile 3, post ID 3, replyTo 0
  createFakeReply(1, 4, 0), // etc
  createFakeReply(3, 5, 0),
  createFakeReply(2, 6, 0),
  createFakeBroadcast(3, 7),
  createFakeBroadcast(1, 8),
  createFakeBroadcast(4, 9),
  createFakeBroadcast(6, 10),
  createFakeReply(1, 11, 9),
  createFakeReply(4, 12, 9),
  createFakeBroadcast(3, 13),
  createFakeBroadcast(2, 14),
  createFakeBroadcast(1, 15),
  createFakeReply(2, 16, 8),
  createFakeBroadcast(1, 17),
  createFakeBroadcast(1, 18),
  createFakeBroadcast(6, 19),
  createFakeReply(6, 20, 18),
  createFakeBroadcast(2, 21),
  createFakeBroadcast(4, 22),
  createFakeBroadcast(3, 23),
];
