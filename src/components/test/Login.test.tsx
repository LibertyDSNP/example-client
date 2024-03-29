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
import { getPrefabProfile } from "../../test/testProfiles";
import { waitFor } from "@testing-library/react";

let torusWallet: wallet.Wallet;
let metamaskWallet: wallet.Wallet;
beforeAll(async () => {
  torusWallet = await wallet.wallet(wallet.WalletType.TORUS);
  jest.spyOn(torus, "logout").mockImplementation(jest.fn);
  jest.spyOn(torus, "isInitialized").mockReturnValue(true);
  jest
    .spyOn(torusWallet, "getAddress")
    .mockImplementation(() => Promise.resolve("0x123"));
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
    .spyOn(metamaskWallet, "getAddress")
    .mockImplementation(() => Promise.resolve("0x123"));
  jest
    .spyOn(wallet, "wallet")
    .mockImplementation((walletType) =>
      walletType === wallet.WalletType.METAMASK
        ? metamaskWallet
        : wallet.WalletType.TORUS
        ? torusWallet
        : wallet.noWallet
    );
  jest
    .spyOn(dsnp, "setupProvider")
    .mockImplementation(() => Promise.resolve(undefined));
  jest
    .spyOn(dsnp, "getSocialIdentities")
    .mockImplementation(() =>
      Promise.resolve([
        { dsnpUserURI: "dsnp://4242", contractAddr: "0xabc", handle: "test" },
      ])
    );
});

const walletType = wallet.WalletType.NONE;
const profiles = Array(3)
  .fill(0)
  .map((x, i) => getPrefabProfile(i));

const store = createMockStore({
  user: { walletType },
  profiles: {
    profiles: {
      [profiles[0].fromId]: profiles[0],
      [profiles[1].fromId]: profiles[1],
      [profiles[2].fromId]: profiles[2],
    },
  },
});

describe("Login Component", () => {
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
      component.find(".Login__loginButton").first().simulate("click");
      component.find(".LoginModal__loginTorus").first().simulate("click");
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
      component.find(".Login__loginButton").first().simulate("click");
      await waitFor(() => {
        expect(
          component.find(".LoginModal__loginMetamask").length
        ).toBeGreaterThan(0);
        component.find(".LoginModal__loginMetamask").first().simulate("click");
      });
      await waitFor(() => expect(metamaskWallet.login).toHaveBeenCalled());
    });
  });

  describe("is logged in", () => {
    const id = "0x03f2";
    const walletType = wallet.WalletType.METAMASK;
    const initialState = {
      user: { id, walletType },
      profiles: {
        profiles: {
          [profiles[0].fromId]: profiles[0],
          [profiles[1].fromId]: profiles[1],
          [profiles[2].fromId]: profiles[2],
        },
      },
    };
    const store = createMockStore(initialState);

    it("renders without crashing", async () => {
      await waitFor(() =>
        expect(() =>
          mount(
            componentWithStore(Login, store, {
              loginWalletOptions: wallet.WalletType.NONE,
            })
          )
        ).not.toThrow()
      );
    });

    describe("when wallet type is passed to Login", () => {
      describe("and it is set to Torus", () => {
        it("renders logout and clicking on it calls torus logout", async () => {
          const sessionSpy = jest.spyOn(session, "clearSession");
          initialState.user.walletType = wallet.WalletType.TORUS;
          const component = mount(
            componentWithStore(Login, store, {
              loginWalletOptions: wallet.WalletType.TORUS,
            })
          );
          component.find(".Login__userBlock").first().simulate("click");
          component
            .find(".EditRegistration__logoutButton")
            .first()
            .simulate("click");
          await waitFor(() => {
            expect(sessionSpy).toHaveBeenCalled();
            expect(torus.logout).toHaveBeenCalled();
          });
        });
      });

      describe("and it is set to Metamask", () => {
        it("renders logout and clicking on it calls metamask logout", async () => {
          const sessionSpy = jest.spyOn(session, "clearSession");
          initialState.user.walletType = wallet.WalletType.METAMASK;
          const component = mount(
            componentWithStore(Login, store, {
              loginWalletOptions: wallet.WalletType.METAMASK,
            })
          );

          component.find(".Login__userBlock").first().simulate("click");
          component
            .find(".EditRegistration__logoutButton")
            .first()
            .simulate("click");
          await waitFor(() => {
            expect(sessionSpy).toHaveBeenCalled();
            expect(metamaskWallet.logout).toHaveBeenCalled();
          });
        });
      });
    });
  });
});
