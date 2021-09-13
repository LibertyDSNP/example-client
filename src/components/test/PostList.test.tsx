import PostList from "../PostList";
import { mount, shallow } from "enzyme";
import { componentWithStore, createMockStore } from "../../test/testhelpers";
import { generateFeedItem, getPrefabFeed } from "../../test/testFeeds";
import { FeedItem } from "../../utilities/types";
import { getPrefabDsnpUserId } from "../../test/testAddresses";
import { getPrefabProfile } from "../../test/testProfiles";
import { getPreFabSocialGraph } from "../../test/testGraphs";

let initialBlockNumber = 0;
const feed = getPrefabFeed();
feed.forEach((feedItem) => {
  feedItem.blockNumber = initialBlockNumber++;
});

let store = createMockStore({ feed: { feedItems: feed } });
describe("PostList", () => {
  it("renders without crashing", () => {
    expect(() => {
      shallow(componentWithStore(PostList, store));
    }).not.toThrow();
  });

  describe("when feed items are returned out of order", () => {
    it("renders feed items in the correct order", () => {
      const address1 = getPrefabDsnpUserId(0);
      const address2 = getPrefabDsnpUserId(1);
      const address3 = getPrefabDsnpUserId(2);

      const feedItem1: FeedItem = generateFeedItem(address1, "hello hello");
      feedItem1.blockNumber = 1;

      const feedItem2: FeedItem = generateFeedItem(address2, "hi there");
      feedItem2.blockNumber = 2;

      const feedItem3: FeedItem = generateFeedItem(address3, "Goodbye");

      feedItem3.blockNumber = 3;

      const feed: FeedItem[] = [feedItem2, feedItem1, feedItem3];
      const graphs = getPreFabSocialGraph();
      const userId = getPrefabProfile(0).fromId;
      store = createMockStore({
        feed: {
          feedItems: feed,
          replies: {},
          isPostLoading: { loading: false },
        },
        user: { id: userId },
        graphs: graphs,
      });

      const component = mount(componentWithStore(PostList, store));

      expect(component.find(".FromTitle__block").first().text()).toContain(
        feedItem3.fromId
      );

      expect(component.find(".FromTitle__block").last().text()).toContain(
        feedItem1.fromId
      );
    });
  });
});
