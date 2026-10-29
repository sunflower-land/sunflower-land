import Decimal from "decimal.js-light";
import {
  BAKERY_COOKABLES,
  COOKABLE_CAKES,
  FIRE_PIT_COOKABLES,
  isTruffleRecipe,
  KITCHEN_COOKABLES,
  TRUFFLE_RECIPES,
} from "./consumables";
import { isFoodMadeWithHoney } from "features/game/expansion/lib/boosts";

const HOUR = 60 * 60;

describe("Truffle recipes (Chapter 16)", () => {
  it("roasts Ember-Roasted Truffle Potatoes at the Fire Pit for 800 XP in 1h", () => {
    expect(FIRE_PIT_COOKABLES["Ember-Roasted Truffle Potatoes"]).toMatchObject({
      name: "Ember-Roasted Truffle Potatoes",
      building: "Fire Pit",
      experience: 800,
      cookingSeconds: 1 * HOUR,
      ingredients: {
        Truffle: new Decimal(1),
        Potato: new Decimal(30),
      },
    });
  });

  it("bakes Truffle Cake at the Bakery for 25,000 XP in 26h", () => {
    expect(BAKERY_COOKABLES["Truffle Cake"]).toMatchObject({
      name: "Truffle Cake",
      building: "Bakery",
      experience: 25000,
      cookingSeconds: 26 * HOUR,
      ingredients: {
        Truffle: new Decimal(15),
        Wheat: new Decimal(30),
        Egg: new Decimal(30),
        Honey: new Decimal(5),
      },
    });
  });

  it("cooks Creamy Truffle Risotto at the Kitchen for 28,000 XP in 48h", () => {
    expect(KITCHEN_COOKABLES["Creamy Truffle Risotto"]).toMatchObject({
      name: "Creamy Truffle Risotto",
      building: "Kitchen",
      experience: 28000,
      cookingSeconds: 48 * HOUR,
      ingredients: {
        Truffle: new Decimal(8),
        Rice: new Decimal(3),
        "Wild Mushroom": new Decimal(5),
      },
    });
  });

  it("counts Truffle Cake as a cake made with Honey, so both bonus sets apply", () => {
    expect(COOKABLE_CAKES["Truffle Cake"]).toBe(
      BAKERY_COOKABLES["Truffle Cake"],
    );
    expect(isFoodMadeWithHoney(BAKERY_COOKABLES["Truffle Cake"])).toBe(true);
  });

  it("lists exactly the three Truffle recipes", () => {
    expect(TRUFFLE_RECIPES).toEqual([
      "Ember-Roasted Truffle Potatoes",
      "Truffle Cake",
      "Creamy Truffle Risotto",
    ]);
    expect(isTruffleRecipe("Truffle Cake")).toBe(true);
    expect(isTruffleRecipe("Boiled Eggs")).toBe(false);
  });
});
