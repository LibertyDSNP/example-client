import { generateRandomGraph } from "../test/testGraphs";
import { Graph, HexString, Profile } from "../utilities/types";
import { activityContent } from "@dsnp/sdk/generators";

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
  return { socialAddress, ...activityContent.generateProfile() };
};
