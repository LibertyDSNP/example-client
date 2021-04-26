import * as torus from "./torus";
import { Wallet } from "../wallet";

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
  getWeb3: () => {
    return torus.getWeb3();
  },
};

export default torusWallet;
