import Web3 from "web3";
import { HexString } from "../../../utilities/types";
import ethereum, { EthereumProvider } from "./ethereum";

const mmweb3 = new Web3(ethereum as EthereumProvider);

export const getWeb3 = (): Web3 => {
  if (!isInstalled()) throw new Error("Metamask not installed");
  return mmweb3;
};

export const isInstalled = (): boolean => {
  return Boolean(ethereum?.isConnected);
};

export const getWalletAddress = async (): Promise<HexString> => {
  const response = await ethereum?.request({ method: "eth_requestAccounts" });
  if (!response) throw new Error("Metamask not installed");
  return response.result ? response.result[0] : response[0];
};
