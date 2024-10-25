import Decimal from "decimal.js-light";
import { claimProduce } from "./claimProduce";
import { INITIAL_FARM } from "features/game/lib/constants";
import { ANIMAL_SLEEP_DURATION } from "./feedAnimal";

describe("claimProduce", () => {
  const now = Date.now();

  it("claims produce from a chicken and receives an egg", () => {
    const chickenId = "xyz";

    const state = claimProduce({
      createdAt: now,
      state: {
        ...INITIAL_FARM,
        henHouse: {
          ...INITIAL_FARM.henHouse,
          animals: {
            [chickenId]: {
              coordinates: { x: 0, y: 0 },
              id: chickenId,
              type: "Chicken",
              createdAt: 0,
              state: "ready",
              experience: 60,
              asleepAt: 0,
              lovedAt: 0,
              item: "Petting Hand",
            },
          },
        },
      },
      action: {
        type: "produce.claimed",
        animal: "Chicken",
        id: chickenId,
      },
    });

    expect(state.henHouse.animals[chickenId].state).toBe("idle");
    expect(state.henHouse.animals[chickenId].experience).toBe(60);
    expect(state.inventory.Egg).toStrictEqual(new Decimal(1));
  });

  it("throws an error if animal is not in ready state", () => {
    const chickenId = "xyz";

    expect(() =>
      claimProduce({
        createdAt: now,
        state: {
          ...INITIAL_FARM,
          henHouse: {
            ...INITIAL_FARM.henHouse,
            animals: {
              [chickenId]: {
                coordinates: { x: 0, y: 0 },
                id: chickenId,
                type: "Chicken",
                createdAt: 0,
                state: "idle",
                experience: 50,
                asleepAt: 0,
                lovedAt: 0,
                item: "Petting Hand",
              },
            },
          },
        },
        action: {
          type: "produce.claimed",
          animal: "Chicken",
          id: chickenId,
        },
      }),
    ).toThrow("Animal is not ready to claim produce");
  });

  it("gives 2x eggs for chickens when Chicken Coop is placed", () => {
    const chickenId = "123";

    const newState = claimProduce({
      state: {
        ...INITIAL_FARM,
        inventory: {
          "Chicken Coop": new Decimal(1),
        },
        collectibles: {
          "Chicken Coop": [
            {
              id: "coop",
              createdAt: now,
              coordinates: { x: 0, y: 0 },
              readyAt: now - 5 * 60 * 1000,
            },
          ],
        },
        henHouse: {
          ...INITIAL_FARM.henHouse,
          animals: {
            [chickenId]: {
              coordinates: { x: 0, y: 0 },
              id: chickenId,
              type: "Chicken",
              createdAt: 0,
              state: "ready",
              experience: 60,
              asleepAt: 0,
              lovedAt: 0,
              item: "Petting Hand",
            },
          },
        },
      },
      action: { type: "produce.claimed", animal: "Chicken", id: chickenId },
      createdAt: now,
    });

    expect(newState.inventory.Egg).toEqual(new Decimal(2));
  });

  it("gives +0.1 eggs for chickens when a Rich Chicken is placed", () => {
    const chickenId = "123";

    const newState = claimProduce({
      state: {
        ...INITIAL_FARM,
        inventory: {
          "Rich Chicken": new Decimal(1),
        },
        collectibles: {
          "Rich Chicken": [
            {
              id: "rich",
              createdAt: now,
              coordinates: { x: 0, y: 0 },
              readyAt: now,
            },
          ],
        },
        henHouse: {
          ...INITIAL_FARM.henHouse,
          animals: {
            [chickenId]: {
              coordinates: { x: 0, y: 0 },
              id: chickenId,
              type: "Chicken",
              createdAt: 0,
              state: "ready",
              experience: 60,
              asleepAt: 0,
              lovedAt: 0,
              item: "Petting Hand",
            },
          },
        },
      },
      action: { type: "produce.claimed", animal: "Chicken", id: chickenId },
      createdAt: now,
    });

    expect(newState.inventory.Egg).toEqual(new Decimal(1.1));
  });

  it("gives +0.1 eggs for chickens when an Undead Rooster is placed", () => {
    const chickenId = "123";

    const newState = claimProduce({
      state: {
        ...INITIAL_FARM,
        inventory: {
          "Undead Rooster": new Decimal(1),
        },
        collectibles: {
          "Undead Rooster": [
            {
              id: "undead",
              createdAt: now,
              coordinates: { x: 0, y: 0 },
              readyAt: now,
            },
          ],
        },
        henHouse: {
          ...INITIAL_FARM.henHouse,
          animals: {
            [chickenId]: {
              coordinates: { x: 0, y: 0 },
              id: chickenId,
              type: "Chicken",
              createdAt: 0,
              state: "ready",
              experience: 60,
              asleepAt: 0,
              lovedAt: 0,
              item: "Petting Hand",
            },
          },
        },
      },
      action: { type: "produce.claimed", animal: "Chicken", id: chickenId },
      createdAt: now,
    });

    expect(newState.inventory.Egg).toEqual(new Decimal(1.1));
  });

  it("gives +0.2 eggs for chickens when an Ayam Cemani is placed", () => {
    const chickenId = "123";

    const newState = claimProduce({
      state: {
        ...INITIAL_FARM,
        inventory: {
          "Ayam Cemani": new Decimal(1),
        },
        collectibles: {
          "Ayam Cemani": [
            {
              id: "ayam",
              createdAt: now,
              coordinates: { x: 0, y: 0 },
              readyAt: now,
            },
          ],
        },
        henHouse: {
          ...INITIAL_FARM.henHouse,
          animals: {
            [chickenId]: {
              coordinates: { x: 0, y: 0 },
              id: chickenId,
              type: "Chicken",
              createdAt: 0,
              state: "ready",
              experience: 60,
              asleepAt: 0,
              lovedAt: 0,
              item: "Petting Hand",
            },
          },
        },
      },
      action: { type: "produce.claimed", animal: "Chicken", id: chickenId },
      createdAt: now,
    });

    expect(newState.inventory.Egg).toEqual(new Decimal(1.2));
  });

  it("gives +0.25 yield for all produce for chickens when a Cattlegrim is being worn", () => {
    const chickenId = "123";

    const newState = claimProduce({
      state: {
        ...INITIAL_FARM,
        bumpkin: {
          ...INITIAL_FARM.bumpkin,
          equipped: {
            ...INITIAL_FARM.bumpkin?.equipped,
            hat: "Cattlegrim",
          },
        },
        henHouse: {
          ...INITIAL_FARM.henHouse,
          animals: {
            [chickenId]: {
              coordinates: { x: 0, y: 0 },
              id: chickenId,
              type: "Chicken",
              createdAt: 0,
              state: "ready",
              experience: 120,
              asleepAt: 0,
              lovedAt: 0,
              item: "Petting Hand",
            },
          },
        },
      },
      action: { type: "produce.claimed", animal: "Chicken", id: chickenId },
      createdAt: now,
    });

    expect(newState.inventory.Egg).toEqual(new Decimal(1.25));
    expect(newState.inventory.Feather).toEqual(new Decimal(1.25));
  });

  it("gives +0.25 yield for all produce for cows when a Cattlegrim is being worn", () => {
    const cowId = "123";

    const newState = claimProduce({
      state: {
        ...INITIAL_FARM,
        bumpkin: {
          ...INITIAL_FARM.bumpkin,
          equipped: {
            ...INITIAL_FARM.bumpkin?.equipped,
            hat: "Cattlegrim",
          },
        },
        barn: {
          ...INITIAL_FARM.barn,
          animals: {
            [cowId]: {
              coordinates: { x: 0, y: 0 },
              id: cowId,
              type: "Cow",
              createdAt: 0,
              state: "ready",
              experience: 360,
              asleepAt: 0,
              lovedAt: 0,
              item: "Petting Hand",
            },
          },
        },
      },
      action: { type: "produce.claimed", animal: "Cow", id: cowId },
      createdAt: now,
    });

    expect(newState.inventory.Milk).toEqual(new Decimal(1.25));
    expect(newState.inventory.Leather).toEqual(new Decimal(1.25));
  });

  it("gives +0.25 yield for all produce for sheep when a Cattlegrim is being worn", () => {
    const sheepId = "123";

    const newState = claimProduce({
      state: {
        ...INITIAL_FARM,
        bumpkin: {
          ...INITIAL_FARM.bumpkin,
          equipped: {
            ...INITIAL_FARM.bumpkin?.equipped,
            hat: "Cattlegrim",
          },
        },
        barn: {
          ...INITIAL_FARM.barn,
          animals: {
            [sheepId]: {
              coordinates: { x: 0, y: 0 },
              id: sheepId,
              type: "Sheep",
              createdAt: 0,
              state: "ready",
              experience: 240,
              asleepAt: 0,
              lovedAt: 0,
              item: "Petting Hand",
            },
          },
        },
      },
      action: { type: "produce.claimed", animal: "Sheep", id: sheepId },
      createdAt: now,
    });

    expect(newState.inventory.Wool).toEqual(new Decimal(1.25));
    expect(newState.inventory["Merino Wool"]).toEqual(new Decimal(1.25));
  });

  it("gives +0.1 eggs for chickens when a Bale is placed", () => {
    const chickenId = "123";

    const newState = claimProduce({
      state: {
        ...INITIAL_FARM,
        inventory: {
          Bale: new Decimal(1),
        },
        collectibles: {
          Bale: [
            {
              id: "bale",
              createdAt: now,
              coordinates: { x: 0, y: 0 },
              readyAt: now,
            },
          ],
        },
        henHouse: {
          ...INITIAL_FARM.henHouse,
          animals: {
            [chickenId]: {
              coordinates: { x: 0, y: 0 },
              id: chickenId,
              type: "Chicken",
              createdAt: 0,
              state: "ready",
              experience: 120,
              asleepAt: 0,
              lovedAt: 0,
              item: "Petting Hand",
            },
          },
        },
      },
      action: { type: "produce.claimed", animal: "Chicken", id: chickenId },
      createdAt: now,
    });

    expect(newState.inventory.Egg).toEqual(new Decimal(1.1));
    expect(newState.inventory.Feather).toEqual(new Decimal(1));
  });

  it("gives +0.1 more produce for chickens when player has Barn Manager skill", () => {
    const chickenId = "123";

    const newState = claimProduce({
      state: {
        ...INITIAL_FARM,
        inventory: {
          "Barn Manager": new Decimal(1),
        },
        henHouse: {
          ...INITIAL_FARM.henHouse,
          animals: {
            [chickenId]: {
              coordinates: { x: 0, y: 0 },
              id: chickenId,
              type: "Chicken",
              createdAt: 0,
              state: "ready",
              experience: 120,
              asleepAt: 0,
              lovedAt: 0,
              item: "Petting Hand",
            },
          },
        },
      },
      action: { type: "produce.claimed", animal: "Chicken", id: chickenId },
      createdAt: now,
    });

    expect(newState.inventory.Egg).toEqual(new Decimal(1.1));
    expect(newState.inventory.Feather).toEqual(new Decimal(1.1));
  });

  it("gives +0.1 more produce for cows when player has Barn Manager skill", () => {
    const cowId = "123";

    const newState = claimProduce({
      state: {
        ...INITIAL_FARM,
        inventory: {
          "Barn Manager": new Decimal(1),
        },
        barn: {
          ...INITIAL_FARM.barn,
          animals: {
            [cowId]: {
              coordinates: { x: 0, y: 0 },
              id: cowId,
              type: "Cow",
              createdAt: 0,
              state: "ready",
              experience: 360,
              asleepAt: 0,
              lovedAt: 0,
              item: "Petting Hand",
            },
          },
        },
      },
      action: { type: "produce.claimed", animal: "Cow", id: cowId },
      createdAt: now,
    });

    expect(newState.inventory.Milk).toEqual(new Decimal(1.1));
    expect(newState.inventory.Leather).toEqual(new Decimal(1.1));
  });

  it("gives +0.1 more produce for sheep when player has Barn Manager skill", () => {
    const sheepId = "123";

    const newState = claimProduce({
      state: {
        ...INITIAL_FARM,
        inventory: {
          "Barn Manager": new Decimal(1),
        },
        barn: {
          ...INITIAL_FARM.barn,
          animals: {
            [sheepId]: {
              coordinates: { x: 0, y: 0 },
              id: sheepId,
              type: "Sheep",
              createdAt: 0,
              state: "ready",
              experience: 240,
              asleepAt: 0,
              lovedAt: 0,
              item: "Petting Hand",
            },
          },
        },
      },
      action: { type: "produce.claimed", animal: "Sheep", id: sheepId },
      createdAt: now,
    });

    expect(newState.inventory.Wool).toEqual(new Decimal(1.1));
    expect(newState.inventory["Merino Wool"]).toEqual(new Decimal(1.1));
  });

  it("stacks the Barn Manager, Rich Chicken, Chicken Coop, and Bale yield boosts for eggs", () => {
    const chickenId = "123";

    const newState = claimProduce({
      state: {
        ...INITIAL_FARM,
        inventory: {
          "Barn Manager": new Decimal(1),
          "Rich Chicken": new Decimal(1),
          "Chicken Coop": new Decimal(1),
          Bale: new Decimal(1),
        },
        collectibles: {
          "Rich Chicken": [
            {
              id: "rich",
              createdAt: now,
              coordinates: { x: 0, y: 0 },
              readyAt: now,
            },
          ],
          "Chicken Coop": [
            {
              id: "coop",
              createdAt: now,
              coordinates: { x: 0, y: 0 },
              readyAt: now,
            },
          ],
          Bale: [
            {
              id: "bale",
              createdAt: now,
              coordinates: { x: 0, y: 0 },
              readyAt: now,
            },
          ],
        },
        henHouse: {
          ...INITIAL_FARM.henHouse,
          animals: {
            [chickenId]: {
              coordinates: { x: 0, y: 0 },
              id: chickenId,
              type: "Chicken",
              createdAt: 0,
              state: "ready",
              experience: 120,
              asleepAt: 0,
              lovedAt: 0,
              item: "Petting Hand",
            },
          },
        },
      },
      action: { type: "produce.claimed", animal: "Chicken", id: chickenId },
      createdAt: now,
    });

    expect(newState.inventory.Egg).toEqual(new Decimal(2.3));
  });

  it("gives +0.1 more produce for animals when a bumpkin has the Free Range skill", () => {
    const sheepId = "123";

    const newState = claimProduce({
      state: {
        ...INITIAL_FARM,
        bumpkin: {
          ...INITIAL_FARM.bumpkin,
          skills: {
            "Free Range": 1,
          },
        },
        barn: {
          ...INITIAL_FARM.barn,
          animals: {
            [sheepId]: {
              coordinates: { x: 0, y: 0 },
              id: sheepId,
              type: "Sheep",
              createdAt: 0,
              state: "ready",
              experience: 240,
              asleepAt: 0,
              lovedAt: 0,
              item: "Petting Hand",
            },
          },
        },
      },
      action: { type: "produce.claimed", animal: "Sheep", id: sheepId },
      createdAt: now,
    });

    expect(newState.inventory.Wool).toEqual(new Decimal(1.1));
    expect(newState.inventory["Merino Wool"]).toEqual(new Decimal(1.1));
  });

  it("applies bud boosts", () => {
    const cowId = "123";

    const newState = claimProduce({
      state: {
        ...INITIAL_FARM,
        buds: {
          1: {
            aura: "No Aura",
            colour: "Red",
            ears: "No Ears",
            stem: "Egg Head",
            type: "Retreat",
            coordinates: { x: 0, y: 0 },
          },
        },
        barn: {
          ...INITIAL_FARM.barn,
          animals: {
            [cowId]: {
              coordinates: { x: 0, y: 0 },
              id: cowId,
              type: "Cow",
              createdAt: 0,
              state: "ready",
              experience: 360,
              asleepAt: 0,
              lovedAt: 0,
              item: "Petting Hand",
            },
          },
        },
      },
      action: { type: "produce.claimed", animal: "Cow", id: cowId },
      createdAt: now,
    });

    expect(newState.inventory.Milk).toEqual(new Decimal(1.2));
    expect(newState.inventory.Leather).toEqual(new Decimal(1.2));
  });

  it("reduces the sleep time by 10% if a Speed Chicken is placed and ready", () => {
    const state = claimProduce({
      createdAt: now,
      state: {
        ...INITIAL_FARM,
        inventory: {
          "Speed Chicken": new Decimal(1),
          Hay: new Decimal(1),
        },
        collectibles: {
          "Speed Chicken": [
            {
              coordinates: { x: 0, y: 0 },
              createdAt: 0,
              id: "1",
              readyAt: 0,
            },
          ],
        },
        henHouse: {
          ...INITIAL_FARM.henHouse,
          animals: {
            "0": {
              ...INITIAL_FARM.henHouse.animals["0"],
              state: "ready",
              experience: 60,
            },
          },
        },
      },
      action: {
        type: "produce.claimed",
        animal: "Chicken",
        id: "0",
      },
    });

    const boostedAsleepAt = now - ANIMAL_SLEEP_DURATION * 0.1;

    expect(state.henHouse.animals["0"].asleepAt).toEqual(boostedAsleepAt);
  });

  it("adds a time boost of -4 hours if El Pollo Veloz is placed", () => {
    const state = claimProduce({
      createdAt: now,
      state: {
        ...INITIAL_FARM,
        inventory: {
          "El Pollo Veloz": new Decimal(1),
          Hay: new Decimal(1),
        },
        collectibles: {
          "El Pollo Veloz": [
            {
              coordinates: { x: 0, y: 0 },
              createdAt: 0,
              id: "1",
              readyAt: 0,
            },
          ],
        },
        henHouse: {
          ...INITIAL_FARM.henHouse,
          animals: {
            "0": {
              ...INITIAL_FARM.henHouse.animals["0"],
              state: "ready",
              experience: 60,
            },
          },
        },
      },
      action: {
        type: "produce.claimed",
        animal: "Chicken",
        id: "0",
      },
    });

    const fourHoursInMs = 2 * 60 * 60 * 1000;
    const boostedAsleepAt = now - fourHoursInMs;

    expect(state.henHouse.animals["0"].asleepAt).toEqual(boostedAsleepAt);
  });

  it("doesn't stack the time boost of 10% if multiple Speed Chickens are placed and ready", () => {
    const state = claimProduce({
      createdAt: now,
      state: {
        ...INITIAL_FARM,
        inventory: {
          "Speed Chicken": new Decimal(1),
          Hay: new Decimal(1),
        },
        collectibles: {
          "Speed Chicken": [
            {
              coordinates: { x: 0, y: 0 },
              createdAt: 0,
              id: "1",
              readyAt: 0,
            },
            {
              coordinates: { x: 1, y: 0 },
              createdAt: 0,
              id: "2",
              readyAt: 0,
            },
          ],
        },
        henHouse: {
          ...INITIAL_FARM.henHouse,
          animals: {
            "0": {
              ...INITIAL_FARM.henHouse.animals["0"],
              state: "ready",
              experience: 60,
            },
          },
        },
      },
      action: {
        type: "produce.claimed",
        animal: "Chicken",
        id: "0",
      },
    });

    const boostedAsleepAt = now - ANIMAL_SLEEP_DURATION * 0.1;

    expect(state.henHouse.animals["0"].asleepAt).toEqual(boostedAsleepAt);
  });

  it("reduces the sleep time by 10% for a chicken if player has Wrangler skill", () => {
    const state = claimProduce({
      createdAt: now,
      state: {
        ...INITIAL_FARM,
        inventory: {
          Wrangler: new Decimal(1),
        },
        henHouse: {
          ...INITIAL_FARM.henHouse,
          animals: {
            "0": {
              ...INITIAL_FARM.henHouse.animals["0"],
              state: "ready",
              experience: 60,
            },
          },
        },
      },
      action: {
        type: "produce.claimed",
        animal: "Chicken",
        id: "0",
      },
    });

    const boostedAsleepAt = now - ANIMAL_SLEEP_DURATION * 0.1;

    expect(state.henHouse.animals["0"].asleepAt).toEqual(boostedAsleepAt);
  });

  it("reduces the sleep time by 10% for a Cow if player has Wrangler skill", () => {
    const state = claimProduce({
      createdAt: now,
      state: {
        ...INITIAL_FARM,
        inventory: {
          Wrangler: new Decimal(1),
        },
        barn: {
          ...INITIAL_FARM.barn,
          animals: {
            "0": {
              ...INITIAL_FARM.barn.animals["0"],
              state: "ready",
              experience: 60,
            },
          },
        },
      },
      action: {
        type: "produce.claimed",
        animal: "Cow",
        id: "0",
      },
    });

    const boostedAsleepAt = now - ANIMAL_SLEEP_DURATION * 0.1;

    expect(state.barn.animals["0"].asleepAt).toEqual(boostedAsleepAt);
  });

  it("stacks the Wrangler and Speed Chicken speed boosts", () => {
    const state = claimProduce({
      createdAt: now,
      state: {
        ...INITIAL_FARM,
        inventory: {
          Wrangler: new Decimal(1),
          "Speed Chicken": new Decimal(1),
        },
        collectibles: {
          "Speed Chicken": [
            {
              coordinates: { x: 0, y: 0 },
              createdAt: 0,
              id: "1",
              readyAt: 0,
            },
          ],
        },
        henHouse: {
          ...INITIAL_FARM.henHouse,
          animals: {
            "0": {
              ...INITIAL_FARM.henHouse.animals["0"],
              state: "ready",
              experience: 60,
            },
          },
        },
      },
      action: {
        type: "produce.claimed",
        animal: "Chicken",
        id: "0",
      },
    });

    const boostedAsleepAt = now - ANIMAL_SLEEP_DURATION * 0.2;

    expect(state.henHouse.animals["0"].asleepAt).toEqual(boostedAsleepAt);
  });

  it("adds a time boost of 10% if a Stable Hand skill is present", () => {
    const state = claimProduce({
      createdAt: now,
      state: {
        ...INITIAL_FARM,
        bumpkin: {
          ...INITIAL_FARM.bumpkin,
          skills: {
            "Stable Hand": 1,
          },
        },
        barn: {
          ...INITIAL_FARM.barn,
          animals: {
            "0": {
              ...INITIAL_FARM.barn.animals["0"],
              state: "ready",
              experience: 60,
            },
          },
        },
      },
      action: {
        type: "produce.claimed",
        animal: "Cow",
        id: "0",
      },
    });

    const boostedAsleepAt = now - ANIMAL_SLEEP_DURATION * 0.1;

    expect(state.barn.animals["0"].asleepAt).toEqual(boostedAsleepAt);
  });
});
