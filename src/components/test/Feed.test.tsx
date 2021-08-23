import Feed from "../Feed";
import Post from "../Post";
import { mount, shallow } from "enzyme";
import { getPrefabFeed } from "../../test/testFeeds";
import { componentWithStore, createMockStore } from "../../test/testhelpers";
import { getPreFabSocialGraph } from "../../test/testGraphs";
import { getPrefabProfile } from "../../test/testProfiles";

const userId = getPrefabProfile(0).fromId;
const feedItems = getPrefabFeed();
const graphs = getPreFabSocialGraph();
const initialState = {
  user: { id: userId },
  feed: {
    feedItems: feedItems,
    isPostLoading: { loading: false, myIdentifier: undefined },
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
        isPostLoading: { loading: false, myIdentifier: undefined },
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
    it("Connections Feed", () => {
      const component = mount(componentWithStore(Feed, store));
      expect(component.find(Post).length).toEqual(3);

      const expectedFeedAddresses = [userId].concat(
        Object.keys(graphs.following)
      );
      component.find(".ant-card-meta-title").forEach((address) => {
        expect(expectedFeedAddresses).toContain(address.text());
      });
    });

    it("My Feed", () => {
      const component = mount(componentWithStore(Feed, store));
      const button = component.findWhere((node) => {
        return (
          node.hasClass("Feed__navigationItem") && node.text() === "My Posts"
        );
      });
      button.simulate("click");
      expect(component.find(Post).length).toEqual(2);
      component.find(".ant-card-meta-title").forEach((address) => {
        expect(address.text()).toBe(userId);
      });
    });

    it("All Posts", () => {
      const component = mount(componentWithStore(Feed, store));
      const button = component.findWhere((node) => {
        return (
          node.hasClass("Feed__navigationItem") && node.text() === "All Posts"
        );
      });
      button.simulate("click");
      expect(component.find(Post).length).toEqual(4);
    });
  });
});
