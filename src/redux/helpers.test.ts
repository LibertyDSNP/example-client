import * as wallet from "../services/wallets/wallet";
import { getPrefabProfile } from "../test/testProfiles";
import { reduxLogout } from "./helpers";
import { reducer } from "./store";
import { configureStore } from "@reduxjs/toolkit";
import { FeedItem, User } from "../utilities/types";
import { getPreFabSocialGraph } from "../test/testGraphs";
import { graphState } from "./slices/graphSlice";
import { getPrefabFeed } from "../test/testFeeds";

const profiles: User[] = Array(3)
  .fill(0)
  .map((x, i) => getPrefabProfile(i));

const graph: graphState = getPreFabSocialGraph();

const feedItems: FeedItem[] = getPrefabFeed();

const feed = {
  feedItems: feedItems,
  replies: {},
  isPostLoading: { loading: false, currentUserId: undefined },
  isReplyLoading: { loading: false, parent: undefined },
};

const loggedInState = {
  user: {
    id: "123456",
    walletType: wallet.WalletType.METAMASK,
  },
  profiles: {
    profiles: {
      [profiles[0].fromId]: profiles[0],
      [profiles[1].fromId]: profiles[1],
      [profiles[2].fromId]: profiles[2],
    },
  },
  feed: feed,
  graphs: graph,
};

const store = configureStore({
  reducer,
  preloadedState: loggedInState,
});

describe("ReduxLogout", () => {
  beforeEach(() => reduxLogout(store.dispatch));

  it("user wallet type is set to NONE", () => {
    expect(store.getState().user.walletType).toEqual("NONE");
  });

  it("user id is undefined", () => {
    expect(store.getState().user.id).toBeUndefined();
  });

  it("profiles are cleared", () => {
    expect(store.getState().profiles.profiles).toEqual({});
  });

  it("feed is cleared", () => {
    expect(store.getState().feed).toEqual({
      feedItems: [],
      replies: {},
      isPostLoading: { loading: false, currentUserId: undefined },
      isReplyLoading: { loading: false, parent: undefined },
    });
  });

  it("graph is cleared", () => {
    expect(store.getState().graphs).toEqual({ followers: {}, following: {} });
  });
});
