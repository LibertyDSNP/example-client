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

const newPostLoadingState = (
  state: isPostLoadingType,
  item: FeedItem
): isPostLoadingType => {
  if (!state.loading || state.currentUserId === item.fromId)
    return { loading: false, currentUserId: undefined };
  return state;
};

const newReplyLoadingState = (
  state: isReplyLoadingType,
  item: FeedItem
): isReplyLoadingType => {
  if (!state.loading || state.parent === item.parent)
    return { loading: false, parent: undefined };
  return state;
};

export const feedSlice = createSlice({
  name: "feed",
  initialState,
  reducers: {
    addFeedItem: (state, action: PayloadAction<FeedItem>) => {
      const newFeedItem = action.payload;
      return {
        ...state,
        feedItems: [...state.feedItems, newFeedItem],
        isPostLoading: newPostLoadingState(state.isPostLoading, newFeedItem),
        isReplyLoading: newReplyLoadingState(state.isReplyLoading, newFeedItem),
      };
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
