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
  icon?: any;
  name?: string;
};

// ## FeedItem ##
export type FeedItem = {
  fromId: string;
  contentHash: HexString;
  url: string;
  blockNumber: number;
  blockIndex: number;
  batchIndex: number;
  published?: string;
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
