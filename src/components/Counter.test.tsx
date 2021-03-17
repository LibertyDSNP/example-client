import React from "react";
import { shallow } from "enzyme";
import Counter from "./Counter";

function subject() {
  return shallow(<Counter />);
}

describe("initial state", () => {
  it("renders 0", () => {
    expect(subject().text()).toContain("0");
  });
});

describe("onClick", () => {
  it("increments when clicked", () => {
    const component = subject();
    component.find("button").simulate("click");
    expect(component.text()).toContain("1");

    component.find("button").simulate("click");
    expect(component.text()).toContain("2");
  });
});
