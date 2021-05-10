import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { FeedItem } from "../../utilities/types";

interface feedState {
  feed: FeedItem[];
  newFeed: FeedItem[];
  replies: FeedItem[];
  currentBlock: number | null;
}

const initialState: feedState = {
  feed: [],
  newFeed: [],
  replies: [],
  currentBlock: null,
};

interface feedData {
  feedData: FeedItem[];
  newCurrentBlock: number;
}

export const feedSlice = createSlice({
  name: "feed",
  initialState,
  reducers: {
    addFeedItems: (state, action: PayloadAction<feedData>) => {
      const [feedData, replyData] = splitFeedAndReply(action.payload.feedData);
      const allReplies = [...state.replies, ...replyData];
      const olderFeed = [...feedData];
      const [matchedFeed, remainingReplies] = matchRepliesToFeed(
        olderFeed,
        allReplies
      );

      return {
        ...state,
        feed: [...state.feed, ...matchedFeed],
        replies: [...remainingReplies],
        currentBlock: action.payload.newCurrentBlock,
      };
    },

    addNewFeedItems: (state, action: PayloadAction<FeedItem[]>) => {
      const [feedData, replyData] = splitFeedAndReply(action.payload);
      return {
        ...state,
        replies: [...replyData, ...state.replies],
        newFeed: [...feedData, ...state.newFeed],
      };
    },

    addNewFeedtoMainFeed: (state) => {
      const allReplies = [...state.replies];
      const allFeed = [...state.newFeed, ...state.feed];
      const [matchedFeed, remainingReplies] = matchRepliesToFeed(
        allFeed,
        allReplies
      );

      return {
        ...state,
        feed: [...matchedFeed],
        replies: [...remainingReplies],
        newFeed: [],
      };
    },
  },
});

enum ActionType {
  Private = 0,
  GraphChange = 1,
  Broadcast = 2,
  Profile = 3,
  KeyList = 4,
  PrivateGraphKeyList = 5,
  EncryptionKeyList = 6,
  Reaction = 7,
  PrivateGraphChange = 8,
  Drop = 9,
  EncryptedInbox = 10,
  PrivateBroadcast = 11,
  Reply = 12,
  Batch = 13,
}

/**
 * Splits The feed items and replies to feed items.
 * @param items the combined list of feed items and replies
 * @returns an array of the feed items first and then the reply items
 */
const splitFeedAndReply = (items: FeedItem[]): [FeedItem[], FeedItem[]] => {
  const feedItems: FeedItem[] = [];
  const replyItems: FeedItem[] = [];
  items.forEach((item) => {
    if (item.topic === ActionType.Broadcast.toString()) feedItems.push(item);
    if (item.topic === ActionType.Reply.toString()) replyItems.push(item);
  });
  return [feedItems, replyItems];
};

/**
 * Takes in a feedItem array and a replyItem array.
 * Does not modify either array that is passed in
 * @param passedFeedItems the feed items to match reply items to
 * @param passedReplyItems the reply items to match feed items to
 * @returns The feed with matched replies and the remianing replies
 */
const matchRepliesToFeed = (
  passedFeedItems: FeedItem[],
  passedReplyItems: FeedItem[]
): [FeedItem[], FeedItem[]] => {
  let feedItems = [...passedFeedItems];
  let replyItems = [...passedReplyItems];
  feedItems = feedItems.map((feedItem) => {
    const feedReplies: FeedItem[] = [];
    replyItems = replyItems.filter((reply) => {
      if (feedItem.hash === reply.inReplyTo) {
        feedReplies.push(reply);
        return false;
      }
      return true;
    });
    if (feedReplies.length === 0) return feedItem;
    return {
      ...feedItem,
      replies: feedReplies,
    };
  });
  return [feedItems, replyItems];
};

export const {
  addFeedItems,
  addNewFeedItems,
  addNewFeedtoMainFeed,
} = feedSlice.actions;

export const initialFeedState = { feed: initialState };

export default feedSlice.reducer;
