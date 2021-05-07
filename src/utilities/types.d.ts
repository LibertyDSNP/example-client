import { PersonActivityPub, ActivityPub } from "./activityPub";

export type HexString = string;
export type EncryptedString = string;
export type URLString = string;
// ### Feed Data Types ###

// ## Profile ##
export interface Profile extends PersonActivityPub {
  walletAddress: HexString;
  socialAddress: HexString;
}

// ## Note ##
export type NoteAttachmentType = "Image" | "Video";
export type NoteAttachment = {
  mediaType: string;
  type: NoteAttachmentType;
  url: URLString;
};

// ## Feed ##
export interface FeedItem {
  address?: HexString;
  content?: NoteActivityPub;
  replies: FeedItem[];
  blockNumber?: number;
  hash: HexString;
  timestamp?: number;
  topic?: HexString;
  uri?: URLString;
}

// ## Graph ##
export interface Graph {
  socialAddress: HexString;
  following: HexString[];
  followers: HexString[];
}

export type SocialGraph = Graph[];
