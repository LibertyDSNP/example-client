import { DSNPUserId } from "@dsnp/sdk/dist/types/core/identifiers";
import { HexString } from "../utilities/types";
import { generateDsnpUserId, getPrefabDsnpUserId } from "./testAddresses";

/**
 * Unidirectional lookup of graph realationships.
 * For example, this structure can store all follow relationships
 * for all users. The existence of a relationship from account1 to
 * account2 can be checked with graph[account1]?.[account2].
 */
type Graph = Record<DSNPUserId, Record<DSNPUserId, boolean>>;

interface SocialGraph {
  followers: Graph;
  following: Graph;
}

export const generateRandomGraph = (
  dsnpUserId: HexString,
  _size: number = 4
): Record<DSNPUserId, boolean> => {
  return {};
};

// Invert a map from followers to followees into a map of followees to followers.
const followersFromFollowing = (following: Graph): Graph => {
  const followers: Record<string, Record<string, boolean>> = {};
  for (const follower of Object.keys(following)) {
    for (const followee of Object.keys(following[follower])) {
      followers[followee] = {
        ...(followers[followee] || {}),
        [follower]: true,
      };
    }
  }
  return followers;
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
  const following: Record<DSNPUserId, Record<DSNPUserId, boolean>> = {};
  for (let i = 0; i < socialGraphSize; i++) {
    const address: DSNPUserId = generateDsnpUserId();
    const graph = generateRandomGraph(address, graphSize);
    following[address] = graph;
  }

  const followers = followersFromFollowing(following);

  return { following, followers };
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
  const following = {
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

  const followers = followersFromFollowing(following);

  return { following, followers };
};
/**
 * Returns an empty social graph meant to work with prefabs
 */
export const getEmptySocialGraph = (): SocialGraph => {
  return { following: {}, followers: {} };
};
