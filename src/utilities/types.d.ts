import { ProfileAnnouncement } from "@dsnp/sdk/core/announcements";
import { ActivityContentProfile } from "@dsnp/sdk/core/activityContent";
import {
  ActivityContent,
  ActivityContentNote,
  ActivityContentPerson,
} from "@dsnp/sdk/core/activityContent";

export type HexString = string;
export type EncryptedString = string;
export type URLString = string;
// ### Feed Data Types ###

// ## Profile ##
export interface Profile extends ActivityContentPerson {
  socialAddress: HexString;
}

export declare type HexString = string;
// ## Note ##
export type NoteAttachmentType = "Image" | "Video";
export type NoteAttachment = {
  mediaType: string;
  type: NoteAttachmentType;
  url: URLString;
};

// ## Feed ##
export interface FeedItem {
  fromAddress: HexString;
  content: ActivityContentNote;
  replies?: FeedItem[];
  blockNumber: number;
  hash?: HexString;
  inbox?: boolean;
  timestamp: number;
  topic?: HexString;
  uri?: URLString | undefined;
  rawContent?: string;
  ddid?: HexString;
  inReplyTo?: HexString;
  tags?: string[] | undefined;
}

// ## Graph ##
export interface Graph {
  dsnpUserId: HexString;
  following: HexString[];
  followers: HexString[];
}

// ## Profile ##
export type Profile = ProfileAnnouncement &
  ActivityContentProfile & { handle: string };

// ## FeedItem ##
export type FeedItem = BroadcastAnnouncement & ActivityContentNote;

// ## Reply ##
export type Reply = ReplyAnnouncement & ActivityContentNote;
