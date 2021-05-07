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
  replyData: FeedItem[];
  newCurrentBlock: number;
}

export const feedSlice = createSlice({
  name: "feed",
  initialState,
  reducers: {
    addFeedItems: (state, action: PayloadAction<feedData>) => {
      let allReplies = [...state.replies, ...action.payload.replyData];

      let olderFeed = [...action.payload.feedData];

      olderFeed = olderFeed.map((feedItem) => {
        const feedReplies: FeedItem[] = [];
        console.log("🚀 | file: feedSlice.ts | line 36 | Before allReplies", allReplies);
        allReplies = allReplies.filter((reply) => {
          if (feedItem.hash === reply.inReplyTo) {
            feedReplies.push(reply);
            return false;
          }
          return true;
        });
        console.log("🚀 | file: feedSlice.ts | line 35 | After feedReplies", feedReplies);
        console.log("🚀 | file: feedSlice.ts | line 36 | After allReplies", allReplies);
        if (feedReplies.length === 0) return feedItem;
        return {
          ...feedItem,
          replies: feedReplies,
        };
      });

      return {
        ...state,
        feed: [...state.feed, ...olderFeed],
        replies: [...allReplies],
        currentBlock: action.payload.newCurrentBlock,
      };
    },
    addNewFeedItems: (state, action: PayloadAction<FeedItem[]>) => {
      const newFeedItems = action.payload;
      return {
        ...state,
        newFeed: [...newFeedItems, ...state.newFeed],
      };
    },
    addNewFeedtoMainFeed: (state) => {
      return {
        ...state,
        feed: [...state.newFeed, ...state.feed],
        newFeed: [],
      };
    },
  },
});
export const {
  addFeedItems,
  addNewFeedItems,
  addNewFeedtoMainFeed,
} = feedSlice.actions;
export default feedSlice.reducer;
