import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { FeedItem, HexString } from "../../utilities/types";

interface isPostLoadingType {
  loading: boolean;
  myIdentifier: HexString | undefined;
}

interface isReplyLoadingType {
  loading: boolean;
  parent: HexString | undefined;
}

interface feedState {
  feed: FeedItem[];
  isPostLoading: isPostLoadingType;
  isReplyLoading: isReplyLoadingType;
}

const initialState: feedState = {
  feed: [],
  isPostLoading: { loading: false, myIdentifier: undefined },
  isReplyLoading: { loading: false, parent: undefined },
};

export const feedSlice = createSlice({
  name: "feed",
  initialState,
  reducers: {
    addFeedItem: (state, action: PayloadAction<FeedItem>) => {
      const newFeedItem = action.payload;
      if (state.isPostLoading.myIdentifier === newFeedItem.fromId) {
        return {
          ...state,
          feed: [...state.feed, newFeedItem],
          isPostLoading: { loading: false, myIdentifier: undefined },
          isReplyLoading: { loading: false, parent: undefined },
        };
      }
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
    clearFeedItems: (state) => {
      return {
        ...state,
        feed: [],
      };
    },
    postLoading: (state, isLoading: PayloadAction<isPostLoadingType>) => {
      return {
        ...state,
        isPostLoading: {
          loading: isLoading.payload.loading,
          myIdentifier: isLoading.payload.myIdentifier,
        },
      };
    },
    replyLoading: (state, isLoading: PayloadAction<isReplyLoadingType>) => {
      return {
        ...state,
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
