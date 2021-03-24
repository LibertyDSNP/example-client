import { getPublicKey } from "../services/readChain";
import { walletDecrypt } from "./walletDecrypt";
import { keccak256 } from "../utilities/hash";
import { hexToBase64 } from "../utilities/buffer";
import {
  contractEventsToKeyList,
  getKeysThatCanBeDecryptedByWallet,
  decryptKeyList,
} from "@liberty30/lib-privacy-js/KeyList";

export const privateGraphKeyListTopic = keccak256("PrivateGraphKeyList(bytes)");
export const encryptionKeyListTopic = keccak256("EncryptionKeyList(bytes)");

const keyDecrypt = async (walletAddress, sem) => {
  const keyResult = await walletDecrypt(walletAddress, sem);
  return JSON.parse(keyResult);
};

export const getLastFrom = (listOfKeys) => {
  if (listOfKeys && listOfKeys.length) return listOfKeys[listOfKeys.length - 1];
  return null;
};

export const requestKeys = async (walletAddress, contract, keyManagerTopic) => {
  const events = await contract.getPastEvents({
    fromBlock: 0,
    topics: [keyManagerTopic],
  });
  if (events.length === 0) {
    return [];
  }

  // Version upgrade web3.js. Change incoming when web privacy js upgrades
  const keyList = await contractEventsToKeyList(
    events.map((e) => ({ args: { keyList: e.returnValues.keyList } }))
  );

  // Get the most recent key for our starting points:
  const publicKey = await getPublicKey(walletAddress);
  const walletKeys = getKeysThatCanBeDecryptedByWallet(publicKey, keyList);
  if (walletKeys.length === 0) {
    return [];
  }
  const mostRecentKey = await keyDecrypt(
    walletAddress,
    getLastFrom(walletKeys)
  );

  return decryptKeyList([mostRecentKey], keyList);
};

export const getKeyById = (listOfKeys, keyId) => {
  if (!listOfKeys) return null;
  const base64KeyId = keyId.substr(0, 2) === "0x" ? hexToBase64(keyId) : keyId;
  return listOfKeys.find((x) => x.k === base64KeyId) || null;
};
