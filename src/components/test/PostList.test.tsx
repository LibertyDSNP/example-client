import PostList from "../PostList";
import { mount } from "enzyme";
import { componentWithStore, createMockStore } from "../../test/testhelpers";
import { initialFeedState } from "../../redux/slices/feedSlice";

describe("PostList", () => {
  const store = createMockStore(initialFeedState);
  it("renders without crashing", () => {
    expect(() => {
      mount(componentWithStore(PostList, store));
    }).not.toThrow();
  });
});
