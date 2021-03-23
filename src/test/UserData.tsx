import { UserRelation } from "types";
import { getPrefabSocialAddress } from "./testAddresses";
import { getPrefabProfile } from "./testProfiles";

export const mockUserRelationList: UserRelation[] = [
  {
    address: getPrefabSocialAddress(0),
    following: false,
    profile: getPrefabProfile(0)
  },
  {
    address: getPrefabSocialAddress(1),
    following: true,
    profile: getPrefabProfile(1)
  },
  {
    address: getPrefabSocialAddress(2),
    following: false,
    profile: getPrefabProfile(2)
  },
  {
    address: getPrefabSocialAddress(3),
    following: false,
    profile: getPrefabProfile(3)
  },
  {
    address: getPrefabSocialAddress(4),
    following: false,
    profile: getPrefabProfile(4)
  },
  {
    address: getPrefabSocialAddress(5),
    following: false,
    profile: getPrefabProfile(5)
  },
  {
    address: getPrefabSocialAddress(6),
    following: true,
    profile: getPrefabProfile(6)
  }
];

export const addressesToUsers = jest.fn();
