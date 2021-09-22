import RegistrationModal from "../RegistrationModal";
import { mount, ReactWrapper } from "enzyme";
import { componentWithStore, createMockStore } from "../../test/testhelpers";
import { getPrefabProfile } from "../../test/testProfiles";
import { waitFor } from "@testing-library/react";
import { Registration } from "@dsnp/sdk/core/contracts/registry";
import { DSNPUserURI } from "@dsnp/sdk/core/identifiers";
import * as dsnp from "../../services/dsnp";

const profiles = Array(3)
  .fill(0)
  .map((x, i) => getPrefabProfile(i));

const mockRegistrations: Registration[] = profiles.map((p, i) => ({
  dsnpUserURI: p.fromId,
  contractAddr: "0x" + Array(5).fill(i).join(""),
  handle: `test_${i}`,
}));

const store = createMockStore({
  user: { id: "424242", registrations: mockRegistrations },
  profiles: {
    profiles: {
      [profiles[0].fromId]: profiles[0],
      [profiles[1].fromId]: profiles[1],
      [profiles[2].fromId]: profiles[2],
    },
  },
});

describe("RegistrationModal", () => {
  describe("when account has no registrations", () => {
    let component: ReactWrapper;
    let registrationSelection: DSNPUserURI | undefined;
    let handleInput: string;

    beforeEach(() => {
      component = mount(
        componentWithStore(RegistrationModal, store, {
          visible: true,
          onIdResolved: (r: DSNPUserURI) => {
            registrationSelection = r;
          },
        })
      );
      jest.spyOn(global.console, "warn").mockImplementation(jest.fn());
      jest
        .spyOn(dsnp, "createNewDSNPRegistration")
        .mockImplementation((_addr, handle) => {
          handleInput = handle;
          return Promise.resolve("dsnp://424242");
        });
      jest
        .spyOn(dsnp, "getSocialIdentities")
        .mockImplementation(() => Promise.resolve([]));
    });

    afterEach(() => {
      component.unmount();
    });

    it("shows new registration UI", async () => {
      component
        .find(".EditRegistrationAccordion__panelTitle")
        .first()
        .simulate("click");
      expect(component.exists(".RegistrationModal__handleInput")).toBe(true);
    });

    it("prevents registration with empty handle", async () => {
      component
        .find(".EditRegistrationAccordion__panelTitle")
        .first()
        .simulate("click");
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
      component
        .find(".EditRegistrationAccordion__panelTitle")
        .first()
        .simulate("click");
      component.find("Input").simulate("change", {
        target: { value: "Joanne" },
      });
      component
        .find(".RegistrationModal__createHandle")
        .first()
        .simulate("submit");

      await waitFor(() => {
        expect(handleInput).toBe("Joanne");
        expect(registrationSelection).toBe("424242");
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
          onIdResolved: (r: DSNPUserURI) => {
            registrationSelection = r;
          },
        })
      );
      component.find({ children: "Select Account Handle" }).simulate("click");
    });

    afterEach(() => {
      component.unmount();
    });

    it("displays all registrations", async () => {
      mockRegistrations.forEach((registration, i) => {
        expect(
          component.find(".RegistrationModal__registration").at(i).text()
        ).toContain(registration.handle);
      });
    });

    it("associates registrations with profiles", async () => {
      mockRegistrations.forEach((registration, i) => {
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
      component
        .find(".EditRegistrationAccordion__panelTitle")
        .last()
        .simulate("click");
      expect(
        component.find(".RegistrationModal__footerBtn").last().prop("disabled")
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
          expect(registrationSelection).toBe(mockRegistrations[1].dsnpUserURI);
        });
      });
    });

    describe("when create new handle is clicked", () => {
      beforeEach(() => {
        component.find({ children: "Create New Handle" }).simulate("click");
      });

      it("displays create handle form", async () => {
        await waitFor(() => {
          expect(component.find("form").props().id).toEqual("createHandle");
        });
      });

      it("permits a new registration", async () => {
        const registerSpy = jest
          .spyOn(dsnp, "createNewDSNPRegistration")
          .mockImplementation(() => Promise.resolve("dsnp://424242"));
        jest
          .spyOn(dsnp, "getSocialIdentities")
          .mockImplementation(() => Promise.resolve([]));

        component.find("Input").simulate("change", {
          target: { value: "Joanne" },
        });
        component
          .find(".RegistrationModal__createHandle")
          .first()
          .simulate("submit");
        await waitFor(() => expect(registerSpy.mock.calls.length).toBe(1));
      });
    });
  });
});
