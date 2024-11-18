import Decimal from "decimal.js-light";
import {
  QUEST_NPC_NAMES,
  QuestNPCName,
  TICKET_REWARDS,
  deliverOrder,
} from "./deliver";
import { INITIAL_BUMPKIN, TEST_FARM } from "features/game/lib/constants";
import { getSeasonalTicket } from "features/game/types/seasons";

const FIRST_DAY_OF_SEASON = new Date("2024-11-01T16:00:00Z").getTime();
const MID_SEASON = new Date("2023-08-15T15:00:00Z").getTime();

describe("deliver", () => {
  beforeEach(() => {
    jest.useRealTimers();
  });

  it("requires the order exists", () => {
    expect(() =>
      deliverOrder({
        state: {
          ...TEST_FARM,
        },
        action: {
          id: "123",
          type: "order.delivered",
        },
      }),
    ).toThrow("Order does not exist");
  });

  it("requires order has started", () => {
    expect(() =>
      deliverOrder({
        state: {
          ...TEST_FARM,
          delivery: {
            ...TEST_FARM.delivery,
            orders: [
              {
                id: "123",
                createdAt: 0,
                readyAt: MID_SEASON + 5000,
                from: "betty",
                items: {
                  Sunflower: 50,
                },
                reward: { sfl: 0.1 },
              },
            ],
          },
        },
        action: {
          id: "123",
          type: "order.delivered",
        },
        createdAt: MID_SEASON,
      }),
    ).toThrow("Order has not started");
  });

  it("requires player has the ingredients", () => {
    expect(() =>
      deliverOrder({
        state: {
          ...TEST_FARM,
          delivery: {
            ...TEST_FARM.delivery,
            orders: [
              {
                id: "123",
                createdAt: 0,
                readyAt: MID_SEASON,
                from: "betty",
                items: {
                  Sunflower: 50,
                },
                reward: { sfl: 0.1 },
              },
            ],
          },
        },
        action: {
          id: "123",
          type: "order.delivered",
        },
        createdAt: MID_SEASON,
      }),
    ).toThrow("Insufficient ingredient: Sunflower");
  });

  // SFL will be a potential requirement for quests (Legacy)
  it("requires player has the sfl", () => {
    const now = new Date("2024-05-09").getTime();

    expect(() =>
      deliverOrder({
        createdAt: now,
        state: {
          ...TEST_FARM,
          balance: new Decimal(0),
          delivery: {
            ...TEST_FARM.delivery,
            orders: [
              {
                id: "123",
                createdAt: 0,
                readyAt: new Date("2023-10-15T15:00:00Z").getTime(),
                from: "tywin",
                items: {
                  sfl: 10,
                },
                reward: {},
              },
            ],
          },
        },
        action: {
          id: "123",
          type: "order.delivered",
        },
      }),
    ).toThrow("Insufficient ingredient: sfl");
  });

  it("requires player has the coins", () => {
    expect(() =>
      deliverOrder({
        state: {
          ...TEST_FARM,
          coins: 0,
          delivery: {
            ...TEST_FARM.delivery,
            orders: [
              {
                id: "123",
                createdAt: 0,
                readyAt: MID_SEASON,
                from: "betty",
                items: {
                  coins: 50,
                },
                reward: {},
              },
            ],
          },
        },
        action: {
          id: "123",
          type: "order.delivered",
        },
        createdAt: MID_SEASON,
      }),
    ).toThrow("Insufficient ingredient: coins");
  });

  it("takes sfl from player is required in delivery", () => {
    const balance = new Decimal(100);
    const game = deliverOrder({
      state: {
        ...TEST_FARM,
        balance,
        delivery: {
          ...TEST_FARM.delivery,
          orders: [
            {
              id: "123",
              createdAt: 0,
              readyAt: MID_SEASON,
              from: "tywin",
              items: {
                sfl: 50,
              },
              reward: {},
            },
          ],
        },
      },
      action: {
        id: "123",
        type: "order.delivered",
      },
      createdAt: MID_SEASON,
    });

    expect(game.balance).toEqual(balance.sub(50));
  });

  it("rewards sfl", () => {
    const state = deliverOrder({
      state: {
        ...TEST_FARM,
        inventory: {
          Sunflower: new Decimal(60),
        },
        delivery: {
          ...TEST_FARM.delivery,
          fulfilledCount: 0,
          orders: [
            {
              id: "123",
              createdAt: 0,
              readyAt: MID_SEASON,
              from: "betty",
              items: {
                Sunflower: 50,
              },
              reward: { sfl: 0.1 },
            },
          ],
        },
      },
      action: {
        id: "123",
        type: "order.delivered",
      },
      createdAt: MID_SEASON,
    });

    expect(state.balance).toEqual(new Decimal(0.1));
  });

  it("rewards apron boost with Sunflower Cake", () => {
    const state = deliverOrder({
      state: {
        ...TEST_FARM,
        bumpkin: {
          ...INITIAL_BUMPKIN,
          equipped: {
            ...INITIAL_BUMPKIN.equipped,
            coat: "Chef Apron",
          },
        },
        inventory: {
          "Sunflower Cake": new Decimal(1),
        },
        delivery: {
          ...TEST_FARM.delivery,
          fulfilledCount: 0,
          orders: [
            {
              id: "123",
              createdAt: 0,
              readyAt: MID_SEASON,
              from: "betty",
              items: {
                "Sunflower Cake": 1,
              },
              reward: { coins: 320 },
            },
          ],
        },
      },
      action: {
        id: "123",
        type: "order.delivered",
      },
      createdAt: MID_SEASON,
    });

    expect(state.coins).toEqual(384);
  });

  it("rewards apron boost with Eggplant Cake", () => {
    const state = deliverOrder({
      state: {
        ...TEST_FARM,
        bumpkin: {
          ...INITIAL_BUMPKIN,
          equipped: {
            ...INITIAL_BUMPKIN.equipped,
            coat: "Chef Apron",
          },
        },
        inventory: {
          "Eggplant Cake": new Decimal(1),
        },
        delivery: {
          ...TEST_FARM.delivery,
          fulfilledCount: 0,
          orders: [
            {
              id: "123",
              createdAt: 0,
              readyAt: MID_SEASON,
              from: "betty",
              items: {
                "Eggplant Cake": 1,
              },
              reward: { coins: 320 },
            },
          ],
        },
      },
      action: {
        id: "123",
        type: "order.delivered",
      },
      createdAt: MID_SEASON,
    });

    expect(state.coins).toEqual(384);
  });

  it("rewards apron boost with Orange Cake", () => {
    const state = deliverOrder({
      state: {
        ...TEST_FARM,
        bumpkin: {
          ...INITIAL_BUMPKIN,
          equipped: {
            ...INITIAL_BUMPKIN.equipped,
            coat: "Chef Apron",
          },
        },
        inventory: {
          "Orange Cake": new Decimal(1),
        },
        delivery: {
          ...TEST_FARM.delivery,
          fulfilledCount: 0,
          orders: [
            {
              id: "123",
              createdAt: 0,
              readyAt: MID_SEASON,
              from: "betty",
              items: {
                "Orange Cake": 1,
              },
              reward: { coins: 320 },
            },
          ],
        },
      },
      action: {
        id: "123",
        type: "order.delivered",
      },
      createdAt: MID_SEASON,
    });

    expect(state.coins).toEqual(384);
  });

  it("rewards michellin star boost", () => {
    const state = deliverOrder({
      state: {
        ...TEST_FARM,
        bumpkin: {
          ...INITIAL_BUMPKIN,
          skills: {
            "Michelin Stars": 1,
          },
        },
        inventory: {
          "Sunflower Cake": new Decimal(1),
        },
        delivery: {
          ...TEST_FARM.delivery,
          fulfilledCount: 0,
          orders: [
            {
              id: "123",
              createdAt: 0,
              readyAt: MID_SEASON,
              from: "betty",
              items: {
                "Sunflower Cake": 1,
              },
              reward: { coins: 320 },
            },
          ],
        },
      },
      action: {
        id: "123",
        type: "order.delivered",
      },
      createdAt: MID_SEASON,
    });

    expect(state.coins).toEqual(336);
  });

  it("rewards 25% SFL when Crown is Active", () => {
    const state = deliverOrder({
      state: {
        ...TEST_FARM,
        bumpkin: {
          ...INITIAL_BUMPKIN,
          equipped: {
            ...INITIAL_BUMPKIN.equipped,
            hat: "Goblin Crown",
          },
        },
        faction: {
          name: "goblins",
          pledgedAt: 0,
          history: {},
          points: 0,
        },
        inventory: {
          "Eggplant Cake": new Decimal(1),
        },
        delivery: {
          ...TEST_FARM.delivery,
          fulfilledCount: 0,
          orders: [
            {
              id: "123",
              createdAt: 0,
              readyAt: Date.now(),
              from: "betty",
              items: {
                "Eggplant Cake": 1,
              },
              reward: { sfl: 320 },
            },
          ],
        },
      },
      action: {
        id: "123",
        type: "order.delivered",
      },
    });

    expect(state.balance).toEqual(new Decimal(400));
  });

  it("rewards 25% Coins when Crown is Active", () => {
    const state = deliverOrder({
      state: {
        ...TEST_FARM,
        bumpkin: {
          ...INITIAL_BUMPKIN,
          equipped: {
            ...INITIAL_BUMPKIN.equipped,
            hat: "Goblin Crown",
          },
        },
        faction: {
          name: "goblins",
          pledgedAt: 0,
          history: {},
          points: 0,
        },
        inventory: {
          "Eggplant Cake": new Decimal(1),
        },
        delivery: {
          ...TEST_FARM.delivery,
          fulfilledCount: 0,
          orders: [
            {
              id: "123",
              createdAt: 0,
              readyAt: Date.now(),
              from: "betty",
              items: {
                "Eggplant Cake": 1,
              },
              reward: { coins: 320 },
            },
          ],
        },
      },
      action: {
        id: "123",
        type: "order.delivered",
      },
    });

    expect(state.coins).toEqual(400);
  });

  it("Crown Boost won't apply if not in a faction", () => {
    const state = deliverOrder({
      state: {
        ...TEST_FARM,
        bumpkin: {
          ...INITIAL_BUMPKIN,
          equipped: {
            ...INITIAL_BUMPKIN.equipped,
            hat: "Goblin Crown",
          },
        },
        faction: {
          name: "nightshades",
          pledgedAt: 0,
          history: {},
          points: 0,
        },
        inventory: {
          "Eggplant Cake": new Decimal(1),
        },
        delivery: {
          ...TEST_FARM.delivery,
          fulfilledCount: 0,
          orders: [
            {
              id: "123",
              createdAt: 0,
              readyAt: Date.now(),
              from: "betty",
              items: {
                "Eggplant Cake": 1,
              },
              reward: { coins: 320 },
            },
          ],
        },
      },
      action: {
        id: "123",
        type: "order.delivered",
      },
    });

    expect(state.coins).toEqual(320);
  });

  it("Crown Boost won't apply if not in the right faction", () => {
    const state = deliverOrder({
      state: {
        ...TEST_FARM,
        bumpkin: {
          ...INITIAL_BUMPKIN,
          equipped: {
            ...INITIAL_BUMPKIN.equipped,
            hat: "Goblin Crown",
          },
        },
        faction: {
          name: "nightshades",
          pledgedAt: 0,
          history: {},
          points: 0,
        },
        inventory: {
          "Eggplant Cake": new Decimal(1),
        },
        delivery: {
          ...TEST_FARM.delivery,
          fulfilledCount: 0,
          orders: [
            {
              id: "123",
              createdAt: 0,
              readyAt: Date.now(),
              from: "betty",
              items: {
                "Eggplant Cake": 1,
              },
              reward: { coins: 320 },
            },
          ],
        },
      },
      action: {
        id: "123",
        type: "order.delivered",
      },
    });

    expect(state.coins).toEqual(320);
  });

  it("rewards season tickets", () => {
    const state = deliverOrder({
      state: {
        ...TEST_FARM,
        inventory: {
          Gold: new Decimal(60),
        },
        delivery: {
          ...TEST_FARM.delivery,
          fulfilledCount: 0,
          orders: [
            {
              id: "123",
              createdAt: 0,
              readyAt: MID_SEASON,
              from: "pumpkin' pete",
              items: {
                Gold: 50,
              },
              reward: {},
            },
          ],
        },
      },
      action: {
        id: "123",
        type: "order.delivered",
      },
      createdAt: MID_SEASON,
    });

    const seasonTicket = getSeasonalTicket();

    expect(state.inventory[seasonTicket]).toEqual(new Decimal(1));
  });

  it("rewards items", () => {
    const state = deliverOrder({
      state: {
        ...TEST_FARM,
        inventory: {
          Sunflower: new Decimal(60),
        },
        delivery: {
          ...TEST_FARM.delivery,
          fulfilledCount: 1,
          orders: [
            {
              id: "123",
              createdAt: 0,
              readyAt: MID_SEASON,
              from: "betty",
              items: {
                Sunflower: 50,
              },
              reward: { items: { Carrot: 1 } },
            },
          ],
        },
      },
      action: {
        id: "123",
        type: "order.delivered",
      },
      createdAt: MID_SEASON,
    });

    expect(state.inventory["Carrot"]).toEqual(new Decimal(1));
  });

  it("increments npc delivery count", () => {
    const state = deliverOrder({
      state: {
        ...TEST_FARM,
        inventory: {
          Sunflower: new Decimal(60),
          "Beta Pass": new Decimal(1),
        },
        delivery: {
          ...TEST_FARM.delivery,
          fulfilledCount: 3,
          orders: [
            {
              id: "123",
              createdAt: 0,
              readyAt: Date.now(),
              from: "betty",
              items: {
                Sunflower: 50,
              },
              reward: { items: { "Dawn Breaker Ticket": 1 } },
            },
          ],
        },
      },
      action: {
        id: "123",
        type: "order.delivered",
      },
    });

    expect(state.npcs?.betty).toBeDefined();
    expect(state.npcs?.betty?.deliveryCount).toEqual(1);
  });

  it("increments npc friendship", () => {
    const now = new Date("2024-05-09").getTime();
    const state = deliverOrder({
      state: {
        ...TEST_FARM,
        inventory: {
          Sunflower: new Decimal(60),
          "Beta Pass": new Decimal(1),
        },
        delivery: {
          ...TEST_FARM.delivery,
          fulfilledCount: 3,
          orders: [
            {
              id: "123",
              createdAt: 0,
              readyAt: now,
              from: "pumpkin' pete",
              items: {
                Sunflower: 50,
              },
              reward: { sfl: 0, items: { "Dawn Breaker Ticket": 1 } },
            },
          ],
        },
      },
      action: {
        id: "123",
        type: "order.delivered",
        friendship: true,
      },
      createdAt: now,
    });

    expect(state.npcs?.["pumpkin' pete"]).toBeDefined();
    expect(state.npcs?.["pumpkin' pete"]?.friendship).toEqual({
      points: 3,
      updatedAt: now,
      giftClaimedAtPoints: 0,
    });
  });

  it("does not complete order with ticket rewards when frozen", () => {
    expect(() =>
      deliverOrder({
        state: {
          ...TEST_FARM,
          inventory: {
            Sunflower: new Decimal(60),
          },
          delivery: {
            ...TEST_FARM.delivery,
            fulfilledCount: 3,
            orders: [
              {
                id: "123",
                createdAt: 0,
                readyAt: FIRST_DAY_OF_SEASON,
                from: "pumpkin' pete",
                items: {
                  Sunflower: 50,
                },
                reward: {},
              },
            ],
          },
          bumpkin: INITIAL_BUMPKIN,
        },
        action: {
          id: "123",
          type: "order.delivered",
        },
        createdAt: FIRST_DAY_OF_SEASON,
      }),
    ).toThrow("Ticket tasks are frozen");
  });

  it("completes coin and sfl deliveries when tasks are frozen", () => {
    const state = deliverOrder({
      state: {
        ...TEST_FARM,
        inventory: {
          Sunflower: new Decimal(60),
        },
        delivery: {
          ...TEST_FARM.delivery,
          fulfilledCount: 3,
          orders: [
            {
              id: "123",
              createdAt: 0,
              readyAt: FIRST_DAY_OF_SEASON,
              from: "betty",
              items: {
                Sunflower: 50,
              },
              reward: { sfl: 10 },
            },
          ],
        },
        bumpkin: INITIAL_BUMPKIN,
      },
      action: {
        id: "123",
        type: "order.delivered",
      },
      createdAt: FIRST_DAY_OF_SEASON,
    });

    expect(state.balance).toEqual(new Decimal(10));
    expect(state.inventory.Sunflower).toEqual(new Decimal(10));
  });

  it("provides the correct amount of tickets for deliveries", () => {
    const seasonNPCs = QUEST_NPC_NAMES;

    seasonNPCs.forEach((name) => {
      const state = deliverOrder({
        state: {
          ...TEST_FARM,
          inventory: {
            Sunflower: new Decimal(60),
          },
          delivery: {
            ...TEST_FARM.delivery,
            fulfilledCount: 3,
            orders: [
              {
                id: "123",
                createdAt: 0,
                readyAt: new Date("2023-10-31T15:00:00Z").getTime(),
                from: name,
                items: {
                  Sunflower: 50,
                },
                reward: {},
              },
            ],
          },
          bumpkin: INITIAL_BUMPKIN,
        },
        action: {
          id: "123",
          type: "order.delivered",
        },
        createdAt: new Date("2024-05-10T16:00:00Z").getTime(),
      });

      expect(state.inventory[getSeasonalTicket()]).toEqual(
        new Decimal(TICKET_REWARDS[name as QuestNPCName]),
      );
    });
  });

  it("provides normal tickets for non banner holder", () => {
    const state = deliverOrder({
      state: {
        ...TEST_FARM,
        inventory: {
          Sunflower: new Decimal(60),
        },
        delivery: {
          ...TEST_FARM.delivery,
          fulfilledCount: 3,
          orders: [
            {
              id: "123",
              createdAt: 0,
              readyAt: new Date("2023-10-31T15:00:00Z").getTime(),
              from: "pumpkin' pete",
              items: {
                Sunflower: 50,
              },
              reward: {},
            },
          ],
        },
        bumpkin: INITIAL_BUMPKIN,
      },
      action: {
        id: "123",
        type: "order.delivered",
      },
      createdAt: new Date("2024-05-10T16:00:00Z").getTime(),
    });

    expect(state.inventory[getSeasonalTicket()]).toEqual(new Decimal(1));
  });

  it("provides +2 tickets for banner holder", () => {
    const state = deliverOrder({
      state: {
        ...TEST_FARM,
        inventory: {
          Sunflower: new Decimal(60),
          "Clash of Factions Banner": new Decimal(1),
        },
        delivery: {
          ...TEST_FARM.delivery,
          fulfilledCount: 3,
          orders: [
            {
              id: "123",
              createdAt: 0,
              readyAt: new Date("2023-10-31T15:00:00Z").getTime(),
              from: "pumpkin' pete",
              items: {
                Sunflower: 50,
              },
              reward: {},
            },
          ],
        },
        bumpkin: INITIAL_BUMPKIN,
      },
      action: {
        id: "123",
        type: "order.delivered",
      },
      createdAt: new Date("2024-05-10T16:00:00Z").getTime(),
    });

    expect(state.inventory[getSeasonalTicket()]).toEqual(new Decimal(3));
  });

  it("provides +2 tickets for Lifetime Farmer banner holder", () => {
    const state = deliverOrder({
      state: {
        ...TEST_FARM,
        inventory: {
          Sunflower: new Decimal(60),
          "Lifetime Farmer Banner": new Decimal(1),
        },
        delivery: {
          ...TEST_FARM.delivery,
          fulfilledCount: 3,
          orders: [
            {
              id: "123",
              createdAt: 0,
              readyAt: new Date("2023-10-31T15:00:00Z").getTime(),
              from: "pumpkin' pete",
              items: {
                Sunflower: 50,
              },
              reward: {},
            },
          ],
        },
        bumpkin: INITIAL_BUMPKIN,
      },
      action: {
        id: "123",
        type: "order.delivered",
      },
      createdAt: new Date("2024-05-10T16:00:00Z").getTime(),
    });

    expect(state.inventory[getSeasonalTicket()]).toEqual(new Decimal(3));
  });

  it("provides +1 tickets when Cowboy Hat is worn at Bull Run Season", () => {
    const mockDate = new Date(2024, 11, 11);
    jest.useFakeTimers();
    jest.setSystemTime(mockDate);
    const state = deliverOrder({
      state: {
        ...TEST_FARM,
        inventory: {
          Sunflower: new Decimal(60),
        },
        delivery: {
          ...TEST_FARM.delivery,
          fulfilledCount: 3,
          orders: [
            {
              id: "123",
              createdAt: mockDate.getTime(),
              readyAt: new Date("2024-11-04T15:00:00Z").getTime(),
              from: "pumpkin' pete",
              items: {
                Sunflower: 50,
              },
              reward: {},
            },
          ],
        },
        bumpkin: {
          ...INITIAL_BUMPKIN,
          equipped: {
            ...INITIAL_BUMPKIN.equipped,
            hat: "Cowboy Hat",
          },
        },
      },
      action: {
        id: "123",
        type: "order.delivered",
      },
      createdAt: mockDate.getTime(),
    });

    expect(state.inventory[getSeasonalTicket()]).toEqual(new Decimal(2));
  });

  it("provides +1 tickets when Cowboy Shirt is worn at Bull Run Season", () => {
    const mockDate = new Date(2024, 11, 11);
    jest.useFakeTimers();
    jest.setSystemTime(mockDate);
    const state = deliverOrder({
      state: {
        ...TEST_FARM,
        inventory: {
          Sunflower: new Decimal(60),
        },
        delivery: {
          ...TEST_FARM.delivery,
          fulfilledCount: 3,
          orders: [
            {
              id: "123",
              createdAt: mockDate.getTime(),
              readyAt: new Date("2024-11-04T15:00:00Z").getTime(),
              from: "pumpkin' pete",
              items: {
                Sunflower: 50,
              },
              reward: {},
            },
          ],
        },
        bumpkin: {
          ...INITIAL_BUMPKIN,
          equipped: {
            ...INITIAL_BUMPKIN.equipped,
            shirt: "Cowboy Shirt",
          },
        },
      },
      action: {
        id: "123",
        type: "order.delivered",
      },
      createdAt: mockDate.getTime(),
    });

    expect(state.inventory[getSeasonalTicket()]).toEqual(new Decimal(2));
  });

  it("provides +1 tickets when Cowboy Trouser is worn at Bull Run Season", () => {
    const mockDate = new Date(2024, 11, 11);
    jest.useFakeTimers();
    jest.setSystemTime(mockDate);
    const state = deliverOrder({
      state: {
        ...TEST_FARM,
        inventory: {
          Sunflower: new Decimal(60),
        },
        delivery: {
          ...TEST_FARM.delivery,
          fulfilledCount: 3,
          orders: [
            {
              id: "123",
              createdAt: mockDate.getTime(),
              readyAt: new Date("2024-11-04T15:00:00Z").getTime(),
              from: "pumpkin' pete",
              items: {
                Sunflower: 50,
              },
              reward: {},
            },
          ],
        },
        bumpkin: {
          ...INITIAL_BUMPKIN,
          equipped: {
            ...INITIAL_BUMPKIN.equipped,
            pants: "Cowboy Trouser",
          },
        },
      },
      action: {
        id: "123",
        type: "order.delivered",
      },
      createdAt: mockDate.getTime(),
    });

    expect(state.inventory[getSeasonalTicket()]).toEqual(new Decimal(2));
  });

  it("stacks Cowboy Set boost at Bull Run Season", () => {
    const mockDate = new Date(2024, 11, 11);
    jest.useFakeTimers();
    jest.setSystemTime(mockDate);
    const state = deliverOrder({
      state: {
        ...TEST_FARM,
        inventory: {
          Sunflower: new Decimal(60),
        },
        delivery: {
          ...TEST_FARM.delivery,
          fulfilledCount: 3,
          orders: [
            {
              id: "123",
              createdAt: mockDate.getTime(),
              readyAt: new Date("2024-11-04T15:00:00Z").getTime(),
              from: "pumpkin' pete",
              items: {
                Sunflower: 50,
              },
              reward: {},
            },
          ],
        },
        bumpkin: {
          ...INITIAL_BUMPKIN,
          equipped: {
            ...INITIAL_BUMPKIN.equipped,
            hat: "Cowboy Hat",
            shirt: "Cowboy Shirt",
            pants: "Cowboy Trouser",
          },
        },
      },
      action: {
        id: "123",
        type: "order.delivered",
      },
      createdAt: mockDate.getTime(),
    });

    expect(state.inventory[getSeasonalTicket()]).toEqual(new Decimal(4));
  });

  it("does not provide +1 tickets when Cowboy Hat is worn outside Bull Run Season", () => {
    const mockDate = new Date("2024-10-30T15:00:00Z");
    jest.useFakeTimers();
    jest.setSystemTime(mockDate);
    const state = deliverOrder({
      state: {
        ...TEST_FARM,
        inventory: {
          Sunflower: new Decimal(60),
        },
        delivery: {
          ...TEST_FARM.delivery,
          fulfilledCount: 3,
          orders: [
            {
              id: "123",
              createdAt: mockDate.getTime(),
              readyAt: new Date("2024-10-29T15:00:00Z").getTime(),
              from: "pumpkin' pete",
              items: {
                Sunflower: 50,
              },
              reward: {},
            },
          ],
        },
        bumpkin: {
          ...INITIAL_BUMPKIN,
          equipped: {
            ...INITIAL_BUMPKIN.equipped,
            hat: "Cowboy Hat",
          },
        },
      },
      action: {
        id: "123",
        type: "order.delivered",
      },
      createdAt: mockDate.getTime(),
    });

    expect(state.inventory[getSeasonalTicket()]).toEqual(new Decimal(1));
  });

  it("add 20% coins bonus if has Betty's Friend skill on Betty's orders with Coins reward", () => {
    const state = deliverOrder({
      state: {
        ...TEST_FARM,
        bumpkin: {
          ...INITIAL_BUMPKIN,
          skills: {
            "Betty's Friend": 1,
          },
        },
        inventory: {
          Sunflower: new Decimal(60),
        },
        delivery: {
          ...TEST_FARM.delivery,
          fulfilledCount: 3,
          orders: [
            {
              id: "123",
              createdAt: 0,
              readyAt: new Date("2023-10-31T15:00:00Z").getTime(),
              from: "betty",
              items: {
                Sunflower: 50,
              },
              reward: { coins: 100 },
            },
          ],
        },
      },
      action: {
        id: "123",
        type: "order.delivered",
      },
      createdAt: new Date("2024-05-10T16:00:00Z").getTime(),
    });

    expect(state.coins).toEqual(120);
  });
  it("add 20% coins bonus if has Forge-Ward Profits skill on Blacksmith's orders with Coins reward", () => {
    const state = deliverOrder({
      state: {
        ...TEST_FARM,
        bumpkin: {
          ...INITIAL_BUMPKIN,
          skills: {
            "Forge-Ward Profits": 1,
          },
        },
        inventory: {
          Wood: new Decimal(50),
        },
        delivery: {
          ...TEST_FARM.delivery,
          fulfilledCount: 3,
          orders: [
            {
              id: "123",
              createdAt: 0,
              readyAt: new Date("2023-10-31T15:00:00Z").getTime(),
              from: "blacksmith",
              items: {
                Wood: 50,
              },
              reward: { coins: 100 },
            },
          ],
        },
      },
      action: {
        id: "123",
        type: "order.delivered",
      },
      createdAt: new Date("2024-05-10T16:00:00Z").getTime(),
    });

    expect(state.coins).toEqual(120);
  });

  it("does not add 20% coins bonus if has Betty's Friend skill on non Betty's orders with Coins reward", () => {
    const state = deliverOrder({
      state: {
        ...TEST_FARM,
        bumpkin: {
          ...INITIAL_BUMPKIN,
          skills: {
            "Betty's Friend": 1,
          },
        },
        inventory: {
          Sunflower: new Decimal(60),
        },
        delivery: {
          ...TEST_FARM.delivery,
          fulfilledCount: 3,
          orders: [
            {
              id: "123",
              createdAt: 0,
              readyAt: new Date("2023-10-31T15:00:00Z").getTime(),
              from: "pumpkin' pete",
              items: {
                Sunflower: 50,
              },
              reward: { coins: 100 },
            },
          ],
        },
      },
      action: {
        id: "123",
        type: "order.delivered",
      },
      createdAt: new Date("2024-05-10T16:00:00Z").getTime(),
    });

    expect(state.coins).toEqual(100);
  });

  it("gives 50% more Coins profit on completed fruit deliveries if player has Fruity Profit skill", () => {
    const state = deliverOrder({
      state: {
        ...TEST_FARM,
        coins: 0,
        inventory: {
          Orange: new Decimal(5),
          Grape: new Decimal(2),
        },
        delivery: {
          ...TEST_FARM.delivery,
          orders: [
            {
              id: "123",
              createdAt: 0,
              readyAt: Date.now(),
              from: "tango",
              items: {
                Orange: 5,
                Grape: 2,
              },
              reward: { coins: 320 },
            },
          ],
        },
        bumpkin: {
          ...INITIAL_BUMPKIN,
          skills: {
            "Fruity Profit": 1,
          },
        },
      },
      action: {
        id: "123",
        type: "order.delivered",
      },
    });

    expect(state.coins).toEqual(480);
  });

  it("does not give Fruity Profit bonus if item is not fruit", () => {
    const state = deliverOrder({
      state: {
        ...TEST_FARM,
        coins: 0,
        inventory: {
          "Sunflower Cake": new Decimal(1),
        },
        delivery: {
          ...TEST_FARM.delivery,
          orders: [
            {
              id: "123",
              createdAt: 0,
              readyAt: Date.now(),
              from: "betty",
              items: {
                "Sunflower Cake": 1,
              },
              reward: { coins: 320 },
            },
          ],
        },
        bumpkin: {
          ...INITIAL_BUMPKIN,
          skills: {
            "Fruity Profit": 1,
          },
        },
      },
      action: {
        id: "123",
        type: "order.delivered",
      },
    });

    expect(state.coins).toEqual(320);
  });

  it("gives a +50% coins bonus on completed orders from Corale if player has Fishy Fortune skill", () => {
    const state = deliverOrder({
      state: {
        ...TEST_FARM,
        coins: 0,
        inventory: {
          "Sunflower Cake": new Decimal(1),
        },
        delivery: {
          ...TEST_FARM.delivery,
          orders: [
            {
              id: "123",
              createdAt: 0,
              readyAt: Date.now(),
              from: "corale",
              items: {
                "Sunflower Cake": 1,
              },
              reward: { coins: 320 },
            },
          ],
        },
        bumpkin: {
          ...INITIAL_BUMPKIN,
          skills: {
            "Fishy Fortune": 1,
          },
        },
      },
      action: {
        id: "123",
        type: "order.delivered",
      },
    });

    expect(state.coins).toEqual(480);
  });

  it("gives 5% more revenue on completed food orders with Nom Nom skill", () => {
    const state = deliverOrder({
      state: {
        ...TEST_FARM,
        coins: 0,
        inventory: {
          "Sunflower Cake": new Decimal(1),
        },
        delivery: {
          ...TEST_FARM.delivery,
          orders: [
            {
              id: "123",
              createdAt: 0,
              readyAt: Date.now(),
              from: "betty",
              items: {
                "Sunflower Cake": 1,
              },
              reward: { coins: 320 },
            },
          ],
        },
        bumpkin: {
          ...INITIAL_BUMPKIN,
          skills: {
            "Nom Nom": 1,
          },
        },
      },
      action: {
        id: "123",
        type: "order.delivered",
      },
    });

    expect(state.coins).toEqual(336);
  });
  it("gives 100% more Coins profit on completed deliveries if double delivery is active", () => {
    const state = deliverOrder({
      state: {
        ...TEST_FARM,
        coins: 0,
        inventory: {
          Orange: new Decimal(5),
          Grape: new Decimal(2),
        },
        delivery: {
          ...TEST_FARM.delivery,
          orders: [
            {
              id: "123",
              createdAt: 0,
              readyAt: new Date("2024-09-10").getTime(),
              from: "tango",
              items: {
                Orange: 5,
                Grape: 2,
              },
              reward: { coins: 320 },
            },
          ],
          doubleDelivery: "2024-09-10",
        },
      },
      action: {
        id: "123",
        type: "order.delivered",
      },
      createdAt: new Date("2024-09-10").getTime(),
    });

    expect(state.coins).toEqual(640);
  });

  it("gives 100% more SFL profit on completed deliveries if double delivery is active", () => {
    const state = deliverOrder({
      state: {
        ...TEST_FARM,
        coins: 0,
        inventory: {
          Orange: new Decimal(5),
          Grape: new Decimal(2),
        },
        delivery: {
          ...TEST_FARM.delivery,
          orders: [
            {
              id: "123",
              createdAt: 0,
              readyAt: new Date("2024-09-10").getTime(),
              from: "guria",
              items: {
                Orange: 5,
                Grape: 2,
              },
              reward: { sfl: 1 },
            },
          ],
          doubleDelivery: "2024-09-10",
        },
      },
      action: {
        id: "123",
        type: "order.delivered",
      },
      createdAt: new Date("2024-09-10").getTime(),
    });

    expect(state.balance).toEqual(new Decimal(2));
  });

  it("gives 100% more seasonal ticket on completed deliveries if double delivery is active", () => {
    const state = deliverOrder({
      state: {
        ...TEST_FARM,
        coins: 6400,
        inventory: { "Amber Fossil": new Decimal(0) },
        delivery: {
          ...TEST_FARM.delivery,
          orders: [
            {
              id: "123",
              createdAt: 0,
              readyAt: new Date("2024-09-10").getTime(),
              from: "tywin",
              items: { coins: 6400 },
              reward: {},
            },
          ],
          doubleDelivery: "2024-09-10",
        },
      },
      action: {
        id: "123",
        type: "order.delivered",
      },
      createdAt: new Date("2024-09-10").getTime(),
    });

    expect(state.inventory[getSeasonalTicket()]).toEqual(new Decimal(10));
  });
});
