import * as metamask from "./metamask";
import { Wallet } from "../wallet";
import { setConfig } from "@dsnp/sdk";
import { ethers } from "ethers";
import ethereum from "./ethereum";

const metamaskWallet: Wallet = {
  icon:
    "https://cdn.iconscout.com/icon/free/png-512/metamask-2728406-2261817.png",
  login: async () => {
    if (!metamask.isInstalled()) throw new Error("Metamask not installed");
    return metamask.getWalletAddress();
  },
  logout: () => {
    return;
  },
  reload: () => {
    const provider =
      (ethereum && new ethers.providers.Web3Provider(ethereum)) || undefined;
    setConfig({
      provider,
      signer: provider?.getSigner(),
    });
    return;
  },
  getAddress: async () => {
    return metamask.getWalletAddress();
  },
};

export default metamaskWallet;
