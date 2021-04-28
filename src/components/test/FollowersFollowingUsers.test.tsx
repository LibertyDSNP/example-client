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

  it("displays correct follow button", () => {
    const component = shallow(
      <FollowersFollowingUsers
        listStatus={ListStatus.FOLLOWERS}
        tempUserList={mockTempUserList}
        notFollowing={[preFabProfiles[0]]}
      />
    );
    expect(
      component.find(".FollowersFollowingUsers__button").first().text()
    ).toContain("Follow");
  });

  it("displays correct unfollow button", () => {
    const component = shallow(
      <FollowersFollowingUsers
        listStatus={ListStatus.FOLLOWERS}
        tempUserList={mockTempUserList}
        notFollowing={[preFabProfiles[0]]}
      />
    );
    expect(
      component.find(".FollowersFollowingUsers__button").at(1).text()
    ).toContain("Unfollow");
    expect(
      component.find(".FollowersFollowingUsers__button").at(2).text()
    ).toContain("Unfollow");
    expect(
      component.find(".FollowersFollowingUsers__button").at(3).text()
    ).toContain("Unfollow");
  });
});
