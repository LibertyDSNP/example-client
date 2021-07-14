import NewPost from "../NewPost";
import { shallow } from "enzyme";
import { getPrefabProfile } from "../../test/testProfiles";
import { componentWithStore, createMockStore } from "../../test/testhelpers";

describe("NewPost", () => {
  const profile = getPrefabProfile(0);
  const initialState = { user: { profile } };
  const store = createMockStore(initialState);
  it("renders without crashing", () => {
    expect(() => {
      shallow(
        componentWithStore(NewPost, store, {
          onCancel: jest.fn,
          onSuccess: jest.fn,
        })
      );
    }).not.toThrow();
  });
});
