import { randInt } from "@dsnp/test-generators";
import { generateDsnpUserId, getPrefabDsnpUserId } from "./testAddresses";
import { prefabFirstNames, prefabLastNames } from "./testhelpers";
import { generators } from "@dsnp/sdk";
import { ActivityContentProfile } from "@dsnp/sdk/core/activityContent";
import { User } from "../utilities/types";
const generateProfile = generators.activityContent.generateProfile;

/**
 * Generate a random Profile using some prefab
 * names and a generated social address
 */
export const generateRandomProfile = (): ActivityContentProfile & {
  fromId: string;
} => {
  const fromId = generateDsnpUserId();
  const firstName = prefabFirstNames[randInt(prefabFirstNames.length)];
  const lastName = prefabLastNames[randInt(prefabLastNames.length)];
  return {
    fromId,
    ...generateProfile(firstName + " " + lastName),
  };
};

/**
 * Get one of 7 prefabricated profiles meant
 * to work with other prefab components
 * @param index The index of the profile to grab. `Accepted values: 0-6`
 */
export const getPrefabProfile = (index: number): User => {
  return preFabProfiles[index];
};

let baIndex = 0;
const blockAttributes = () => ({
  blockNumber: baIndex,
  blockIndex: baIndex,
  batchIndex: baIndex++,
});

/**
 * An array of prefabricated profiles meant to
 * work with other prefab components
 */
export const preFabProfiles: Array<User> = [
  {
    fromId: getPrefabDsnpUserId(0),
    ...blockAttributes(),
    ...generateProfile("Monday January"),
  },
  {
    fromId: getPrefabDsnpUserId(1),
    ...blockAttributes(),
    ...generateProfile("Tuesday February"),
  },
  {
    fromId: getPrefabDsnpUserId(2),
    ...blockAttributes(),
    ...generateProfile("Wednesday March"),
  },
  {
    fromId: getPrefabDsnpUserId(3),
    ...generateProfile("Thursday April"),
    ...blockAttributes(),
  },
  {
    fromId: getPrefabDsnpUserId(4),
    ...blockAttributes(),
    ...generateProfile("Friday May"),
  },
  {
    fromId: getPrefabDsnpUserId(5),
    ...blockAttributes(),
    ...generateProfile("Saturday June"),
  },
  {
    fromId: getPrefabDsnpUserId(6),
    ...blockAttributes(),
    ...generateProfile("Sunday July"),
  },
];

export const getPrefabProfileByAddress = (
  address: string | undefined
): User | null => {
  for (let i = 0; i < preFabProfiles.length; i++) {
    const prefabProfile = preFabProfiles[i];
    if (prefabProfile.fromId === address) {
      return prefabProfile;
    }
  }
  return null;
};
