import React from "react";
import App from "./App";
import { shallow } from "enzyme";

it("renders without crashing", () => {
  expect(() => {
    shallow(<App />);
  }).not.toThrow();
});

describe("testEnabler", () => {
  it("enables testing", () => {
    expect(1).toEqual(1);
  });
});
