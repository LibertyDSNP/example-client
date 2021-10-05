import ConnectionsList from "../ConnectionsList";
import { mount, shallow } from "enzyme";
import {
  forcePromiseResolve,
  componentWithStore,
  createMockStore,
} from "../../test/testhelpers";
import { getPreFabSocialGraph } from "../../test/testGraphs";
import { getPrefabProfile } from "../../test/testProfiles";
import { waitFor } from "@testing-library/react";

const profile = getPrefabProfile(0);
const graphs = getPreFabSocialGraph();
const store = createMockStore({
  user: { id: profile.fromId },
  profiles: [],
  graphs: graphs,
});

describe("ConnectionsList", () => {
  it("renders without crashing", async () => {
    const component = shallow(componentWithStore(ConnectionsList, store));
    await forcePromiseResolve();
    expect(() => component).not.toThrow();
  });

  describe("button displays correct list title", () => {
    it("displays correct list title on followers click", async () => {
      const component = mount(componentWithStore(ConnectionsList, store));
      await forcePromiseResolve();
      const followersButton = component
        .find(".ConnectionsList__button")
        .first();
      followersButton.simulate("click");
      await waitFor(() => {
        console.log(followersButton.debug());

        expect(
          followersButton.hasClass("ConnectionsList__button--active")
        ).toBeTruthy();
      });
    });

    it("displays correct list title on following click", async () => {
      const component = mount(componentWithStore(ConnectionsList, store));
      await forcePromiseResolve();
      component.find(".ConnectionsList__button").last().simulate("click");
      expect(component.find("ConnectionsListProfiles").prop("listStatus")).toBe(
        2
      );
    });

    it("hides list on double click", async () => {
      const component = mount(componentWithStore(ConnectionsList, store));
      await forcePromiseResolve();
      component.find(".ConnectionsList__button").last().simulate("click");
      component.find(".ConnectionsList__button").last().simulate("click");
      expect(component.find("ConnectionsListProfiles").prop("listStatus")).toBe(
        0
      );
    });

    it("switches back and forth between lists", async () => {
      const component = mount(componentWithStore(ConnectionsList, store));
      await forcePromiseResolve();
      component.find(".ConnectionsList__button").first().simulate("click");
      component.find(".ConnectionsList__button").last().simulate("click");
      expect(component.find("ConnectionsListProfiles").prop("listStatus")).toBe(
        2
      );
    });
  });
});
