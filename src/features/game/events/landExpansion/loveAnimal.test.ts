import { INITIAL_FARM } from "features/game/lib/constants";
import { loveAnimal } from "./loveAnimal";
import Decimal from "decimal.js-light";
import { ANIMAL_SLEEP_DURATION } from "./feedAnimal";

describe("loveAnimal", () => {
  const now = Date.now();

  it("throws if the animal is not sleeping", () => {
    expect(() =>
      loveAnimal({
        state: {
          ...INITIAL_FARM,
          barn: {
            level: 1,
            animals: {
              "1": {
                id: "1",
                type: "Cow",
                asleepAt: 0,
                awakeAt: 0,
                lovedAt: 0,
                coordinates: { x: 0, y: 0 },
                createdAt: 0,
                experience: 0,
                state: "idle",
                item: "Petting Hand",
              },
            },
          },
        },
        action: {
          type: "animal.loved",
          animal: "Cow",
          id: "1",
          item: "Petting Hand",
        },
        createdAt: now,
      }),
    ).toThrow("The animal is not sleeping");
  });

  it("throws if the animal has not been sleeping for more than 8 hours", () => {
    expect(() =>
      loveAnimal({
        state: {
          ...INITIAL_FARM,
          barn: {
            level: 1,
            animals: {
              "1": {
                id: "1",
                type: "Cow",
                asleepAt: now - 1,
                awakeAt: now - 1 + ANIMAL_SLEEP_DURATION,
                lovedAt: now - 1,
                coordinates: { x: 0, y: 0 },
                createdAt: 0,
                experience: 0,
                state: "idle",
                item: "Petting Hand",
              },
            },
          },
        },
        action: {
          type: "animal.loved",
          animal: "Cow",
          id: "1",
          item: "Petting Hand",
        },
        createdAt: now,
      }),
    ).toThrow("The animal has not been sleeping for more than 8 hours");
  });

  it("throws if the animal was loved less than 8 hours ago", () => {
    expect(() =>
      loveAnimal({
        state: {
          ...INITIAL_FARM,
          barn: {
            level: 1,
            animals: {
              "1": {
                id: "1",
                type: "Cow",
                asleepAt: now - 17 * 60 * 60 * 1000,
                awakeAt: now - 17 * 60 * 60 * 1000 + ANIMAL_SLEEP_DURATION,
                lovedAt: now - 7 * 60 * 60 * 1000,
                coordinates: { x: 0, y: 0 },
                createdAt: 0,
                experience: 0,
                state: "idle",
                item: "Petting Hand",
              },
            },
          },
        },
        action: {
          type: "animal.loved",
          animal: "Cow",
          id: "1",
          item: "Petting Hand",
        },
        createdAt: now,
      }),
    ).toThrow("The animal was loved in the last 8 hours");
  });

  it("requires the correct item", () => {
    expect(() =>
      loveAnimal({
        state: {
          ...INITIAL_FARM,
          inventory: {
            "Petting Hand": new Decimal(1),
          },
          barn: {
            level: 1,
            animals: {
              "1": {
                id: "1",
                type: "Cow",
                asleepAt: now - 17 * 60 * 60 * 1000,
                awakeAt: now - 17 * 60 * 60 * 1000 + ANIMAL_SLEEP_DURATION,
                lovedAt: now - 17 * 60 * 60 * 1000,
                coordinates: { x: 0, y: 0 },
                createdAt: 0,
                experience: 0,
                state: "idle",
                item: "Brush",
              },
            },
          },
        },
        action: {
          type: "animal.loved",
          animal: "Cow",
          id: "1",
          item: "Petting Hand",
        },
        createdAt: now,
      }),
    ).toThrow("Petting Hand is the wrong item");
  });

  it("throws if the player does not have the item", () => {
    expect(() =>
      loveAnimal({
        state: {
          ...INITIAL_FARM,
          inventory: {},
          barn: {
            level: 1,
            animals: {
              "1": {
                id: "1",
                type: "Cow",
                asleepAt: now - 17 * 60 * 60 * 1000,
                awakeAt: now - 17 * 60 * 60 * 1000 + ANIMAL_SLEEP_DURATION,
                lovedAt: now - 17 * 60 * 60 * 1000,
                coordinates: { x: 0, y: 0 },
                createdAt: 0,
                experience: 0,
                state: "idle",
                item: "Petting Hand",
              },
            },
          },
        },
        action: {
          type: "animal.loved",
          animal: "Cow",
          id: "1",
          item: "Petting Hand",
        },
        createdAt: now,
      }),
    ).toThrow("Missing item, Petting Hand");
  });

  it("pets the animal", () => {
    const state = loveAnimal({
      state: {
        ...INITIAL_FARM,
        inventory: {
          "Petting Hand": new Decimal(1),
        },
        barn: {
          level: 1,
          animals: {
            "1": {
              id: "1",
              type: "Cow",
              asleepAt: now - 9 * 60 * 60 * 1000,
              awakeAt: now - 9 * 60 * 60 * 1000 + ANIMAL_SLEEP_DURATION,
              lovedAt: now - 17 * 60 * 60 * 1000,
              coordinates: { x: 0, y: 0 },
              createdAt: 0,
              experience: 0,
              state: "idle",
              item: "Petting Hand",
            },
          },
        },
      },
      action: {
        type: "animal.loved",
        animal: "Cow",
        id: "1",
        item: "Petting Hand",
      },
      createdAt: now,
    });

    expect(state.barn.animals["1"].experience).toBe(25);
  });

  it("sets the lovedAt timestamp", () => {
    const state = loveAnimal({
      state: {
        ...INITIAL_FARM,
        inventory: {
          "Petting Hand": new Decimal(1),
        },
        barn: {
          level: 1,
          animals: {
            "1": {
              id: "1",
              type: "Cow",
              asleepAt: now - 9 * 60 * 60 * 1000,
              awakeAt: now - 9 * 60 * 60 * 1000 + ANIMAL_SLEEP_DURATION,
              lovedAt: now - 17 * 60 * 60 * 1000,
              coordinates: { x: 0, y: 0 },
              createdAt: 0,
              experience: 0,
              state: "idle",
              item: "Petting Hand",
            },
          },
        },
      },
      action: {
        type: "animal.loved",
        animal: "Cow",
        id: "1",
        item: "Petting Hand",
      },
      createdAt: now,
    });

    expect(state.barn.animals["1"].lovedAt).toBe(now);
  });

  it("selects a new item for affection", () => {
    const state = loveAnimal({
      state: {
        ...INITIAL_FARM,
        inventory: {
          "Petting Hand": new Decimal(1),
          Brush: new Decimal(1),
          "Music Box": new Decimal(1),
        },
        barn: {
          level: 1,
          animals: {
            "1": {
              id: "1",
              type: "Cow",
              asleepAt: now - 9 * 60 * 60 * 1000,
              awakeAt: now - 9 * 60 * 60 * 1000 + ANIMAL_SLEEP_DURATION,
              lovedAt: 0,
              coordinates: { x: 0, y: 0 },
              createdAt: 0,
              experience: 200,
              state: "idle",
              item: "Music Box",
            },
          },
        },
      },
      action: {
        type: "animal.loved",
        animal: "Cow",
        id: "1",
        item: "Music Box",
      },
      createdAt: now,
    });

    expect(state.barn.animals["1"].item).toBe("Petting Hand");
  });
});
