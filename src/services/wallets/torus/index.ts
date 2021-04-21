import * as torus from "./torus";
import { Wallet } from "../wallet";
import { HexString } from "../../../utilities/types";

const torusWallet: Wallet = {
  login: async () => {
    await torus.enableTorus();
    return await torus.getWalletAddress();
  },
  logout: () => {
    if (torus.isInitialized()) {
      torus.logout();
    }
  },
  getAddress: async () => {
    return await torus.getWalletAddress();
  },
  getBalance: async (walletAddress: HexString) => {
    const stringBal = await torus.getBalance(walletAddress);
    return Number(stringBal);
  },
  getWeb3: () => {
    return torus.getWeb3();
  },
};

export default torusWallet;
