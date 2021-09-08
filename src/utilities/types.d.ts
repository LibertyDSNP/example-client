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

// ## Profile ##
export type Profile = {
  fromId: string;
  contentHash?: HexString;
  url?: string;
  summary?: string;
  icon?: Array<ActivityContentImageLink>;
  name?: string;
  handle?: string;
  blockNumber: number;
  blockIndex: number;
  batchIndex: number;
};

// ## FeedItem ##
export type FeedItem = BroadcastAnnouncement & ActivityContentNote;

// ## Reply ##
export type Reply = ReplyAnnouncement & ActivityContentNote;
