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
  dsnpUserId: HexString
): Promise<Graph | null> => {
  return generateRandomGraph(dsnpUserId);
};

export const getProfileFromSocialIdentity = async (
  fromId: HexString
): Promise<Profile> => {
  return {
    fromId,
    ...activityContent.generateProfile(),
  } as Profile;
};
