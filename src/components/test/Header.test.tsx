import React from "react";
import Header from "../Header";
import { shallow } from "enzyme";
import { getPrefabSocialAddress } from "../../test/testAddresses";

const mockSocialAddress = getPrefabSocialAddress(0);

describe("Header", () => {
  it("renders without crashing", () => {
    expect(() => {
      shallow(
        <Header
          socialAddress={mockSocialAddress}
          onAuthenticate={jest.fn}
          logout={jest.fn}
        />
      );
    }).not.toThrow();
  });
});
