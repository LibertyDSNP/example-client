import Feed from "../Feed";
import Post from "../Post";
import { mount, shallow } from "enzyme";
import { getPrefabFeed } from "../../test/testFeeds";
import { componentWithStore, createMockStore } from "../../test/testhelpers";
import { getPreFabSocialGraph } from "../../test/testGraphs";
import { getPrefabProfile } from "../../test/testProfiles";
import { FeedItem } from "../../utilities/types";

const userProfile = getPrefabProfile(0);
const displayProfile = getPrefabProfile(3);
const feedItems: FeedItem[] = getPrefabFeed();
const graphs = getPreFabSocialGraph();
const initialState = {
  user: {
    id: userProfile.fromId,
    displayId: displayProfile.fromId as string | undefined,
  },
  profiles: {
    profiles: {
      [userProfile.fromId]: userProfile,
      [displayProfile.fromId]: displayProfile,
    },
  },
  feed: {
    feedItems: feedItems,
    replies: {},
    isPostLoading: { loading: false, currentUserId: undefined },
    isReplyLoading: { loading: false, parent: undefined },
  },
  graphs: graphs,
};
const store = createMockStore(initialState);

describe("Feed", () => {
  it("renders without crashing", () => {
    expect(() => {
      shallow(componentWithStore(Feed, store));
    }).not.toThrow();
  });

  it("does display new post button when logged in", () => {
    const component = mount(componentWithStore(Feed, store));
    expect(component.find(".Feed__newPostButton").length).not.toBe(0);
  });

  it("does not display new post button when not logged in", () => {
    const initialState = {
      user: {},
      feed: {
        feedItems,
        replies: {},
        isPostLoading: { loading: false, currentUserId: undefined },
        isReplyLoading: { loading: false, parent: undefined },
      },
      graphs: { graphs },
    };
    const store = createMockStore(initialState);
    const component = mount(componentWithStore(Feed, store));
    expect(component.find(".Feed__newPostButton").length).toBe(0);
  });

  it("opens new post modal onclick", () => {
    const component = mount(componentWithStore(Feed, store));
    component.find(".Feed__newPostButton").first().simulate("click");
    expect(component.find("Modal")).toBeTruthy();
  });

  describe("Displays Correct Feed", () => {
    it("Discover Feed", () => {
      const component = mount(componentWithStore(Feed, store));
      const button = component.findWhere((node) => {
        return (
          node.hasClass("Feed__navigationItem") && node.text() === "Discover"
        );
      });
      button.simulate("click");

      expect(component.find(Post).length).toEqual(4);

      const expectedFeedAddresses: (string | undefined)[] = [
        userProfile.fromId,
      ].concat(Object.keys(graphs.following));

      component.find(Post).forEach((post) => {
        expect(expectedFeedAddresses).toContain(post.props().feedItem.fromId);
      });
    });

    it("My Posts", () => {
      const component = mount(componentWithStore(Feed, store));
      const button = component.findWhere((node) => {
        return (
          node.hasClass("Feed__navigationItem") && node.text() === "My Posts"
        );
      });
      button.simulate("click");
      expect(component.find(Post).length).toEqual(2);
      component.find(".ant-card-meta-title").forEach((address) => {
        expect(address.text()).toBe(userProfile.fromId);
      });
    });

    it("My Feed", () => {
      const component = mount(componentWithStore(Feed, store));
      const button = component.findWhere((node) => {
        return (
          node.hasClass("Feed__navigationItem") && node.text() === "My Feed"
        );
      });
      button.simulate("click");
      expect(component.find(Post).length).toEqual(3);
    });

    describe("Another User's Posts", () => {
      it("Displays nav name in feed nav", async () => {
        const component = mount(componentWithStore(Feed, store));
        expect(component.find(".Feed__navigationItem--active").text()).toEqual(
          displayProfile.fromId + "'s Posts"
        );
      });

      it("Displays correct feed items", async () => {
        const component = mount(componentWithStore(Feed, store));
        expect(component.find(Post).props().feedItem.fromId).toEqual(
          displayProfile.fromId
        );
      });
    });
  });
});
