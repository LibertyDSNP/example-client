import React from "react";
import NewPost from "../NewPost";
import { shallow } from "enzyme";

describe("NewPost", () => {
  it("renders without crashing", () => {
    expect(() => {
      shallow(<NewPost />);
    }).not.toThrow();
  });
});
