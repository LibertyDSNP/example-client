import ProfileBlock from "../ProfileBlock";
import { mount } from "enzyme";
import { getPrefabProfile } from "../../test/testProfiles";
import { componentWithStore, createMockStore } from "../../test/testhelpers";

describe("Profile", () => {
  it("renders without crashing", () => {
    const profile = getPrefabProfile(0);
    const initialState = { user: { profile } };
    const store = createMockStore(initialState);
    expect(() => {
      mount(componentWithStore(ProfileBlock, store));
    }).not.toThrow();
  });
});
