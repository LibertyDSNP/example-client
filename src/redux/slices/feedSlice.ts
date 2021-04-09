import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { FeedItem } from "../../utilities/types";

interface feedState {
  feed: FeedItem[];
}

const initialState: feedState = {
  feed: [],
};

export const feedSlice = createSlice({
  name: "feed",
  initialState,
  reducers: {
    addFeedItem: (state, action: PayloadAction<FeedItem>) => {
      const newFeedItem: FeedItem = action.payload;
      return {
        ...state,
        feed: [...state.feed, newFeedItem],
      };
    },
    addFeedItems: (state, action: PayloadAction<FeedItem[]>) => {
      const newFeedItems: FeedItem[] = action.payload;
      return {
        ...state,
        feed: [...state.feed, ...newFeedItems],
      };
    },
  },
});
export const { addFeedItem, addFeedItems } = feedSlice.actions;
export default feedSlice.reducer;
