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
  createImage,
  createVideo,
  ActivityContentNote,
  ActivityContentAttachment,
  ActivityContentPerson,
  ActivityContentImage,
  ActivityContentVideo,
} from "@dsnp/sdk/core/activityContent";

/**
 * Generate an image attachement from a given url.
 * @param url The url to generate the attachement around
 */
export const generateImageAttachment = (url: string): ActivityContentImage => {
  return createImage(
    url,
    url.replace(/(^\w+:|^)\/\//, ""),
    { algorithm: "" },
    0,
    0
  );
};

/**
 * Generate a video attachement from a given url.
 * @param url The url to generate the attachement around
 */
export const generateVideoAttachment = (url: string): ActivityContentVideo => {
  return createVideo(
    url,
    url.replace(/(^\w+:|^)\/\//, ""),
    { algorithm: "" },
    0,
    0
  );
};

/**
 * Generate a Note piece of Content for us in constructing a Feed
 * @param address the HexString socialAddress to associate with making this note
 * @param message The message string to display in the note
 * @param attachment the NoteAttachements for pictures and videos in this Note.
 */
export const generateNote = (
  address: HexString,
  message: string,
  attachment?: ActivityContentAttachment[]
): ActivityContentNote => {
  return {
    "@context": "https://www.w3.org/ns/activitystreams",
    content: message,
    attachment: attachment || [],
    type: "Note",
    published: "17ad9cb8551",
  };
};

/**
 * Generate a Profile update. The type `Person` is not a `Profile`
 * @param address the HexString socialAddress to make this person update around
 * @param name the new name of the profile update
 * @param handle the new username of the profile update
 */
export const generatePerson = (name?: string): ActivityContentPerson => {
  return {
    "@context": "https://www.w3.org/ns/activitystreams",
    name: name || "",
    type: "Person",
    published: "17ad9cb8551",
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
  content: ActivityContentNote,
  constTime: boolean = false,
  replies?: FeedItem[]
): FeedItem => {
  return {
    timestamp: constTime ? 1608580122 : Math.round(Date.now() / 1000),
    inbox: false,
    topic: "0x" + keccak_256("Announce(string,bytes32,bytes32)"),
    fromAddress: "",
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
export const getPrefabFeed = (): FeedItem[] => {
  const address0 = getPrefabSocialAddress(0);
  const address1 = getPrefabSocialAddress(1);
  const address2 = getPrefabSocialAddress(2);
  const address3 = getPrefabSocialAddress(3);
  return [
    // FeedItems that are just Notes
    generateFeedItem(
      generateNote(address3, "My favorite dessert is Cake"),
      true
    ),
    generateFeedItem(generateNote(address0, "Going to the mall!"), true),
    // FeedItem note with replies
    generateFeedItem(generateNote(address0, "Hello World"), true, [
      generateFeedItem(generateNote(address1, "Hi Monday!"), true),
      generateFeedItem(generateNote(address2, "Go away"), true, [
        generateFeedItem(generateNote(address0, "You're mean"), true),
      ]),
    ]),
    // FeedItem that is a profile update
    // generateFeedItem(generatePerson("Grumpy Gills Jr"), true),
    // // FeedItem Note with media
    // generateFeedItem(
    //   generateNote(address2, "Everyone leave me alone", [
    //     generateImageAttachment(
    //       "https://64.media.tumblr.com/bd8d2127a91f57463c2e753cf837ab6e/014df86f4004efef-ec/s1280x1920/adda1023806b71606f83f484a64daa03bce12c8d.jpg"
    //     ),
    //   ]),
    //   true
    // ),
  ];
};

/**
 * Generate random note content
 */
export const generateRandomNote = (): ActivityContentNote => {
  const address = generateSocialAddress();
  const message = getRandomMessage();
  const attachment = getRandomAttachment();
  return generateNote(address, message, attachment);
};

/**
 * Generate random profile update content
 */
export const generateRandomPerson = (): ActivityContentPerson => {
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
    replies[r] = generateFeedItem(generateRandomNote());
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
): FeedItem[] => {
  const feed: FeedItem[] = [];
  // For each feed item we need to generate:
  // 1 - Content
  // 2 - Replies if Note
  for (let s = 0; s < size; s++) {
    const content: ActivityContentNote = generateRandomNote();
    feed[s] = generateFeedItem(
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
