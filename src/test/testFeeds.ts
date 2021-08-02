import { keccak_256 } from "js-sha3";
import { randInt } from "@dsnp/test-generators";
import { FeedItem, HexString } from "../utilities/types";
import { generateSocialAddress, getPrefabSocialAddress } from "./testAddresses";
import {
  prefabFirstNames,
  prefabLastNames,
  prefabMessages,
  randImage,
} from "./testhelpers";
import {
  ActivityContentNote,
  ActivityContentAttachment,
  ActivityContentProfile,
} from "@dsnp/sdk/core/activityContent";

import { generators } from "@dsnp/sdk";
const generateImageAttachment =
  generators.activityContent.generateImageAttachment;
const generateNote = generators.activityContent.generateNote;

/**
 * Generate a Profile update. The type `Person` is not a `Profile`
 * @param address the HexString socialAddress to make this person update around
 * @param name the new name of the profile update
 * @param handle the new username of the profile update
 */
export const generatePerson = (name?: string): ActivityContentProfile => {
  return {
    "@context": "https://www.w3.org/ns/activitystreams",
    name: name || "",
    type: "Profile",
  };
};

/**
 * Generate a FeedItem needed to make a full Feed
 * You'll need to generate Content first. Use
 * `generateNote()` or `generatePerson()`.
 * @param content the content to make the FeedItem around
 * @param constTime use the standard time of this or now time
 * @param replies? an array of FeedItem replies to this FeedItem
 */
export const generateFeedItem = (
  address: HexString,
  content: ActivityContentNote,
  constTime: boolean = false,
  replies?: FeedItem<ActivityContentNote>[]
): FeedItem<ActivityContentNote> => {
  return {
    timestamp: constTime ? 1608580122 : Math.round(Date.now() / 1000),
    inbox: false,
    topic: "0x" + keccak_256("Announce(string,bytes32,bytes32)"),
    fromAddress: address,
    content: content,
    replies: replies || [],
    blockNumber: 50,
    hash: keccak_256("this is a hash of the feed item"),
    rawContent: "", // This can be simulated, but it's annoying to do so.
  };
};

/**
 * A prefabricated feed with at least one of every
 * important functionality currently available
 */
export const getPrefabFeed = (): FeedItem<ActivityContentNote>[] => {
  const address0 = getPrefabSocialAddress(0);
  const address1 = getPrefabSocialAddress(1);
  const address2 = getPrefabSocialAddress(2);
  const address3 = getPrefabSocialAddress(3);
  const noteWithAttachment = generateNote("Everyone leave me alone", true);

  return [
    // FeedItems that are just Notes
    generateFeedItem(
      address3,
      generateNote("My favorite dessert is Cake"),
      true
    ),
    generateFeedItem(address0, generateNote("Going to the mall!"), true),
    // FeedItem note with replies
    generateFeedItem(address0, generateNote("Hello World"), true, [
      generateFeedItem(address1, generateNote("Hi Monday!"), true),
      generateFeedItem(address2, generateNote("Go away"), true, [
        generateFeedItem(address0, generateNote("You're mean"), true),
      ]),
    ]),
    // FeedItem Note with media
    generateFeedItem(address2, noteWithAttachment, true),
  ];
};

/**
 * Generate random note content with an attachment
 */
export const generateRandomNote = (): ActivityContentNote => {
  const message = getRandomMessage();
  return generateNote(message, true);
};

/**
 * Generate random profile update content
 */
export const generateRandomPerson = (): ActivityContentProfile => {
  const name = getRandomName();
  if (randInt(5) > 0) return generatePerson();
  if (randInt(5) > 0) return generatePerson(name);
  return generatePerson(name);
};

/**
 * Generate random replies Array. Only generates depth 0 random replies
 * @param avgReplies the average number of replies
 */
export const generateRandomReplies = (
  avgReplies: number
): FeedItem<ActivityContentNote>[] => {
  const replies: FeedItem<ActivityContentNote>[] = [];
  const numReplies = randInt(avgReplies * 2 + 1);
  for (let r = 0; r < numReplies; r++) {
    replies[r] = generateFeedItem(
      generateSocialAddress(),
      generateRandomNote()
    );
  }
  return replies;
};

/**
 * Generate a random feed full of Notes and Profile updates.
 * @param size the size of the feed, default to 4
 * @param avgReplies the average number of replies, default 0
 */
export const generateRandomFeed = (
  size: number = 4,
  avgReplies: number = 0
): FeedItem<ActivityContentNote>[] => {
  const feed: FeedItem<ActivityContentNote>[] = [];
  // For each feed item we need to generate:
  // 1 - Content
  // 2 - Replies if Note
  for (let s = 0; s < size; s++) {
    const content: ActivityContentNote = generateRandomNote();
    feed[s] = generateFeedItem(
      generateSocialAddress(),
      content,
      false,
      generateRandomReplies(avgReplies)
    );
  }
  return feed;
};

const getRandomMessage = (): string => {
  return prefabMessages[randInt(prefabMessages.length)];
};

const getRandomAttachment = (): ActivityContentAttachment[] => {
  return [generateImageAttachment(randImage)];
};

const getRandomName = (): string => {
  const firstName = prefabFirstNames[randInt(prefabFirstNames.length)];
  const lastName = prefabLastNames[randInt(prefabLastNames.length)];
  return firstName + " " + lastName;
};
