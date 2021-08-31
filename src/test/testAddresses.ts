import { HexString } from "../utilities/types";
import { generateHexString } from "@dsnp/test-generators";
import { DSNPUserId } from "@dsnp/sdk/dist/types/core/identifiers";

/**
 * Generate a wallet address
 */
export const generateWalletAddress = (): HexString => {
  return generateHexString(40);
};

/**
 * Generate a social identity address
 */
export const generateDsnpUserId = (): DSNPUserId => {
  return BigInt(generateHexString(40));
};

/**
 * Get a prefabricated wallet address compatible with other prefab data
 * Prefab wallet addres is `0xCODE0000`
 */
export const getPrefabWalletAddress = (index: number): HexString => {
  const regex = /0/gi;
  const address = "0x" + "CADE0000".replace(regex, index.toString());
  return address;
};

/**
 * Get a prefabricated social identity address compatible with other prefab data
 * Prefab social identity addres is `0xCODE0000`
 */
export const getPrefabDsnpUserId = (index: number): DSNPUserId => {
  return BigInt(index);
};
