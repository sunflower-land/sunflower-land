import "lib/__mocks__/configMock";
import Decimal from "decimal.js-light";
import { INITIAL_BUMPKIN, TEST_FARM } from "features/game/lib/constants";
import { GameState } from "features/game/types/game";
import { CONSUMABLES } from "features/game/types/consumables";
import { FEED_BUMPKIN_ERRORS, feedBumpkin } from "./feedBumpkin";

describe("feedBumpkin", () => {
  it("throws error if no bumpkin is found", () => {
    const state: GameState = { ...TEST_FARM, bumpkin: undefined };
    expect(() =>
      feedBumpkin({
        state,
        action: { type: "bumpkin.feed", food: "Boiled Eggs", amount: 1 },
      })
    ).toThrow(FEED_BUMPKIN_ERRORS.MISSING_BUMPKIN);
  });

  it("throws error if food amount is invalid", () => {
    const state: GameState = { ...TEST_FARM, inventory: {} };
    expect(() =>
      feedBumpkin({
        state,
        action: { type: "bumpkin.feed", food: "Boiled Eggs", amount: -1 },
      })
    ).toThrow(FEED_BUMPKIN_ERRORS.INVALID_AMOUNT);
  });

  it("throws error if no food is found in inventory", () => {
    const state: GameState = { ...TEST_FARM, inventory: {} };
    expect(() =>
      feedBumpkin({
        state,
        action: { type: "bumpkin.feed", food: "Boiled Eggs", amount: 1 },
      })
    ).toThrow(FEED_BUMPKIN_ERRORS.NOT_ENOUGH_FOOD);
  });

  it("throws error if food in inventory is not enough to feed bumpkin", () => {
    const state: GameState = {
      ...TEST_FARM,
      inventory: { "Boiled Eggs": new Decimal(8) },
    };
    expect(() =>
      feedBumpkin({
        state,
        action: { type: "bumpkin.feed", food: "Boiled Eggs", amount: 9 },
      })
    ).toThrow(FEED_BUMPKIN_ERRORS.NOT_ENOUGH_FOOD);
  });

  it("deducts one food from inventory", () => {
    const state: GameState = {
      ...TEST_FARM,
      inventory: { "Boiled Eggs": new Decimal(11) },
    };

    const stateCopy = feedBumpkin({
      state,
      action: { type: "bumpkin.feed", food: "Boiled Eggs", amount: 1 },
    });

    expect(stateCopy.inventory["Boiled Eggs"]).toEqual(new Decimal(10));
  });

  it("deducts multiple food from inventory", () => {
    const state: GameState = {
      ...TEST_FARM,
      inventory: { "Boiled Eggs": new Decimal(11) },
    };

    const stateCopy = feedBumpkin({
      state,
      action: { type: "bumpkin.feed", food: "Boiled Eggs", amount: 5 },
    });

    expect(stateCopy.inventory["Boiled Eggs"]).toEqual(new Decimal(6));
  });

  it("adds experience when feeding 1 food", () => {
    const state: GameState = {
      ...TEST_FARM,
      inventory: { "Boiled Eggs": new Decimal(8) },
    };

    const stateCopy = feedBumpkin({
      state,
      action: { type: "bumpkin.feed", food: "Boiled Eggs", amount: 1 },
    });

    expect(stateCopy.bumpkin?.experience).toBe(
      (state.bumpkin?.experience as number) +
        CONSUMABLES["Boiled Eggs"].experience
    );
  });

  it("adds more experience when feeding multiple food", () => {
    const state: GameState = {
      ...TEST_FARM,
      inventory: { "Boiled Eggs": new Decimal(20) },
    };

    const stateCopy = feedBumpkin({
      state,
      action: { type: "bumpkin.feed", food: "Boiled Eggs", amount: 7 },
    });

    expect(stateCopy.bumpkin?.experience).toBe(
      (state.bumpkin?.experience as number) +
        CONSUMABLES["Boiled Eggs"].experience * 7
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
        amount: 1,
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
        amount: 1,
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
        amount: 1,
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
        amount: 1,
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
        amount: 1,
      },
    });

    expect(result.bumpkin?.experience).toBe(
      CONSUMABLES["Sauerkraut"].experience
    );
  });

  it("gives 10% more xp with Blossombeard", () => {
    const result = feedBumpkin({
      state: {
        ...TEST_FARM,
        inventory: {
          Gumbo: new Decimal(2),
        },
        collectibles: {
          Blossombeard: [
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
        food: "Gumbo",
        amount: 1,
      },
    });

    expect(result.bumpkin?.experience).toBe(
      CONSUMABLES["Gumbo"].experience * 1.1
    );
  });

  it("gives 50% more xp for a fish product if Luminous Anglerfish Topper is equipped", () => {
    const result = feedBumpkin({
      state: {
        ...TEST_FARM,
        bumpkin: {
          ...INITIAL_BUMPKIN,
          equipped: {
            ...INITIAL_BUMPKIN.equipped,
            hat: "Luminous Anglerfish Topper",
          },
        },
        inventory: {
          Gumbo: new Decimal(2),
        },
      },
      action: {
        type: "bumpkin.feed",
        food: "Gumbo",
        amount: 1,
      },
    });

    expect(result.bumpkin?.experience).toBe(
      CONSUMABLES["Gumbo"].experience * 1.5
    );
  });

  it("gives 50% more xp for a fish if Luminous Anglerfish Topper is equipped", () => {
    const result = feedBumpkin({
      state: {
        ...TEST_FARM,
        bumpkin: {
          ...INITIAL_BUMPKIN,
          equipped: {
            ...INITIAL_BUMPKIN.equipped,
            hat: "Luminous Anglerfish Topper",
          },
        },
        inventory: {
          Anchovy: new Decimal(2),
        },
      },
      action: {
        type: "bumpkin.feed",
        food: "Anchovy",
        amount: 1,
      },
    });

    expect(result.bumpkin?.experience).toBe(
      CONSUMABLES["Anchovy"].experience * 1.5
    );
  });

  it("provides 20% more experience for Fish with Skill Shrimpy", () => {
    const result = feedBumpkin({
      state: {
        ...TEST_FARM,
        bumpkin: {
          ...INITIAL_BUMPKIN,
        },
        inventory: {
          Anchovy: new Decimal(1),
        },
        collectibles: {
          "Skill Shrimpy": [
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
        food: "Anchovy",
        amount: 1,
      },
    });

    expect(result.bumpkin?.experience).toBe(
      CONSUMABLES["Anchovy"].experience * 1.2
    );
  });

  it("provides 20% more experience for Fish food with Skill Shrimpy", () => {
    const result = feedBumpkin({
      state: {
        ...TEST_FARM,
        bumpkin: {
          ...INITIAL_BUMPKIN,
        },
        inventory: {
          Gumbo: new Decimal(1),
        },
        collectibles: {
          "Skill Shrimpy": [
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
        food: "Gumbo",
        amount: 1,
      },
    });

    expect(result.bumpkin?.experience).toBe(
      CONSUMABLES["Gumbo"].experience * 1.2
    );
  });

  it("provides 2x experience with Baby Panda in March", () => {
    const result = feedBumpkin({
      state: {
        ...TEST_FARM,
        bumpkin: {
          ...INITIAL_BUMPKIN,
        },
        inventory: {
          Gumbo: new Decimal(1),
        },
        collectibles: {
          "Baby Panda": [
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
        food: "Gumbo",
        amount: 1,
      },
      createdAt: new Date("2024-03-04").getTime(),
    });

    expect(result.bumpkin?.experience).toBe(
      CONSUMABLES["Gumbo"].experience * 2
    );
  });
});
