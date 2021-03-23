import React from "react";
import PostList from "./PostList";
import { shallow } from "enzyme";

describe("PostList", () => {
  it("renders without crashing", () => {
    expect(() => {
      shallow(<PostList />);
    }).not.toThrow();
  });
});
