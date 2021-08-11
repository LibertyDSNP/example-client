import { randInt } from "@dsnp/test-generators";
import { HexString } from "../utilities/types";
import { generateDsnpUserId, getPrefabDsnpUserId } from "./testAddresses";
import { prefabFirstNames, prefabLastNames } from "./testhelpers";
import { generators } from "@dsnp/sdk";
import { ActivityContentProfile } from "@dsnp/sdk/core/activityContent";
import { DSNPUserId } from "@dsnp/sdk/dist/types/core/identifiers";
const generateProfile = generators.activityContent.generateProfile;

/**
 * Generate a random Profile using some prefab
 * names and a generated social address
 */
export const generateRandomProfile = (): ActivityContentProfile & {
  fromId: DSNPUserId;
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
export const getPrefabProfile = (
  index: number
): ActivityContentProfile & { fromId: DSNPUserId } => {
  return preFabProfiles[index];
};

/**
 * An array of prefabricated profiles meant to
 * work with other prefab components
 */
export const preFabProfiles: Array<
  ActivityContentProfile & {
    fromId: DSNPUserId;
  }
> = [
  {
    fromId: getPrefabDsnpUserId(0),
    ...generateProfile("Monday January"),
  },
  {
    fromId: getPrefabDsnpUserId(1),
    ...generateProfile("Tuesday February"),
  },
  {
    fromId: getPrefabDsnpUserId(2),
    ...generateProfile("Wednesday March"),
  },
  {
    fromId: getPrefabDsnpUserId(3),
    ...generateProfile("Thursday April"),
  },
  {
    fromId: getPrefabDsnpUserId(4),
    ...generateProfile("Friday May"),
  },
  {
    fromId: getPrefabDsnpUserId(5),
    ...generateProfile("Saturday June"),
  },
  {
    fromId: getPrefabDsnpUserId(6),
    ...generateProfile("Sunday July"),
  },
];

export const getPrefabProfileByAddress = (
  address: HexString
): (ActivityContentProfile & { fromId: DSNPUserId }) | null => {
  for (let i = 0; i < preFabProfiles.length; i++) {
    const prefabProfile = preFabProfiles[i];
    if (prefabProfile.fromId === address) {
      return prefabProfile;
    }
  }
  return null;
};
