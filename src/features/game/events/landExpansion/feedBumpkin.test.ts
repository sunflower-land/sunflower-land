import Decimal from "decimal.js-light";
import { INITIAL_BUMPKIN, TEST_FARM } from "features/game/lib/constants";
import { GameState } from "features/game/types/game";
import { CONSUMABLES } from "features/game/types/consumables";
import { FEED_BUMPKIN_ERRORS, feedBumpkin } from "./feedBumpkin";
import { getSeasonalBanner } from "features/game/types/seasons";

describe("feedBumpkin", () => {
  it("throws error if food amount is invalid", () => {
    const state: GameState = { ...TEST_FARM, inventory: {} };
    expect(() =>
      feedBumpkin({
        state,
        action: { type: "bumpkin.feed", food: "Boiled Eggs", amount: -1 },
      }),
    ).toThrow(FEED_BUMPKIN_ERRORS.INVALID_AMOUNT);
  });

  it("throws error if no food is found in inventory", () => {
    const state: GameState = { ...TEST_FARM, inventory: {} };
    expect(() =>
      feedBumpkin({
        state,
        action: { type: "bumpkin.feed", food: "Boiled Eggs", amount: 1 },
      }),
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
      }),
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
        CONSUMABLES["Boiled Eggs"].experience,
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
        CONSUMABLES["Boiled Eggs"].experience * 7,
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
      new Decimal(CONSUMABLES["Boiled Eggs"].experience).mul(1.05).toNumber(),
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
      new Decimal(CONSUMABLES["Boiled Eggs"].experience).mul(1.1).toNumber(),
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
      CONSUMABLES["Boiled Eggs"].experience * 1.05,
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
      CONSUMABLES["Sunflower Cake"].experience * 1.2,
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
      CONSUMABLES["Sauerkraut"].experience,
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
      CONSUMABLES["Gumbo"].experience * 1.1,
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
      CONSUMABLES["Gumbo"].experience * 1.5,
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
      CONSUMABLES["Anchovy"].experience * 1.5,
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
      CONSUMABLES["Anchovy"].experience * 1.2,
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
      CONSUMABLES["Gumbo"].experience * 1.2,
    );
  });

  it("provides 2x experience for Fermented Carrots with the Hungry Hare", () => {
    const result = feedBumpkin({
      state: {
        ...TEST_FARM,
        bumpkin: {
          ...INITIAL_BUMPKIN,
        },
        inventory: {
          "Fermented Carrots": new Decimal(1),
        },
        collectibles: {
          "Hungry Hare": [
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
        food: "Fermented Carrots",
        amount: 1,
      },
    });

    expect(result.bumpkin?.experience).toBe(
      CONSUMABLES["Fermented Carrots"].experience * 2,
    );
  });
  it("provides 10% more experience when Seasonal Banner is in inventory", () => {
    const result = feedBumpkin({
      state: {
        ...TEST_FARM,
        bumpkin: {
          ...INITIAL_BUMPKIN,
        },
        inventory: {
          "Boiled Eggs": new Decimal(2),
          [getSeasonalBanner()]: new Decimal(1),
        },
      },
      action: {
        type: "bumpkin.feed",
        food: "Boiled Eggs",
        amount: 1,
      },
    });

    expect(result.bumpkin?.experience).toBe(
      new Decimal(CONSUMABLES["Boiled Eggs"].experience).mul(1.1).toNumber(),
    );
  });

  it("provides 10% more experience when Lifetime Farmer Banner is in inventory", () => {
    const result = feedBumpkin({
      state: {
        ...TEST_FARM,
        bumpkin: {
          ...INITIAL_BUMPKIN,
        },
        inventory: {
          "Boiled Eggs": new Decimal(2),
          "Lifetime Farmer Banner": new Decimal(1),
        },
      },
      action: {
        type: "bumpkin.feed",
        food: "Boiled Eggs",
        amount: 1,
      },
    });

    expect(result.bumpkin?.experience).toBe(
      new Decimal(CONSUMABLES["Boiled Eggs"].experience).mul(1.1).toNumber(),
    );
  });

  it("provides a 10% more experience if the players faction pet is on a streak of 2", () => {
    jest.useFakeTimers("modern");
    jest.setSystemTime(new Date("2024-07-15"));

    const result = feedBumpkin({
      state: {
        ...TEST_FARM,
        bumpkin: {
          ...INITIAL_BUMPKIN,
        },
        inventory: {
          "Boiled Eggs": new Decimal(2),
        },
        faction: {
          name: "sunflorians",
          pledgedAt: 0,
          pet: {
            week: "2024-07-08",
            requests: [
              { food: "Anchovy", quantity: 1, dailyFulfilled: {} },
              { food: "Apple Pie", quantity: 1, dailyFulfilled: {} },
              { food: "Honey Cake", quantity: 1, dailyFulfilled: {} },
            ],
            qualifiesForBoost: true,
          },
          history: {
            "2024-07-08": {
              score: 100,
              petXP: 100,
              collectivePet: {
                goalReached: true,
                streak: 2,
                totalXP: 120,
                goalXP: 110,
                sleeping: false,
              },
            },
          },
        },
      },
      action: {
        type: "bumpkin.feed",
        food: "Boiled Eggs",
        amount: 1,
      },
    });

    expect(result.bumpkin?.experience).toBe(
      new Decimal(CONSUMABLES["Boiled Eggs"].experience).mul(1.1).toNumber(),
    );

    jest.useRealTimers();
  });

  it("provides a 20% boost if the players faction pet is on a streak of 4", () => {
    jest.useFakeTimers("modern");
    jest.setSystemTime(new Date("2024-07-15"));

    const result = feedBumpkin({
      state: {
        ...TEST_FARM,
        bumpkin: {
          ...INITIAL_BUMPKIN,
        },
        inventory: {
          "Boiled Eggs": new Decimal(2),
        },
        faction: {
          name: "sunflorians",
          pledgedAt: 0,
          pet: {
            week: "2024-07-08",
            requests: [
              { food: "Anchovy", quantity: 1, dailyFulfilled: {} },
              { food: "Apple Pie", quantity: 1, dailyFulfilled: {} },
              { food: "Honey Cake", quantity: 1, dailyFulfilled: {} },
            ],
            qualifiesForBoost: true,
          },
          history: {
            "2024-07-08": {
              score: 100,
              petXP: 100,
              collectivePet: {
                goalReached: true,
                streak: 4,
                totalXP: 120,
                goalXP: 110,
                sleeping: false,
              },
            },
          },
        },
      },
      action: {
        type: "bumpkin.feed",
        food: "Boiled Eggs",
        amount: 1,
      },
    });

    expect(result.bumpkin?.experience).toBe(
      new Decimal(CONSUMABLES["Boiled Eggs"].experience).mul(1.2).toNumber(),
    );

    jest.useRealTimers();
  });

  it("returns a boost of 50% if the players faction pet is on a streak of 10", () => {
    jest.useFakeTimers("modern");
    jest.setSystemTime(new Date("2024-07-15"));

    const result = feedBumpkin({
      state: {
        ...TEST_FARM,
        bumpkin: {
          ...INITIAL_BUMPKIN,
        },
        inventory: {
          "Boiled Eggs": new Decimal(2),
        },
        faction: {
          name: "sunflorians",
          pledgedAt: 0,
          pet: {
            week: "2024-07-08",
            requests: [
              { food: "Anchovy", quantity: 1, dailyFulfilled: {} },
              { food: "Apple Pie", quantity: 1, dailyFulfilled: {} },
              { food: "Honey Cake", quantity: 1, dailyFulfilled: {} },
            ],
            qualifiesForBoost: true,
          },
          history: {
            "2024-07-08": {
              score: 100,
              petXP: 100,
              collectivePet: {
                goalReached: true,
                streak: 10,
                totalXP: 120,
                goalXP: 110,
                sleeping: false,
              },
            },
          },
        },
      },
      action: {
        type: "bumpkin.feed",
        food: "Boiled Eggs",
        amount: 1,
      },
    });

    expect(result.bumpkin?.experience).toBe(
      new Decimal(CONSUMABLES["Boiled Eggs"].experience).mul(1.5).toNumber(),
    );

    jest.useRealTimers();
  });

  it("gives 5% more experience with Munching Mastery skill", () => {
    const result = feedBumpkin({
      state: {
        ...TEST_FARM,
        bumpkin: {
          ...INITIAL_BUMPKIN,
          skills: { "Munching Mastery": 1 },
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
      new Decimal(CONSUMABLES["Boiled Eggs"].experience).mul(1.05).toNumber(),
    );
  });

  it("give 10% more experience when drinking juices with Juicy Boost skill", () => {
    const result = feedBumpkin({
      state: {
        ...TEST_FARM,
        bumpkin: {
          ...INITIAL_BUMPKIN,
          skills: { "Juicy Boost": 1 },
        },
        inventory: {
          "Apple Juice": new Decimal(2),
        },
      },
      action: {
        type: "bumpkin.feed",
        food: "Apple Juice",
        amount: 1,
      },
    });

    expect(result.bumpkin?.experience).toBe(
      new Decimal(CONSUMABLES["Apple Juice"].experience).mul(1.1).toNumber(),
    );
  });

  it("gives 15% more experience when eating Deli foods with Drive-Through Deli skill", () => {
    const result = feedBumpkin({
      state: {
        ...TEST_FARM,
        bumpkin: {
          ...INITIAL_BUMPKIN,
          skills: { "Drive-Through Deli": 1 },
        },
        inventory: {
          "Shroom Syrup": new Decimal(2),
        },
      },
      action: {
        type: "bumpkin.feed",
        food: "Shroom Syrup",
        amount: 1,
      },
    });

    expect(result.bumpkin?.experience).toBe(
      new Decimal(CONSUMABLES["Shroom Syrup"].experience).mul(1.15).toNumber(),
    );
  });

  it("gives 10% more experience when eating food made with Honey with Buzzworthy Treats skill", () => {
    const result = feedBumpkin({
      state: {
        ...TEST_FARM,
        bumpkin: {
          ...INITIAL_BUMPKIN,
          skills: { "Buzzworthy Treats": 1 },
        },
        inventory: {
          "Honey Cake": new Decimal(2),
        },
      },
      action: {
        type: "bumpkin.feed",
        food: "Honey Cake",
        amount: 1,
      },
    });

    expect(result.bumpkin?.experience).toBe(
      new Decimal(CONSUMABLES["Honey Cake"].experience).mul(1.1).toNumber(),
    );
  });

  it("does not apply Buzzworthy Treats on food made without Honey", () => {
    const result = feedBumpkin({
      state: {
        ...TEST_FARM,
        bumpkin: {
          ...INITIAL_BUMPKIN,
          skills: { "Buzzworthy Treats": 1 },
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
      new Decimal(CONSUMABLES["Boiled Eggs"].experience).toNumber(),
    );
  });

  it("gives +500 more experience when eating food made with Cheese when Swiss Whiskers is placed", () => {
    const result = feedBumpkin({
      state: {
        ...TEST_FARM,
        bumpkin: {
          ...INITIAL_BUMPKIN,
        },
        inventory: {
          "Pizza Margherita": new Decimal(2),
        },
        collectibles: {
          "Swiss Whiskers": [
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
        food: "Pizza Margherita",
        amount: 1,
      },
    });

    expect(result.bumpkin?.experience).toBe(
      new Decimal(CONSUMABLES["Pizza Margherita"].experience)
        .plus(500)
        .toNumber(),
    );
  });

  it("does not apply Swiss Whiskers boost on food made without Cheese", () => {
    const result = feedBumpkin({
      state: {
        ...TEST_FARM,
        bumpkin: {
          ...INITIAL_BUMPKIN,
        },
        inventory: {
          "Boiled Eggs": new Decimal(2),
        },
        collectibles: {
          "Swiss Whiskers": [
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
      new Decimal(CONSUMABLES["Boiled Eggs"].experience).toNumber(),
    );
  });
});
