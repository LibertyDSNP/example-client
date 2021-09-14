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
export type FeedItem = BroadcastAnnouncement;

// ## Reply ##
export type Reply = ReplyAnnouncement;
