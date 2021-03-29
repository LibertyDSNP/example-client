import { Graph, HexString, Profile } from "../utilities/types";
import * as sdk from "./mocksdk";

export const getSocialIdentity = async (
  walletAddress: HexString
): Promise<HexString> => {
  let socialAddress: HexString = await sdk.getSocialIdentityfromWalletAddress(
    walletAddress
  );
  if (!socialAddress) {
    socialAddress = await sdk.createSocialIdentityfromWalletAddress(
      walletAddress
    );
  }
  return socialAddress;
};
export const getGraph = async (
  socialAddress: HexString
): Promise<Graph | null> => {
  const graph: Graph | null = await sdk.getGraphFromSocialIdentity(
    socialAddress
  );
  return graph;
};

export const getProfile = async (
  socialAddress: HexString
): Promise<Profile | null> => {
  const profile: Profile | null = await sdk.getProfileFromSocialIdentity(
    socialAddress
  );
  return profile;
};
