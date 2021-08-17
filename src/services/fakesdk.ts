import { HexString, Profile } from "../utilities/types";
import { activityContent } from "@dsnp/sdk/generators";
import { DSNPUserId } from "@dsnp/sdk/dist/types/core/identifiers";

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

export const getProfileFromSocialIdentity = async (
  fromId: DSNPUserId
): Promise<Profile> => {
  return {
    fromId,
    ...activityContent.generateProfile(),
  } as Profile;
};
