import React from "react";
import FollowersFollowing from "../FollowersFollowing";
import { shallow } from "enzyme";

describe("Feed", () => {
  it("renders without crashing", () => {
    expect(() => {
      shallow(<FollowersFollowing />);
    }).not.toThrow();
  });
  it("to match snapshot", () => {
    //write more specific tests when we are pulling from a real followers/following list
    //I want to test more specific actions
    const component = shallow(<FollowersFollowing />);
    expect(component).toMatchSnapshot();
  });
});
