import { keccak_256 } from "js-sha3";
import { randInt } from "@dsnp/test-generators";
import { FeedItem } from "../utilities/types";
import { generateDsnpUserId, getPrefabDsnpUserId } from "./testAddresses";
import {
  prefabFirstNames,
  prefabLastNames,
  prefabMessages,
} from "./testhelpers";
import {
  ActivityContentNote,
  ActivityContentProfile,
} from "@dsnp/sdk/core/activityContent";

import { generators } from "@dsnp/sdk";
import { AnnouncementType } from "@dsnp/sdk/core/announcements";

const generateNote = generators.activityContent.generateNote;

/**
 * Generate a Profile update. The type `Person` is not a `Profile`
 * @param address the HexString dsnpUserId to make this person update around
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
 * @param address from address of feed item
 * @param content content for feed item
 */
export const generateFeedItem = (
  address: string,
  content: string
): FeedItem => {
  const hash = "0x" + keccak_256(content);
  return {
    announcementType: AnnouncementType.Broadcast,
    fromId: address,
    blockNumber: 50,
    blockIndex: 0,
    batchIndex: 0,
    contentHash: hash,
    url: `http://example.com/${hash}.json`,
  };
};

/**
 * A prefabricated feed with at least one of every
 * important functionality currently available
 */
export const getPrefabFeed = (): FeedItem[] => {
  const address0 = getPrefabDsnpUserId(0);
  const address2 = getPrefabDsnpUserId(2);
  const address3 = getPrefabDsnpUserId(3);

  return [
    // FeedItems that are just Notes
    generateFeedItem(address3, "My favorite dessert is Cake"),
    generateFeedItem(address0, "Going to the mall!"),
    generateFeedItem(address0, "Hello World"),
    generateFeedItem(address2, "Everyone leave me alone"),
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
export const generateRandomReplies = (avgReplies: number): FeedItem[] => {
  const replies: FeedItem[] = [];
  const numReplies = randInt(avgReplies * 2 + 1);
  for (let r = 0; r < numReplies; r++) {
    replies[r] = generateFeedItem(generateDsnpUserId(), getRandomMessage());
  }
  return replies;
};

/**
 * Generate a random feed full of Notes and Profile updates.
 * @param size the size of the feed, default to 4
 * @param avgReplies the average number of replies, default 0
 */
export const generateRandomFeed = (size: number = 4): FeedItem[] => {
  const feed: FeedItem[] = [];
  // For each feed item we need to generate:
  // 1 - Content
  // 2 - Replies if Note
  for (let s = 0; s < size; s++) {
    feed[s] = generateFeedItem(generateDsnpUserId(), getRandomMessage());
  }
  return feed;
};

const getRandomMessage = (): string => {
  return prefabMessages[randInt(prefabMessages.length)];
};

const getRandomName = (): string => {
  const firstName = prefabFirstNames[randInt(prefabFirstNames.length)];
  const lastName = prefabLastNames[randInt(prefabLastNames.length)];
  return firstName + " " + lastName;
};
