import React from "react";
import { shallow } from "enzyme";
import UserAvatar from "../UserAvatar";
import { getPrefabProfile } from "../../test/testProfiles";

describe("UserAvatar", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });
  it("renders without crashing", () => {
    const component = shallow(
      <UserAvatar profile={getPrefabProfile(0)} avatarSize="large" />
    );
    expect(component).toMatchSnapshot();
  });
});
