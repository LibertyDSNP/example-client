import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { FeedItem, HexString } from "../../utilities/types";

interface isPostLoadingType {
  loading: boolean;
  currentUserId: HexString | undefined;
}

interface isReplyLoadingType {
  loading: boolean;
  parent: HexString | undefined;
}

interface feedState {
  feedItems: FeedItem[];
  isPostLoading: isPostLoadingType;
  isReplyLoading: isReplyLoadingType;
}

const initialState: feedState = {
  feedItems: [],
  isPostLoading: { loading: false, currentUserId: undefined },
  isReplyLoading: { loading: false, parent: undefined },
};

export const feedSlice = createSlice({
  name: "feed",
  initialState,
  reducers: {
    addFeedItem: (state, action: PayloadAction<FeedItem>) => {
      const newFeedItem = action.payload;
      if (state.isPostLoading.currentUserId === newFeedItem.fromId) {
        // to keep loading from being turned off when some else's post
        // arrives while waiting for the current user's to appear.
        return {
          ...state,
          feedItems: [...state.feedItems, newFeedItem],
          isPostLoading: { loading: false, currentUserId: undefined },
          isReplyLoading: { loading: false, parent: undefined },
        };
      }
    },
    clearFeedItems: (state) => {
      return {
        ...state,
        feedItems: [],
      };
    },
    postLoading: (state, isLoading: PayloadAction<isPostLoadingType>) => {
      return {
        ...state,
        isPostLoading: {
          loading: isLoading.payload.loading,
          currentUserId: isLoading.payload.currentUserId,
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
  clearFeedItems,
  postLoading,
  replyLoading,
} = feedSlice.actions;

export default feedSlice.reducer;
