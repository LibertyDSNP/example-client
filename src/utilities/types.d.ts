import { SimpleEncryptedMessage } from "@liberty30/lib-privacy-js";
import {WrappedSEM} from "@liberty30/lib-privacy-js/dist/module";

export type HexString = string;
export type EncryptedString = string;
export type URLString = string;
// ### Feed Data Types ###
export type ContentType = "Person" | "Note" | "EncryptedMessage";

// ## Profile ##
export interface Profile extends PersonActivityPub {
  address: HexString;
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
  address: HexString;
  content?: ActivityPub;
  replies?: FeedItem[];
  blockNumber: number;
  hash: HexString;
  inbox: boolean;
  timestamp: number;
  topic: HexString;
  uri: URLString | undefined;
  rawContent?: string;
  ddid?: HexString;
  inReplyTo?: HexString;
}

// ## Graph ##
export interface Graph {
  [key: string]: Set<HexString>;
}

export interface ReplyParent {
  hash: HexString;
  replies: FeedItem[];
}

export interface UserRelation {
  address: HexString;
  following?: boolean;
  profile?: ProfileProps;
}

export interface ActivityPubBase {
  "@context"?: string;
  actor: HexString;
  id?: string; // See other comment below about this vs `activitypub.ts`
  type: ContentType | string; // Why or string? Because `ContentType` are just the ones that we care about, others can and do exist
}

export interface PersonActivityPub extends ActivityPubBase {
  preferredUsername?: string;
  name?: string;
  summary?: string;
  url?: string;
  discoverable?: boolean;
  icon?: { url?: string };
  type: "Person";
}

type PubType = "Image" | "Video";
interface ActivityPubAttachement {
  type: PubType;
  mediaType: string;
  url: string;
}

export interface NoteActivityPub extends ActivityPubBase {
  content: string;
  attachment?: ActivityPubAttachement[];
  inReplyTo?: HexString;
  type: "Note";
}

export interface EncryptedMessageActivityPub extends ActivityPubBase {
  message: SimpleEncryptedMessage | WrappedSEM;
  type: "EncryptedMessage";
}

export type ActivityPub = PersonActivityPub | NoteActivityPub | EncryptedMessageActivityPub;

export interface DeadDropInfo {
  toMe: HexString[];
  fromMe: HexString[];
  ddidToPublicKey: Record<HexString, undefined | HexString[]>;
  theirHexPublicKey: HexString | null;
}
