import { randInt } from "@dsnp/test-generators";
import { Profile, HexString } from "../utilities/types";
import { generateSocialAddress, getPrefabSocialAddress } from "./testAddresses";
import { prefabFirstNames, prefabLastNames } from "./testhelpers";

/**
 * Generate a complete Profile
 * @param address the address to use with the profile
 * @param name the name for the profile
 * @param handle the username for the profile
 * @param icon the image/icon to use for the profile
 */
export const generateProfile = (
  socialAddress: HexString,
  name?: string
): Profile => {
  return {
    "@context": "https://www.w3.org/ns/activitystreams",
    name: name || "",
    socialAddress,
    type: "Person",
    published: "17ad9d83a36",
  };
};

/**
 * Generate a random Profile using some prefab
 * names and a generated social address
 */
export const generateRandomProfile = (): Profile => {
  const socialAddress = generateSocialAddress();
  const firstName = prefabFirstNames[randInt(prefabFirstNames.length)];
  const lastName = prefabLastNames[randInt(prefabLastNames.length)];
  return generateProfile(socialAddress, firstName + " " + lastName);
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
 * An array of prefabricated profiles meants to
 * work with other prefab components
 */
export const preFabProfiles = [
  generateProfile(getPrefabSocialAddress(0), "Monday January"),
  generateProfile(getPrefabSocialAddress(1), "Tuesday February"),
  generateProfile(getPrefabSocialAddress(2), "Wednesday March"),
  generateProfile(getPrefabSocialAddress(3), "Thursday April"),
  generateProfile(getPrefabSocialAddress(4), "Friday May"),
  generateProfile(getPrefabSocialAddress(5), "Saturday June"),
  generateProfile(getPrefabSocialAddress(6), "Sunday July"),
];

export const getPrefabProfileByAddress = (
  address: HexString
): Profile | null => {
  for (let i = 0; i < preFabProfiles.length; i++) {
    const prefabProfile = preFabProfiles[i];
    if (prefabProfile.socialAddress === address) {
      return prefabProfile;
    }
  }
  return null;
};
