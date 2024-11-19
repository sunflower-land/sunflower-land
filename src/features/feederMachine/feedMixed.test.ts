import Decimal from "decimal.js-light";
import { feedMixed } from "./feedMixed";
import { INITIAL_FARM } from "features/game/lib/constants";
import { AnimalFoodName } from "features/game/types/game";

describe("feedMixed", () => {
  it("throws an error if item is not a feed", () => {
    expect(() =>
      feedMixed({
        state: INITIAL_FARM,
        action: {
          type: "feed.mixed",
          item: "Sunflower Seed" as AnimalFoodName,
          amount: 1,
        },
      }),
    ).toThrow("Item is not a feed!");
  });

  it("does not mix feed if there's not enough ingredients", () => {
    expect(() =>
      feedMixed({
        state: {
          ...INITIAL_FARM,
          inventory: {},
        },
        action: {
          type: "feed.mixed",
          item: "Hay",
          amount: 1,
        },
      }),
    ).toThrow("Insufficient Ingredient: Wheat");
  });

  it("adds the feed into inventory", () => {
    const state = feedMixed({
      state: {
        ...INITIAL_FARM,
        coins: 0,
        inventory: {
          Wheat: new Decimal(100),
        },
      },
      action: {
        type: "feed.mixed",
        item: "Hay",
        amount: 1,
      },
    });
    expect(state.inventory.Hay).toEqual(new Decimal(1));
    expect(state.inventory.Wheat).toEqual(new Decimal(99));
  });

  it("mixes Barn Delight correctly", () => {
    const state = feedMixed({
      state: {
        ...INITIAL_FARM,
        coins: 0,
        inventory: {
          Egg: new Decimal(10),
          Iron: new Decimal(1),
        },
      },
      action: {
        type: "feed.mixed",
        item: "Barn Delight",
        amount: 1,
      },
    });
    expect(state.inventory["Barn Delight"]).toEqual(new Decimal(1));
    expect(state.inventory.Egg).toEqual(new Decimal(0));
    expect(state.inventory.Iron).toEqual(new Decimal(0));
  });

  it("removes the ingredients for 1 x Kernel Blend from inventory", () => {
    const state = feedMixed({
      state: {
        ...INITIAL_FARM,
        coins: 0,
        inventory: {
          Corn: new Decimal(10),
        },
      },
      action: {
        type: "feed.mixed",
        item: "Kernel Blend",
        amount: 1,
      },
    });

    expect(state.inventory.Corn).toEqual(new Decimal(9));
  });

  it("removes the ingredients for 10 x Kernel Blend from inventory", () => {
    const state = feedMixed({
      state: {
        ...INITIAL_FARM,
        coins: 0,
        inventory: {
          Corn: new Decimal(15),
        },
      },
      action: {
        type: "feed.mixed",
        item: "Kernel Blend",
        amount: 10,
      },
    });

    expect(state.inventory.Corn).toEqual(new Decimal(5));
    expect(state.inventory["Kernel Blend"]).toEqual(new Decimal(10));
  });
});
