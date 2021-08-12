import Login from "../Login";
import { mount } from "enzyme";
import * as torus from "../../services/wallets/torus/torus";
import * as wallet from "../../services/wallets/wallet";
import {
  forcePromiseResolve,
  componentWithStore,
  createMockStore,
} from "../../test/testhelpers";
import { getPrefabProfile } from "../../test/testProfiles";
import * as metamask from "../../services/wallets/metamask/metamask";
import * as sdk from "../../services/sdk";

let torusWallet: wallet.Wallet;
beforeAll(async () => {
  torusWallet = await wallet.wallet(wallet.WalletType.TORUS);
  jest.spyOn(torus, "logout").mockImplementation(jest.fn);
  jest.spyOn(torus, "isInitialized").mockReturnValue(true);
  jest
    .spyOn(torusWallet, "login")
    .mockImplementation(() => Promise.resolve("0x123"));
  jest.spyOn(metamask, "isInstalled").mockReturnValue(true);
  jest
    .spyOn(metamask, "getWalletAddress")
    .mockImplementation(() => Promise.resolve("0x123"));
  jest.spyOn(sdk, "setupProvider").mockImplementation(jest.fn);
});

describe("Login Component", () => {
  const store = createMockStore({ user: {} });
  describe("is logged out", () => {
    it("renders without crashing", () => {
      expect(() => {
        mount(
          componentWithStore(Login, store, {
            loginWalletOptions: wallet.WalletType.NONE,
          })
        );
      }).not.toThrow();
    });
  });

  describe("header button triggers login sequence", () => {
    it("header button -> torus login", async () => {
      const component = mount(
        componentWithStore(Login, store, {
          loginWalletOptions: wallet.WalletType.NONE,
        })
      );
      component.find(".LoginButton__loginButton").first().simulate("click");
      component.find(".LoginButton__loginTorus").first().simulate("click");
      await forcePromiseResolve();
      expect(torusWallet.login).toHaveBeenCalled();
    });

    it("header button -> metamask login", async () => {
      const store = createMockStore({ user: {} });
      const component = mount(
        componentWithStore(Login, store, {
          loginWalletOptions: wallet.WalletType.NONE,
        })
      );
      component.find(".LoginButton__loginButton").first().simulate("click");
      component.find(".LoginButton__loginMetamask").first().simulate("click");
      await forcePromiseResolve();
      expect(metamask.getWalletAddress).toHaveBeenCalled();
    });
  });

  describe("is logged in", () => {
    const id = "0x03f2";
    const walletType = wallet.WalletType.TORUS;
    const initialState = { user: { id, walletType } };
    const store = createMockStore(initialState);

    it("renders without crashing", () => {
      expect(() => {
        mount(
          componentWithStore(Login, store, {
            loginWalletOptions: wallet.WalletType.NONE,
          })
        );
      }).not.toThrow();
    });

    it("button triggers logout sequence", () => {
      const component = mount(
        componentWithStore(Login, store, {
          loginWalletOptions: wallet.WalletType.NONE,
        })
      );
      component.find("Button").simulate("click");
      expect(torus.logout).toHaveBeenCalled();
    });
  });
});
