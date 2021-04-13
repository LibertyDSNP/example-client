import { HexString } from "../../utilities/types";
import web3Torus, { BuildEnvironment } from "./tweb3";

export const enableTorus = async (
  buildEnv?: BuildEnvironment
): Promise<void> => {
  await web3Torus.initialize(buildEnv || "testing");
};

export const isInitialized = (): boolean => {
  return web3Torus.initialized;
};

interface UserInfo {
  email: string;
  name: string;
  profileImage: string;
  verifier: string;
  verifierId: string;
}

export const getUserInfo = async (): Promise<UserInfo> => {
  const userInfo = await web3Torus.torus?.getUserInfo(
    "This site is requesting your information"
  );
  if (!userInfo) throw new Error("Unable to find user's info");
  return userInfo;
};

export const logout = (): void => {
  web3Torus.torus?.cleanUp().then(() => {
    sessionStorage.setItem("pageUsingTorus", "false");
  });
};

type VerifierTypes = "google" | "reddit" | "discord";
type AddressType = undefined | string | { address: string };
export const getPublicAddress = async (
  verifier: VerifierTypes,
  verifierId: string
): Promise<AddressType> => {
  return await web3Torus.torus?.getPublicAddress({
    verifier,
    verifierId,
    isExtended: true,
  });
};

export const getWalletAddress = async (): Promise<string> => {
  const { verifier, verifierId } = await getUserInfo();
  const walletObject = await getPublicAddress(
    verifier as VerifierTypes,
    verifierId
  );
  if (!walletObject) throw new Error("No Wallet Address found for User");
  else if (typeof walletObject === "string") return walletObject;
  else return walletObject.address;
};

export const getBalance = async (walletAddress: HexString): Promise<string> => {
  return await web3Torus.web3.eth.getBalance(walletAddress).then((balance) => {
    return balance;
  });
};
