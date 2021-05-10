import Feed from "../Feed";
import { mount } from "enzyme";
import { componentWithStore, createMockStore } from "../../test/testhelpers";
import { initialFeedState } from "../../redux/slices/feedSlice";

describe("Feed", () => {
  const store = createMockStore(initialFeedState);
  it("renders without crashing", () => {
    expect(() => {
      mount(componentWithStore(Feed, store));
    }).not.toThrow();
  });
});
