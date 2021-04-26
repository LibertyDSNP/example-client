import React from "react";
import { shallow } from "enzyme";
import UserAvatar from "../UserAvatar";
import { getPrefabProfile } from "../../test/testProfiles";

describe("UserAvatar", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });
  it("renders without crashing", () => {
    expect(() => {
      shallow(<UserAvatar profile={getPrefabProfile(0)} avatarSize="large" />);
    }).not.toThrow();
  });
  it("matches snapshot", () => {
    const component = shallow(
      <UserAvatar profile={getPrefabProfile(0)} avatarSize="large" />
    );
    expect(component).toMatchSnapshot();
  });
});
