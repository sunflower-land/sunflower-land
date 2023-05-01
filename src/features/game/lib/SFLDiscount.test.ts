import Decimal from "decimal.js-light";
import { SFLDiscount } from "./SFLDiscount";
import { TEST_FARM } from "./constants";

describe("SFLDiscount", () => {
  it("should return 0.75 when inventory has Dawn Breaker Banner", () => {
    const state = {
      ...TEST_FARM,
      inventory: { "Dawn Breaker Banner": new Decimal(1) },
    };
    const sfl = new Decimal(1);
    const result = SFLDiscount(state, sfl);
    expect(result).toEqual(new Decimal(0.75));
  });
  it("should return 1 when inventory does not have Dawn Breaker Banner", () => {
    const state = {
      ...TEST_FARM,
      inventory: { "Dawn Breaker Banner": undefined },
    };
    const sfl = new Decimal(1);
    const result = SFLDiscount(state, sfl);
    expect(result).toEqual(new Decimal(1));
  });
});
