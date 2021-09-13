import ProfileBlock from "../ProfileBlock";
import { mount } from "enzyme";
import { getPrefabProfile } from "../../test/testProfiles";
import { componentWithStore, createMockStore } from "../../test/testhelpers";
import { getPreFabSocialGraph } from "../../test/testGraphs";
import * as wallet from "../../services/wallets/wallet";
import { waitFor } from "@testing-library/react";

const id = "0x03f2";
const displayId = id;
const otherId = "0x1234";
const profile = getPrefabProfile(0);
const otherProfile = getPrefabProfile(1);
const graphs = getPreFabSocialGraph();
const walletType = wallet.WalletType.TORUS;
const store = createMockStore({
  user: { id, walletType, displayId },
  profiles: { profiles: { [id]: profile, [otherId]: otherProfile } },
  graphs: graphs,
});

describe("Profile Block", () => {
  it("renders without crashing", async () => {
    await waitFor(() => {
      expect(() => {
        mount(componentWithStore(ProfileBlock, store));
      }).not.toThrow();
    });
  });

  it("displays login prompt when not logged in", () => {
    const store = createMockStore({
      user: { undefined },
      profiles: { profiles: {} },
      graphs: { graphs: graphs },
      displayId: undefined,
    });
    const component = mount(componentWithStore(ProfileBlock, store));
    expect(component.find("ProfileBlock").text()).toContain(
      "Login Quick Start"
    );
  });

  it("editable on edit button click", async () => {
    const component = mount(componentWithStore(ProfileBlock, store));
    component.find(".ProfileBlock__editButton").first().simulate("click");
    await waitFor(() => {
      expect(component.find(".ProfileBlock__name").props().disabled).toEqual(
        false
      );
    });
  });

  describe("save button click", () => {
    it("save button disabled when not edited", async () => {
      const component = mount(componentWithStore(ProfileBlock, store));
      component.find(".ProfileBlock__editButton").first().simulate("click");
      await waitFor(() => {
        expect(
          component.find(".ProfileBlock__editButton").first().props().disabled
        ).toEqual(true);
      });
    });
    it("save button enabled when edited", async () => {
      const component = mount(componentWithStore(ProfileBlock, store));
      component.find(".ProfileBlock__editButton").first().simulate("click");
      component
        .find(".ProfileBlock__name")
        .simulate("change", { target: { value: "Monday NewLastName" } });
      await waitFor(() => {
        expect(
          component.find(".ProfileBlock__editButton").first().props().disabled
        ).toEqual(false);
      });
    });
  });

  it("cancels on cancel button click", async () => {
    const component = mount(componentWithStore(ProfileBlock, store));
    component.find(".ProfileBlock__editButton").first().simulate("click");
    component
      .find(".ProfileBlock__name")
      .simulate("change", { target: { value: "Monday TestLastName" } });
    await waitFor(() => {
      expect(component.find(".ProfileBlock__name").props().value).toEqual(
        "Monday TestLastName"
      );
    });
    component.find(".ProfileBlock__editButton").last().simulate("click");
    expect(component.find(".ProfileBlock__name").props().value).toEqual(
      "Anonymous"
    );
  });

  describe("display other user", () => {
    const displayId = otherId;
    const otherUserStore = createMockStore({
      user: { id, walletType, displayId },
      profiles: {
        profiles: { [id]: profile, [displayId]: otherProfile },
      },
      graphs: graphs,
    });

    it("does not show edit button if other user", async () => {
      const component = mount(componentWithStore(ProfileBlock, otherUserStore));
      expect(component.find(".ProfileBlock__editButton")).toEqual({});
    });

    it("displays correct userId", async () => {
      const component = mount(componentWithStore(ProfileBlock, otherUserStore));
      expect(component.find(".ProfileBlock__dsnpUserId").props().value).toEqual(
        displayId
      );
    });
  });
});
