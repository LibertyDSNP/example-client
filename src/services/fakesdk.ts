import { generateRandomSocialGraph } from "../test/testGraphs";
import { generateProfile } from "../test/testProfiles";
import { Graph, HexString, Profile } from "../utilities/types";

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
  _socialAddress: HexString
): Promise<Graph | null> => {
  return generateRandomSocialGraph(10);
};

export const getProfileFromSocialIdentity = async (
  socialAddress: HexString
): Promise<Profile | null> => {
  return generateProfile(socialAddress);
};
