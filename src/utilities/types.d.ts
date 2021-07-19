import { ActivityContent, ActivityContentNote, ActivityContentPerson } from "@dsnp/sdk/core/activityContent";


export type HexString = string;
export type EncryptedString = string;
export type URLString = string;
// ### Feed Data Types ###

// ## Profile ##
export interface Profile extends ActivityContentPerson {
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
export interface FeedItem<T extends ActivityContent> {
  fromAddress: HexString;
  content: T;
  replies?: FeedItem[];
  blockNumber: number;
  hash: HexString;
  inbox?: boolean;
  timestamp: number;
  topic?: HexString;
  uri?: URLString | undefined;
  rawContent?: string;
  ddid?: HexString;
  inReplyTo?: HexString;
}

// ## Graph ##
export interface Graph {
  socialAddress: HexString;
  following: HexString[];
  followers: HexString[];
}

export type SocialGraph = Graph[];
