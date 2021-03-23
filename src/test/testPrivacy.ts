import { SimpleKeyFormat } from "@liberty30/lib-privacy-js";
import { HexString } from "types";
import { generateBase64String, generateHexString } from "./testhelpers";

/**
 * Generate an array of Encryption Keys
 * @param size The number of keys to put in the cache
 */
export const generateEncryptedKeyCache = (size: number): SimpleKeyFormat[] => {
  const keyCache: SimpleKeyFormat[] = [];
  for (let s = 0; s < size; s++) {
    keyCache[s] = {
      t: "x25519",
      d: generateBase64String(43),
      k: generateBase64String(43)
    };
  }
  return keyCache;
};

export const getPreFabEncryptedKeyCache = (): SimpleKeyFormat[] => {
  const keyCache: SimpleKeyFormat[] = [];
  for (let s = 0; s < 3; s++) {
    keyCache[s] = {
      t: "x25519",
      d: s + "5hwCE4ViZkZRUmb+TjZea5XHcRhAiNm5sTjzHMPX0+W=",
      k: s + "4qZwE+ZI0xADt8cNUV3ppQeSgd+Q+fQh+w9Rv7Gd6g=="
    };
  }
  return keyCache;
};

/**
 * Generate an array of Private Graph Keys
 * @param size The number of keys to put in the cache
 */
export const generatePrivateGraphKeyCache = (
  size: number
): SimpleKeyFormat[] => {
  const keyCache: SimpleKeyFormat[] = [];
  for (let s = 0; s < size; s++) {
    keyCache[s] = {
      k: "0",
      t: "xsalsa20",
      x: generateBase64String(43)
    };
  }
  return keyCache;
};

export const getPreFabPrivateGraphKeyCache = (): SimpleKeyFormat[] => {
  const keyCache: SimpleKeyFormat[] = [];
  for (let s = 0; s < 3; s++) {
    keyCache[s] = {
      k: "0",
      t: "xsalsa20",
      x: s + "pv9iRksALJUubKPjA8PRmLq1ZCMVVNtGDsrc4g9dGf="
    };
  }
  return keyCache;
};

/**
 * Generate a dead drop id
 */
export const generateDeadDropId = (): HexString => {
  return generateHexString(40);
};
