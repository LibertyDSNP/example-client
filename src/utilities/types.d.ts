import { ActivityContentProfile } from "@dsnp/sdk/core/activityContent";

export declare type HexString = string;

// ## GraphChange ##
export interface GraphChange {
  followee: string;
  follower: string;
  unfollow: boolean;
}

// ## Profile ##
export type Profile = ActivityContentProfile & {
  fromId: string;
  handle: string;
  blockNumber: number;
  blockIndex: number;
  batchIndex: number;
};

// ## FeedItem ##
export type FeedItem = BroadcastAnnouncement & ActivityContentNote;

// ## Reply ##
export type Reply = ReplyAnnouncement & ActivityContentNote;
