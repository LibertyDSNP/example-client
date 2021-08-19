import { startSubscriptions } from "./sdk";
import { core } from "@dsnp/sdk";
import { flushPromises } from "../test/testhelpers";
const subscription = core.contracts.subscription;

const mockThunkDispatch = jest.fn;

describe("sdk.ts", () => {
  describe("startSubscriptions", () => {
    it("works", async () => {
      let caught = "";
      const batchSub = jest
        .spyOn(subscription, "subscribeToBatchPublications")
        .mockImplementation(async () => jest.fn());

      const regSub = jest
        .spyOn(subscription, "subscribeToRegistryUpdates")
        .mockImplementation(async () => jest.fn);

      const res = await startSubscriptions(mockThunkDispatch);
      const unsub = () =>
        Object.values(res).forEach(async (u) => {
          try {
            await u();
          } catch (e) {
            caught = e.message;
          }
        });
      await expect(unsub).not.toThrow();
      expect(batchSub).toHaveBeenCalled();
      expect(regSub).toHaveBeenCalled();
      expect(caught).toEqual("");
    });
  });
});
