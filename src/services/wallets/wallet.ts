import { HexString } from "../../utilities/types";
import metamaskWallet from "./metamask";
import Web3 from "web3";

// HOW TO ADD A WALLET
// Add the new wallet to the enum and switch/case
// Both places are marked with a comment
// Then, create a Folder for the new wallet with it's implementation
// code. create an index.ts file in the folder that implements
// the Wallet interface below. Look at torus or metamask for
// an example.

export enum WalletType {
  NONE = "NONE",
  METAMASK = "METAMASK",
  // Add new WalletTypes Here
}

export const wallet = (walletType: WalletType): Wallet => {
  switch (walletType) {
    case WalletType.NONE:
      return noWallet;
    case WalletType.METAMASK:
      return metamaskWallet;
    // Add new WalletTypes Here
  }
};

export interface Wallet {
  icon: string;
  login: () => Promise<HexString>;
  logout: () => void;
  reload: () => void;
  getAddress: () => Promise<HexString>;
  getWeb3: () => Web3;
}

export const noWallet: Wallet = {
  icon:
    "https://icons.veryicon.com/png/o/business/business-style-icon/wallet-62.png",
  login: async () => await "",
  logout: () => {
    return;
  },
  reload: () => {
    return;
  },
  getAddress: async () => await "",
  getWeb3: () => new Web3(),
};
