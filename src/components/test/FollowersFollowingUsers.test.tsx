import React from "react";
import FollowersFollowingUsers from "../FollowersFollowingUsers";
import { shallow, mount } from "enzyme";
import { preFabProfiles } from "../../test/testProfiles";

const mockTempUserList = [
  {
    profile: preFabProfiles[0],
    icon: preFabProfiles[0].icon,
    name: preFabProfiles[0].name,
    following: true,
    followsMe: true,
  },
  {
    profile: preFabProfiles[1],
    icon: preFabProfiles[1].icon,
    name: preFabProfiles[1].name,
    following: true,
    followsMe: false,
  },
  {
    profile: preFabProfiles[2],
    icon: preFabProfiles[2].icon,
    name: preFabProfiles[2].name,
    following: false,
    followsMe: true,
  },
];

describe("Feed", () => {
  it("renders without crashing", () => {
    expect(() => {
      shallow(
        <FollowersFollowingUsers
          selectedListTitle="showFollowers"
          tempUserList={mockTempUserList}
        />
      );
    }).not.toThrow();
  });
  it("to match snapshot", () => {
    const component = mount(
      <FollowersFollowingUsers
        selectedListTitle="showFollowers"
        tempUserList={mockTempUserList}
      />
    );
    expect(component).toMatchSnapshot();
  });
});
