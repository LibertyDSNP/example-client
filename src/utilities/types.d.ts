import { ProfileAnnouncement } from "@dsnp/sdk/core/announcements";
import { ActivityContentProfile } from "@dsnp/sdk/core/activityContent";
import { DSNPUserId } from "@dsnp/sdk/dist/types/core/identifiers";

export declare type HexString = string;

// ## GraphChange ##
export interface GraphChange {
  followee: DSNPUserId;
  follower: DSNPUserId;
  unfollow: boolean;
}

// ## Profile ##
export type Profile = ProfileAnnouncement &
  ActivityContentProfile & { socialAddress: string, handle: string };

// ## FeedItem ##
export type FeedItem = BroadcastAnnouncement & ActivityContentNote;

// ## Reply ##
export type Reply = ReplyAnnouncement & ActivityContentNote;
