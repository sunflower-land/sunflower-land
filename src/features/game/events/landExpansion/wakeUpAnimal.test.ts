import { INITIAL_FARM } from "features/game/lib/constants";
import { getAnimalToy, wakeAnimal } from "./wakeUpAnimal";
import Decimal from "decimal.js-light";
import { getAnimalReadyAt } from "features/game/lib/animals";
import type { Animal } from "features/game/types/game";

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
    // Stays on the speed-rate model: the 1s it slept is its whole sleep.
    expect(state.henHouse.animals["1"].baseDurationMs).toEqual(1000);
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
  it("keeps the animal on the speed-rate model and wakes it at exactly this instant", () => {
    const now = Date.now();
    const state = wakeAnimal({
      state: {
        ...INITIAL_FARM,
        inventory: { ...INITIAL_FARM.inventory, Doll: new Decimal(1) },
        collectibles: {
          "Bantam Shrine": [
            {
              id: "bantam",
              createdAt: now,
              readyAt: now,
              coordinates: { x: 0, y: 0 },
            },
          ],
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
              asleepAt: now,
              awakeAt: now + 24 * 60 * 60 * 1000,
              baseDurationMs: 24 * 60 * 60 * 1000,
              lovedAt: 0,
              item: "Petting Hand",
            },
          },
        },
      },
      action: { type: "animal.wakeUp", animal: "Chicken", id: "1" },
      createdAt: now,
    });

    const animal = state.henHouse.animals["1"];
    // The marker becomes the work done so far (none: it fell asleep just now),
    // so the shrine windows can't re-derive a future wake time.
    expect(animal.baseDurationMs).toEqual(0);
    expect(animal.awakeAt).toEqual(now);
    expect(getAnimalReadyAt(animal, state)).toEqual(now);
  });
});

/**
 * Chicken thresholds: L10 1440, L11 1680, L15 2720. A banked Chicken is
 * woken at the level its next claim pays, not its XP level.
 */
describe("wakeAnimal: banked claims", () => {
  const now = Date.now();
  // Claimed to L10 (1440) with 2800 XP (L15): next claim pays L11
  const banked: Animal = {
    id: "1",
    type: "Chicken",
    createdAt: 0,
    state: "ready",
    experience: 2800,
    claimedExperience: 1440,
    asleepAt: now - 1000,
    awakeAt: now + 60_000,
    lovedAt: 0,
    item: "Petting Hand",
  };

  it("picks the toy for the level the next claim pays", () => {
    // XP level 15 would ask for a Gilded Doll; level 11 asks for a Wooly Doll
    expect(getAnimalToy({ animal: banked })).toEqual("Wooly Doll");
  });

  it("wakes a banked animal whose XP is at the max level", () => {
    const state = wakeAnimal({
      createdAt: now,
      state: {
        ...INITIAL_FARM,
        inventory: { "Wooly Doll": new Decimal(1) },
        henHouse: { ...INITIAL_FARM.henHouse, animals: { "1": banked } },
      },
      action: { type: "animal.wakeUp", animal: "Chicken", id: "1" },
    });

    expect(state.inventory["Wooly Doll"]).toEqual(new Decimal(0));
    expect(getAnimalReadyAt(state.henHouse.animals["1"], state)).toEqual(now);
    expect(state.henHouse.animals["1"].state).toEqual("ready");
  });
});
