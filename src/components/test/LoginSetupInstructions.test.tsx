import { componentWithStore, createMockStore } from "../../test/testhelpers";
import { mount } from "enzyme";
import { waitFor } from "@testing-library/react";
import Login from "../Login";
import * as wallet from "../../services/wallets/wallet";
import * as metamask from "../../services/wallets/metamask/metamask";
import * as torus from "../../services/wallets/torus/torus";
import * as sdk from "../../services/sdk";

let metamaskWallet: wallet.Wallet;
let torusWallet: wallet.Wallet;
beforeAll(async () => {
  torusWallet = await wallet.wallet(wallet.WalletType.TORUS);
  metamaskWallet = await wallet.wallet(wallet.WalletType.METAMASK);

  jest.spyOn(torus, "logout").mockImplementation(jest.fn);
  jest.spyOn(torus, "isInitialized").mockReturnValue(true);
  jest
    .spyOn(torusWallet, "login")
    .mockImplementation(() => Promise.resolve("0x123"));
  jest.spyOn(metamask, "isInstalled").mockReturnValue(true);
  jest
    .spyOn(metamaskWallet, "login")
    .mockImplementation(() => Promise.resolve("0x123"));
  jest.spyOn(sdk, "setupProvider").mockImplementation(jest.fn);
  jest
    .spyOn(sdk, "getSocialIdentities")
    .mockImplementation(() =>
      Promise.resolve([
        { dsnpUserURI: "dsnp://0x034b", contractAddr: "0xabc", handle: "test" },
      ])
    );
});

describe("LoginSetupInstructions Component", () => {
  describe("login from login guide", () => {
    it("metamask login guide", async () => {
      const initialState = { user: {} };
      const store = createMockStore(initialState);
      const component = mount(
        componentWithStore(Login, store, {
          loginWalletOptions: wallet.WalletType.METAMASK,
        })
      );
      component
        .find(".LoginButton__loginButton--quickStart")
        .first()
        .simulate("click");
      await waitFor(() => {
        expect(metamaskWallet.login).toHaveBeenCalled();
      });
    });

    it("torus login guide", async () => {
      const initialState = { user: {} };
      const store = createMockStore(initialState);
      const component = mount(
        componentWithStore(Login, store, {
          loginWalletOptions: wallet.WalletType.TORUS,
        })
      );
      component
        .find(".LoginButton__loginButton--quickStart")
        .first()
        .simulate("click");
      await waitFor(() => {
        expect(torusWallet.login).toHaveBeenCalled();
      });
    });
  });
});
