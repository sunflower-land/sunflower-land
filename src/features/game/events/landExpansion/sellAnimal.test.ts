import { INITIAL_FARM } from "features/game/lib/constants";
import { sellAnimal } from "./sellAnimal";
import Decimal from "decimal.js-light";

describe("animal.sold", () => {
  it("requires deal exists", () => {
    expect(() =>
      sellAnimal({
        state: INITIAL_FARM,
        action: {
          requestId: "123",
          animalId: Object.keys(INITIAL_FARM.henHouse.animals)[0],
          type: "animal.sold",
        },
      }),
    ).toThrow("Bounty does not exist");
  });

  it("requires deal not already made", () => {
    expect(() =>
      sellAnimal({
        state: {
          ...INITIAL_FARM,
          bounties: {
            completed: [
              {
                id: "123",
                soldAt: Date.now(),
              },
            ],
            requests: [
              {
                id: "123",
                coins: 100,

                level: 1,
                name: "Chicken",
              },
            ],
          },
        },
        action: {
          requestId: "123",
          animalId: Object.keys(INITIAL_FARM.henHouse.animals)[0],

          type: "animal.sold",
        },
      }),
    ).toThrow("Bounty already completed");
  });

  it("requires player has a chicken", () => {
    expect(() =>
      sellAnimal({
        state: {
          ...INITIAL_FARM,
          bounties: {
            completed: [],
            requests: [
              {
                id: "123",
                coins: 100,

                level: 1,
                name: "Chicken",
              },
            ],
          },
        },
        action: {
          requestId: "123",
          animalId: "678",
          type: "animal.sold",
        },
      }),
    ).toThrow("Animal does not exist");
  });

  it("requires chicken is correct level", () => {
    expect(() =>
      sellAnimal({
        state: {
          ...INITIAL_FARM,
          bounties: {
            completed: [],
            requests: [
              {
                id: "123",
                coins: 100,

                level: 12,
                name: "Chicken",
              },
            ],
          },
        },
        action: {
          requestId: "123",
          animalId: Object.keys(INITIAL_FARM.henHouse.animals)[0],

          type: "animal.sold",
        },
      }),
    ).toThrow("Animal does not meet requirements");
  });

  // Success
  it("removes a chicken", () => {
    const animalId = Object.keys(INITIAL_FARM.henHouse.animals)[0];
    const state = sellAnimal({
      state: {
        ...INITIAL_FARM,
        henHouse: {
          ...INITIAL_FARM.henHouse,
          animals: {
            ...INITIAL_FARM.henHouse.animals,
            [animalId]: {
              ...INITIAL_FARM.henHouse.animals[animalId],
              experience: 1000,
            },
          },
        },
        bounties: {
          completed: [],
          requests: [
            {
              id: "123",
              coins: 100,

              level: 1,
              name: "Chicken",
            },
          ],
        },
      },
      action: {
        requestId: "123",
        animalId,

        type: "animal.sold",
      },
    });

    expect(state.henHouse.animals[animalId]).toBeUndefined();
    expect(Object.keys(state.henHouse.animals)).toHaveLength(2);
  });

  it("exchanges coins", () => {
    const animalId = Object.keys(INITIAL_FARM.henHouse.animals)[0];
    const state = sellAnimal({
      state: {
        ...INITIAL_FARM,
        henHouse: {
          ...INITIAL_FARM.henHouse,
          animals: {
            ...INITIAL_FARM.henHouse.animals,
            [animalId]: {
              ...INITIAL_FARM.henHouse.animals[animalId],
              experience: 1000,
            },
          },
        },
        bounties: {
          completed: [],
          requests: [
            {
              id: "123",
              coins: 100,

              level: 1,
              name: "Chicken",
            },
          ],
        },
      },
      action: {
        requestId: "123",
        animalId,

        type: "animal.sold",
      },
    });

    expect(state.coins).toEqual(100);
  });

  it("exchanges tickets", () => {
    const animalId = Object.keys(INITIAL_FARM.henHouse.animals)[0];
    const state = sellAnimal({
      state: {
        ...INITIAL_FARM,
        henHouse: {
          ...INITIAL_FARM.henHouse,
          animals: {
            ...INITIAL_FARM.henHouse.animals,
            [animalId]: {
              ...INITIAL_FARM.henHouse.animals[animalId],
              experience: 1000,
            },
          },
        },
        bounties: {
          completed: [],
          requests: [
            {
              id: "123",
              items: { "Amber Fossil": 7 },

              level: 1,
              name: "Chicken",
            },
          ],
        },
      },
      action: {
        requestId: "123",
        animalId,

        type: "animal.sold",
      },
      createdAt: new Date("2024-10-10").getTime(),
    });

    expect(state.inventory["Amber Fossil"]).toEqual(new Decimal(7));
  });

  it("marks as sold", () => {
    const now = Date.now();
    const animalId = Object.keys(INITIAL_FARM.henHouse.animals)[0];
    const state = sellAnimal({
      state: {
        ...INITIAL_FARM,
        henHouse: {
          ...INITIAL_FARM.henHouse,
          animals: {
            ...INITIAL_FARM.henHouse.animals,
            [animalId]: {
              ...INITIAL_FARM.henHouse.animals[animalId],
              experience: 1000,
            },
          },
        },
        bounties: {
          completed: [],
          requests: [
            {
              id: "123",
              coins: 100,

              level: 1,
              name: "Chicken",
            },
          ],
        },
      },
      action: {
        requestId: "123",
        animalId,

        type: "animal.sold",
      },
      createdAt: now,
    });

    const deal = state.bounties.completed.find((deal) => deal.id === "123");
    expect(deal?.soldAt).toEqual(now);
  });

  it("gives 50% more coins when selling bountiful bounties", () => {
    const animalId = Object.keys(INITIAL_FARM.henHouse.animals)[0];
    const state = sellAnimal({
      state: {
        ...INITIAL_FARM,
        bumpkin: {
          ...INITIAL_FARM.bumpkin,
          skills: {
            "Bountiful Bounties": 1,
          },
        },
        henHouse: {
          ...INITIAL_FARM.henHouse,
          animals: {
            ...INITIAL_FARM.henHouse.animals,
            [animalId]: {
              ...INITIAL_FARM.henHouse.animals[animalId],
              experience: 1000,
            },
          },
        },
        bounties: {
          completed: [],
          requests: [
            {
              id: "123",

              coins: 100,
              items: {},
              level: 1,
              name: "Chicken",
            },
          ],
        },
      },
      action: {
        requestId: "123",
        animalId,
        type: "animal.sold",
      },
    });

    expect(state.coins).toEqual(150);
  });

  it("gives 25% less coins when selling sick animals", () => {
    const animalId = Object.keys(INITIAL_FARM.henHouse.animals)[0];
    const state = sellAnimal({
      state: {
        ...INITIAL_FARM,
        henHouse: {
          ...INITIAL_FARM.henHouse,
          animals: {
            ...INITIAL_FARM.henHouse.animals,
            [animalId]: {
              ...INITIAL_FARM.henHouse.animals[animalId],
              experience: 60,
              state: "sick",
            },
          },
        },
        bounties: {
          completed: [],
          requests: [
            {
              id: "123",
              coins: 100,
              items: {},
              level: 1,
              name: "Chicken",
            },
          ],
        },
      },
      action: {
        requestId: "123",
        animalId,
        type: "animal.sold",
      },
    });

    // Check coins are halved
    expect(state.coins).toEqual(75);
  });

  it("gives approx 25% less items (rounded down) when selling sick animals", () => {
    const animalId = Object.keys(INITIAL_FARM.henHouse.animals)[0];
    const state = sellAnimal({
      state: {
        ...INITIAL_FARM,
        henHouse: {
          ...INITIAL_FARM.henHouse,
          animals: {
            ...INITIAL_FARM.henHouse.animals,
            [animalId]: {
              ...INITIAL_FARM.henHouse.animals[animalId],
              experience: 60,
              state: "sick",
            },
          },
        },
        bounties: {
          completed: [],
          requests: [
            {
              id: "123",
              coins: 100,
              items: {
                "Amber Fossil": 7,
              },
              level: 1,
              name: "Chicken",
            },
          ],
        },
      },
      action: {
        requestId: "123",
        animalId,
        type: "animal.sold",
      },
    });

    // Check coins are halved
    expect(state.coins).toEqual(75);
    expect(state.inventory["Amber Fossil"]).toEqual(new Decimal(5));
  });

  it("rewards +1 Horseshoe when Cowboy Hat is worn during Bull Run Season", () => {
    const mockDate = new Date(2024, 11, 11);
    jest.useFakeTimers();
    jest.setSystemTime(mockDate);
    const animalId = Object.keys(INITIAL_FARM.henHouse.animals)[0];
    const state = sellAnimal({
      state: {
        ...INITIAL_FARM,
        bumpkin: {
          ...INITIAL_FARM.bumpkin,
          equipped: {
            ...INITIAL_FARM.bumpkin.equipped,
            hat: "Cowboy Hat",
          },
        },
        bounties: {
          completed: [],
          requests: [
            {
              id: "123",
              items: { Horseshoe: 7 },
              level: 0,
              name: "Chicken",
            },
          ],
        },
      },
      action: {
        requestId: "123",
        animalId,

        type: "animal.sold",
      },
      createdAt: new Date("2024-11-03").getTime(),
    });

    expect(state.inventory["Horseshoe"]).toEqual(new Decimal(8));
  });

  it("stacks Cowboy Set boosts at Bull Run Season", () => {
    const mockDate = new Date(2024, 11, 11);
    jest.useFakeTimers();
    jest.setSystemTime(mockDate);
    const animalId = Object.keys(INITIAL_FARM.henHouse.animals)[0];
    const state = sellAnimal({
      state: {
        ...INITIAL_FARM,
        bumpkin: {
          ...INITIAL_FARM.bumpkin,
          equipped: {
            ...INITIAL_FARM.bumpkin.equipped,
            hat: "Cowboy Hat",
            shirt: "Cowboy Shirt",
            pants: "Cowboy Trouser",
          },
        },
        bounties: {
          completed: [],
          requests: [
            {
              id: "123",
              items: { Horseshoe: 7 },
              level: 0,
              name: "Chicken",
            },
          ],
        },
      },
      action: {
        requestId: "123",
        animalId,

        type: "animal.sold",
      },
      createdAt: new Date("2024-11-03").getTime(),
    });

    expect(state.inventory["Horseshoe"]).toEqual(new Decimal(10));
  });
  it("rewards +1 Timeshard when Acorn Hat is worn during Winds of Change Chapter", () => {
    const mockDate = new Date(2025, 2, 5);
    jest.useFakeTimers();
    jest.setSystemTime(mockDate);
    const animalId = Object.keys(INITIAL_FARM.henHouse.animals)[0];
    const state = sellAnimal({
      state: {
        ...INITIAL_FARM,
        bumpkin: {
          ...INITIAL_FARM.bumpkin,
          equipped: {
            ...INITIAL_FARM.bumpkin.equipped,
            hat: "Acorn Hat",
          },
        },
        bounties: {
          completed: [],
          requests: [
            {
              id: "123",
              items: { Timeshard: 7 },
              level: 0,
              name: "Chicken",
            },
          ],
        },
      },
      action: {
        requestId: "123",
        animalId,

        type: "animal.sold",
      },
      createdAt: new Date("2025-02-05").getTime(),
    });

    expect(state.inventory["Timeshard"]).toEqual(new Decimal(8));
  });

  it("stacks timeshard boosts during Winds of Change Chapter", () => {
    const mockDate = new Date(2025, 2, 5);
    jest.useFakeTimers();
    jest.setSystemTime(mockDate);
    const animalId = Object.keys(INITIAL_FARM.henHouse.animals)[0];
    const state = sellAnimal({
      state: {
        ...INITIAL_FARM,
        bumpkin: {
          ...INITIAL_FARM.bumpkin,
          equipped: {
            ...INITIAL_FARM.bumpkin.equipped,
            hat: "Acorn Hat",
          },
        },
        collectibles: {
          Igloo: [
            {
              id: "123",
              coordinates: { x: -1, y: -1 },
              createdAt: Date.now() - 100,
              readyAt: Date.now() - 100,
            },
          ],
          Hammock: [
            {
              id: "123",
              coordinates: { x: -1, y: -1 },
              createdAt: Date.now() - 100,
              readyAt: Date.now() - 100,
            },
          ],
        },
        bounties: {
          completed: [],
          requests: [
            {
              id: "123",
              items: { Timeshard: 7 },
              level: 0,
              name: "Chicken",
            },
          ],
        },
      },
      action: {
        requestId: "123",
        animalId,

        type: "animal.sold",
      },
      createdAt: new Date("2025-02-05").getTime(),
    });

    expect(state.inventory["Timeshard"]).toEqual(new Decimal(10));
  });
});
