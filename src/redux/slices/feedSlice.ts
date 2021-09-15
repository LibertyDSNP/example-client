import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { FeedItem, Reply, HexString } from "../../utilities/types";

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
  replies: Record<string, Reply[]>;
  isPostLoading: isPostLoadingType;
  isReplyLoading: isReplyLoadingType;
}

const initialState: feedState = {
  feedItems: [],
  replies: {},
  isPostLoading: { loading: false, currentUserId: undefined },
  isReplyLoading: { loading: false, parent: undefined },
};

const newPostLoadingState = (
  state: isPostLoadingType,
  item: FeedItem
): isPostLoadingType => {
  if (state.loading && state.currentUserId === item.fromId)
    return { loading: false, currentUserId: undefined };
  return state;
};

const newReplyLoadingState = (
  state: isReplyLoadingType,
  item: Reply
): isReplyLoadingType => {
  if (state.loading && state.parent === item.inReplyTo) {
    return { loading: false, parent: undefined };
  }
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
      };
    },
    addReply: (state, action: PayloadAction<Reply>) => {
      const newReply = action.payload;
      return {
        ...state,
        replies: {
          ...state.replies,
          [newReply.inReplyTo]: [
            ...(state.replies[newReply.inReplyTo] || []),
            newReply,
          ],
        },
        isReplyLoading: newReplyLoadingState(state.isReplyLoading, newReply),
      };
    },
    clearFeedItems: (_state) => {
      return initialState;
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
  addReply,
  clearFeedItems,
  postLoading,
  replyLoading,
} = feedSlice.actions;

export default feedSlice.reducer;
