import { HexString } from "../../utilities/types";

import * as torus from "./torus/torus";
import * as metamask from "./metamask/metamask";
import Web3 from "web3";

export enum WalletType {
  TORUS = "TORUS",
  METAMASK = "METAMASK",
  // Add new WalletTypes Here
}

interface Wallet {
  login: () => Promise<HexString>;
  logout: () => void;
  getAddress: () => Promise<HexString>;
  getBalance: (walletAddress: HexString) => Promise<number>;
  getWeb3: () => Web3;
}

export const wallet = (walletType: WalletType): Wallet => {
  switch (walletType) {
    case WalletType.TORUS:
      return torusWallet;
    case WalletType.METAMASK:
      return metamaskWallet;
    // Add new WalletTypes Here
  }
};

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

// Add new Wallet interface here
