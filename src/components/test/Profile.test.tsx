import React from "react";
import Profile from "./PostList";
import { shallow } from "enzyme";

describe("Profile", () => {
  it("renders without crashing", () => {
    expect(() => {
      shallow(<Profile />);
    }).not.toThrow();
  });
});
