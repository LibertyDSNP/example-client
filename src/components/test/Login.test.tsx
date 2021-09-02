import Login from "../Login";
import { mount } from "enzyme";
import * as torus from "../../services/wallets/torus/torus";
import * as wallet from "../../services/wallets/wallet";
import {
  forcePromiseResolve,
  componentWithStore,
  createMockStore,
} from "../../test/testhelpers";
import * as metamask from "../../services/wallets/metamask/metamask";
import * as dsnp from "../../services/dsnp";
import * as session from "../../services/session";

let torusWallet: wallet.Wallet;
let metamaskWallet: wallet.Wallet;
beforeAll(async () => {
  torusWallet = await wallet.wallet(wallet.WalletType.TORUS);
  jest.spyOn(torus, "logout").mockImplementation(jest.fn);
  jest.spyOn(torus, "isInitialized").mockReturnValue(true);
  jest
    .spyOn(torusWallet, "login")
    .mockImplementation(() => Promise.resolve("0x123"));

  metamaskWallet = await wallet.wallet(wallet.WalletType.METAMASK);

  jest
    .spyOn(metamaskWallet, "login")
    .mockImplementation(() => Promise.resolve("0x456"));
  jest.spyOn(metamaskWallet, "logout").mockImplementation(jest.fn);

  jest.spyOn(metamask, "isInstalled").mockReturnValue(true);
  jest
    .spyOn(metamask, "getWalletAddress")
    .mockImplementation(() => Promise.resolve("0x123"));
  jest.spyOn(dsnp, "setupProvider").mockImplementation(jest.fn);
  jest
    .spyOn(dsnp, "getSocialIdentities")
    .mockImplementation(() =>
      Promise.resolve([
        { dsnpUserURI: "dsnp://4242", contractAddr: "0xabc", handle: "test" },
      ])
    );
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
      expect(metamaskWallet.login).toHaveBeenCalled();
    });
  });

  describe("is logged in", () => {
    const id = "0x03f2";
    const walletType = wallet.WalletType.METAMASK;
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

    describe("when wallet type is passed to Login", () => {
      const sessionSpy = jest.spyOn(session, "clearSession");
      describe("and it is set to Torus", () => {
        initialState.user.walletType = wallet.WalletType.TORUS;
        const component = mount(
          componentWithStore(Login, store, {
            loginWalletOptions: wallet.WalletType.TORUS,
          })
        );
        it("renders logout and clicking on it calls torus logout", () => {
          component.find("Button").first().simulate("click");
          expect(sessionSpy).toHaveBeenCalled();
          expect(torus.logout).toHaveBeenCalled();
        });
      });
      describe("and it is set to Metamask", () => {
        initialState.user.walletType = wallet.WalletType.METAMASK;
        const component = mount(
          componentWithStore(Login, store, {
            loginWalletOptions: wallet.WalletType.METAMASK,
          })
        );
        it("renders logout and clicking on it calls metamask logout", () => {
          component.find("Button").simulate("click");
          expect(sessionSpy).toHaveBeenCalled();
          expect(metamaskWallet.logout).toHaveBeenCalled();
        });
      });
    });
  });
});
