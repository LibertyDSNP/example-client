import { HexString } from "@liberty30/lib-privacy-js";
import { UserRelation } from "types";
import { getPreFabSocialGraph } from "./testGraphs";
import { getPrefabProfileByAddress, preFabProfiles } from "./testProfiles";

export const getPreFabUserRelationList = (
  address: HexString
): UserRelation[] => {
  const relationList: UserRelation[] = [];
  for (let i = 0; i < preFabProfiles.length; i++) {
    const prefabProfile = preFabProfiles[i];
    if (prefabProfile.address === address) continue;
    const relation = getPreFabUserRelation(address, prefabProfile.address);
    relationList.push(relation);
  }
  return relationList;
};
export const getPreFabUserRelation = (
  address: HexString,
  targetAddress: HexString
): UserRelation => {
  const graph = getPreFabSocialGraph();
  return {
    address: targetAddress,
    following: graph[address].has(targetAddress),
    profile: getPrefabProfileByAddress(targetAddress)
  };
};
