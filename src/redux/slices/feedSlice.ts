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
      // Old feed array copy
      let oldFeed = [...state.feed];

      // New feed array copy
      const newFeed = [...action.payload.feedData];

      // Look for matching Feed Item addresses
      // Use newest Feed item, grab old replies
      // This works because the final new feed item
      // with matching addres is the Reply Parent
      // All previous feed items are replies that
      // get combined through this process.
      oldFeed = oldFeed.map((oldFeedItem) => {
        const newReplyParent = newFeed.find(
          (newFeedItem) => oldFeedItem.address === newFeedItem.address
        );
        if (newReplyParent) {
          //newReplyParent.replies = oldFeedItem.replies;
          newFeed.splice(newFeed.indexOf(newReplyParent), 1);
          return {
            ...newReplyParent,
            replies: oldFeedItem.replies,
          };
        }
        return oldFeedItem;
      });

      return {
        ...state,
        feed: [...oldFeed, ...newFeed],
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
