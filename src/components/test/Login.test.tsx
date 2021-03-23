import React from "react";
import Login from "../Login";
import { shallow } from "enzyme";
import { getPrefabSocialAddress } from "../../test/testAddresses";

const mockSocialAddress = getPrefabSocialAddress(0);

describe("Login", () => {
  it("renders without crashing", () => {
    expect(() => {
      shallow(
        <Login
          logout={jest.fn}
          onAuthenticate={jest.fn}
          socialAddress={mockSocialAddress}
        />
      );
    }).not.toThrow();
  });
});
