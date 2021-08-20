import RegistrationModal from "../RegistrationModal";
import { mount, ReactWrapper } from "enzyme";
import { componentWithStore, createMockStore } from "../../test/testhelpers";
import { getPrefabProfile } from "../../test/testProfiles";
import { waitFor } from "@testing-library/react";
import { Registration } from "@dsnp/sdk/core/contracts/registry";

const profiles = Array(3)
  .fill(0)
  .map((x, i) => getPrefabProfile(i));
const store = createMockStore({
  profiles: {
    profiles: {
      [profiles[0].fromId]: profiles[0],
      [profiles[1].fromId]: profiles[1],
      [profiles[2].fromId]: profiles[2],
    },
  },
});

const registrations: Registration[] = profiles.map((p, i) => ({
  dsnpUserURI: p.fromId,
  contractAddr: "0x" + Array(5).fill(i).join(""),
  handle: `test_${i}`,
}));

describe("RegistrationModal", () => {
  it("renders without crashing", async () => {
    await waitFor(() => {
      expect(() => {
        mount(
          componentWithStore(RegistrationModal, store, {
            visible: true,
            registrations: registrations,
          })
        );
      }).not.toThrow();
    });
  });

  describe("when visible", () => {
    let component: ReactWrapper;
    let registrationSelection: Registration | undefined;

    beforeEach(() => {
      registrationSelection = undefined;
      component = mount(
        componentWithStore(RegistrationModal, store, {
          visible: true,
          registrations: registrations,
          onIdResolved: (r: Registration) => {
            registrationSelection = r;
          },
        })
      );
    });

    it("displays all registrations", async () => {
      registrations.forEach((registration, i) => {
        expect(
          component.find(".RegistrationModal__registration").at(i).text()
        ).toContain(registration.handle);
      });
    });

    it("associates registrations with profiles", async () => {
      registrations.forEach((registration, i) => {
        expect(
          component
            .find(".RegistrationModal__registration")
            .at(i)
            ?.find("img")
            .prop("alt")
        ).toBe(registration.dsnpUserURI);
      });
    });

    it("has disabled button when no registration is selected", async () => {
      expect(
        component.find("Button.RegistrationModal__footerBtn").prop("disabled")
      ).toBe(true);
    });

    describe("when registration selected", () => {
      beforeEach(async () => {
        component
          .find(".RegistrationModal__registration")
          .at(1)
          .simulate("click");
      });

      it("associates registrations with profiles", async () => {
        await waitFor(() => {
          [false, true, false].forEach((selectionStatus, i) =>
            expect(
              component
                .find(".RegistrationModal__registration")
                .at(i)
                .hasClass("RegistrationModal__registration--selected")
            ).toBe(selectionStatus)
          );
        });
      });

      it("select button is enabled", async () => {
        expect(
          component.find("Button.RegistrationModal__footerBtn").prop("disabled")
        ).toBe(false);
      });

      it("calls callback with selected registation when button clicked", async () => {
        component.find("Button.RegistrationModal__footerBtn").simulate("click");

        await waitFor(() => {
          expect(registrationSelection).toBe(registrations[1]);
        });
      });
    });
  });
});
