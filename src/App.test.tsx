import React from "react";
import App from "./App";
import { mount } from "enzyme";
import { componentWithStore, createMockStore } from "./test/testhelpers";

jest.mock("../src/components/Header", () => () => <div> Header </div>);
jest.mock("../src/components/Feed", () => () => <div> Feed </div>);
jest.mock("../src/components/ProfileBlock", () => () => <div> Profile </div>);

it("renders without crashing", () => {
  const initialState = { user: {} };
  const store = createMockStore(initialState);
  expect(() => {
    mount(componentWithStore(App, store));
  }).not.toThrow();
});
