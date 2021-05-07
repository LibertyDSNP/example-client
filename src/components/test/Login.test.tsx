import Login from "../Login";
import { mount } from "enzyme";
import * as torus from "../../services/wallets/torus/torus";
import {
  forcePromiseResolve,
  componentWithStore,
  createMockStore,
} from "../../test/testhelpers";
import { getPrefabProfile } from "../../test/testProfiles";
import { act } from "react-test-renderer";
import * as wallet from "../../services/wallets/wallet";

jest.spyOn(torus, "logout").mockImplementation(jest.fn);
jest.spyOn(torus, "isInitialized").mockReturnValue(true);
jest
  .spyOn(torus, "enableTorus")
  .mockImplementation(jest.fn((_build) => Promise.resolve()));

describe("Login Component", () => {
  describe("is logged out", () => {
    const initialState = { user: {} };
    const store = createMockStore(initialState);
    it("renders without crashing", () => {
      expect(() => {
        mount(componentWithStore(Login, store));
      }).not.toThrow();
    });

    it("button triggers login sequence", async () => {
      const component = mount(componentWithStore(Login, store));
      act(() => {
        component.find("Button").simulate("click");
        component.find(".Login__loginTorus").at(0).simulate("click");
      });
      await forcePromiseResolve();
      expect(torus.enableTorus).toHaveBeenCalled();
    });
  });

  describe("is logged in", () => {
    const profile = getPrefabProfile(0);
    const walletType = wallet.WalletType.TORUS;
    const initialState = { user: { profile, walletType } };
    const store = createMockStore(initialState);

    it("renders without crashing", () => {
      expect(() => {
        mount(componentWithStore(Login, store));
      }).not.toThrow();
    });

    it("button triggers logout sequence", () => {
      const component = mount(componentWithStore(Login, store));
      component.find("Button").simulate("click");
      expect(torus.logout).toHaveBeenCalled();
    });
  });
});
