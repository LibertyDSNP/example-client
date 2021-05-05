import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { FeedItem } from "../../utilities/types";

interface feedState {
  feed: FeedItem[];
  newFeed: FeedItem[];
  currentBlock: number | null;
}

const initialState: feedState = {
  feed: [],
  newFeed: [],
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
      const newFeedItems = action.payload.feedData;
      return {
        ...state,
        feed: [...state.feed, ...newFeedItems],
        currentBlock: action.payload.newCurrentBlock,
      };
    },
    addNewFeedItem: (state, action: PayloadAction<FeedItem>) => {
      const newFeedItem = action.payload;
      return {
        ...state,
        newFeed: [newFeedItem, ...state.newFeed],
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
  addNewFeedItem,
  addNewFeedItems,
  addNewFeedtoMainFeed,
} = feedSlice.actions;
export default feedSlice.reducer;
