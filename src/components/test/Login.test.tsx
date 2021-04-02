import React from "react";
import Login from "../Login";
import { shallow } from "enzyme";
import { getPrefabSocialAddress } from "../../test/testAddresses";
import * as torus from "../../services/wallets/torus";

jest.spyOn(torus, "logout").mockImplementation(jest.fn);
jest.spyOn(torus, "isInitialized").mockReturnValue(true);
jest
  .spyOn(torus, "enableTorus")
  .mockImplementation(jest.fn((_build) => Promise.resolve()));

describe("Login Component", () => {
  describe("is logged out", () => {
    it("renders without crashing", () => {
      expect(() => {
        shallow(
          <Login
            logout={jest.fn}
            onAuthenticate={jest.fn}
            socialAddress={null}
          />
        );
      }).not.toThrow();
    });

    it("button triggers login sequence", () => {
      const component = shallow(
        <Login logout={jest.fn} onAuthenticate={jest.fn} socialAddress={null} />
      );
      component.find("Button").simulate("click");
      expect(torus.enableTorus).toHaveBeenCalled();
    });
  });

  describe("is logged in", () => {
    const mockSocialAddress = getPrefabSocialAddress(0);
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

    it("button triggers logout sequence", () => {
      const component = shallow(
        <Login
          logout={jest.fn}
          onAuthenticate={jest.fn}
          socialAddress={mockSocialAddress}
        />
      );
      component.find("Button").simulate("click");
      expect(torus.logout).toHaveBeenCalled();
    });
  });
});
