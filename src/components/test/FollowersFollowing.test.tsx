import FollowersFollowing from "../FollowersFollowing";
import { mount } from "enzyme";
import { forcePromiseResolve } from "../../test/testhelpers";
import { componentWithStore, createMockStore } from "../../test/testhelpers";
import { getPreFabSocialGraph } from "../../test/testGraphs";
import { getPrefabSocialAddress } from "../../test/testAddresses";

const profile = getPrefabSocialAddress(0);
const graph = getPreFabSocialGraph().get(profile);
const userGraph = { user: { graph } };
const store = createMockStore(userGraph);

describe("FollowersFollowing", () => {
  it("renders without crashing", async () => {
    const component = mount(componentWithStore(FollowersFollowing, store));
    await forcePromiseResolve();
    expect(() => component).not.toThrow();
  });

  describe("button displays correct list title", () => {
    it("displays correct list title on followers click", async () => {
      const component = mount(componentWithStore(FollowersFollowing, store));
      await forcePromiseResolve();
      component.find(".FollowersFollowing__button").first().simulate("click");
      expect(component.find("FollowersFollowingUsers").prop("listStatus")).toBe(
        1
      );
    });

    it("displays correct list title on following click", async () => {
      const component = mount(componentWithStore(FollowersFollowing, store));
      await forcePromiseResolve();
      component.find(".FollowersFollowing__button").last().simulate("click");
      expect(component.find("FollowersFollowingUsers").prop("listStatus")).toBe(
        2
      );
    });

    it("hides list on double click", async () => {
      const component = mount(componentWithStore(FollowersFollowing, store));
      await forcePromiseResolve();
      component.find(".FollowersFollowing__button").last().simulate("click");
      component.find(".FollowersFollowing__button").last().simulate("click");
      expect(component.find("FollowersFollowingUsers").prop("listStatus")).toBe(
        0
      );
    });

    it("switches back and forth between lists", async () => {
      const component = mount(componentWithStore(FollowersFollowing, store));
      await forcePromiseResolve();
      component.find(".FollowersFollowing__button").first().simulate("click");
      component.find(".FollowersFollowing__button").last().simulate("click");
      expect(component.find("FollowersFollowingUsers").prop("listStatus")).toBe(
        2
      );
    });
  });
});
