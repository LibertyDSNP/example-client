import FollowersFollowing from "../FollowersFollowing";
import { mount } from "enzyme";
import { componentWithStore, createMockStore } from "../../test/testhelpers";
import { getPreFabSocialGraph } from "../../test/testGraphs";
import { getPrefabSocialAddress } from "../../test/testAddresses";

describe("FollowersFollowing", () => {
  it("renders without crashing", () => {
    const profile = getPrefabSocialAddress(0);
    const graph = getPreFabSocialGraph().get(profile);
    const userGraph = { user: { graph } };
    const store = createMockStore(userGraph);
    expect(() => {
      mount(componentWithStore(FollowersFollowing, store));
    }).not.toThrow();
  });
});
