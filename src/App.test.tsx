import React from "react";
import App from "./App";
import * as wallet from "../src/services/wallets/wallet";

import { mount } from "enzyme";
import { componentWithStore, createMockStore } from "./test/testhelpers";
import * as dsnp from "./services/dsnp";
import * as content from "./services/content";
import * as hooks from "./redux/hooks";
import { UnsubscribeFunction } from "./services/dsnp";

jest.mock("../src/components/Header", () => () => <div> Header </div>);
jest.mock("../src/components/Feed", () => () => <div> Feed </div>);
jest.mock("../src/components/ProfileBlock", () => () => <div> Profile </div>);

describe("App", () => {
  const initialState = { user: { walletType: "METAMASK" }, feed: { feed: [] } };
  const store = createMockStore(initialState);

  jest
    .spyOn(wallet, "wallet")
    .mockReturnValue({ reload: jest.fn().mockResolvedValue(null) } as any);

  jest.spyOn(dsnp, "setupProvider").mockReturnValue(undefined);

  describe("useEffect", () => {
    let unsubscribeFnc: UnsubscribeFunction;
    let component: any;

    beforeEach(async () => {
      const dispatch = jest.fn();
      unsubscribeFnc = jest.fn();

      jest.spyOn(React, "useEffect").mockImplementation((cb) => cb());
      jest
        .spyOn(content, "startSubscriptions")
        .mockReturnValue(Promise.resolve(unsubscribeFnc));
      jest.spyOn(hooks, "useAppDispatch").mockReturnValue(dispatch);

      dispatch.mockResolvedValue({ unsubscribeFnc });

      component = await mount(componentWithStore(App, store));
    });

    it("calls clean up function", () => {
      component.unmount();

      expect(unsubscribeFnc).toHaveBeenCalled();
    });
  });
});
