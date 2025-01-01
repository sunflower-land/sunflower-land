import { MAX_INVENTORY_ITEMS } from "../lib/processEvent";
import { InventoryItemName } from "../types/game";
import { TRADE_LIMITS } from "./tradeLimits";

describe("TRADE_LIMITS", () => {
  it("allows the hoarding limit to be at least 3x more than the trade limits", () => {
    Object.entries(TRADE_LIMITS).forEach(([name, quantity]) => {
      // console.log(name);
      expect(
        MAX_INVENTORY_ITEMS[name as InventoryItemName]?.toNumber(),
      ).toBeGreaterThanOrEqual(quantity * 3);
    });
  });
});
