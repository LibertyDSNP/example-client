import React from "react";
import Login from "../Login";
import { shallow } from "enzyme";
import {
  getPrefabSocialAddress,
  getPrefabWalletAddress,
} from "../../test/testAddresses";
import * as torus from "../../services/wallets/torus";

// Mock all torus functions as they won't opperate
// inside tests.
const torusLogoutMock = jest.spyOn(torus, "logout");
torusLogoutMock.mockImplementation(jest.fn);

const torusEnableMock = jest.spyOn(torus, "enableTorus");
torusEnableMock.mockImplementation(
  (_build): Promise<void> => new Promise((resolve) => resolve())
);

const torusGetWalletMock = jest.spyOn(torus, "getWalletAddress");
torusGetWalletMock.mockReturnValue(
  new Promise((resolve) => resolve(getPrefabWalletAddress(0)))
);
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
      expect(torusEnableMock).toHaveBeenCalled();
    });
  });

  describe("is logged in", () => {
    // Mock a social address to trigger logged in state
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
      expect(torusLogoutMock).toHaveBeenCalled();
    });
  });
});
