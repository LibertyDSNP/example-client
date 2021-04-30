import {
  noteToActivityPub,
  postReplyToActivityPub,
} from "../utilities/activityPub";
import { FeedItem, HexString } from "../utilities/types";
import { ActivityPub } from "../utilities/activityPubTypes";

export const createNote = async (
  actor: HexString,
  note: string,
  uriList: string[]
): Promise<FeedItem> => {
  // send content to api
  const activityPubNote: ActivityPub = noteToActivityPub(actor, note, uriList);
  //mock api.createAnnouncement return value
  const newPostFeedItem: FeedItem = {
    fromAddress: actor,
    content: activityPubNote,
    blockNumber: 0x123,
    timestamp: Math.floor(Math.random() * 999999),
  };
  return newPostFeedItem;
};

export const storeReply = async (
  actor: HexString,
  reply: string,
  parent: HexString
): Promise<FeedItem> => {
  const activityPubReply = postReplyToActivityPub(actor, reply, parent);
  //mock api.createAnnouncement return value
  const newPostReplyItem: FeedItem = {
    fromAddress: actor,
    content: activityPubReply,
    blockNumber: 0x123,
    timestamp: Math.floor(Math.random() * 999999),
  };
  return newPostReplyItem;
};
