import React from "react";
import FollowersFollowingUsers from "../FollowersFollowingUsers";
import { shallow } from "enzyme";
import { preFabProfiles } from "../../test/testProfiles";
import { ListStatus } from "../../utilities/enums";

const mockTempUserList = [
  preFabProfiles[0],
  preFabProfiles[1],
  preFabProfiles[2],
  preFabProfiles[3],
];

describe("FollowersFollowingUsers", () => {
  it("renders without crashing", () => {
    expect(() => {
      shallow(
        <FollowersFollowingUsers
          listStatus={ListStatus.FOLLOWERS}
          tempUserList={mockTempUserList}
          notFollowing={[preFabProfiles[1]]}
        />
      );
    }).not.toThrow();
  });

  it("displays correct follow or unfollow button", () => {
    const component = shallow(
      <FollowersFollowingUsers
        listStatus={ListStatus.FOLLOWERS}
        tempUserList={mockTempUserList}
        notFollowing={[preFabProfiles[1]]}
      />
    );
    expect(component).toMatchSnapshot();
  });
});
