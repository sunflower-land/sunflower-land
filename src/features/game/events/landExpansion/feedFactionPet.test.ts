import Decimal from "decimal.js-light";
import { INITIAL_BUMPKIN, TEST_FARM } from "features/game/lib/constants";
import {
  START_DATE,
  getFactionWeek,
  getFactionWeekday,
} from "features/game/lib/factions";
import { Faction, GameState } from "features/game/types/game";
import { feedFactionPet } from "./feedFactionPet";
import { CONSUMABLES } from "features/game/types/consumables";

const state: GameState = {
  ...TEST_FARM,
  faction: {
    name: "goblins",
    pledgedAt: 0,
    points: 0,
    history: {},
  },
};

describe("feedFactionPet", () => {
  afterEach(() => jest.useRealTimers());

  const startTime = START_DATE.getTime();
  const week = getFactionWeek({ date: START_DATE });

  it("throws an error if the faction pet feature is not active yet", () => {
    expect(() => {
      feedFactionPet({
        state,
        action: { type: "factionPet.fed", requestIndex: 0 },
        createdAt: 0,
      });
    }).toThrow("Faction pet feature is not active yet");
  });

  it("throws an error if the player has not joined a faction", () => {
    expect(() => {
      feedFactionPet({
        state: { ...state, faction: undefined },
        action: { type: "factionPet.fed", requestIndex: 0 },
        createdAt: startTime,
      });
    }).toThrow("Player has not joined a faction");
  });

  it("throws an error if there is no pet data available", () => {
    expect(() => {
      feedFactionPet({
        state: {
          ...state,
          faction: { ...state.faction, pet: undefined } as Faction,
        },
        action: { type: "factionPet.fed", requestIndex: 0 },
        createdAt: startTime,
      });
    }).toThrow("No pet data available");
  });

  it("throws an error if there is no food requested at that index", () => {
    expect(() => {
      feedFactionPet({
        state: {
          ...state,
          faction: {
            ...state.faction,
            pet: {
              week: "2024/06/24",
              requests: [
                {
                  food: "Pumpkin Soup",
                  quantity: 2,
                  dailyFulfilled: {},
                },
                {
                  food: "Sunflower Cake",
                  quantity: 1,
                  dailyFulfilled: {},
                },
                {
                  food: "Carrot Cake",
                  quantity: 1,
                  dailyFulfilled: {},
                },
              ],
            },
          } as Faction,
        },
        action: { type: "factionPet.fed", requestIndex: 10 as any },
        createdAt: startTime,
      });
    }).toThrow("No requested food found at index");
  });

  it("throws an error if the player does not have enough food to fulfill the request", () => {
    expect(() => {
      feedFactionPet({
        state: {
          ...state,
          inventory: { "Pumpkin Soup": new Decimal(1) },
          faction: {
            ...state.faction,
            pet: {
              week: "2024/06/24",
              requests: [
                {
                  food: "Pumpkin Soup",
                  quantity: 2,
                  dailyFulfilled: {},
                },
                {
                  food: "Sunflower Cake",
                  quantity: 1,
                  dailyFulfilled: {},
                },
                {
                  food: "Carrot Cake",
                  quantity: 1,
                  dailyFulfilled: {},
                },
              ],
            },
          } as Faction,
        },
        action: { type: "factionPet.fed", requestIndex: 0 },
        createdAt: startTime,
      });
    }).toThrow("Insufficient food to fulfill the request");
  });

  it("fulfills the request and increments the fulfilled count", () => {
    const day = getFactionWeekday(startTime);

    const result = feedFactionPet({
      state: {
        ...state,
        inventory: { "Pumpkin Soup": new Decimal(3) },
        faction: {
          ...state.faction,
          pet: {
            week: "2024/06/24",
            requests: [
              {
                food: "Pumpkin Soup",
                quantity: 2,
                dailyFulfilled: {},
              },
              {
                food: "Sunflower Cake",
                quantity: 1,
                dailyFulfilled: {},
              },
              {
                food: "Carrot Cake",
                quantity: 1,
                dailyFulfilled: {},
              },
            ],
          },
          history: {
            [week]: { petXP: 0, score: 0 },
          },
        } as Faction,
      },
      action: { type: "factionPet.fed", requestIndex: 0 },
      createdAt: startTime,
    });

    expect(result.faction?.pet?.requests[0].dailyFulfilled[day]).toBe(1);
    expect(result.inventory["Pumpkin Soup"]?.toNumber()).toBe(1);
  });

  it("increments the weekly pet xp by the total requested food xp value", () => {
    const result = feedFactionPet({
      state: {
        ...state,
        inventory: { "Pumpkin Soup": new Decimal(3) },
        faction: {
          ...state.faction,
          pet: {
            week: "2024/06/24",
            requests: [
              {
                food: "Pumpkin Soup",
                quantity: 2,
                dailyFulfilled: {},
              },
              {
                food: "Sunflower Cake",
                quantity: 1,
                dailyFulfilled: {},
              },
              {
                food: "Carrot Cake",
                quantity: 1,
                dailyFulfilled: {},
              },
            ],
          },
          history: {
            [week]: { petXP: 0, score: 0 },
          },
        } as Faction,
      },
      action: { type: "factionPet.fed", requestIndex: 0 },
      createdAt: startTime,
    });

    const pumpkinSoupXP = CONSUMABLES["Pumpkin Soup"].experience;
    const totalXPForRequest = pumpkinSoupXP * 2;

    expect(result.faction?.history[week]?.petXP).toBe(totalXPForRequest);
  });

  it("rewards the player with 4 marks/score for the first fulfillment of an easy request", () => {
    const result = feedFactionPet({
      state: {
        ...state,
        inventory: { "Pumpkin Soup": new Decimal(3), Mark: new Decimal(0) },
        faction: {
          ...state.faction,
          pet: {
            week: "2024/06/24",
            requests: [
              {
                food: "Pumpkin Soup",
                quantity: 2,
                dailyFulfilled: {},
              },
              {
                food: "Sunflower Cake",
                quantity: 1,
                dailyFulfilled: {},
              },
              {
                food: "Carrot Cake",
                quantity: 1,
                dailyFulfilled: {},
              },
            ],
          },
          history: {
            [week]: { petXP: 0, score: 0 },
          },
        } as Faction,
      },
      createdAt: startTime,
      action: { type: "factionPet.fed", requestIndex: 0 },
    });

    expect(result.inventory["Mark"]?.toNumber()).toBe(4);
    expect(result.faction?.history[week]?.score).toBe(4);
  });

  it("decrements the reward by 2 for the second easy delivery of the day", () => {
    const day = getFactionWeekday(startTime);

    const result = feedFactionPet({
      state: {
        ...state,
        inventory: { "Pumpkin Soup": new Decimal(3), Mark: new Decimal(4) },
        faction: {
          ...state.faction,
          pet: {
            week: "2024/06/24",
            requests: [
              {
                food: "Pumpkin Soup",
                quantity: 2,
                dailyFulfilled: {
                  [day]: 1,
                },
              },
              {
                food: "Sunflower Cake",
                quantity: 1,
                dailyFulfilled: {},
              },
              {
                food: "Carrot Cake",
                quantity: 1,
                dailyFulfilled: {},
              },
            ],
          },
          history: {
            [week]: { petXP: 0, score: 4 },
          },
        } as Faction,
      },
      createdAt: startTime,
      action: { type: "factionPet.fed", requestIndex: 0 },
    });

    expect(result.inventory["Mark"]?.toNumber()).toBe(6);
    expect(result.faction?.history[week]?.score).toBe(6);
  });

  it("rewards 1 mark/point when the third easy delivery of the day", () => {
    const day = getFactionWeekday(startTime);

    const result = feedFactionPet({
      state: {
        ...state,
        inventory: { "Pumpkin Soup": new Decimal(3), Mark: new Decimal(6) },
        faction: {
          ...state.faction,
          pet: {
            week: "2024/06/24",
            requests: [
              {
                food: "Pumpkin Soup",
                quantity: 2,
                dailyFulfilled: {
                  [day]: 2,
                },
              },
              {
                food: "Sunflower Cake",
                quantity: 1,
                dailyFulfilled: {},
              },
              {
                food: "Carrot Cake",
                quantity: 1,
                dailyFulfilled: {},
              },
            ],
          },
          history: {
            [week]: { petXP: 0, score: 6 },
          },
        } as Faction,
      },
      createdAt: startTime,
      action: { type: "factionPet.fed", requestIndex: 0 },
    });

    expect(result.inventory["Mark"]?.toNumber()).toBe(7);
    expect(result.faction?.history[week]?.score).toBe(7);
  });

  it("rewards the player with 8 marks for the fulfillment of a medium request", () => {
    const result = feedFactionPet({
      state: {
        ...state,
        inventory: { "Sunflower Cake": new Decimal(1), Mark: new Decimal(0) },
        faction: {
          ...state.faction,
          pet: {
            week: "2024/06/24",
            requests: [
              {
                food: "Pumpkin Soup",
                quantity: 2,
                dailyFulfilled: {},
              },
              {
                food: "Sunflower Cake",
                quantity: 1,
                dailyFulfilled: {},
              },
              {
                food: "Carrot Cake",
                quantity: 1,
                dailyFulfilled: {},
              },
            ],
          },
          history: {
            [week]: { petXP: 0, score: 0 },
          },
        } as Faction,
      },
      createdAt: startTime,
      action: { type: "factionPet.fed", requestIndex: 1 },
    });

    expect(result.inventory["Mark"]?.toNumber()).toBe(8);
  });

  it("rewards the player with 12 marks for the fulfillment of a hard request", () => {
    const result = feedFactionPet({
      state: {
        ...state,
        inventory: { "Carrot Cake": new Decimal(1), Mark: new Decimal(0) },
        faction: {
          ...state.faction,
          pet: {
            week: "2024/06/24",
            requests: [
              {
                food: "Pumpkin Soup",
                quantity: 2,
                dailyFulfilled: {},
              },
              {
                food: "Sunflower Cake",
                quantity: 1,
                dailyFulfilled: {},
              },
              {
                food: "Carrot Cake",
                quantity: 1,
                dailyFulfilled: {},
              },
            ],
          },
          history: {
            [week]: { petXP: 0, score: 0 },
          },
        } as Faction,
      },
      createdAt: startTime,
      action: { type: "factionPet.fed", requestIndex: 2 },
    });

    expect(result.inventory["Mark"]?.toNumber()).toBe(12);
  });

  it("rewards 5% more marks when the player has their faction shoes on", () => {
    const result = feedFactionPet({
      state: {
        ...state,
        inventory: { "Carrot Cake": new Decimal(1), Mark: new Decimal(0) },
        bumpkin: {
          ...INITIAL_BUMPKIN,
          equipped: {
            ...INITIAL_BUMPKIN.equipped,
            shoes: "Goblin Sabatons",
          },
        },
        faction: {
          ...state.faction,
          pet: {
            week: "2024/06/24",
            requests: [
              {
                food: "Pumpkin Soup",
                quantity: 2,
                dailyFulfilled: {},
              },
              {
                food: "Sunflower Cake",
                quantity: 1,
                dailyFulfilled: {},
              },
              {
                food: "Carrot Cake",
                quantity: 1,
                dailyFulfilled: {},
              },
            ],
          },
          history: {
            [week]: { petXP: 0, score: 0 },
          },
        } as Faction,
      },
      createdAt: startTime,
      action: { type: "factionPet.fed", requestIndex: 2 },
    });

    expect(result.inventory["Mark"]?.toNumber()).toBe(12.6);
  });

  it("rewards 400% bonus marks if top rank in faction", () => {
    const result = feedFactionPet({
      state: {
        ...state,
        inventory: {
          "Carrot Cake": new Decimal(1),
          Mark: new Decimal(0),
          "Goblin Emblem": new Decimal(100_000),
        },
        bumpkin: {
          ...INITIAL_BUMPKIN,
          equipped: {
            ...INITIAL_BUMPKIN.equipped,
          },
        },
        faction: {
          ...state.faction,
          pet: {
            week,
            requests: [
              {
                food: "Pumpkin Soup",
                quantity: new Decimal(2),
                dailyFulfilled: {},
              },
              {
                food: "Sunflower Cake",
                quantity: 1,
                dailyFulfilled: {},
              },
              {
                food: "Carrot Cake",
                quantity: 1,
                dailyFulfilled: {},
              },
            ],
          },
          history: {
            [week]: { petXP: 0, score: 0 },
          },
        } as Faction,
      },
      createdAt: startTime,
      action: { type: "factionPet.fed", requestIndex: 2 },
    });

    expect(result.inventory["Mark"]?.toNumber()).toBe(12 * 5);
  });

  it("rewards 405% bonus marks if top rank and wearing faction shoes", () => {
    const result = feedFactionPet({
      state: {
        ...state,
        inventory: {
          "Carrot Cake": new Decimal(1),
          Mark: new Decimal(0),
          "Goblin Emblem": new Decimal(100_000),
        },
        bumpkin: {
          ...INITIAL_BUMPKIN,
          equipped: {
            ...INITIAL_BUMPKIN.equipped,
            shoes: "Goblin Sabatons",
          },
        },
        faction: {
          ...state.faction,
          pet: {
            week,
            requests: [
              {
                food: "Pumpkin Soup",
                quantity: new Decimal(2),
                dailyFulfilled: {},
              },
              {
                food: "Sunflower Cake",
                quantity: 1,
                dailyFulfilled: {},
              },
              {
                food: "Carrot Cake",
                quantity: 1,
                dailyFulfilled: {},
              },
            ],
          },
          history: {
            [week]: { petXP: 0, score: 0 },
          },
        } as Faction,
      },
      createdAt: startTime,
      action: { type: "factionPet.fed", requestIndex: 2 },
    });

    expect(result.inventory["Mark"]?.toNumber()).toBeCloseTo(12 * 5.05);
  });

  it("adds 25% marks when Paw Shield is active", () => {
    const result = feedFactionPet({
      state: {
        ...state,
        inventory: { "Carrot Cake": new Decimal(1), Mark: new Decimal(0) },
        bumpkin: {
          ...INITIAL_BUMPKIN,
          equipped: {
            ...INITIAL_BUMPKIN.equipped,
            secondaryTool: "Paw Shield",
          },
        },
        faction: {
          ...state.faction,
          pet: {
            week,
            requests: [
              {
                food: "Pumpkin Soup",
                quantity: new Decimal(2),
                dailyFulfilled: {},
              },
              {
                food: "Sunflower Cake",
                quantity: 1,
                dailyFulfilled: {},
              },
              {
                food: "Carrot Cake",
                quantity: 1,
                dailyFulfilled: {},
              },
            ],
          },
          history: {
            [week]: { petXP: 0, score: 0 },
          },
        } as Faction,
      },
      createdAt: startTime,
      action: { type: "factionPet.fed", requestIndex: 2 },
    });

    expect(result.inventory["Mark"]?.toNumber()).toBe(12 * 1.25);
    expect(result.faction?.history[week]?.score).toBe(12 * 1.25);
  });

  it("adds 25% XP to pet when Paw Shield is active", () => {
    const result = feedFactionPet({
      state: {
        ...state,
        inventory: { "Pumpkin Soup": new Decimal(3) },
        bumpkin: {
          ...INITIAL_BUMPKIN,
          equipped: {
            ...INITIAL_BUMPKIN.equipped,
            secondaryTool: "Paw Shield",
          },
        },
        faction: {
          ...state.faction,
          pet: {
            week,
            requests: [
              {
                food: "Pumpkin Soup",
                quantity: new Decimal(2),
                dailyFulfilled: {},
              },
              {
                food: "Sunflower Cake",
                quantity: 1,
                dailyFulfilled: {},
              },
              {
                food: "Carrot Cake",
                quantity: 1,
                dailyFulfilled: {},
              },
            ],
          },
          history: {
            [week]: { petXP: 0, score: 0 },
          },
        } as Faction,
      },
      action: { type: "factionPet.fed", requestIndex: 0 },
      createdAt: startTime,
    });

    const pumpkinSoupXP = CONSUMABLES["Pumpkin Soup"].experience;
    const totalXPForRequest = pumpkinSoupXP * 2;

    expect(result.faction?.history[week]?.petXP).toBe(totalXPForRequest * 1.25);
  });
});
