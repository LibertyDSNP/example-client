import { randInt } from "@unfinishedlabs/test-generators"
import { Profile, HexString } from "../utilities/types";
import {
  generateSocialAddress,
  generateWalletAddress,
  getPrefabSocialAddress,
  getPrefabWalletAddress,
} from "./testAddresses";
import {
  prefabFirstNames,
  prefabLastNames,
  randImage,
} from "./testhelpers";

/**
 * Generate a complete Profile
 * @param address the address to use with the profile
 * @param name the name for the profile
 * @param preferredUsername the username for the profile
 * @param icon the image/icon to use for the profile
 */
export const generateProfile = (
  walletAddress: HexString,
  socialAddress: HexString,
  name?: string,
  preferredUsername?: string,
  icon?: string
): Profile => {
  return {
    "@context": "https://www.w3.org/ns/activitystreams",
    name: name || "",
    preferredUsername: preferredUsername || "",
    icon: { url: icon || "" },
    walletAddress,
    socialAddress,
    actor: socialAddress,
    discoverable: true,
    type: "Person",
    summary: "",
    url: "",
    id: "http://localhost:3003/api/announce/" + socialAddress,
  };
};

/**
 * Generate a random Profile using some prefab
 * names and a generated social address
 */
export const generateRandomProfile = (): Profile => {
  const walletAddress = generateWalletAddress();
  const socialAddress = generateSocialAddress();
  const firstName = prefabFirstNames[randInt(prefabFirstNames.length)];
  const lastName = prefabLastNames[randInt(prefabLastNames.length)];
  const username =
    firstName.substring(0, 3) + lastName.substring(0, 3).toLocaleLowerCase();
  const icon = randImage;
  return generateProfile(
    walletAddress,
    socialAddress,
    firstName + " " + lastName,
    username,
    icon
  );
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
  generateProfile(
    getPrefabWalletAddress(0),
    getPrefabSocialAddress(0),
    "Monday January",
    "0Monday0",
    "https://image.shutterstock.com/image-vector/monday-time-sparkle-shine-word-600w-731826949.jpg"
  ),
  generateProfile(
    getPrefabWalletAddress(1),
    getPrefabSocialAddress(1),
    "Tuesday February",
    "1Tuesday1",
    "https://image.shutterstock.com/image-vector/traditional-taco-tuesday-neon-light-600w-1193206603.jpg"
  ),
  generateProfile(
    getPrefabWalletAddress(2),
    getPrefabSocialAddress(2),
    "Wednesday March",
    "2Wednesday2",
    "https://image.shutterstock.com/image-vector/wednesday-pop-art-illustration-vector-600w-219333010.jpg"
  ),
  generateProfile(
    getPrefabWalletAddress(3),
    getPrefabSocialAddress(3),
    "Thursday April",
    "3Thursday3",
    "https://image.shutterstock.com/image-vector/throwback-thursday-brush-lettering-vector-600w-467925458.jpg"
  ),
  generateProfile(
    getPrefabWalletAddress(4),
    getPrefabSocialAddress(4),
    "Friday May",
    "4Friday4",
    "https://image.shutterstock.com/image-vector/friday-loading-concept-vector-illustration-600w-1160548075.jpg"
  ),
  generateProfile(
    getPrefabWalletAddress(5),
    getPrefabSocialAddress(5),
    "Saturday June",
    "5Saturday5",
    "https://image.shutterstock.com/image-vector/hello-saturday-typographic-design-vector-600w-394210252.jpg"
  ),
  generateProfile(
    getPrefabWalletAddress(6),
    getPrefabSocialAddress(6),
    "Sunday July",
    "6Sunday6",
    "https://image.shutterstock.com/image-vector/sunday-funday-hand-written-lettering-600w-1420085606.jpg"
  ),
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
