import { BroadcastAnnouncement, ReplyAnnouncement,  } from "@dsnp/sdk/core/announcements";
import { DSNPAnnouncementURI } from "@dsnp/sdk/core/identifiers";


export declare type HexString = string;

// ## GraphChange ##
export interface GraphChange {
  followee: string;
  follower: string;
  unfollow: boolean;
  blockNumber: number;
  blockIndex: number;
  batchIndex: number;
}

// ## User ##
export type User = {
  fromId: string;
  contentHash?: HexString;
  url?: string;
  handle?: string;
  blockNumber: number;
  blockIndex: number;
  batchIndex: number;
};

// ## FeedItem ##
export type FeedItem = {
  fromId: string;
  contentHash: HexString;
  url: string;
  blockNumber: number;
  blockIndex: number;
  batchIndex: number;
};

// ## Reply ##
export type ReplyItem = {
  fromId: string;
  contentHash: HexString;
  url: string;
  inReplyTo: DSNPAnnouncementURI;
  blockNumber: number;
  blockIndex: number;
  batchIndex: number;
};
