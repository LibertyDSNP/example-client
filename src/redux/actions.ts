import { FeedItem, Graph, HexString, Profile } from "../utilities/types";

// Profile State Actions
const SET_PROFILE = "SET_PROFILE";
const REMOVE_PROFILE = "REMOVE_PROFILE";

// Graph State Actions
const SET_GRAPH = "SET_GRAPH";
const REMOVE_GRAPH = "REMOVE_GRAPH";
const FOLLOW = "FOLLOW";
const UNFOLLOW = "UNFOLLOW";

// Feed State Actions
const ADD_FEED_ITEM = "ADD_FEED_ITEM";
const ADD_FEED_ITEMS = "ADD_FEED_ITEMS";

export interface Action {
  type: string;
  payload: any;
}

export const addProfileAction = (profile: Profile): Action => {
  return {
    type: SET_PROFILE,
    payload: {
      profile,
    },
  };
};

export const removeProfileAction = (socialAddress: HexString): Action => {
  return {
    type: REMOVE_PROFILE,
    payload: { socialAddress },
  };
};

export const setGraphAction = (graph: Graph): Action => {
  return {
    type: SET_GRAPH,
    payload: {
      graph,
    },
  };
};

export const removeGraphAction = (socialAddress: HexString): Action => {
  return {
    type: REMOVE_GRAPH,
    payload: { socialAddress },
  };
};

export const followAction = (
  socialAddress: HexString,
  followAddress: HexString
): Action => {
  return {
    type: FOLLOW,
    payload: {
      socialAddress,
      followAddress,
    },
  };
};

export const unfollowAction = (
  socialAddress: HexString,
  unfollowAddress: HexString
): Action => {
  return {
    type: UNFOLLOW,
    payload: {
      socialAddress,
      unfollowAddress,
    },
  };
};

export const addFeedItemAction = (feedItem: FeedItem): Action => {
  return {
    type: ADD_FEED_ITEM,
    payload: {
      feedItem,
    },
  };
};

export const addFeedItemsAction = (feedItems: FeedItem[]): Action => {
  return {
    type: ADD_FEED_ITEMS,
    payload: {
      feedItems,
    },
  };
};
