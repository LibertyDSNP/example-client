import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { FeedItem } from "../../utilities/types";

interface feedState {
  feed: FeedItem[];
  newFeed: FeedItem[];
}

const initialState: feedState = {
  feed: [],
  newFeed: [],
};

export const feedSlice = createSlice({
  name: "feed",
  initialState,
  reducers: {
    addFeedItem: (state, action: PayloadAction<FeedItem>) => {
      const newFeedItem = action.payload;
      return {
        ...state,
        feed: [...state.feed, newFeedItem],
      };
    },
    addFeedItems: (state, action: PayloadAction<FeedItem[]>) => {
      const newFeedItems = action.payload;
      return {
        ...state,
        feed: [...state.feed, ...newFeedItems],
      };
    },
    addNewFeedItem: (state, action: PayloadAction<FeedItem>) => {
      const newFeedItem = action.payload;
      return {
        ...state,
        newFeed: [...state.feed, newFeedItem],
      };
    },
    addNewFeedItems: (state, action: PayloadAction<FeedItem[]>) => {
      const newFeedItems = action.payload;
      return {
        ...state,
        newFeed: [...state.feed, ...newFeedItems],
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
export const { addFeedItem, addFeedItems } = feedSlice.actions;
export default feedSlice.reducer;
