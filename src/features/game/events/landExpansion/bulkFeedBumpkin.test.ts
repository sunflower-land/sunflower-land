import Decimal from "decimal.js-light";
import { TEST_FARM } from "features/game/lib/constants";
import type { GameState } from "features/game/types/game";
import { CONSUMABLES } from "features/game/types/consumables";
import { FEED_BUMPKIN_ERRORS } from "./feedBumpkin";
import { bulkFeedBumpkin, type BulkFeedBumpkinAction } from "./bulkFeedBumpkin";

describe("bulkFeedBumpkin", () => {
  it("throws an error if there is no bumpkin", () => {
    const state: GameState = { ...TEST_FARM, bumpkin: undefined as never };

    expect(() =>
      bulkFeedBumpkin({
        state,
        action: {
          type: "bumpkin.bulkFeed",
          items: [{ food: "Boiled Eggs", amount: 1 }],
        },
      }),
    ).toThrow(FEED_BUMPKIN_ERRORS.MISSING_BUMPKIN);
  });

  it("throws an error if no items are provided", () => {
    const state: GameState = {
      ...TEST_FARM,
      inventory: { "Boiled Eggs": new Decimal(10) },
    };

    expect(() =>
      bulkFeedBumpkin({
        state,
        action: { type: "bumpkin.bulkFeed", items: [] },
      }),
    ).toThrow(FEED_BUMPKIN_ERRORS.INVALID_AMOUNT);
  });

  it("throws an error if any item has an invalid amount", () => {
    const state: GameState = {
      ...TEST_FARM,
      inventory: { "Boiled Eggs": new Decimal(10) },
    };

    expect(() =>
      bulkFeedBumpkin({
        state,
        action: {
          type: "bumpkin.bulkFeed",
          items: [{ food: "Boiled Eggs", amount: 0 }],
        },
      }),
    ).toThrow(FEED_BUMPKIN_ERRORS.INVALID_AMOUNT);
  });

  it("throws an error if the inventory does not have enough of a food", () => {
    const state: GameState = {
      ...TEST_FARM,
      inventory: { "Boiled Eggs": new Decimal(2) },
    };

    expect(() =>
      bulkFeedBumpkin({
        state,
        action: {
          type: "bumpkin.bulkFeed",
          items: [{ food: "Boiled Eggs", amount: 3 }],
        },
      }),
    ).toThrow(FEED_BUMPKIN_ERRORS.NOT_ENOUGH_FOOD);
  });

  // Regression: validation must sum duplicate entries for the same food
  // across the batch, not just check each entry in isolation - two 6-item
  // requests should require 12 total, not pass because each one alone is
  // under an 8-item inventory.
  it("aggregates duplicate food entries before validating stock", () => {
    const state: GameState = {
      ...TEST_FARM,
      inventory: { "Boiled Eggs": new Decimal(8) },
    };

    expect(() =>
      bulkFeedBumpkin({
        state,
        action: {
          type: "bumpkin.bulkFeed",
          items: [
            { food: "Boiled Eggs", amount: 6 },
            { food: "Boiled Eggs", amount: 6 },
          ],
        },
      }),
    ).toThrow(FEED_BUMPKIN_ERRORS.NOT_ENOUGH_FOOD);
  });

  it("does not mutate inventory when the batch is rejected", () => {
    const state: GameState = {
      ...TEST_FARM,
      inventory: {
        "Boiled Eggs": new Decimal(5),
        "Sunflower Cake": new Decimal(1),
      },
    };

    expect(() =>
      bulkFeedBumpkin({
        state,
        action: {
          type: "bumpkin.bulkFeed",
          items: [
            { food: "Boiled Eggs", amount: 5 },
            { food: "Sunflower Cake", amount: 5 },
          ],
        },
      }),
    ).toThrow(FEED_BUMPKIN_ERRORS.NOT_ENOUGH_FOOD);

    expect(state.inventory["Boiled Eggs"]).toEqual(new Decimal(5));
    expect(state.inventory["Sunflower Cake"]).toEqual(new Decimal(1));
  });

  it("feeds multiple different foods in a single batch", () => {
    const state: GameState = {
      ...TEST_FARM,
      inventory: {
        "Boiled Eggs": new Decimal(5),
        "Sunflower Cake": new Decimal(2),
      },
    };

    const action: BulkFeedBumpkinAction = {
      type: "bumpkin.bulkFeed",
      items: [
        { food: "Boiled Eggs", amount: 3 },
        { food: "Sunflower Cake", amount: 1 },
      ],
    };

    const result = bulkFeedBumpkin({ state, action });

    expect(result.inventory["Boiled Eggs"]).toEqual(new Decimal(2));
    expect(result.inventory["Sunflower Cake"]).toEqual(new Decimal(1));
    expect(result.bumpkin?.experience).toBe(
      (state.bumpkin?.experience as number) +
        CONSUMABLES["Boiled Eggs"].experience * 3 +
        CONSUMABLES["Sunflower Cake"].experience * 1,
    );
  });

  it("sums duplicate food entries into a single deduction and XP grant", () => {
    const state: GameState = {
      ...TEST_FARM,
      inventory: { "Boiled Eggs": new Decimal(10) },
    };

    const action: BulkFeedBumpkinAction = {
      type: "bumpkin.bulkFeed",
      items: [
        { food: "Boiled Eggs", amount: 3 },
        { food: "Boiled Eggs", amount: 2 },
      ],
    };

    const result = bulkFeedBumpkin({ state, action });

    expect(result.inventory["Boiled Eggs"]).toEqual(new Decimal(5));
    expect(result.bumpkin?.experience).toBe(
      (state.bumpkin?.experience as number) +
        CONSUMABLES["Boiled Eggs"].experience * 5,
    );
  });

  it("tracks farm activity per food fed", () => {
    const state: GameState = {
      ...TEST_FARM,
      inventory: {
        "Boiled Eggs": new Decimal(5),
        "Sunflower Cake": new Decimal(2),
      },
    };

    const action: BulkFeedBumpkinAction = {
      type: "bumpkin.bulkFeed",
      items: [
        { food: "Boiled Eggs", amount: 3 },
        { food: "Sunflower Cake", amount: 1 },
      ],
    };

    const result = bulkFeedBumpkin({ state, action });

    expect(result.farmActivity["Boiled Eggs Fed"]).toEqual(3);
    expect(result.farmActivity["Sunflower Cake Fed"]).toEqual(1);
  });
});
