import Feed from "../Feed";
import { mount, shallow } from "enzyme";
import { getPrefabProfile } from "../../test/testProfiles";
import { getPrefabFeed } from "../../test/testFeeds";
import { componentWithStore, createMockStore } from "../../test/testhelpers";

const profile = getPrefabProfile(0);
const feed = getPrefabFeed();
const initialState = { user: { profile }, feed: { feed } };
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
    expect(component).toMatchSnapshot();
  });

  it("does not display new post button when not logged in", () => {
    const initialState = { user: { profile: undefined }, feed: { feed } };
    const store = createMockStore(initialState);
    const component = mount(componentWithStore(Feed, store));
    expect(component.find(".Feed__newPostButton").length).toBe(0);
  });

  it("opens new post modal onclick", () => {
    const component = mount(componentWithStore(Feed, store));
    component.find(".Feed__newPostButton").first().simulate("click");
    expect(component.find("Modal")).toBeTruthy();
  });
});
