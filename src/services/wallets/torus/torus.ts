import Web3 from "web3";
import { HexString } from "../../../utilities/types";
import web3Torus, { BuildEnvironment } from "./tweb3";

// Torus doesn't give us access to their internal verifier types
// They also don't enforce their own verifier system consistently
// This means we need to create our own and update it.
// This verifiers array is our list of approved verifiers based
// off their internal list. That list can be found here:
// https://github.com/torusresearch/torus-embed/blob/master/types/embed.d.ts
const verifiers = ["google", "reddit", "discord"] as const;
type VerifierTypes = typeof verifiers[number];
type AddressType = undefined | string | { address: string };

interface UserInfo {
  email: string;
  name: string;
  profileImage: string;
  verifier: string;
  verifierId: string;
}

export const enableTorus = async (
  buildEnv?: BuildEnvironment
): Promise<void> => {
  await web3Torus.initialize(buildEnv || "production");
};

export const isInitialized = (): boolean => {
  return web3Torus.initialized;
};

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
  const typedVerifier: VerifierTypes = getTypedVerifier(verifier);
  const walletAddressHolder = await getPublicAddress(typedVerifier, verifierId);
  if (!walletAddressHolder) throw new Error("No Wallet Address found for User");
  if (typeof walletAddressHolder === "string") return walletAddressHolder;
  return walletAddressHolder.address;
};

const getTypedVerifier = (untypedVerifier: string): VerifierTypes => {
  const typedVerifier = verifiers.find((verifier) => {
    return untypedVerifier.includes(verifier);
  });

  if (!typedVerifier) throw new Error("Unknown Verifier");
  return typedVerifier as VerifierTypes;
};

export const getBalance = async (walletAddress: HexString): Promise<string> => {
  return await web3Torus.web3.eth.getBalance(walletAddress).then((balance) => {
    return balance;
  });
};

export const getWeb3 = (): Web3 => {
  return web3Torus.web3;
};
