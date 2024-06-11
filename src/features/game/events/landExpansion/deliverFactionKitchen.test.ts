import Decimal from "decimal.js-light";
import { TEST_FARM } from "features/game/lib/constants";
import { Faction, GameState } from "features/game/types/game";
import { deliverFactionKitchen } from "./deliverFactionKitchen";

const GAME_STATE: GameState = {
  ...TEST_FARM,
  faction: {
    name: "goblins",
    pledgedAt: 0,
    points: 0,
    donated: {
      daily: {
        sfl: {},
        resources: {},
      },
      totalItems: {},
    },
  },
};

describe("factionKitchenDeliver", () => {
  it("throws and error if the player has not joined a faction", () => {
    expect(() =>
      deliverFactionKitchen({
        state: { ...GAME_STATE, faction: undefined },
        action: {
          type: "factionKitchen.delivered",
          resourceIndex: 0,
        },
      })
    ).toThrow("Player has not joined a faction");
  });

  it("throws an error if faction kitchen has not started yet", () => {
    expect(() =>
      deliverFactionKitchen({
        state: GAME_STATE,
        action: {
          type: "factionKitchen.delivered",
          resourceIndex: 0,
        },
        createdAt: new Date("2024-06-01T00:00:00Z").getTime(),
      })
    ).toThrow("Faction kitchen has not started yet");
  });

  it("throws an error if there is no kitchen data available", () => {
    expect(() =>
      deliverFactionKitchen({
        state: GAME_STATE,
        action: {
          type: "factionKitchen.delivered",
          resourceIndex: 0,
        },
        createdAt: new Date("2024-07-01T00:00:00Z").getTime(),
      })
    ).toThrow("No kitchen data available");
  });

  it("throws an error if nothing exists at the index provided", () => {
    expect(() =>
      deliverFactionKitchen({
        state: {
          ...GAME_STATE,
          faction: {
            ...(GAME_STATE.faction as Faction),
            kitchen: {
              week: 1,
              requests: [],
              points: 0,
            },
          },
        },
        action: {
          type: "factionKitchen.delivered",
          resourceIndex: 0,
        },
        createdAt: new Date("2024-07-01T00:00:00Z").getTime(),
      })
    ).toThrow("No requested resource found at index");
  });

  it("throws and error if the player doesn't have the required resources", () => {
    expect(() =>
      deliverFactionKitchen({
        state: {
          ...GAME_STATE,
          inventory: {},
          faction: {
            ...(GAME_STATE.faction as Faction),
            kitchen: {
              week: 1,
              requests: [{ item: "Honey", amount: 1, deliveryCount: 0 }],
              points: 0,
            },
          },
        },
        action: {
          type: "factionKitchen.delivered",
          resourceIndex: 0,
        },
        createdAt: new Date("2024-07-01T00:00:00Z").getTime(),
      })
    ).toThrow("Insufficient resources");
  });

  it("subtracts the resources from the player's inventory", () => {
    const state = deliverFactionKitchen({
      state: {
        ...GAME_STATE,
        inventory: { Honey: new Decimal(5) },
        faction: {
          ...(GAME_STATE.faction as Faction),
          kitchen: {
            week: 1,
            requests: [{ item: "Honey", amount: 1, deliveryCount: 0 }],
            points: 0,
          },
        },
      },
      action: {
        type: "factionKitchen.delivered",
        resourceIndex: 0,
      },
      createdAt: new Date("2024-07-01T00:00:00Z").getTime(),
    });

    expect(state.inventory.Honey?.toNumber()).toBe(4);
  });

  it("increments the delivery count by 1", () => {
    const state = deliverFactionKitchen({
      state: {
        ...GAME_STATE,
        inventory: { Honey: new Decimal(5) },
        faction: {
          ...(GAME_STATE.faction as Faction),
          kitchen: {
            week: 1,
            requests: [{ item: "Honey", amount: 1, deliveryCount: 0 }],
            points: 0,
          },
        },
      },
      action: {
        type: "factionKitchen.delivered",
        resourceIndex: 0,
      },
      createdAt: new Date("2024-07-01T00:00:00Z").getTime(),
    });

    expect(state.faction?.kitchen?.requests[0].deliveryCount).toBe(1);
  });

  it("adds 20 weekly points and marks for the first delivery", () => {
    const state = deliverFactionKitchen({
      state: {
        ...GAME_STATE,
        inventory: { Honey: new Decimal(5) },
        faction: {
          ...(GAME_STATE.faction as Faction),
          kitchen: {
            week: 1,
            requests: [{ item: "Honey", amount: 1, deliveryCount: 0 }],
            points: 0,
          },
        },
      },
      action: {
        type: "factionKitchen.delivered",
        resourceIndex: 0,
      },
      createdAt: new Date("2024-07-01T00:00:00Z").getTime(),
    });

    expect(state.faction?.kitchen?.points).toBe(20);
    expect(state.inventory["Faction Mark"]?.toNumber()).toBe(20);
  });

  it("reduces the points and marks amount by 2 for each subsequent delivery", () => {
    const state = deliverFactionKitchen({
      state: {
        ...GAME_STATE,
        inventory: { Honey: new Decimal(5), "Faction Mark": new Decimal(20) },
        faction: {
          ...(GAME_STATE.faction as Faction),
          kitchen: {
            week: 1,
            requests: [{ item: "Honey", amount: 1, deliveryCount: 1 }],
            points: 20,
          },
        },
      },
      action: {
        type: "factionKitchen.delivered",
        resourceIndex: 0,
      },
      createdAt: new Date("2024-07-01T00:00:00Z").getTime(),
    });

    expect(state.faction?.kitchen?.points).toBe(38);
    expect(state.inventory["Faction Mark"]?.toNumber()).toBe(38);
  });

  it("adds 1 point and 1 mark for the 11th delivery", () => {
    const state = deliverFactionKitchen({
      state: {
        ...GAME_STATE,
        inventory: { Honey: new Decimal(5), "Faction Mark": new Decimal(110) },
        faction: {
          ...(GAME_STATE.faction as Faction),
          kitchen: {
            week: 1,
            requests: [{ item: "Honey", amount: 1, deliveryCount: 10 }],
            points: 110,
          },
        },
      },
      action: {
        type: "factionKitchen.delivered",
        resourceIndex: 0,
      },
      createdAt: new Date("2024-07-01T00:00:00Z").getTime(),
    });

    expect(state.faction?.kitchen?.points).toBe(111);
    expect(state.inventory["Faction Mark"]?.toNumber()).toBe(111);
  });

  it("adds 1 point for the 12th delivery", () => {
    const state = deliverFactionKitchen({
      state: {
        ...GAME_STATE,
        inventory: { Honey: new Decimal(5), "Faction Mark": new Decimal(111) },
        faction: {
          ...(GAME_STATE.faction as Faction),
          kitchen: {
            week: 1,
            requests: [{ item: "Honey", amount: 1, deliveryCount: 11 }],
            points: 111,
          },
        },
      },
      action: {
        type: "factionKitchen.delivered",
        resourceIndex: 0,
      },
      createdAt: new Date("2024-07-01T00:00:00Z").getTime(),
    });

    expect(state.faction?.kitchen?.points).toBe(112);
    expect(state.inventory["Faction Mark"]?.toNumber()).toBe(112);
  });

  it("adds 111 points for 11 deliveries", () => {
    let state: GameState = {
      ...GAME_STATE,
      inventory: { Honey: new Decimal(100) },
      faction: {
        ...(GAME_STATE.faction as Faction),
        kitchen: {
          week: 1,
          requests: [{ item: "Honey", amount: 1, deliveryCount: 0 }],
          points: 0,
        },
      },
    };

    for (let i = 0; i < 11; i++) {
      state = deliverFactionKitchen({
        state,
        action: {
          type: "factionKitchen.delivered",
          resourceIndex: 0,
        },
        createdAt: new Date("2024-07-01T00:00:00Z").getTime(),
      });
    }

    expect(state.faction?.kitchen?.points).toBe(111);
    expect(state.inventory["Faction Mark"]?.toNumber()).toBe(111);
  });
});
