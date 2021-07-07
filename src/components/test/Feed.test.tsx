import Feed from "../Feed";
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
    const initialState = {
      user: { profile: undefined },
      feed: { feed },
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
      expect(component).toMatchSnapshot();
      // delete snapshot and input correct toEqual number when graph exists
      // expect(component.find(Post).length).toEqual(3);
    });

    it("My Feed", () => {
      const component = mount(componentWithStore(Feed, store));
      const button = component.findWhere((node) => {
        return (
          node.hasClass("Feed__navigationItem") && node.text() === "My Posts"
        );
      });
      button.simulate("click");
      expect(component).toMatchSnapshot();
      // delete snapshot and input correct toEqual number when graph exists
      // expect(component.find(Post).length).toEqual(2);
    });

    it("All Posts", () => {
      const component = mount(componentWithStore(Feed, store));
      const button = component.findWhere((node) => {
        return (
          node.hasClass("Feed__navigationItem") && node.text() === "All Posts"
        );
      });
      button.simulate("click");
      expect(component).toMatchSnapshot();
      // delete snapshot and input correct toEqual number when graph exists
      // expect(component.find(Post).length).toEqual(2);
    });
  });
});
