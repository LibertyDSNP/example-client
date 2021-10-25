import ConnectWallet from "../ConnectWallet";
import { mount } from "enzyme";
import * as wallet from "../../services/wallets/wallet";
import {
  forcePromiseResolve,
  componentWithStore,
} from "../../test/testhelpers";
import * as metamask from "../../services/wallets/metamask/metamask";
import * as dsnp from "../../services/dsnp";
import * as session from "../../services/session";
import { getPrefabProfile } from "../../test/testProfiles";
import { waitFor } from "@testing-library/react";
import { FeedItem, User } from "../../utilities/types";
import { graphState } from "../../redux/slices/graphSlice";
import { getPreFabSocialGraph } from "../../test/testGraphs";
import { getPrefabFeed } from "../../test/testFeeds";
import { configureStore } from "@reduxjs/toolkit";
import { reducer } from "../../redux/store";
import { reduxLogout } from "../../redux/helpers";

let metamaskWallet: wallet.Wallet;
beforeAll(async () => {
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

const profiles: User[] = Array(3)
  .fill(0)
  .map((x, i) => getPrefabProfile(i));

const graph: graphState = getPreFabSocialGraph();

const feedItems: FeedItem[] = getPrefabFeed();

const feed = {
  feedItems: feedItems,
  replies: {},
  isPostLoading: { loading: false, currentUserId: undefined },
  isReplyLoading: { loading: false, parent: undefined },
};

const loggedInState = {
  user: {
    id: "123456",
    walletType: wallet.WalletType.METAMASK,
  },
  profiles: {
    profiles: {
      [profiles[0].fromId]: profiles[0],
      [profiles[1].fromId]: profiles[1],
      [profiles[2].fromId]: profiles[2],
    },
  },
  feed: feed,
  graphs: graph,
};

const store = configureStore({
  reducer,
  preloadedState: loggedInState,
});

describe("ConnectWallet Component", () => {
  it("renders without crashing", () => {
    expect(() => {
      mount(
        componentWithStore(ConnectWallet, store, {
          loginWalletOptions: wallet.WalletType.NONE,
        })
      );
    }).not.toThrow();
  });

  describe("logs out of wallet", () => {
    it("renders logout and clicking on it calls metamask logout", async () => {
      const sessionSpy = jest.spyOn(session, "clearSession");
      const component = mount(componentWithStore(ConnectWallet, store));
      component.find(".ConnectWallet__userBlock").first().simulate("click");
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

  describe("with metamask", () => {
    it("header button -> metamask connect", async () => {
      reduxLogout(store.dispatch);
      const component = mount(componentWithStore(ConnectWallet, store));
      component.find(".ConnectWallet__loginButton").first().simulate("click");
      component.find(".LoginModal__loginMetamask").first().simulate("click");
      await forcePromiseResolve();
      expect(metamaskWallet.login).toHaveBeenCalled();
      expect(store.getState().user).toEqual({
        walletType: "METAMASK",
        id: "4242",
        displayId: "4242",
      });
    });

    it("connects to wallet, then cancels login", async () => {
      jest.spyOn(dsnp, "getSocialIdentities").mockImplementationOnce(() =>
        Promise.resolve([
          {
            dsnpUserURI: "dsnp://4242",
            contractAddr: "0xabc",
            handle: "test",
          },
          {
            dsnpUserURI: "dsnp://5353",
            contractAddr: "0xdef",
            handle: "test2",
          },
        ])
      );
      reduxLogout(store.dispatch);
      const component = mount(componentWithStore(ConnectWallet, store));
      component.find(".ConnectWallet__loginButton").first().simulate("click");
      component.find(".LoginModal__loginMetamask").first().simulate("click");
      await forcePromiseResolve();
      component.update();
      component.find(".EditRegistration__cancel").first().simulate("click");
      expect(
        component.find(".ConnectWallet__loginButton").length
      ).toBeGreaterThan(0);
    });

    it("connects to wallet with more than one handle", async () => {
      jest.spyOn(dsnp, "getSocialIdentities").mockImplementationOnce(() =>
        Promise.resolve([
          {
            dsnpUserURI: "dsnp://4242",
            contractAddr: "0xabc",
            handle: "test",
          },
          {
            dsnpUserURI: "dsnp://5353",
            contractAddr: "0xdef",
            handle: "test2",
          },
        ])
      );
      reduxLogout(store.dispatch);
      const component = mount(componentWithStore(ConnectWallet, store));
      component.find(".ConnectWallet__loginButton").first().simulate("click");
      component.find(".LoginModal__loginMetamask").first().simulate("click");
      await forcePromiseResolve();
      component.update();
      expect(
        component.find(".SelectHandle__registrations").length
      ).toBeGreaterThan(0);
      component.find(".SelectHandle__registration").first().simulate("click");
      component.find(".SelectHandle__footerBtn").first().simulate("click");
      expect(store.getState().user.id).toEqual("4242");
    });

    it("first time login and registration", async () => {
      const createNewDSNPRegistration = jest.spyOn(
        dsnp,
        "createNewDSNPRegistration"
      );
      jest
        .spyOn(dsnp, "getSocialIdentities")
        .mockImplementationOnce(() => Promise.resolve([]));
      reduxLogout(store.dispatch);
      const component = mount(componentWithStore(ConnectWallet, store));
      component.find(".ConnectWallet__loginButton").first().simulate("click");
      component.find(".LoginModal__loginMetamask").first().simulate("click");
      await forcePromiseResolve();
      component.update();
      component
        .find(".CreateRegistration__input")
        .first()
        .simulate("change", {
          target: { value: "John" },
        });
      component
        .find(".CreateRegistration__createHandle")
        .first()
        .simulate("submit");
      await forcePromiseResolve();
      component.update();
      expect(createNewDSNPRegistration).toHaveBeenCalledWith("0x123", "John");
    });
  });
});
