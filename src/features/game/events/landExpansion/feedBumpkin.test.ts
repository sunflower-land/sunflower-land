import "lib/__mocks__/configMock";
import Decimal from "decimal.js-light";
import { INITIAL_BUMPKIN, TEST_FARM } from "features/game/lib/constants";
import { GameState } from "features/game/types/game";
import { CONSUMABLES } from "features/game/types/consumables";
import { feedBumpkin } from "./feedBumpkin";

describe("feedBumpkin", () => {
  it("requires a bumpkin", () => {
    const state: GameState = { ...TEST_FARM, bumpkin: undefined };
    expect(() =>
      feedBumpkin({
        state,
        action: { type: "bumpkin.feed", food: "Boiled Eggs" },
      })
    ).toThrow("You do not have a Bumpkin");
  });

  it("requires food is in inventory", () => {
    const state: GameState = { ...TEST_FARM, inventory: {} };
    expect(() =>
      feedBumpkin({
        state,
        action: { type: "bumpkin.feed", food: "Boiled Eggs" },
      })
    ).toThrow("You have none of this food type");
  });

  it("deducts one food from inventory", () => {
    const state: GameState = {
      ...TEST_FARM,
      inventory: { "Boiled Eggs": new Decimal(2) },
    };

    const stateCopy = feedBumpkin({
      state,
      action: { type: "bumpkin.feed", food: "Boiled Eggs" },
    });

    expect(stateCopy.inventory["Boiled Eggs"]).toEqual(new Decimal(1));
  });

  it("adds experience", () => {
    const state: GameState = {
      ...TEST_FARM,
      inventory: { "Boiled Eggs": new Decimal(2) },
    };

    const stateCopy = feedBumpkin({
      state,
      action: { type: "bumpkin.feed", food: "Boiled Eggs" },
    });

    expect(stateCopy.bumpkin?.experience).toBe(
      (state.bumpkin?.experience as number) +
        CONSUMABLES["Boiled Eggs"].experience
    );
  });

  it("provides 5% more experience with Kitchen Hand skill", () => {
    const result = feedBumpkin({
      state: {
        ...TEST_FARM,
        bumpkin: { ...INITIAL_BUMPKIN, skills: { "Kitchen Hand": 1 } },
        inventory: {
          "Boiled Eggs": new Decimal(2),
        },
      },
      action: {
        type: "bumpkin.feed",
        food: "Boiled Eggs",
      },
    });

    expect(result.bumpkin?.experience).toBe(
      new Decimal(CONSUMABLES["Boiled Eggs"].experience).mul(1.05).toNumber()
    );
  });

  it("provides 10% more experience with Golden Spatula Bumpkin Wearable tool", () => {
    const result = feedBumpkin({
      state: {
        ...TEST_FARM,
        bumpkin: {
          ...INITIAL_BUMPKIN,
          equipped: { ...INITIAL_BUMPKIN.equipped, tool: "Golden Spatula" },
        },
        inventory: {
          "Boiled Eggs": new Decimal(2),
        },
      },
      action: {
        type: "bumpkin.feed",
        food: "Boiled Eggs",
      },
    });

    expect(result.bumpkin?.experience).toBe(
      new Decimal(CONSUMABLES["Boiled Eggs"].experience).mul(1.1).toNumber()
    );
  });

  it("provides 5% more experience when player has Observatory placed", () => {
    const result = feedBumpkin({
      state: {
        ...TEST_FARM,
        bumpkin: {
          ...INITIAL_BUMPKIN,
          experience: 0,
        },
        inventory: {
          Observatory: new Decimal(1),
          "Boiled Eggs": new Decimal(1),
        },
        collectibles: {
          Observatory: [
            {
              coordinates: { x: 0, y: 0 },
              createdAt: 0,
              id: "123",
              readyAt: 0,
            },
          ],
        },
      },
      action: {
        type: "bumpkin.feed",
        food: "Boiled Eggs",
      },
    });

    expect(result.bumpkin?.experience).toBe(
      CONSUMABLES["Boiled Eggs"].experience * 1.05
    );
  });

  it("provides 20% more experience for cakes with Grain Grinder ", () => {
    const result = feedBumpkin({
      state: {
        ...TEST_FARM,
        bumpkin: {
          ...INITIAL_BUMPKIN,
        },
        inventory: {
          "Sunflower Cake": new Decimal(1),
        },
        collectibles: {
          "Grain Grinder": [
            {
              coordinates: { x: 0, y: 0 },
              createdAt: 0,
              id: "123",
              readyAt: 0,
            },
          ],
        },
      },
      action: {
        type: "bumpkin.feed",
        food: "Sunflower Cake",
      },
    });

    expect(result.bumpkin?.experience).toBe(
      CONSUMABLES["Sunflower Cake"].experience * 1.2
    );
  });

  it("does not provides experience boost with Grain Grinder if not a cake", () => {
    const result = feedBumpkin({
      state: {
        ...TEST_FARM,
        bumpkin: {
          ...INITIAL_BUMPKIN,
        },
        inventory: {
          Sauerkraut: new Decimal(1),
        },
        collectibles: {
          "Grain Grinder": [
            {
              coordinates: { x: 0, y: 0 },
              createdAt: 0,
              id: "123",
              readyAt: 0,
            },
          ],
        },
      },
      action: {
        type: "bumpkin.feed",
        food: "Sauerkraut",
      },
    });

    expect(result.bumpkin?.experience).toBe(
      CONSUMABLES["Sauerkraut"].experience
    );
  });
});
