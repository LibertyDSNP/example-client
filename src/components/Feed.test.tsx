import React from "react";
import Feed from "./Feed";
import { shallow } from "enzyme";

describe("Feed", () => {
  it("renders without crashing", () => {
    expect(() => {
      shallow(<Feed />);
    }).not.toThrow();
  });
});
