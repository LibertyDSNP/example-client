import { Graph, HexString, Profile } from "../utilities/types";
<<<<<<< HEAD
=======
<<<<<<< HEAD
<<<<<<< HEAD
import * as sdk from "./mocksdk";
>>>>>>> begun wallet login process

export const getDSNPProfile = async (
  socialAddress: HexString
): Promise<Profile | null> => {
  const { server: apiServer } = await getNetwork();

  const response = await fetch(`${apiServer}/api/resolve/${socialAddress}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    signal,
  }).catch((e) => {
    if (e.name !== "AbortError") {
      throw e;
    }
  });
  if ((response as Response).status === 200) {
    return await (response as Response).json();
  }
  return null;
};

export const getGraph = async (siAddress: HexString): Promise<Graph | null> => {
  const friendlyProfileRequest = await api.getPersonFromSocialIdentity(
    siAddress
  );
  if ((friendlyProfileRequest as Response).status === 200) {
    return await (friendlyProfileRequest as Response).json();
  }
  return null;
};
<<<<<<< HEAD

function getNetwork(): { server: any } | PromiseLike<{ server: any }> {
  throw new Error("Function not implemented.");
}
=======
=======
=======
import * as sdk from "./mocksdk";
>>>>>>> ced0d1f... More login progress

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

<<<<<<< HEAD
function getNetwork(): { server: any } | PromiseLike<{ server: any }> {
  throw new Error("Function not implemented.");
}
>>>>>>> 9f3606e... begun wallet login process
=======
export const getProfile = async (
  socialAddress: HexString
): Promise<Profile | null> => {
  const profile: Profile | null = await sdk.getProfileFromSocialIdentity(
    socialAddress
  );
  return profile;
};
>>>>>>> ced0d1f... More login progress
>>>>>>> begun wallet login process
