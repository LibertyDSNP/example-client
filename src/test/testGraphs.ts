import {
  RelationshipState,
  RelationshipStatus,
} from "../redux/slices/graphSlice";
import { getPrefabDsnpUserId } from "./testAddresses";

/**
 * Unidirectional lookup of graph realationships.
 * For example, this structure can store all follow relationships
 * for all users. The existence of a relationship from account1 to
 * account2 can be checked with graph[account1]?.[account2].
 */
type Graph = Record<string, Record<string, RelationshipState>>;

interface SocialGraph {
  followers: Graph;
  following: Graph;
}

// Invert a map from followers to followees into a map of followees to followers.
const followersFromFollowing = (following: Graph): Graph => {
  const followers: Record<string, Record<string, RelationshipState>> = {};
  for (const follower of Object.keys(following)) {
    for (const followee of Object.keys(following[follower])) {
      followers[followee] = {
        ...(followers[followee] || {}),
        [follower]: {
          status: RelationshipStatus.FOLLOWING,
          blockNumber: 0,
          blockIndex: 0,
          batchIndex: 0,
        },
      };
    }
  }
  return followers;
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
  const followState = {
    status: RelationshipStatus.FOLLOWING,
    blockNumber: 0,
    blockIndex: 0,
    batchIndex: 0,
  };

  const following = {
    [adr0]: {
      [adr1]: followState,
      [adr2]: followState,
    },
    [adr1]: {
      [adr0]: followState,
      [adr6]: followState,
    },
    [adr2]: {
      [adr0]: followState,
      [adr1]: followState,
      [adr3]: followState,
      [adr4]: followState,
      [adr5]: followState,
      [adr6]: followState,
    },
    [adr3]: { [adr6]: followState },
    [adr4]: {
      [adr6]: followState,
      [adr5]: followState,
    },
    [adr5]: { [adr6]: followState },
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
