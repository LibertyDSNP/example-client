import { combineReducers } from "redux";
import { FeedItem, Graph, HexString, Profile } from "../utilities/types";
import { Action } from "./actions";

type ProfileMap = Map<HexString, Profile>;

interface ProfileState {
  profiles: ProfileMap;
}

const profileReducer = (
  state: ProfileState = {
    profiles: new Map<HexString, Profile>(),
  },
  action: Action
): ProfileState => {
  switch (action.type) {
    case "SET_PROFILE": {
      const newProfile: Profile = action.payload.profile;
      state.profiles.set(newProfile.socialAddress, newProfile);
      return {
        ...state,
        profiles: new Map(state.profiles),
      };
    }
    case "REMOVE_PROFILE": {
      state.profiles.delete(action.payload.socialAddress);
      return {
        ...state,
        profiles: new Map(state.profiles),
      };
    }
    default:
      return state;
  }
};

export type GraphMap = Map<HexString, Graph>;

interface GraphState {
  graphs: GraphMap;
}

const graphReducer = (
  state: GraphState = {
    graphs: new Map<HexString, Graph>(),
  },
  action: Action
): GraphState => {
  switch (action.type) {
    case "SET_GRAPH": {
      const newGraph: Graph = action.payload.graph;
      state.graphs.set(newGraph.socialAddress, newGraph);
      return {
        ...state,
        graphs: new Map(state.graphs),
      };
    }
    case "REMOVE_GRAPH": {
      const socialAddress = action.payload.socialAddress;
      state.graphs.delete(socialAddress);
      return {
        ...state,
        graphs: new Map(state.graphs),
      };
    }
    case "FOLLOW": {
      const socialAddress = action.payload.socialAddress;
      const followAddress = action.payload.followAddress;
      state.graphs.get(socialAddress)?.following.add(followAddress);
      state.graphs.get(followAddress)?.followers.add(socialAddress);
      return {
        ...state,
        graphs: new Map(state.graphs),
      };
    }
    case "UNFOLLOW": {
      const socialAddress = action.payload.socialAddress;
      const unfollowAddress = action.payload.unfollowAddress;
      state.graphs.get(socialAddress)?.following.delete(unfollowAddress);
      state.graphs.get(unfollowAddress)?.followers.delete(socialAddress);
      return {
        ...state,
        graphs: new Map(state.graphs),
      };
    }
    default:
      return state;
  }
};

interface FeedState {
  feed: FeedItem[];
}

const feedReducer = (
  state: FeedState = {
    feed: [],
  },
  action: Action
): FeedState => {
  switch (action.type) {
    case "ADD_FEED_ITEM": {
      const newFeedItem: FeedItem = action.payload.feedItem;
      return {
        ...state,
        feed: [...state.feed, newFeedItem],
      };
    }
    case "ADD_FEED_ITEMS": {
      const newFeedItems: FeedItem[] = action.payload.feedItems;
      return {
        ...state,
        feed: [...state.feed, ...newFeedItems],
      };
    }
    default:
      return state;
  }
};

export default combineReducers({
  profileReducer,
  graphReducer,
  feedReducer,
});
