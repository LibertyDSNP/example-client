import PostList from "../PostList";
import { shallow } from "enzyme";
import { componentWithStore, createMockStore } from "../../test/testhelpers";
import { getPrefabFeed } from "../../test/testFeeds";

const store = createMockStore({ feed: getPrefabFeed });

describe("PostList", () => {
  it("renders without crashing", () => {
    expect(() => {
      shallow(componentWithStore(PostList, store));
    }).not.toThrow();
  });
});
