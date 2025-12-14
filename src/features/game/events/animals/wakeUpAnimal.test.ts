import { INITIAL_FARM } from "features/game/lib/constants";
import { wakeAnimal } from "./wakeUpAnimal";
import Decimal from "decimal.js-light";

describe("wakeAnimal", () => {
  it("requires animal exists", () => {
    expect(() =>
      wakeAnimal({
        state: {
          ...INITIAL_FARM,

          henHouse: {
            ...INITIAL_FARM.henHouse,
            animals: {
              ["1"]: {
                id: "1",
                type: "Chicken",
                createdAt: 0,
                state: "idle",
                experience: 0,
                asleepAt: Date.now() - 1000,
                awakeAt: Date.now() + 1000,
                lovedAt: 0,
                item: "Petting Hand",
              },
            },
          },
        },
        action: {
          type: "animal.wakeUp",
          animal: "Chicken",
          id: "2",
        },
      }),
    ).toThrow("Animal 2 not found in building henHouse");
  });

  it("requires animal is asleep", () => {
    expect(() =>
      wakeAnimal({
        state: {
          ...INITIAL_FARM,

          henHouse: {
            ...INITIAL_FARM.henHouse,
            animals: {
              ["1"]: {
                id: "1",
                type: "Chicken",
                createdAt: 0,
                state: "idle",
                experience: 0,
                asleepAt: 0,
                awakeAt: 0,
                lovedAt: 0,
                item: "Petting Hand",
              },
            },
          },
        },
        action: {
          type: "animal.wakeUp",
          animal: "Chicken",
          id: "1",
        },
      }),
    ).toThrow("Animal not asleep");
  });

  it("requires player has a doll", () => {
    const now = Date.now();

    expect(() =>
      wakeAnimal({
        state: {
          ...INITIAL_FARM,

          henHouse: {
            ...INITIAL_FARM.henHouse,
            animals: {
              ["1"]: {
                id: "1",
                type: "Chicken",
                createdAt: 0,
                state: "idle",
                experience: 0,
                asleepAt: now - 1000,
                awakeAt: now + 1000,
                lovedAt: 0,
                item: "Petting Hand",
              },
            },
          },
        },
        action: {
          type: "animal.wakeUp",
          animal: "Chicken",
          id: "1",
        },
        createdAt: now,
      }),
    ).toThrow("Player does not have a doll");
  });

  it("wakes up a lvl 1 chicken", () => {
    const now = Date.now();

    const state = wakeAnimal({
      state: {
        ...INITIAL_FARM,

        inventory: {
          ...INITIAL_FARM.inventory,
          Doll: new Decimal(2),
        },

        henHouse: {
          ...INITIAL_FARM.henHouse,
          animals: {
            ["1"]: {
              id: "1",
              type: "Chicken",
              createdAt: 0,
              state: "idle",
              experience: 0,
              asleepAt: now - 1000,
              awakeAt: now + 1000,
              lovedAt: 0,
              item: "Petting Hand",
            },
          },
        },
      },
      action: {
        type: "animal.wakeUp",
        animal: "Chicken",
        id: "1",
      },
      createdAt: now,
    });

    expect(state.henHouse.animals["1"].awakeAt).toEqual(now);
    expect(state.inventory.Doll).toEqual(new Decimal(1));
  });

  it("wakes up a lvl 1 cow", () => {
    const now = Date.now();

    const state = wakeAnimal({
      state: {
        ...INITIAL_FARM,

        inventory: {
          ...INITIAL_FARM.inventory,
          "Cluck Doll": new Decimal(2),
        },

        barn: {
          ...INITIAL_FARM.barn,
          animals: {
            ["1"]: {
              id: "1",
              type: "Cow",
              createdAt: 0,
              state: "idle",
              experience: 0,
              asleepAt: now - 1000,
              awakeAt: now + 1000,
              lovedAt: 0,
              item: "Petting Hand",
            },
          },
        },
      },
      action: {
        type: "animal.wakeUp",
        animal: "Cow",
        id: "1",
      },
      createdAt: now,
    });

    expect(state.barn.animals["1"].awakeAt).toEqual(now);
    expect(state.inventory["Cluck Doll"]).toEqual(new Decimal(1));
  });

  it("wakes up a lvl 1 sheep", () => {
    const now = Date.now();

    const state = wakeAnimal({
      state: {
        ...INITIAL_FARM,

        inventory: {
          ...INITIAL_FARM.inventory,
          "Lumber Doll": new Decimal(2),
        },

        barn: {
          ...INITIAL_FARM.barn,
          animals: {
            ["1"]: {
              id: "1",
              type: "Sheep",
              createdAt: 0,
              state: "idle",
              experience: 0,
              asleepAt: now - 1000,
              awakeAt: now + 1000,
              lovedAt: 0,
              item: "Petting Hand",
            },
          },
        },
      },
      action: {
        type: "animal.wakeUp",
        animal: "Sheep",
        id: "1",
      },
      createdAt: now,
    });

    expect(state.barn.animals["1"].awakeAt).toEqual(now);
    expect(state.inventory["Lumber Doll"]).toEqual(new Decimal(1));
  });

  it("wakes up a high level sheep", () => {
    const now = Date.now();

    const state = wakeAnimal({
      state: {
        ...INITIAL_FARM,

        inventory: {
          ...INITIAL_FARM.inventory,
          "Moo Doll": new Decimal(2),
        },

        barn: {
          ...INITIAL_FARM.barn,
          animals: {
            ["1"]: {
              id: "1",
              type: "Sheep",
              createdAt: 0,
              state: "idle",
              experience: 5000,
              asleepAt: now - 1000,
              awakeAt: now + 1000,
              lovedAt: 0,
              item: "Petting Hand",
            },
          },
        },
      },
      action: {
        type: "animal.wakeUp",
        animal: "Sheep",
        id: "1",
      },
      createdAt: now,
    });

    expect(state.barn.animals["1"].awakeAt).toEqual(now);
    expect(state.inventory["Moo Doll"]).toEqual(new Decimal(1));
  });

  it("removes only 1 item if it's placed", () => {
    const now = Date.now();

    const state = wakeAnimal({
      state: {
        ...INITIAL_FARM,

        inventory: {
          ...INITIAL_FARM.inventory,
          "Moo Doll": new Decimal(2),
        },
        collectibles: {
          "Moo Doll": [
            {
              id: "1253",
              readyAt: 0,
              createdAt: 0,
              coordinates: {
                x: 0,
                y: 0,
              },
            },
          ],
        },
        barn: {
          ...INITIAL_FARM.barn,
          animals: {
            ["1"]: {
              id: "1",
              type: "Sheep",
              createdAt: 0,
              state: "idle",
              experience: 5000,
              asleepAt: now - 1000,
              awakeAt: now + 1000,
              lovedAt: 0,
              item: "Petting Hand",
            },
          },
        },
      },
      action: {
        type: "animal.wakeUp",
        animal: "Sheep",
        id: "1",
      },
      createdAt: now,
    });

    expect(state.barn.animals["1"].awakeAt).toEqual(now);
    expect(state.inventory["Moo Doll"]).toEqual(new Decimal(1));
  });
});
