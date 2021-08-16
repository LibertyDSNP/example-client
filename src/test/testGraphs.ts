import { DSNPUserId } from "@dsnp/sdk/dist/types/core/identifiers";
import { HexString } from "../utilities/types";
import { generateDsnpUserId, getPrefabDsnpUserId } from "./testAddresses";

type SocialGraph = Record<DSNPUserId, Record<DSNPUserId, boolean>>;

export const generateRandomGraph = (
  dsnpUserId: HexString,
  _size: number = 4
): Record<DSNPUserId, boolean> => {
  return {};
};

/**
 * Generate a completely randomized social graph
 * @param size The size of the social graph, `default: 4`
 */
export const generateRandomSocialGraph = (
  socialGraphSize: number = 4,
  graphSize: number = 4
): SocialGraph => {
  // Generate addresses
  const socialGraph: Record<DSNPUserId, Record<DSNPUserId, boolean>> = {};
  for (let i = 0; i < socialGraphSize; i++) {
    const address: DSNPUserId = generateDsnpUserId();
    const graph = generateRandomGraph(address, graphSize);
    socialGraph[address] = graph;
  }

  return socialGraph;
};

const adr0 = getPrefabDsnpUserId(0);
const adr1 = getPrefabDsnpUserId(1);
const adr2 = getPrefabDsnpUserId(2);
const adr3 = getPrefabDsnpUserId(3);
const adr4 = getPrefabDsnpUserId(4);
const adr5 = getPrefabDsnpUserId(5);
const adr6 = getPrefabDsnpUserId(6);
/**
 * Returns a constant, prefabricated social graph
 * Prefabs are meant to work with other prefab components
 */

export const getPreFabSocialGraph = (): SocialGraph => {
  const socialGraph = {
    [adr0]: { [adr1]: true, [adr2]: true },
    [adr1]: { [adr0]: true, [adr6]: true },
    [adr2]: {
      [adr0]: true,
      [adr1]: true,
      [adr3]: true,
      [adr4]: true,
      [adr5]: true,
      [adr6]: true,
    },
    [adr3]: { [adr6]: true },
    [adr4]: { [adr6]: true, [adr5]: true },
    [adr5]: { [adr6]: true },
    [adr6]: {},
  };

  return socialGraph;
};
/**
 * Returns an empty social graph meant to work with prefabs
 */
export const getEmptySocialGraph = (): SocialGraph => {
  const socialGraph = {
    [adr0]: {},
    [adr1]: {},
    [adr2]: {},
    [adr3]: {},
    [adr4]: {},
    [adr5]: {},
    [adr6]: {},
  };

  return socialGraph;
};
