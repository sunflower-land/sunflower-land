import Decimal from "decimal.js-light";
import { SellableItem } from "../events/sell";
import { CAKES } from "../types/craftables";
import { getSellPrice } from "./boosts";
import { marketRate } from "./halvening";

describe("boosts", () => {
  describe("getSellPrice", () => {
    it("applies chef apron boost to cakes", () => {
      const amount = getSellPrice(CAKES()["Beetroot Cake"] as SellableItem, {
        "Chef Apron": new Decimal(1),
      });
      expect(amount).toEqual(new Decimal(marketRate(672)));
    });

    it("does not apply chef apron boost if missing", () => {
      const amount = getSellPrice(CAKES()["Beetroot Cake"] as SellableItem, {});
      expect(amount).toEqual(new Decimal(marketRate(560)));
    });
  });
});
