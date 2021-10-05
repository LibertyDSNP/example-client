import ConnectionsList from "../ConnectionsList";
import { mount, shallow } from "enzyme";
import {
  forcePromiseResolve,
  componentWithStore,
  createMockStore,
} from "../../test/testhelpers";
import { getPreFabSocialGraph } from "../../test/testGraphs";
import { preFabProfiles } from "../../test/testProfiles";
import { waitFor } from "@testing-library/react";
import { User } from "../../utilities/types";

const mockUserList: User[] = [
  preFabProfiles[0],
  preFabProfiles[1],
  preFabProfiles[2],
  preFabProfiles[3],
  preFabProfiles[4],
];

const profiles = mockUserList.reduce((m, p) => ({ ...m, [p.fromId]: p }), {});
const graphs = getPreFabSocialGraph();
const store = createMockStore({
  user: { id: mockUserList[0].fromId, displayId: mockUserList[2].fromId },
  profiles: profiles,
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
      component.find(".ConnectionsList__button").first().simulate("click");
      await waitFor(() => {
        expect(
          component
            .find(".ConnectionsList__button")
            .first()
            .hasClass("ConnectionsList__button--active")
        ).toBeTruthy();
      });
    });

    it("displays correct list title on following click", async () => {
      const component = mount(componentWithStore(ConnectionsList, store));
      await forcePromiseResolve();
      component.find(".ConnectionsList__button").last().simulate("click");
      await waitFor(() => {
        expect(
          component
            .find(".ConnectionsList__button")
            .last()
            .hasClass("ConnectionsList__button--active")
        ).toBeTruthy();
      });
    });

    it("hides list on double click", async () => {
      const component = mount(componentWithStore(ConnectionsList, store));
      await forcePromiseResolve();
      component.find(".ConnectionsList__button").last().simulate("click");
      await waitFor(() => {
        expect(
          component
            .find(".ConnectionsList__button")
            .first()
            .hasClass("ConnectionsList__button--active")
        ).not.toBeTruthy();
      });
    });

    it("switches back and forth between lists", async () => {
      const component = mount(componentWithStore(ConnectionsList, store));
      await forcePromiseResolve();
      component.find(".ConnectionsList__button").first().simulate("click");
      component.find(".ConnectionsList__button").last().simulate("click");
      await waitFor(() => {
        expect(
          component
            .find(".ConnectionsList__button")
            .last()
            .hasClass("ConnectionsList__button--active")
        ).toBeTruthy();
      });
    });
  });

  describe("profiles filtered", () => {
    it("filters followers", async () => {
      const component = mount(componentWithStore(ConnectionsList, store));
      component.find(".ConnectionsList__button").first().simulate("click");
      await waitFor(() => {
        expect(
          (component
            .find("ConnectionsListProfiles")
            .prop("connectionsList") as User[]).length
        ).toEqual(1);
      });
    });

    it("filters following", async () => {
      const component = mount(componentWithStore(ConnectionsList, store));
      component.find(".ConnectionsList__button").last().simulate("click");
      await waitFor(() => {
        expect(
          (component
            .find("ConnectionsListProfiles")
            .prop("connectionsList") as User[]).length
        ).toEqual(6);
      });
    });

    it("profiles empty on closed", async () => {
      const component = mount(componentWithStore(ConnectionsList, store));
      await waitFor(() => {
        expect(
          (component
            .find("ConnectionsListProfiles")
            .prop("connectionsList") as User[]).length
        ).toEqual(0);
      });
    });

    it("profiles empty on double click closed", async () => {
      const component = mount(componentWithStore(ConnectionsList, store));
      component.find(".ConnectionsList__button").last().simulate("click");
      component.find(".ConnectionsList__button").last().simulate("click");

      await waitFor(() => {
        expect(
          (component
            .find("ConnectionsListProfiles")
            .prop("connectionsList") as User[]).length
        ).toEqual(0);
      });
    });
  });
});
