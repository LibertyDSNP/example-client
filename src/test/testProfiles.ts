import { randInt } from "@dsnp/test-generators";
import { Profile, HexString } from "../utilities/types";
import { generatedsnpUserId, getPrefabdsnpUserId } from "./testAddresses";
import { prefabFirstNames, prefabLastNames } from "./testhelpers";
import { generators } from "@dsnp/sdk";
const generateProfile = generators.activityContent.generateProfile;

/**
 * Generate a random Profile using some prefab
 * names and a generated social address
 */
export const generateRandomProfile = (): Profile => {
  const dsnpUserId = generatedsnpUserId();
  const firstName = prefabFirstNames[randInt(prefabFirstNames.length)];
  const lastName = prefabLastNames[randInt(prefabLastNames.length)];
  return {
    dsnpUserId,
    ...generateProfile(firstName + " " + lastName),
  };
};

/**
 * Get one of 7 prefabricated profiles meant
 * to work with other prefab components
 * @param index The index of the profile to grab. `Accepted values: 0-6`
 */
export const getPrefabProfile = (index: number): Profile => {
  return preFabProfiles[index];
};

/**
 * An array of prefabricated profiles meant to
 * work with other prefab components
 */
export const preFabProfiles: Array<Profile> = [
  {
    dsnpUserId: getPrefabdsnpUserId(0),
    ...generateProfile("Monday January"),
  },
  {
    dsnpUserId: getPrefabdsnpUserId(1),
    ...generateProfile("Tuesday February"),
  },
  {
    dsnpUserId: getPrefabdsnpUserId(2),
    ...generateProfile("Wednesday March"),
  },
  {
    dsnpUserId: getPrefabdsnpUserId(3),
    ...generateProfile("Thursday April"),
  },
  {
    dsnpUserId: getPrefabdsnpUserId(4),
    ...generateProfile("Friday May"),
  },
  {
    dsnpUserId: getPrefabdsnpUserId(5),
    ...generateProfile("Saturday June"),
  },
  {
    dsnpUserId: getPrefabdsnpUserId(6),
    ...generateProfile("Sunday July"),
  },
];

export const getPrefabProfileByAddress = (
  address: HexString
): Profile | null => {
  for (let i = 0; i < preFabProfiles.length; i++) {
    const prefabProfile = preFabProfiles[i];
    if (prefabProfile.dsnpUserId === address) {
      return prefabProfile;
    }
  }
  return null;
};
