import * as torus from "./torus";
import { Wallet } from "../wallet";

const torusWallet: Wallet = {
  icon:
    "data:image/jpeg;base64,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",
  login: async () => {
    await torus.enableTorus();
    return await torus.getWalletAddress();
  },
  logout: () => {
    if (torus.isInitialized()) {
      torus.logout();
    }
  },
  reload: async () => {
    if (torus.isInitialized()) return;
    await torus.enableTorus();
  },
  getAddress: async () => {
    return await torus.getWalletAddress();
  },
  getWeb3: () => {
    return torus.getWeb3();
  },
};

export default torusWallet;