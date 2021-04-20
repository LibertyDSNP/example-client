import Web3 from "web3";
import Torus from "@toruslabs/torus-embed";
import { provider } from "web3-core";

export type BuildEnvironment =
  | "production"
  | "development"
  | "binance"
  | "testing"
  | "lrc"
  | "beta"
  | undefined;

// interface TorusCtorArgs in torus-embeded types
const torusSettings = {
  //buttonPosition?: 'top-left' | 'top-right' | 'bottom-right' | 'bottom-left'
  //modalZIndex?: number
  //apiKey?: string
};

// interface WhiteLabelParams in torus-embeded types
// example data structure here: https://github.com/torusresearch/torus-embed/blob/master/examples/vue-app/src/data.js
const popupStyling = {
  theme: {
    isDark: false,
    colors: {
      torusBrand1: "#000000",
      torusGray2: "#FBF7F3",
    },
  },
  logoDark:
    "https://www.pngkit.com/png/full/119-1193080_technology-electronics-icons-png.png",
  logoLight:
    "https://www.pngkit.com/png/full/119-1193080_technology-electronics-icons-png.png",
  //topupHide?: boolean
  //featuredBillboardHide?: boolean
  //disclaimerHide?: boolean
  //tncLink?: LocaleLinks<string>
  //privacyPolicy?: LocaleLinks<string>
  //contactLink?: LocaleLinks<string>
  //customTranslations?: LocaleLinks<any>
};

// interface TorusParams in trous-embeded types
const initSettings = (buildEnv: BuildEnvironment) => {
  return {
    buildEnv: buildEnv || "production",
    network: {
      host: "http://localhost:7545",
      chainId: 1337,
      networkName: "Localchain",
    },
    showTorusButton: true,
    whiteLabel: popupStyling,
  };
};

const web3Torus = {
  web3: new Web3(),
  torus: null as Torus | null,
  initialized: false,
  setweb3: function (provider: provider): void {
    const web3Inst = new Web3(provider);
    web3Torus.web3 = web3Inst;
    this.web3.setProvider(provider);
  },
  initialize: async function (buildEnv: BuildEnvironment): Promise<void> {
    const torus = new Torus(torusSettings);
    await torus.init(initSettings(buildEnv));
    this.initialized = true;
    try {
      await torus.login({ verifier: undefined });
      web3Torus.setweb3(torus.provider);
      web3Torus.torus = torus;
    } catch (error) {
      torus.clearInit();
      this.initialized = false;
      throw new Error("Login Cancelled");
    }
  },
};

export default web3Torus;
