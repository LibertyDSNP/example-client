import { Graph, HexString, SocialGraph } from "../utilities/types";
import { generateSocialAddress, getPrefabSocialAddress } from "./testAddresses";

export const generateRandomGraph = (
  socialAddress: HexString,
  size: number = 4
): Graph => {
  const following: HexString[] = [];
  for (let i = 0; i < size; i++) {
    following[i] = generateSocialAddress();
  }

  const followers: HexString[] = [];
  for (let i = 0; i < size; i++) {
    followers[i] = generateSocialAddress();
  }

  return {
    socialAddress,
    following,
    followers,
  };
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
  const socialGraph = new Map<HexString, Graph>();
  for (let i = 0; i < socialGraphSize; i++) {
    const address = generateSocialAddress();
    const graph = generateRandomGraph(address, graphSize);
    socialGraph.set(address, graph);
  }

  return socialGraph;
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
export const getPreFabSocialGraph = (): SocialGraph => {
  const socialGraph = new Map<HexString, Graph>([
    [
      adr0,
      {
        socialAddress: adr0,
        following: [adr1, adr6],
        followers: [adr1, adr2],
      },
    ],
    [
      adr1,
      {
        socialAddress: adr1,
        following: [adr0, adr6],
        followers: [adr0, adr2],
      },
    ],
    [
      adr2,
      {
        socialAddress: adr2,
        following: [adr0, adr1, adr3, adr4, adr5, adr6],
        followers: [],
      },
    ],
    [
      adr3,
      {
        socialAddress: adr3,
        following: [adr6],
        followers: [adr2],
      },
    ],
    [
      adr4,
      {
        socialAddress: adr4,
        following: [adr6, adr5],
        followers: [adr2],
      },
    ],
    [
      adr5,
      {
        socialAddress: adr5,
        following: [adr6],
        followers: [adr2, adr4],
      },
    ],
    [
      adr6,
      {
        socialAddress: adr6,
        following: [],
        followers: [adr0, adr1, adr2, adr3, adr4, adr5],
      },
    ],
  ]);

  return socialGraph;
};
/**
 * Returns an empty social graph meant to work with prefabs
 */
export const getEmptySocialGraph = (): SocialGraph => {
  const socialGraph = new Map<HexString, Graph>([
    [adr0, { socialAddress: adr0, following: [], followers: [] }],
    [adr1, { socialAddress: adr1, following: [], followers: [] }],
    [adr2, { socialAddress: adr2, following: [], followers: [] }],
    [adr3, { socialAddress: adr3, following: [], followers: [] }],
    [adr4, { socialAddress: adr4, following: [], followers: [] }],
    [adr5, { socialAddress: adr5, following: [], followers: [] }],
    [adr6, { socialAddress: adr6, following: [], followers: [] }],
  ]);

  return socialGraph;
};
