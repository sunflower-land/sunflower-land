import Decimal from "decimal.js-light";
import { INITIAL_BUMPKIN, TEST_FARM } from "features/game/lib/constants";
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
    expect(state.inventory["Mark"]?.toNumber()).toBe(20);
  });

  it("reduces the points and marks amount by 2 for each subsequent delivery", () => {
    const state = deliverFactionKitchen({
      state: {
        ...GAME_STATE,
        inventory: { Honey: new Decimal(5), Mark: new Decimal(20) },
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
    expect(state.inventory["Mark"]?.toNumber()).toBe(38);
  });

  it("adds 1 point and 1 mark for the 11th delivery", () => {
    const state = deliverFactionKitchen({
      state: {
        ...GAME_STATE,
        inventory: { Honey: new Decimal(5), Mark: new Decimal(110) },
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
    expect(state.inventory["Mark"]?.toNumber()).toBe(111);
  });

  it("adds 1 point for the 12th delivery", () => {
    const state = deliverFactionKitchen({
      state: {
        ...GAME_STATE,
        inventory: { Honey: new Decimal(5), Mark: new Decimal(111) },
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
    expect(state.inventory["Mark"]?.toNumber()).toBe(112);
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
    expect(state.inventory["Mark"]?.toNumber()).toBe(111);
  });

  it("applies 5% more points for a delivery if the player has the faction pants active", () => {
    const state = deliverFactionKitchen({
      state: {
        ...GAME_STATE,
        bumpkin: {
          ...INITIAL_BUMPKIN,
          equipped: {
            ...INITIAL_BUMPKIN.equipped,
            pants: "Goblin Pants",
          },
        },
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

    expect(state.faction?.kitchen?.points).toBe(21);
    expect(state.inventory["Mark"]?.toNumber()).toBe(21);
  });

  it("applies 5% more points for a delivery if the player has the faction Sabatons active", () => {
    const state = deliverFactionKitchen({
      state: {
        ...GAME_STATE,
        bumpkin: {
          ...INITIAL_BUMPKIN,
          equipped: {
            ...INITIAL_BUMPKIN.equipped,
            shoes: "Goblin Sabatons",
          },
        },
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

    expect(state.faction?.kitchen?.points).toBe(21);
    expect(state.inventory["Mark"]?.toNumber()).toBe(21);
  });

  it("applies 10% more points for a delivery if the player has the faction tool (goblin axe) active", () => {
    const state = deliverFactionKitchen({
      state: {
        ...GAME_STATE,
        bumpkin: {
          ...INITIAL_BUMPKIN,
          equipped: {
            ...INITIAL_BUMPKIN.equipped,
            tool: "Goblin Axe",
          },
        },
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

    expect(state.faction?.kitchen?.points).toBe(22);
    expect(state.inventory["Mark"]?.toNumber()).toBe(22);
  });

  it("applies 10% more points for a delivery if the player has the faction tool (sword) active", () => {
    const state = deliverFactionKitchen({
      state: {
        ...GAME_STATE,
        bumpkin: {
          ...INITIAL_BUMPKIN,
          equipped: {
            ...INITIAL_BUMPKIN.equipped,
            tool: "Sunflorian Sword",
          },
        },
        inventory: { Honey: new Decimal(5) },
        faction: {
          ...(GAME_STATE.faction as Faction),
          name: "sunflorians",
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

    expect(state.faction?.kitchen?.points).toBe(22);
    expect(state.inventory["Mark"]?.toNumber()).toBe(22);
  });

  it("applies 10% more points for a delivery if the player has the faction helmet active", () => {
    const state = deliverFactionKitchen({
      state: {
        ...GAME_STATE,
        bumpkin: {
          ...INITIAL_BUMPKIN,
          equipped: {
            ...INITIAL_BUMPKIN.equipped,
            hat: "Goblin Helmet",
          },
        },
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

    expect(state.faction?.kitchen?.points).toBe(22);
    expect(state.inventory["Mark"]?.toNumber()).toBe(22);
  });

  it("applies 20% more points for a delivery if the player has the faction  active", () => {
    const state = deliverFactionKitchen({
      state: {
        ...GAME_STATE,
        bumpkin: {
          ...INITIAL_BUMPKIN,
          equipped: {
            ...INITIAL_BUMPKIN.equipped,
            shirt: "Goblin Armor",
          },
        },
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

    expect(state.faction?.kitchen?.points).toBe(24);
    expect(state.inventory["Mark"]?.toNumber()).toBe(24);
  });

  it("applies 50% more points when the whole faction outfit is active", () => {
    const state = deliverFactionKitchen({
      state: {
        ...GAME_STATE,
        bumpkin: {
          ...INITIAL_BUMPKIN,
          equipped: {
            ...INITIAL_BUMPKIN.equipped,
            shirt: "Goblin Armor",
            tool: "Goblin Axe",
            shoes: "Goblin Sabatons",
            pants: "Goblin Pants",
            hat: "Goblin Helmet",
          },
        },
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

    expect(state.faction?.kitchen?.points).toBe(30);
    expect(state.inventory["Mark"]?.toNumber()).toBe(30);
  });
});
