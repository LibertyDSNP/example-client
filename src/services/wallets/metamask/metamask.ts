import Web3 from "web3";
import { HexString } from "../../../utilities/types";
import ethereum from "./ethereum";

export const mmweb3 = new Web3(ethereum as any);

export const isInstalled = (): boolean => {
  return Boolean(ethereum && ethereum.isMetaMask);
};

export const getWalletAddress = async (): Promise<HexString> => {
  const response = await ethereum?.request({ method: "eth_requestAccounts" });
  if (!response) throw new Error("Metamask not installed");
  return response.result ? response.result[0] : response[0];
};

export const getBalance = (account: HexString): Promise<string> => {
  return mmweb3.eth.getBalance(account).then((balance) => {
    return balance;
  });
};
