import { FeedItem, Graph, HexString, Profile } from "../utilities/types";
import * as mocksdk from "./fakesdk";
import { BaseFilters } from "@unfinishedlabs/sdk/dist/types/social/search";
import {
  Broadcast,
  Reply,
  MessageType,
} from "@unfinishedlabs/sdk/dist/types/types/DSNP";
//import { ActionType } from "@unfinishedlabs/sdk/dist/types/batch/actionType";
//import * as dsnp from "@unfinishedlabs/sdk";

export const getSocialIdentity = async (
  walletAddress: HexString
): Promise<HexString> => {
  let socialAddress: HexString = await mocksdk.getSocialIdentityfromWalletAddress(
    walletAddress
  );
  if (!socialAddress) {
    socialAddress = await mocksdk.createSocialIdentityfromWalletAddress(
      walletAddress
    );
  }
  return socialAddress;
};
export const getGraph = async (socialAddress: HexString): Promise<Graph> => {
  const graph = await mocksdk.getGraphFromSocialIdentity(socialAddress);
  if (!graph) throw new Error("Invalid Social Identity Address");
  return graph;
};

export const getProfile = async (
  socialAddress: HexString
): Promise<Profile> => {
  const profile = await mocksdk.getProfileFromSocialIdentity(socialAddress);
  if (!profile) throw new Error("Invalid Social Identity Address");
  return profile;
};

// Note to keep in mind. All Replies are Broadcasts
const convertToFeedItems = (events: MessageType[]): FeedItem[] => {
  return events.map((event: MessageType) => {
    if (!isBroadcast(event)) throw new Error("Bad Message Filter");
    const feedItem: FeedItem = {
      address: event.fromAddress,
      replies: [],
      blockNumber: 5, //event.blockNumber,
      hash: event.messageID,
      timestamp: 1619815126, //event.timestamp,
      topic: event.actionType.toString(),
      uri: event.uri,
    };
    if (!isReply(event)) return feedItem;
    const parentFeedItem: FeedItem = {
      replies: [feedItem],
      hash: event.inReplyTo,
    };
    return parentFeedItem;
  });
};

export const loadFeed = async (filter: BaseFilters): Promise<FeedItem[]> => {
  const events = await mocksdk.fetchEvents(filter);
  //const events = await dsnp.socialSearch.fetchEvents(filter);
  return convertToFeedItems(events);
};

export const subscribeToFeed = (
  filter: BaseFilters,
  callback: (events: FeedItem[]) => void
): string => {
  return mocksdk.subscribe(filter, (event) =>
    callback(convertToFeedItems([event]))
  );
  /* return dsnp.socialSearch.subscribe(filter, (event: Broadcast | Reply) =>
    callback(convertToFeedItems([event]))
  ); */
};

export const unsubscribeToFeed = (id: string): void => {
  mocksdk.unsubscribe(id);
  //dsnp.socialSearch.unsubscribe(id);
};
export const getNewestBlock = (): number => {
  return mocksdk.fakeFeed.length - 1;
};

// Remove once sdk exports this type
export declare type BlockNumber = number;
export interface FetchFilters extends BaseFilters {
  limit?: number;
  to?: BlockNumber;
  from?: BlockNumber;
}

const isBroadcast = (event: any): event is Broadcast => {
  return event.messageID !== undefined && event.uri !== undefined;
};

const isReply = (event: any): event is Reply => {
  return (
    event.messageID !== undefined &&
    event.uri !== undefined &&
    event.inReplyTo !== undefined
  );
};
