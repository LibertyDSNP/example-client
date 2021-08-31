import RegistrationModal from "../RegistrationModal";
import { mount, ReactWrapper } from "enzyme";
import { componentWithStore, createMockStore } from "../../test/testhelpers";
import { getPrefabProfile } from "../../test/testProfiles";
import { waitFor } from "@testing-library/react";
import { Registration } from "@dsnp/sdk/core/contracts/registry";
import { DSNPUserURI } from "@dsnp/sdk/dist/types/core/identifiers";
import * as sdk from "../../services/sdk";

const profiles = Array(3)
  .fill(0)
  .map((x, i) => getPrefabProfile(i));
const store = createMockStore({
  profiles: {
    profiles: {
      [profiles[0].fromId.toString()]: profiles[0],
      [profiles[1].fromId.toString()]: profiles[1],
      [profiles[2].fromId.toString()]: profiles[2],
    },
  },
});

const registrations: Registration[] = profiles.map((p, i) => ({
  dsnpUserURI: p.fromId.toString(16),
  contractAddr: "0x" + Array(5).fill(i).join(""),
  handle: `test_${i}`,
}));

describe("RegistrationModal", () => {
  describe("when account has no registrations", () => {
    let component: ReactWrapper;
    let registrationSelection: DSNPUserURI | undefined;
    let handleInput: string;

    beforeEach(() => {
      component = mount(
        componentWithStore(RegistrationModal, store, {
          visible: true,
          registrations: [],
          onIdResolved: (r: DSNPUserURI) => {
            registrationSelection = r;
          },
        })
      );
      jest.spyOn(global.console, "warn").mockImplementation(jest.fn());
      jest
        .spyOn(sdk, "createNewDSNPRegistration")
        .mockImplementation((_addr, handle) => {
          handleInput = handle;
          return Promise.resolve("dsnp://0x424242");
        });
    });

    afterEach(() => {
      component.unmount();
    });

    it("shows new registration UI", async () => {
      expect(component.exists(".RegistrationModal__handleInput")).toBe(true);
    });

    it("prevents registration with empty handle", async () => {
      component
        .find(".RegistrationModal__createHandle")
        .first()
        .simulate("submit");

      await waitFor(() => {
        expect(
          component.find(".RegistrationModal__handleInput").first().text()
        ).toContain("Handle cannot be blank");
        // this indicates form has not been sumitted
        expect(registrationSelection).toBe(undefined);
      });
    });

    it("registers new DSNP Id", async () => {
      component.find("Input").simulate("change", {
        target: { value: "Joanne" },
      });
      component
        .find(".RegistrationModal__createHandle")
        .first()
        .simulate("submit");

      await waitFor(() => {
        expect(handleInput).toBe("Joanne");
        expect(registrationSelection).toBe("0x424242");
      });
    });
  });

  describe("when account has registrations", () => {
    let component: ReactWrapper;
    let registrationSelection: DSNPUserURI | undefined;

    beforeEach(() => {
      registrationSelection = undefined;
      component = mount(
        componentWithStore(RegistrationModal, store, {
          visible: true,
          registrations: registrations,
          onIdResolved: (r: DSNPUserURI) => {
            registrationSelection = r;
          },
        })
      );
    });

    afterEach(() => {
      component.unmount();
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
          expect(registrationSelection).toBe(registrations[1].dsnpUserURI);
        });
      });
    });

    describe("when create new handle is clicked", () => {
      beforeEach(() => {
        component.find({ children: "Create New Handle" }).simulate("click");
      });

      it("displays create handle form", async () => {
        await waitFor(() => {
          expect(
            component.find(".RegistrationModal__createHandle").first().text()
          ).toContain("Please create a handle:");
        });
      });

      it("permits a new registration", () => {
        const registerSpy = jest
          .spyOn(sdk, "createNewDSNPRegistration")
          .mockImplementation(() => Promise.resolve("dsnp://0x424242"));

        component.find("Input").simulate("change", {
          target: { value: "Joanne" },
        });
        component
          .find(".RegistrationModal__createHandle")
          .first()
          .simulate("submit");

        expect(registerSpy.mock.calls.length).toBe(1);
      });

      it("select existing handle switches back to handle selection", () => {
        component
          .find({ children: "Select Existing Handle" })
          .simulate("click");

        expect(component.find("RegistrationModal").first().text()).toContain(
          "Select an account:"
        );
      });
    });
  });
});
