import { HexString } from "../../../utilities/types";
import ethereum from "./ethereum";

export const isInstalled = (): boolean => {
  return Boolean(ethereum?.isMetaMask);
};

export const getWalletAddress = async (): Promise<HexString> => {
  const response = await ethereum?.request({ method: "eth_requestAccounts" });
  if (!response) throw new Error("Metamask not installed");
  return response.result ? response.result[0] : response[0];
};
