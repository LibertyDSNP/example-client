import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { FeedItem, HexString } from "../../utilities/types";

interface feedState {
  feed: FeedItem[];
  isPostLoading: boolean;
  isReplyLoading: { loading: boolean; parent: HexString | undefined };
}

const initialState: feedState = {
  feed: [],
  isPostLoading: false,
  isReplyLoading: { loading: false, parent: undefined },
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
        isPostLoading: false,
        isReplyLoading: { loading: false, parent: undefined },
      };
    },
    addFeedItems: (state, action: PayloadAction<FeedItem[]>) => {
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
    postLoading: (state, isLoading: PayloadAction<boolean>) => {
      return {
        ...state,
        feed: [...state.feed],
        isPostLoading: isLoading.payload,
      };
    },
    replyLoading: (state, isLoading: PayloadAction<any>) => {
      return {
        ...state,
        feed: [...state.feed],
        isReplyLoading: {
          loading: isLoading.payload.loading,
          parent: isLoading.payload.parent,
        },
      };
    },
  },
});
export const {
  addFeedItem,
  addFeedItems,
  clearFeedItems,
  postLoading,
  replyLoading,
} = feedSlice.actions;
export default feedSlice.reducer;
