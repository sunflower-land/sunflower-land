import { Decimal } from "decimal.js-light";
import { getObjectEntries } from "../expansion/lib/utils";
import { MAX_INVENTORY_ITEMS } from "../lib/processEvent";
import { TRADE_LIMITS } from "./tradeLimits";

describe("TRADE_LIMITS", () => {
  it("allows the hoarding limit to be at least 3x more than the trade limits", () => {
    getObjectEntries(TRADE_LIMITS).forEach(([item, quantity]) => {
      const maxInventory = MAX_INVENTORY_ITEMS[item] ?? new Decimal(0);
      const tradeLimit = quantity ?? 0;
      expect(Number(maxInventory)).toBeGreaterThanOrEqual(tradeLimit * 3);
    });
  });
});
