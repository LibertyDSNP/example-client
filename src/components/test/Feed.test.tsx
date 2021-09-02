import Feed from "../Feed";
import Post from "../Post";
import { mount, shallow } from "enzyme";
import { getPrefabFeed } from "../../test/testFeeds";
import { componentWithStore, createMockStore } from "../../test/testhelpers";
import { getPreFabSocialGraph } from "../../test/testGraphs";
import * as wallet from "../../services/wallets/wallet";
import { convertToDSNPUserId } from "@dsnp/sdk/core/identifiers";

const userId = convertToDSNPUserId(3);
const feedItems = getPrefabFeed();
const feedState = {
  feedItems: feedItems,
  isPostLoading: { loading: false, currentUserId: undefined },
  isReplyLoading: { loading: false, parent: undefined },
};
const graphs = getPreFabSocialGraph();
const initialStateWhenLoggedIn = {
  user: { id: userId, walletType: wallet.WalletType.METAMASK },
  feed: feedState,
  graphs: graphs,
};
const storeWhenLoggedIn = createMockStore(initialStateWhenLoggedIn);

const initialStateWhenLoggedOut = {
  user: { walletType: wallet.WalletType.NONE },
  feed: feedState,
  graphs: graphs,
};
const storeWhenLoggedOut = createMockStore(initialStateWhenLoggedOut);

describe("Feed", () => {
  it("renders without crashing", () => {
    expect(() => {
      shallow(componentWithStore(Feed, storeWhenLoggedIn));
    }).not.toThrow();
  });

  it("does display new post button when logged in", () => {
    const component = mount(componentWithStore(Feed, storeWhenLoggedIn));
    expect(component.find(".Feed__newPostButton").length).not.toEqual(0);
  });

  it("does not display new post button when not logged in", () => {
    const component = mount(componentWithStore(Feed, storeWhenLoggedOut));
    expect(component.find(".Feed__newPostButton").length).toBe(0);
  });

  it("opens new post modal onclick", () => {
    const component = mount(componentWithStore(Feed, storeWhenLoggedIn));
    component.find(".Feed__newPostButton").first().simulate("click");
    expect(component.find("Modal")).toBeTruthy();
  });

  describe("Displays Correct Feed", () => {
    it("My Feed", () => {
      const component = mount(componentWithStore(Feed, storeWhenLoggedIn));
      const button = component.findWhere((node) => {
        return (
          node.hasClass("Feed__navigationItem") && node.text() === "My Feed"
        );
      });
      button.simulate("click");
      expect(component.find(Post).length).toEqual(1);
      const expectedFeedAddresses = [userId.toString()].concat(
        Object.keys(graphs.following)
      );
      component.find("FromTitle").forEach((fromIdWrapper) => {
        const fromId = fromIdWrapper.props("profile").profile.fromId;
        expect(expectedFeedAddresses).toContain(fromId.toString());
      });
    });

    it("My Posts", () => {
      const component = mount(componentWithStore(Feed, storeWhenLoggedIn));
      const button = component.findWhere((node) => {
        return (
          node.hasClass("Feed__navigationItem") && node.text() === "My Posts"
        );
      });
      button.simulate("click");
      expect(component.find(Post).length).toEqual(1);
      component.find("FromTitle").forEach((fromIdWrapper) => {
        const fromId = fromIdWrapper.props("profile").profile.fromId;
        expect(fromId).toBe(userId);
      });
    });

    it("Discover", () => {
      const component = mount(componentWithStore(Feed, storeWhenLoggedIn));
      const button = component.findWhere((node) => {
        return (
          node.hasClass("Feed__navigationItem") && node.text() === "Discover"
        );
      });
      button.simulate("click");
      expect(component.find(Post).length).toEqual(4);
    });
  });
});
