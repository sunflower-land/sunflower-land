import Decimal from "decimal.js-light";
import { TEST_FARM } from "features/game/lib/constants";
import { ValentineFoodName } from "features/game/types/valentine";
import {
  feedValentineFood,
  FEED_VALENTINE_FOOD_ERRORS,
} from "./valentineFoodFeed";

describe("valentineFoodFeed", () => {
  it("ensures a player has a Bumpkin", () => {
    expect(() =>
      feedValentineFood({
        state: { ...TEST_FARM, bumpkin: undefined },
        action: {
          type: "valentineFood.feed",
          food: "Mashed Potato",
        },
      })
    ).toThrow(FEED_VALENTINE_FOOD_ERRORS.NO_BUMPKIN);
  });

  it("throws an error if item is not a valentine food", () => {
    expect(() =>
      feedValentineFood({
        state: TEST_FARM,
        action: {
          type: "valentineFood.feed",
          food: "Non Food" as ValentineFoodName,
        },
      })
    ).toThrow(FEED_VALENTINE_FOOD_ERRORS.NOT_A_FOOD);
  });

  it("ensures player has consumable", () => {
    expect(() =>
      feedValentineFood({
        state: TEST_FARM,
        action: {
          type: "valentineFood.feed",
          food: "Mashed Potato",
        },
      })
    ).toThrow("You do not have Mashed Potato");
  });

  it("throws an error if the food recieved is not what was requested", () => {
    expect(() =>
      feedValentineFood({
        state: {
          ...TEST_FARM,
          inventory: {
            "Reindeer Carrot": new Decimal(1),
          },
        },
        action: {
          type: "valentineFood.feed",
          food: "Reindeer Carrot",
        },
      })
    ).toThrow(FEED_VALENTINE_FOOD_ERRORS.UNKOWN_FOOD);
  });

  it("removes the food from inventory", () => {
    const result = feedValentineFood({
      state: {
        ...TEST_FARM,
        inventory: {
          "Mashed Potato": new Decimal(2),
        },
      },
      action: {
        type: "valentineFood.feed",
        food: "Mashed Potato",
      },
    });

    expect(result.inventory["Mashed Potato"]).toEqual(new Decimal(1));
  });

  it("Adds a lover letter", () => {
    const result = feedValentineFood({
      state: {
        ...TEST_FARM,
        inventory: {
          "Mashed Potato": new Decimal(2),
          "Love Letter": new Decimal(15),
        },
      },
      action: {
        type: "valentineFood.feed",
        food: "Mashed Potato",
      },
    });

    expect(result.inventory["Love Letter"]).toEqual(new Decimal(16));
  });

  it("Adds a lover letter suucessfully for the second time", () => {
    const state = feedValentineFood({
      state: {
        ...TEST_FARM,
        inventory: {
          "Pumpkin Soup": new Decimal(1),
          "Mashed Potato": new Decimal(2),
          "Love Letter": new Decimal(15),
        },
      },
      action: {
        type: "valentineFood.feed",
        food: "Mashed Potato",
      },
    });

    const result = feedValentineFood({
      state: state,
      action: {
        type: "valentineFood.feed",
        food: "Pumpkin Soup",
      },
    });

    expect(result.inventory["Love Letter"]).toEqual(new Decimal(17));
  });

  it("increments the Love Letter Collected activity ", () => {
    const state = feedValentineFood({
      state: {
        ...TEST_FARM,
        inventory: {
          "Mashed Potato": new Decimal(2),
        },
      },
      action: {
        type: "valentineFood.feed",
        food: "Mashed Potato",
      },
    });
    expect(state.bumpkin?.activity?.["Love Letter Collected"]).toEqual(1);
  });
});
