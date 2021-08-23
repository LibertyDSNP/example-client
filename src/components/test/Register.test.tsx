import { mount } from "enzyme";
import {
  componentWithStore,
  createMockStore,
  forcePromiseResolve,
} from "../../test/testhelpers";
import Register from "../Register";
import { generateWalletAddress } from "../../test/testAddresses";
import { waitFor } from "@testing-library/react";

describe("Register component", () => {
  const store = createMockStore({ user: {} });
  const walletAddress = generateWalletAddress();
  const doSetLoginAndSaveSession = jest.fn();

  describe("when first displayed", () => {
    it("renders", () => {
      expect(() => {
        mount(
          componentWithStore(Register, store, {
            walletAddress,
            doSetLoginAndSaveSession,
          })
        );
      }).not.toThrow();
    });
  });
  describe("when the form is submitted", () => {
    it("does not show error if handle is supplied", async () => {
      const warnSpy = jest.spyOn(console, "warn");

      const component = mount(
        componentWithStore(Register, store, {
          walletAddress,
          doSetLoginAndSaveSession,
        })
      );
      component.find("Input").simulate("change", {
        target: { value: "Joanne" },
      });
      component.find("button[type='submit']").first().simulate("click");
      await forcePromiseResolve();
      expect(warnSpy).not.toHaveBeenCalled();
    });
    it("shows error if handle input is non-empty", async () => {
      let calledMsg = "";
      const spy = jest
        .spyOn(console, "warn")
        .mockImplementation((msg: string, msg2: Array<string>) => {
          calledMsg = msg2.join("");
        });
      const component = mount(
        componentWithStore(Register, store, {
          walletAddress,
          doSetLoginAndSaveSession,
        })
      );
      await component.find("Input").simulate("change", "");
      await component.find("button[type='submit']").first().simulate("click");

      await waitFor(() => {
        expect(spy).toHaveBeenCalledTimes(1);
        expect(calledMsg).toContain("'handle' is required");
      });
      console.log(component.html());
      expect(doSetLoginAndSaveSession).not.toHaveBeenCalled();
    });
  });
});
