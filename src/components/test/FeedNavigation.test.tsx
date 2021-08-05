import FeedNavigation from "../FeedNavigation";
import Post from "../Post";
import { mount, shallow } from "enzyme";
import { getPrefabProfile } from "../../test/testProfiles";
import { getPrefabFeed } from "../../test/testFeeds";
import { componentWithStore, createMockStore } from "../../test/testhelpers";
import { getPreFabSocialGraph } from "../../test/testGraphs";

const profile = getPrefabProfile(0);
const feed = getPrefabFeed();
const graphs = getPreFabSocialGraph();
const initialState = { user: { profile }, feed: { feed }, graphs: { graphs } };
const store = createMockStore(initialState);

enum FeedTypes {
  FEED,
  MY_POSTS,
  ALL_POSTS,
}

describe("FeedNavigation", () => {
  const component = mount(
    componentWithStore(FeedNavigation, store, {
      feedType: FeedTypes.ALL_POSTS,
      setFeedType: jest.fn(),
    })
  );

  it("renders without crashing", () => {
    expect(() => {
      shallow(componentWithStore(FeedNavigation, store));
    }).not.toThrow();
  });

  describe("Displays Correct FeedNavigation", () => {
    it("Connections FeedNavigation", () => {
      expect(component.find(Post).length).toEqual(0);

      const expectedFeedAddresses = [profile.socialAddress].concat(
        graphs.find((g) => g.socialAddress === profile.socialAddress)
          ?.following || []
      );
      component.find(".ant-card-meta-title").forEach((address) => {
        expect(expectedFeedAddresses).toContain(address.text());
      });
    });

    it("My FeedNavigation", () => {
      const button = component.findWhere((node) => {
        return (
          node.hasClass("Feed__navigationItem") && node.text() === "My Posts"
        );
      });
      button.simulate("click");
      expect(component.find(Post).length).toEqual(0);
      component.find(".ant-card-meta-title").forEach((address) => {
        expect(address.text()).toBe(profile.socialAddress);
      });
    });

    it("All Posts", () => {
      const button = component.findWhere((node) => {
        return (
          node.hasClass("Feed__navigationItem") && node.text() === "All Posts"
        );
      });
      button.simulate("click");
      expect(component.find(Post).length).toEqual(0);
    });
  });
});
