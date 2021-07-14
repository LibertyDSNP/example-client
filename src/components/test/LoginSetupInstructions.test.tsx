import { componentWithStore, createMockStore } from "../../test/testhelpers";
import { mount } from "enzyme";
import Login from "../Login";
import * as wallet from "../../services/wallets/wallet";
import * as metamask from "../../services/wallets/metamask/metamask";
import * as torus from "../../services/wallets/torus/torus";

jest
  .spyOn(torus, "enableTorus")
  .mockImplementation(jest.fn((_build) => Promise.resolve()));
jest.spyOn(metamask, "isInstalled").mockReturnValue(true);
jest
  .spyOn(metamask, "getWalletAddress")
  .mockImplementation(() => Promise.resolve("0x123"));

describe("LoginSetupInstructions Component", () => {
  describe("login from login guide", () => {
    it("metamask login guide", () => {
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
      expect(metamask.getWalletAddress).toHaveBeenCalled();
    });

    it("torus login guide", () => {
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
      expect(torus.enableTorus).toHaveBeenCalled();
    });
  });
});
