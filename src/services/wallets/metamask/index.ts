import * as metamask from "./metamask";
import { Wallet } from "../wallet";
import { HexString } from "../../../utilities/types";

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
  getBalance: async (walletAddress: HexString) => {
    const stringBal = await metamask.getBalance(walletAddress);
    return Number(stringBal);
  },
  getWeb3: () => {
    return metamask.getWeb3();
  },
};

export default metamaskWallet;
