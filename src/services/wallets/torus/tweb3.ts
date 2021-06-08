import Torus from "@toruslabs/torus-embed";

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
  logoDark: "https://avatars.githubusercontent.com/u/78103996?s=200&v=4",
  logoLight: "https://avatars.githubusercontent.com/u/78103996?s=200&v=4",
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
    buildEnv:
      (process.env.REACT_APP_TORUS_BUILD_ENV as BuildEnvironment) ||
      buildEnv ||
      "production",
    network: {
      host: process.env.REACT_APP_CHAIN_HOST || "http://localhost:7545",
      chainId: Number(process.env.REACT_APP_CHAIN_ID) || 1337,
      networkName: process.env.REACT_APP_CHAIN_NAME || "Localchain",
    },
    showTorusButton: true,
    whiteLabel: popupStyling,
  };
};

const localTorus = {
  torus: null as Torus | null,
  initialized: false,
  initialize: async function (buildEnv: BuildEnvironment): Promise<void> {
    const torus = new Torus(torusSettings);
    await torus.init(initSettings(buildEnv));
    this.initialized = true;
    try {
      await torus.login({ verifier: undefined });
      localTorus.torus = torus;
    } catch (error) {
      torus.clearInit();
      this.initialized = false;
      throw new Error("Login Cancelled");
    }
  },
};

export default localTorus;
