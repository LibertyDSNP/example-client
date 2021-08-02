import { ActivityContentNote } from "@dsnp/sdk/core/activityContent";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { FeedItem } from "../../utilities/types";

interface feedState {
  feed: FeedItem<ActivityContentNote>[];
}

const initialState: feedState = {
  feed: [],
};

export const feedSlice = createSlice({
  name: "feed",
  initialState,
  reducers: {
    addFeedItem: (
      state,
      action: PayloadAction<FeedItem<ActivityContentNote>>
    ) => {
      const newFeedItem = action.payload;
      return {
        ...state,
        feed: [...state.feed, newFeedItem],
      };
    },
    addFeedItems: (
      state,
      action: PayloadAction<FeedItem<ActivityContentNote>[]>
    ) => {
      const newFeedItems = action.payload;
      return {
        ...state,
        feed: [...state.feed, ...newFeedItems],
      };
    },
    clearFeedItems: (state) => {
      return {
        ...state,
        feed: [],
      };
    },
  },
});
export const { addFeedItem, addFeedItems, clearFeedItems } = feedSlice.actions;
export default feedSlice.reducer;
