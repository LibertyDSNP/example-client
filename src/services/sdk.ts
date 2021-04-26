import { Graph, HexString, Profile } from "../utilities/types";
import * as mocksdk from "./fakesdk";
import * as dsnp from "@unfinishedlabs/sdk";
import { BaseFilters } from "@unfinishedlabs/sdk/dist/types/social/search";
import { MessageType } from "@unfinishedlabs/sdk/dist/types/types/DSNP";

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

export const loadFeed = async (filter: BaseFilters): Promise<MessageType[]> => {
  return await mocksdk.fetchEvents(filter);
  //return await dsnp.socialSearch.fetchEvents(filter);
};

export const subscribeToFeed = (
  filter: BaseFilters,
  callback: (event: MessageType) => void
): string => {
  return mocksdk.subscribe(filter, callback);
  //return dsnp.socialSearch.subscribe(filter, callback);
};

export const unsubscribeToFeed = (id: string): void => {
  mocksdk.unsubscribe(id);
  //dsnp.socialSearch.unsubscribe(id);
};
