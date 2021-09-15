import React from "react";
import { shallow } from "enzyme";
import UserAvatar from "../UserAvatar";
import { componentWithStore, createMockStore } from "../../test/testhelpers";
import { getPrefabProfile } from "../../test/testProfiles";

describe("UserAvatar", () => {
  it("renders without crashing", () => {
    expect(() => {
      shallow(
        componentWithStore(
          () => <UserAvatar user={getPrefabProfile(0)} avatarSize="large" />,
          createMockStore({})
        )
      );
    }).not.toThrow();
  });
});
