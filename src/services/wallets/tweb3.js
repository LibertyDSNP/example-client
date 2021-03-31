import Web3 from "web3";
import Torus from "@toruslabs/torus-embed";

const web3Torus = {
  web3: new Web3(),
  torus: {},
  enabled: false,
  setweb3: function (provider) {
    const web3Inst = new Web3(provider);
    web3Torus.web3 = web3Inst;
    this.web3.setProvider(provider);
  },
  initialize: async function (buildEnv) {
    const torus = new Torus();
    await torus.init({
      buildEnv: buildEnv || "production",
      network: {
        host: "http://localhost:7545",
        chainId: 1337,
        networkName: "Localchain",
      },
      showTorusButton: false,
    });
    this.enabled = true;
    try {
      await torus.login();
      web3Torus.setweb3(torus.provider);
      web3Torus.torus = torus;
      sessionStorage.setItem("pageUsingTorus", buildEnv);
    } catch (error) {
      torus.clearInit();
      throw new Error("Login Cancelled");
    }
  },
  login: async function () {
    try {
      await this.torus.login();
    } catch (error) {
      console.log(error);
    }
  },
  uninitialize: function () {
    this.torus.clearInit();
    this.enabled = false;
  },
};

export default web3Torus;
