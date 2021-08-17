import { ProfileAnnouncement } from "@dsnp/sdk/core/announcements";
import { ActivityContentProfile } from "@dsnp/sdk/core/activityContent";

export declare type HexString = string;

// ## Graph ##
export interface Graph {
  dsnpUserId: HexString;
  following: HexString[];
  followers: HexString[];
}

// ## Profile ##
export type Profile = ProfileAnnouncement &
  ActivityContentProfile & { socialAddress: string, handle: string };

// ## FeedItem ##
export type FeedItem = BroadcastAnnouncement & ActivityContentNote;

// ## Reply ##
export type Reply = ReplyAnnouncement & ActivityContentNote;
