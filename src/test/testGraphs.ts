import { Graph, HexString } from "../utilities/types";
import { generateSocialAddress, getPrefabSocialAddress } from "./testAddresses";
import { randInt } from "./testhelpers";

/**
 * Generate a completely randomized social graph
 * @param size The size of the social graph, `default: 4`
 */
export const generateRandomSocialGraph = (size: number = 4): Graph => {
  // Generate addresses
  const addresses: any[] = [];
  for (let i = 0; i < size; i++) {
    addresses[i] = generateSocialAddress();
  }

  // Combine addresses into graph
  const graph: any = {};
  for (let s = 0; s < size; s++) {
    const connections: Set<HexString> = new Set();
    for (let c = 0; c <= randInt(size); c++) {
      const newConnection = addresses[randInt(size)];
      if (!connections.has(newConnection)) {
        connections.add(newConnection);
      }
    }
    graph[addresses[s]] = connections;
  }
  return graph;
};

const adr0 = getPrefabSocialAddress(0);
const adr1 = getPrefabSocialAddress(1);
const adr2 = getPrefabSocialAddress(2);
const adr3 = getPrefabSocialAddress(3);
const adr4 = getPrefabSocialAddress(4);
const adr5 = getPrefabSocialAddress(5);
const adr6 = getPrefabSocialAddress(6);
/**
 * Returns a constant, prefabricated social graph
 * Prefabs are meant to work with other prefab components
 */
export const getPreFabSocialGraph = (): Graph => {
  return {
    [adr0]: new Set([adr1, adr6]),
    [adr1]: new Set([adr0, adr6]),
    [adr2]: new Set(),
    [adr3]: new Set([adr4]),
    [adr4]: new Set([adr3]),
    [adr5]: new Set([adr0, adr1, adr2, adr3, adr4, adr6]),
    [adr6]: new Set(),
  };
};
/**
 * Returns an empty social graph meant to work with prefabs
 */
export const getEmptySocialGraph = (): Graph => {
  return {
    [adr0]: new Set(),
    [adr1]: new Set(),
    [adr2]: new Set(),
    [adr3]: new Set(),
    [adr4]: new Set(),
    [adr5]: new Set(),
    [adr6]: new Set(),
  };
};
