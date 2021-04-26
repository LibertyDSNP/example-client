import { FeedItem } from "../utilities/types";
import * as sdk from "./sdk";

// Here we load data through the dsnp sdk
// and convert it into feed data. That data
// can then be returned to the caller.
export const loadInitialFeed = async (
  feedLoadedCallback: (arg0: FeedItem[]) => void
): Promise<void> => {
  const filter: BaseFilters = {
    type: "Announcement",
  };
  loadFeed(feedLoadedCallback, filter);
};

export const loadOldFeed = async (
  feedLoadedCallback: (arg0: FeedItem[]) => void
): Promise<void> => {
  const filter: BaseFilters = {
    type: "Announcement",
  };
  loadFeed(feedLoadedCallback, filter);
};

const loadFeed = async (
  filter: BaseFilters,
  feedLoadedCallback: (arg0: FeedItem[]) => void,
): Promise<void> => {
  const events = await sdk.fetchEvents(filter);
  const feedItems = buildFeedItems(events);
  feedLoadedCallback(feedItems);
};

export const subscribeToFeed = async (newFeedItemCallback) => {
  const filter: BaseFilters = {
    type: "Announcement",
  };
  const callback = (event: MessageType) => {
    const feedItem = buildFeedItems(event);
    newFeedItemCallback(feedItem);
  };
  sdk.subscribe(filter, callback);
};