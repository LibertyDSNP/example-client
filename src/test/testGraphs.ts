import { Graph, HexString } from "../utilities/types";
import { generateDsnpUserId, getPrefabDsnpUserId } from "./testAddresses";

export const generateRandomGraph = (
  dsnpUserId: HexString,
  size: number = 4
): Graph => {
  const following = [...Array(size)].map(() => generateDsnpUserId());
  const followers = [...Array(size)].map(() => generateDsnpUserId());

  return {
    dsnpUserId,
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
): Graph[] => {
  // Generate addresses
  const socialGraph = [];
  for (let i = 0; i < socialGraphSize; i++) {
    const address = generateDsnpUserId();
    const graph = generateRandomGraph(address, graphSize);
    socialGraph.push(graph);
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

export const getPreFabSocialGraph = (): Graph[] => {
  const socialGraph = [
    {
      dsnpUserId: adr0,
      following: [adr1, adr2],
      followers: [adr1, adr6],
    },
    {
      dsnpUserId: adr1,
      following: [adr0, adr6],
      followers: [adr0, adr2],
    },
    {
      dsnpUserId: adr2,
      following: [adr0, adr1, adr3, adr4, adr5, adr6],
      followers: [],
    },
    {
      dsnpUserId: adr3,
      following: [adr6],
      followers: [adr2],
    },
    {
      dsnpUserId: adr4,
      following: [adr6, adr5],
      followers: [adr2],
    },
    {
      dsnpUserId: adr5,
      following: [adr6],
      followers: [adr2, adr4],
    },
    {
      dsnpUserId: adr6,
      following: [],
      followers: [adr0, adr1, adr2, adr3, adr4, adr5],
    },
  ];

  return socialGraph;
};
/**
 * Returns an empty social graph meant to work with prefabs
 */
export const getEmptySocialGraph = (): Graph[] => {
  const socialGraph = [
    { dsnpUserId: adr0, following: [], followers: [] },
    { dsnpUserId: adr1, following: [], followers: [] },
    { dsnpUserId: adr2, following: [], followers: [] },
    { dsnpUserId: adr3, following: [], followers: [] },
    { dsnpUserId: adr4, following: [], followers: [] },
    { dsnpUserId: adr5, following: [], followers: [] },
    { dsnpUserId: adr6, following: [], followers: [] },
  ];

  return socialGraph;
};
