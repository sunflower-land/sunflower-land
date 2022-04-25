import Decimal from "decimal.js-light";
import { getAmountLeft } from "./amountLeft";
import {
  Craftable,
  BLACKSMITH_ITEMS,
  MARKET_ITEMS,
  TOOLS,
} from "../types/craftables";

const supply = {
  "Woody the Beaver": new Decimal(4000), // (50k - 4k) - 100 - 1 = 45899 left
  "Apprentice Beaver": new Decimal(100), // (5k - 100) - 1 = 4899 left
  "Foreman Beaver": new Decimal(1), // (300 - 1) = 299 left
  Nancy: new Decimal(10000), // (50k - 10k) - 123 - 90 = 39787 left
  Scarecrow: new Decimal(123), // (5k - 123) - 90 = 4787 left
  Kuebiko: new Decimal(90), // (200 - 90) = 110 left
  "Sunflower Statue": new Decimal(100),
};

describe("amountLeft", () => {
  it("should return `Infinity` when there is no `supply` prop", () => {
    const selected = TOOLS.Axe;

    expect(getAmountLeft(supply, selected)).toEqual(Infinity);
  });

  it("should ignore `upgradeSupply` when non existent", () => {
    const selected: Craftable = BLACKSMITH_ITEMS["Sunflower Statue"];

    expect(getAmountLeft(supply, selected)).toEqual(900);
  });

  it("should subtract `upgradeSupply` when limited item is required on higher tier crafting", () => {
    const woody = BLACKSMITH_ITEMS["Woody the Beaver"];
    const apprentice = BLACKSMITH_ITEMS["Apprentice Beaver"];
    const foreman = BLACKSMITH_ITEMS["Foreman Beaver"];

    expect(getAmountLeft(supply, woody)).toEqual(45899);
    expect(getAmountLeft(supply, apprentice)).toEqual(4899);
    expect(getAmountLeft(supply, foreman)).toEqual(299);

    const nancy = MARKET_ITEMS.Nancy;
    const scarecrow = MARKET_ITEMS.Scarecrow;
    const kuebiko = MARKET_ITEMS.Kuebiko;

    expect(getAmountLeft(supply, nancy)).toEqual(39787);
    expect(getAmountLeft(supply, scarecrow)).toEqual(4787);
    expect(getAmountLeft(supply, kuebiko)).toEqual(110);
  });
});
