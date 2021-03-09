import React from "react";
import App from "./App";
import { shallow } from "enzyme";

it("renders without crashing", () => {
  expect(() => shallow(<App />)).not.toThrow();
});
