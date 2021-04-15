import web3Torus from "./tweb3";

export const enableTorus = async (buildEnv) => {
  await web3Torus.initialize(buildEnv || "Testing");
};

export const isInitialized = () => {
  return web3Torus.initialized;
};

export const getUserInfo = async () => {
  const userInfo = await web3Torus.torus.getUserInfo();
  return userInfo;
};

export const logout = () => {
  web3Torus.torus.cleanUp().then(() => {
    sessionStorage.setItem("pageUsingTorus", false);
  });
};

export const getPublicAddress = async (verifier, verifierId) => {
  return await web3Torus.torus.getPublicAddress({
    verifier,
    verifierId,
    isExtended: true,
  });
};

export const getWalletAddress = async () => {
  const { verifier, verifierId } = await getUserInfo();
  return (await getPublicAddress(verifier, verifierId)).address;
};

export const getAccount = async () => {
  return await web3Torus.torus.accounts;
};

export const getBalance = (account) => {
  return web3Torus.web3.eth.getBalance(account).then((balance) => {
    return balance;
  });
};
