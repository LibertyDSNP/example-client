import { shallow, mount } from "enzyme";
import ReplyBlock from "../ReplyBlock";
import { componentWithStore, createMockStore } from "../../test/testhelpers";
import { getPrefabFeed } from "../../test/testFeeds";
import { waitFor } from "@testing-library/react";
import * as sdk from "../../services/sdk";
import * as wallet from "../../services/wallets/wallet";
import { convertToDSNPUserId } from "@dsnp/sdk/core/identifiers";
import { hash } from "@dsnp/sdk/core/utilities";

const id = convertToDSNPUserId(0x0345);
const feedItems = getPrefabFeed();
const initialState = {
  user: { id: id, walletType: wallet.WalletType.METAMASK },
  feed: { feedItems },
};
const store = createMockStore(initialState);

const writeReply = async (component: any) => {
  return component
    .find(".ReplyInput__input")
    .first()
    .simulate("change", { target: { value: "This is our new reply!" } });
};

const pressEnter = async (component: any) => {
  return component
    .find(".ReplyInput__input")
    .last()
    .simulate("keydown", { keyCode: 13 });
};

describe("ReplyBlock", () => {
  beforeAll(() => {
    jest.spyOn(sdk, "sendReply").mockImplementation(() => Promise.resolve());
  });

  const component = mount(
    componentWithStore(ReplyBlock, store, {
      parent: hash("this is a hash of the feed item"),
    })
  );

  it("renders without crashing", () => {
    expect(() => {
      shallow(
        componentWithStore(ReplyBlock, store, {
          parent: getPrefabFeed()[0].hash,
        })
      );
    }).not.toThrow();
  });

  describe("replies show or do not show in reply feed", () => {
    it("does not display messages in feed if no messages", async () => {
      expect(component.find(".ReplyBlock__repliesList")).not.toContain(
        ".Reply__block"
      );
    });

    it("display new message in feed on enter", async () => {
      await writeReply(component);
      await pressEnter(component);
      await waitFor(() =>
        expect(component.find(".ReplyBlock__repliesList")).toBeDefined()
      );
    });
  });

  describe("It adds and clears value correctly", () => {
    it("populates message value", async () => {
      await writeReply(component);
      expect(component.find("textarea").first().text()).toEqual(
        "This is our new reply!"
      );
    });

    it("clears message value on new message submit", async () => {
      await writeReply(component);
      await pressEnter(component);
      await waitFor(() =>
        expect(component.find("textarea").first().text()).toEqual("")
      );
    });
  });
});
