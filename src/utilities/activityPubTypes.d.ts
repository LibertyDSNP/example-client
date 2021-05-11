import { HexString } from "./types";

export type ContentType = "Person" | "Note" | "EncryptedMessage";

export interface ActivityPubBase {
  "@context"?: string;
  actor: HexString;
  id?: string; // See other comment below about this vs `activitypub.ts`
  type: ContentType | string; // Why or string? Because `ContentType` are just the ones that we care about, others can and do exist
}

export interface PersonActivityPub extends ActivityPubBase {
  handle?: string;
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

export type ActivityPub = PersonActivityPub | NoteActivityPub;
