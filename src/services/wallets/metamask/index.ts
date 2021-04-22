import * as metamask from "./metamask";
import { Wallet } from "../wallet";

const metamaskWallet: Wallet = {
  login: async () => {
    return metamask.getWalletAddress();
  },
  logout: () => {
    return;
  },
  getAddress: async () => {
    return metamask.getWalletAddress();
  },
  getWeb3: () => {
    return metamask.getWeb3();
  },
};

export default metamaskWallet;
