import { FeedItem, Graph, HexString, Profile } from "../utilities/types";
import * as mocksdk from "./fakesdk";
import * as dsnp from "@unfinishedlabs/sdk";
import { BaseFilters } from "@unfinishedlabs/sdk/dist/types/social/search";
import { MessageType } from "@unfinishedlabs/sdk/dist/types/types/DSNP";
import { ActionType } from "@unfinishedlabs/sdk/dist/types/batch/actionType";

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

const convertToFeedItems = async (events: MessageType[]): Promise<FeedItem[]> => {
  const feedItems: FeedItem[] = events.map((event => {
    switch (event.actionType) {
      case ActionType.Broadcast:
      case ActionType.
    }
  }));
}

export const loadFeed = async (filter: BaseFilters): Promise<FeedItem[]> => {
  const events = await mocksdk.fetchEvents(filter);
  return convertToFeedItems(events);
  //return await dsnp.socialSearch.fetchEvents(filter);
};

export const subscribeToFeed = (
  filter: BaseFilters,
  callback: (event: MessageType) => void
): string => {
  return mocksdk.subscribe(filter, (event: MessageType) => callback(convertToFeedItems([...event])));
  /* return dsnp.socialSearch.subscribe(filter, (events) =>
    callback(convertToFeedItems(events))
  ); */
};

export const unsubscribeToFeed = (id: string): void => {
  mocksdk.unsubscribe(id);
  //dsnp.socialSearch.unsubscribe(id);
};
