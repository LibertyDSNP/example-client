import { startSubscriptions } from "./dsnp";
import { core } from "@dsnp/sdk";
const subscription = core.contracts.subscription;

describe("dsnp.ts", () => {
  describe("startSubscriptions", () => {
    it("works", async () => {
      let caught = "";
      const batchSub = jest
        .spyOn(subscription, "subscribeToBatchPublications")
        .mockImplementation(async () => jest.fn());

      const regSub = jest
        .spyOn(subscription, "subscribeToRegistryUpdates")
        .mockImplementation(async () => jest.fn);

      const res = await startSubscriptions(jest.fn(), jest.fn());
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
