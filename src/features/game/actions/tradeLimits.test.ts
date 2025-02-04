import { getEntries } from "../expansion/lib/utils";
import { MAX_INVENTORY_ITEMS } from "../lib/processEvent";
import { TRADE_LIMITS } from "./tradeLimits";

describe("TRADE_LIMITS", () => {
  it("allows the hoarding limit to be at least 3x more than the trade limits", () => {
    getEntries(TRADE_LIMITS).forEach(([item, quantity]) => {
      const maxInventory = MAX_INVENTORY_ITEMS[item];
      const tradeLimit = quantity ?? 0;
      if (maxInventory) {
        expect(maxInventory.toNumber()).toBeGreaterThanOrEqual(tradeLimit * 3);
      }
    });
  });
});
