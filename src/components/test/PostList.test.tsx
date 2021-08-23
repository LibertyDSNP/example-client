import PostList from "../PostList";
import { mount, shallow } from "enzyme";
import { componentWithStore, createMockStore } from "../../test/testhelpers";
import { generateFeedItem, getPrefabFeed } from "../../test/testFeeds";
import { ActivityContentNote } from "@dsnp/sdk/dist/types/core/activityContent";
import { FeedItem } from "../../utilities/types";
import Login from "../Login";
import * as wallet from "../../services/wallets/wallet";
import { getPrefabDsnpUserId } from "../../test/testAddresses";
import { getPrefabProfile } from "../../test/testProfiles";
import { getPreFabSocialGraph } from "../../test/testGraphs";

let initialBlockNumber = 0;
const feed = getPrefabFeed();
feed.forEach((feedItem) => {
  feedItem.blockNumber = initialBlockNumber++;
});

let store = createMockStore({ feed: feed });
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

      const feedItem1: FeedItem = generateFeedItem(
        address1,
        {
          type: "Note",
          mediaType: "text/plain",
          content: "hello hello",
        } as ActivityContentNote,
        true
      );
      feedItem1.blockNumber = 1;

      const feedItem2: FeedItem = generateFeedItem(
        address2,
        {
          type: "Note",
          mediaType: "text/plain",
          content: "hi there",
        } as ActivityContentNote,
        true
      );
      feedItem2.blockNumber = 2;

      const feedItem3: FeedItem = generateFeedItem(
        address3,
        {
          type: "Note",
          mediaType: "text/plain",
          content: "Goodbye",
        } as ActivityContentNote,
        true
      );

      feedItem3.blockNumber = 3;

      const feed: FeedItem[] = [feedItem2, feedItem1, feedItem3];
      const graphs = getPreFabSocialGraph();
      const userId = getPrefabProfile(0).fromId;
      store = createMockStore({
        feed: { feedItems: feed, isPostLoading: { loading: false} },
        user: { id: userId },
        graphs: graphs,
      });

      const component = mount(componentWithStore(PostList, store));

      expect(component.find(".Post__caption").first().text()).toContain(
        "Goodbye"
      );

      expect(component.find(".Post__caption").last().text()).toContain(
        "hello hello"
      );
    });
  });
});
