import { keccak_256 } from "js-sha3";
import { shallow, mount } from "enzyme";
import ReplyBlock from "../ReplyBlock";
import { componentWithStore, createMockStore } from "../../test/testhelpers";
import { getPrefabFeed } from "../../test/testFeeds";
import { waitFor } from "@testing-library/react";
import * as content from "../../services/content";

import { ReplyItem, User } from "../../utilities/types";
import { mockQueryResult } from "../../test/testQueryResult";
import { createNote } from "@dsnp/sdk/core/activityContent";
import { preFabProfiles } from "../../test/testProfiles";

const mockUserList: User[] = [
  preFabProfiles[0],
  preFabProfiles[1],
  preFabProfiles[2],
  preFabProfiles[3],
  preFabProfiles[4],
];

const profiles = mockUserList.reduce((m, p) => ({ ...m, [p.fromId]: p }), {});
const feedItems = getPrefabFeed();
const parentUri = keccak_256("this is a hash of the feed item");
const mockReply: Record<string, ReplyItem[]> = {
  [parentUri]: [
    {
      fromId: "12340000",
      contentHash: "123",
      url: "http://example.com/123.json",
      inReplyTo: feedItems[0].url,
      blockNumber: 123,
      blockIndex: 123,
      batchIndex: 123,
    },
  ],
};
const initialState = {
  user: { id: "0x0345" },
  feed: { feedItems, replies: mockReply, isReplyLoading: false },
  profiles: { profiles: profiles },
};
const store = createMockStore(initialState);

const writeReply = async (component: any) => {
  component
    .find(".ReplyInput__input")
    .first()
    .simulate("change", {
      target: {
        value: "This is our new reply!",
      },
    });
};

const pressEnter = async (component: any) => {
  return component
    .find(".ReplyInput__input")
    .last()
    .simulate("keydown", { keyCode: 13 });
};

describe("ReplyBlock", () => {
  beforeEach(() => {
    jest
      .spyOn(content, "sendReply")
      .mockImplementation(() => Promise.resolve());
  });

  const component = mount(
    componentWithStore(ReplyBlock, store, {
      parent: parentUri,
    })
  );

  it("renders without crashing", () => {
    expect(() => {
      shallow(
        componentWithStore(ReplyBlock, store, {
          parent: getPrefabFeed()[0].contentHash,
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

    it("display new reply in feed on enter", async () => {
      await writeReply(component);
      await waitFor(async () => {
        await pressEnter(component);
        expect(component.find(".ReplyBlock__repliesList")).toBeDefined();
      });
    });

    it("display new reply with a link", async () => {
      jest
        .spyOn(content, "PostQuery")
        .mockImplementation((_feedItem) =>
          mockQueryResult(
            createNote("test reply https://www.unfinishedlabs.io/")
          )
        );
      const component = mount(
        componentWithStore(ReplyBlock, store, {
          parentURI: parentUri,
        })
      );
      expect(component.find(".Reply__message").first().html()).toEqual(
        '<div class="Reply__message">test reply <a target="_blank" rel="noreferrer noopener" href="https://www.unfinishedlabs.io/">https://www.unfinishedlabs.io/</a></div>'
      );
    });
  });

  describe("It adds and clears value correctly", () => {
    it("populates message value", async () => {
      await writeReply(component);
      component.update();
      expect(component.find("textarea").first().text()).toEqual(
        "This is our new reply!"
      );
    });

    it("clears message value on new message submit", async () => {
      await writeReply(component);
      await waitFor(async () => {
        await pressEnter(component);
        expect(component.find("textarea").first().text()).toEqual("");
      });
    });
  });
});
