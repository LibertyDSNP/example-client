import { Graph, HexString, Profile } from "../utilities/types";

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

function getNetwork(): { server: any } | PromiseLike<{ server: any }> {
  throw new Error("Function not implemented.");
}
