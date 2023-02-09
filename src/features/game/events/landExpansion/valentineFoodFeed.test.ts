import Decimal from "decimal.js-light";
import { TEST_FARM } from "features/game/lib/constants";
import { ValentineFoodName } from "features/game/types/valentine";
import {
  feedValentineFood,
  FEED_VALENTINE_FOOD_ERRORS,
} from "./valentineFoodFeed";

describe("valentineFoodCreated", () => {
  it("ensures a player has a Bumpkin", () => {
    expect(() =>
      feedValentineFood({
        state: { ...TEST_FARM, bumpkin: undefined },
        action: {
          type: "valentineFood.feed",
          food: "Bumpkin Broth",
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
          food: "Bumpkin Broth",
        },
      })
    ).toThrow("You do not have Bumpkin Broth");
  });

  it("throws an error if the food recieved is not what was requested", () => {
    expect(() =>
      feedValentineFood({
        state: {
          ...TEST_FARM,
          inventory: {
            "Reindeer Carrot": new Decimal(1),
            "Love Letter": new Decimal(1),
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
          "Bumpkin Broth": new Decimal(2),
          "Love Letter": new Decimal(10),
        },
      },
      action: {
        type: "valentineFood.feed",
        food: "Bumpkin Broth",
      },
    });

    expect(result.inventory["Bumpkin Broth"]).toEqual(new Decimal(1));
  });

  it("Adds a lover letter", () => {
    const result = feedValentineFood({
      state: {
        ...TEST_FARM,
        inventory: {
          "Goblin's Treat": new Decimal(2),
          "Love Letter": new Decimal(15),
        },
      },
      action: {
        type: "valentineFood.feed",
        food: "Goblin's Treat",
      },
    });

    expect(result.inventory["Love Letter"]).toEqual(new Decimal(16));
  });
});
