import "lib/__mocks__/configMock";
import Decimal from "decimal.js-light";
import { deliverOrder } from "./deliver";
import { INITIAL_BUMPKIN, TEST_FARM } from "features/game/lib/constants";
import { SEASONS, getSeasonalTicket } from "features/game/types/seasons";
import { Quest } from "features/game/types/game";

const LAST_DAY_OF_SEASON = new Date("2023-10-31T16:00:00Z").getTime();
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
      })
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
      })
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
      })
    ).toThrow("Insufficient ingredient: Sunflower");
  });

  // SFL will be a potential requirement for quests (Legacy)
  it("requires player has the sfl", () => {
    expect(() =>
      deliverOrder({
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
                reward: { tickets: 100 },
              },
            ],
          },
        },
        action: {
          id: "123",
          type: "order.delivered",
        },
      })
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
                reward: { tickets: 100 },
              },
            ],
          },
        },
        action: {
          id: "123",
          type: "order.delivered",
        },
        createdAt: MID_SEASON,
      })
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
              reward: { tickets: 100 },
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
              from: "betty",
              items: {
                Gold: 50,
              },
              reward: { tickets: 5 },
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

    expect(state.inventory[seasonTicket]).toEqual(new Decimal(5));
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
    const now = Date.now();
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

  it("rewards faction points", () => {
    const state = deliverOrder({
      state: {
        ...TEST_FARM,
        inventory: {
          Gold: new Decimal(60),
        },
        faction: {
          name: "goblins",
          donated: { daily: { resources: {}, sfl: {} }, totalItems: {} },
          points: 0,
          pledgedAt: 0,
        },
        delivery: {
          ...TEST_FARM.delivery,
          fulfilledCount: 0,
          orders: [
            {
              id: "123",
              createdAt: 0,
              readyAt: Date.now(),
              from: "raven",
              items: {
                Gold: 50,
              },
              reward: { tickets: 5 },
            } as Quest,
          ],
        },
        bumpkin: INITIAL_BUMPKIN,
      },
      action: {
        id: "123",
        type: "order.delivered",
      },
    });

    expect(state.faction?.points).toEqual(25);
  });

  it("does not reward faction points if no faction selected", () => {
    const timers = jest.useFakeTimers();

    const seasonTime = new Date(
      SEASONS["Witches' Eve"].startDate.getTime() + 8 * 24 * 60 * 60 * 1000
    );

    timers.setSystemTime(seasonTime);
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
              readyAt: Date.now(),
              from: "raven",
              items: {
                Gold: 50,
              },
              reward: { tickets: 5 },
            } as Quest,
          ],
        },
        bumpkin: INITIAL_BUMPKIN,
      },
      action: {
        id: "123",
        type: "order.delivered",
      },
    });

    expect(state.faction).toBeUndefined();
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
                readyAt: LAST_DAY_OF_SEASON,
                from: "betty",
                items: {
                  Sunflower: 50,
                },
                reward: { tickets: 10 },
              },
            ],
          },
          bumpkin: INITIAL_BUMPKIN,
        },
        action: {
          id: "123",
          type: "order.delivered",
        },
        createdAt: LAST_DAY_OF_SEASON,
      })
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
              readyAt: LAST_DAY_OF_SEASON,
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
      createdAt: LAST_DAY_OF_SEASON,
    });

    expect(state.balance).toEqual(new Decimal(10));
    expect(state.inventory.Sunflower).toEqual(new Decimal(10));
  });
});
