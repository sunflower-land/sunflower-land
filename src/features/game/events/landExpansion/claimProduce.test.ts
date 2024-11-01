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
        inventory: {
          Egg: new Decimal(1),
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
              awakeAt: 0,
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
    expect(state.inventory.Egg).toStrictEqual(new Decimal(2));
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
                awakeAt: 0,
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
              awakeAt: 0,
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
              awakeAt: 0,
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
              awakeAt: 0,
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
              awakeAt: 0,
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
              awakeAt: 0,
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
              awakeAt: 0,
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

  it("gives +0.5 yield for Milk for cows when a Milk Apron is being worn", () => {
    const cowId = "123";

    const newState = claimProduce({
      state: {
        ...INITIAL_FARM,
        bumpkin: {
          ...INITIAL_FARM.bumpkin,
          equipped: {
            ...INITIAL_FARM.bumpkin?.equipped,
            coat: "Milk Apron",
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
              awakeAt: 0,
              lovedAt: 0,
              item: "Petting Hand",
            },
          },
        },
      },
      action: { type: "produce.claimed", animal: "Cow", id: cowId },
      createdAt: now,
    });

    expect(newState.inventory.Milk).toEqual(new Decimal(1.5));
    expect(newState.inventory.Leather).toEqual(new Decimal(1));
  });

  it("gives +2 yield for Milk for cows when a Cowbell Necklace is being worn", () => {
    const cowId = "123";

    const newState = claimProduce({
      state: {
        ...INITIAL_FARM,
        bumpkin: {
          ...INITIAL_FARM.bumpkin,
          equipped: {
            ...INITIAL_FARM.bumpkin?.equipped,
            necklace: "Cowbell Necklace",
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
              awakeAt: 0,
              lovedAt: 0,
              item: "Petting Hand",
            },
          },
        },
      },
      action: { type: "produce.claimed", animal: "Cow", id: cowId },
      createdAt: now,
    });

    expect(newState.inventory.Milk).toEqual(new Decimal(3));
    expect(newState.inventory.Leather).toEqual(new Decimal(1));
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
              awakeAt: 0,
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
              awakeAt: 0,
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

  it("gives +1 Feather for chickens when Chicken Suit is worn", () => {
    const chickenId = "123";

    const newState = claimProduce({
      state: {
        ...INITIAL_FARM,
        inventory: {},
        bumpkin: {
          ...INITIAL_FARM.bumpkin,
          equipped: {
            ...INITIAL_FARM.bumpkin?.equipped,
            suit: "Chicken Suit",
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
              awakeAt: 0,
            },
          },
        },
      },
      action: { type: "produce.claimed", animal: "Chicken", id: chickenId },
      createdAt: now,
    });

    expect(newState.inventory.Feather).toEqual(new Decimal(2));
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
              awakeAt: 0,
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
              awakeAt: 0,
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
              awakeAt: 0,
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

  it("gives +0.25 Leather for cows when player has Moo-ver placed", () => {
    const cowId = "123";

    const newState = claimProduce({
      state: {
        ...INITIAL_FARM,
        inventory: {},
        collectibles: {
          "Moo-ver": [
            {
              id: "rich",
              createdAt: now,
              coordinates: { x: 0, y: 0 },
              readyAt: now,
            },
          ],
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
              awakeAt: 0,
            },
          },
        },
      },
      action: { type: "produce.claimed", animal: "Cow", id: cowId },
      createdAt: now,
    });

    expect(newState.inventory.Leather).toEqual(new Decimal(1.25));
  });

  it("gives +2 Wool for sheeps when Black Sheep Onesie is worn", () => {
    const sheepID = "123";

    const newState = claimProduce({
      state: {
        ...INITIAL_FARM,
        inventory: {},
        bumpkin: {
          ...INITIAL_FARM.bumpkin,
          equipped: {
            ...INITIAL_FARM.bumpkin?.equipped,
            onesie: "Black Sheep Onesie",
          },
        },
        barn: {
          ...INITIAL_FARM.barn,
          animals: {
            [sheepID]: {
              coordinates: { x: 0, y: 0 },
              id: sheepID,
              type: "Sheep",
              createdAt: 0,
              state: "ready",
              experience: 360,
              asleepAt: 0,
              lovedAt: 0,
              item: "Petting Hand",
              awakeAt: 0,
            },
          },
        },
      },
      action: { type: "produce.claimed", animal: "Sheep", id: sheepID },
      createdAt: now,
    });

    expect(newState.inventory["Wool"]).toEqual(new Decimal(3));
  });

  it("gives +1 Merino Wool for sheeps when Merino Jumper is worn", () => {
    const sheepID = "123";

    const newState = claimProduce({
      state: {
        ...INITIAL_FARM,
        inventory: {},
        bumpkin: {
          ...INITIAL_FARM.bumpkin,
          equipped: {
            ...INITIAL_FARM.bumpkin?.equipped,
            shirt: "Merino Jumper",
          },
        },
        barn: {
          ...INITIAL_FARM.barn,
          animals: {
            [sheepID]: {
              coordinates: { x: 0, y: 0 },
              id: sheepID,
              type: "Sheep",
              createdAt: 0,
              state: "ready",
              experience: 360,
              asleepAt: 0,
              lovedAt: 0,
              item: "Petting Hand",
              awakeAt: 0,
            },
          },
        },
      },
      action: { type: "produce.claimed", animal: "Sheep", id: sheepID },
      createdAt: now,
    });

    expect(newState.inventory["Merino Wool"]).toEqual(new Decimal(2));
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
              awakeAt: 0,
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
              awakeAt: 0,
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
              awakeAt: 0,
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

    const boostedAwakeAt = now + ANIMAL_SLEEP_DURATION * 0.9;

    expect(state.henHouse.animals["0"].awakeAt).toEqual(boostedAwakeAt);
  });

  it("adds a time boost of -2 hours if El Pollo Veloz is placed", () => {
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

    const twoHoursInMs = 2 * 60 * 60 * 1000;
    const boostedAwakeAt = now + ANIMAL_SLEEP_DURATION - twoHoursInMs;

    expect(state.henHouse.animals["0"].awakeAt).toEqual(boostedAwakeAt);
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

    const boostedAwakeAt = now + ANIMAL_SLEEP_DURATION * 0.9;

    expect(state.henHouse.animals["0"].awakeAt).toEqual(boostedAwakeAt);
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

    const boostedAwakeAt = now + ANIMAL_SLEEP_DURATION * 0.9;

    expect(state.henHouse.animals["0"].awakeAt).toEqual(boostedAwakeAt);
  });

  it("reduces the sleep time by 20% if Dream Scarf is worn and ready", () => {
    const state = claimProduce({
      createdAt: now,
      state: {
        ...INITIAL_FARM,
        bumpkin: {
          ...INITIAL_FARM.bumpkin,
          equipped: {
            ...INITIAL_FARM.bumpkin?.equipped,
            necklace: "Dream Scarf",
          },
        },
        barn: {
          ...INITIAL_FARM.barn,
          animals: {
            "0": {
              ...INITIAL_FARM.barn.animals["0"],
              state: "ready",
              type: "Sheep",
              experience: 60,
            },
          },
        },
      },
      action: {
        type: "produce.claimed",
        animal: "Sheep",
        id: "0",
      },
    });

    const boostedAwakeAt = now + ANIMAL_SLEEP_DURATION * 0.8;

    expect(state.barn.animals["0"].awakeAt).toEqual(boostedAwakeAt);
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
              type: "Cow",
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

    const boostedAwakeAt = now + ANIMAL_SLEEP_DURATION * 0.9;

    expect(state.barn.animals["0"].awakeAt).toEqual(boostedAwakeAt);
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

    // 0.9 * 0.9 = 0.81 (stacking multiplicatively)
    const boostedAwakeAt = now + ANIMAL_SLEEP_DURATION * 0.81;

    expect(state.henHouse.animals["0"].awakeAt).toBeCloseTo(boostedAwakeAt);
  });

  it("stacks all possible speed boosts for chickens", () => {
    const state = claimProduce({
      createdAt: now,
      state: {
        ...INITIAL_FARM,
        inventory: {
          Wrangler: new Decimal(1),
          "Speed Chicken": new Decimal(1),
          "El Pollo Veloz": new Decimal(1),
        },
        bumpkin: {
          ...INITIAL_FARM.bumpkin,
          skills: {
            "Stable Hand": 1,
          },
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

    const twoHoursInMs = 2 * 60 * 60 * 1000;
    // First subtract 2 hours, then apply percentage reductions
    const afterFixedReduction = ANIMAL_SLEEP_DURATION - twoHoursInMs;
    const finalDuration = afterFixedReduction * 0.9 * 0.9 * 0.9; // Apply all 10% reductions
    const boostedAwakeAt = now + finalDuration;

    expect(state.henHouse.animals["0"].awakeAt).toBeCloseTo(boostedAwakeAt);
  });

  it("stacks all possible speed boosts for sheep", () => {
    const state = claimProduce({
      createdAt: now,
      state: {
        ...INITIAL_FARM,
        inventory: {
          Wrangler: new Decimal(1),
        },
        bumpkin: {
          ...INITIAL_FARM.bumpkin,
          skills: {
            "Stable Hand": 1,
          },
          equipped: {
            ...INITIAL_FARM.bumpkin?.equipped,
            necklace: "Dream Scarf",
          },
        },
        barn: {
          ...INITIAL_FARM.barn,
          animals: {
            "0": {
              ...INITIAL_FARM.barn.animals["0"],
              type: "Sheep",
              state: "ready",
              experience: 60,
            },
          },
        },
      },
      action: {
        type: "produce.claimed",
        animal: "Sheep",
        id: "0",
      },
    });

    // 0.9 (Wrangler) * 0.9 (Stable Hand) * 0.8 (Dream Scarf) = 0.648
    const boostedAwakeAt = now + ANIMAL_SLEEP_DURATION * 0.648;

    expect(state.barn.animals["0"].awakeAt).toEqual(boostedAwakeAt);
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

    const boostedAwakeAt = now + ANIMAL_SLEEP_DURATION * 0.9;

    expect(state.barn.animals["0"].awakeAt).toEqual(boostedAwakeAt);
  });

  it("applies the multiplier on all produce when a critical drop is hit with Buckaroo skill", () => {
    const state = claimProduce({
      createdAt: now,
      state: {
        ...INITIAL_FARM,
        bumpkin: {
          ...INITIAL_FARM.bumpkin,
          skills: {
            Buckaroo: 1,
          },
        },
        barn: {
          ...INITIAL_FARM.barn,
          animals: {
            "0": {
              ...INITIAL_FARM.barn.animals["0"],
              state: "ready",
              experience: 360,
              multiplier: 2,
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

    expect(state.inventory.Milk).toEqual(new Decimal(2));
    expect(state.inventory.Leather).toEqual(new Decimal(2));
  });

  it("tracks the bumpkin activity when a resource is collected", () => {
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
              awakeAt: 0,
            },
          },
        },
      },
      action: { type: "produce.claimed", animal: "Chicken", id: chickenId },
      createdAt: now,
    });

    expect(newState.bumpkin.activity["Egg Collected"]).toEqual(1);
    expect(newState.bumpkin.activity["Feather Collected"]).toEqual(1);
  });

  it("correctly applies El Pollo Veloz 2-hour reduction with percentage boosts", () => {
    const state = claimProduce({
      createdAt: now,
      state: {
        ...INITIAL_FARM,
        inventory: {
          "El Pollo Veloz": new Decimal(1),
          Wrangler: new Decimal(1),
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

    const twoHoursInMs = 2 * 60 * 60 * 1000;
    // First subtract 2 hours, then apply 10% reduction
    const reducedDuration = (ANIMAL_SLEEP_DURATION - twoHoursInMs) * 0.9;
    const boostedAwakeAt = now + reducedDuration;

    expect(state.henHouse.animals["0"].awakeAt).toEqual(boostedAwakeAt);
  });

  it("reduces the sleep time by 25% if a Farm Dog is placed and ready", () => {
    const state = claimProduce({
      createdAt: now,
      state: {
        ...INITIAL_FARM,
        inventory: {
          "Farm Dog": new Decimal(1),
        },
        collectibles: {
          "Farm Dog": [
            {
              coordinates: { x: 0, y: 0 },
              createdAt: 0,
              id: "1",
              readyAt: 0,
            },
          ],
        },
        barn: {
          ...INITIAL_FARM.barn,
          animals: {
            "0": {
              ...INITIAL_FARM.barn.animals["0"],
              state: "ready",
              type: "Sheep",
              experience: 60,
            },
          },
        },
      },
      action: {
        type: "produce.claimed",
        animal: "Sheep",
        id: "0",
      },
    });

    const boostedAwakeAt = now + ANIMAL_SLEEP_DURATION * 0.75;

    expect(state.barn.animals["0"].awakeAt).toEqual(boostedAwakeAt);
  });

  it("stacks Farm Dog boost with other speed boosts for sheep", () => {
    const state = claimProduce({
      createdAt: now,
      state: {
        ...INITIAL_FARM,
        inventory: {
          "Farm Dog": new Decimal(1),
          Wrangler: new Decimal(1),
        },
        bumpkin: {
          ...INITIAL_FARM.bumpkin,
          skills: {
            "Stable Hand": 1,
          },
        },
        collectibles: {
          "Farm Dog": [
            {
              coordinates: { x: 0, y: 0 },
              createdAt: 0,
              id: "1",
              readyAt: 0,
            },
          ],
        },
        barn: {
          ...INITIAL_FARM.barn,
          animals: {
            "0": {
              ...INITIAL_FARM.barn.animals["0"],
              state: "ready",
              type: "Sheep",
              experience: 60,
            },
          },
        },
      },
      action: {
        type: "produce.claimed",
        animal: "Sheep",
        id: "0",
      },
    });

    // 0.75 (Farm Dog) * 0.9 (Wrangler) * 0.9 (Stable Hand) = 0.6075
    const boostedAwakeAt = now + ANIMAL_SLEEP_DURATION * 0.6075;

    expect(state.barn.animals["0"].awakeAt).toBeCloseTo(boostedAwakeAt);
  });

  it("gives +0.25 more produce for sheep when player has White Sheep Onesie wearable equipped", () => {
    const sheepId = "123";

    const newState = claimProduce({
      state: {
        ...INITIAL_FARM,
        bumpkin: {
          ...INITIAL_FARM.bumpkin,
          equipped: {
            ...INITIAL_FARM.bumpkin?.equipped,
            onesie: "White Sheep Onesie",
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
              awakeAt: 0,
            },
          },
        },
      },
      action: { type: "produce.claimed", animal: "Sheep", id: sheepId },
      createdAt: now,
    });

    expect(newState.inventory.Wool).toEqual(new Decimal(1.25));
    expect(newState.inventory["Merino Wool"]).toEqual(new Decimal(1));
  });

  it("gives 0.1 more feathers when an Alien Chicken is placed", () => {
    const state = claimProduce({
      createdAt: now,
      state: {
        ...INITIAL_FARM,
        inventory: {
          "Alien Chicken": new Decimal(1),
        },
        collectibles: {
          "Alien Chicken": [
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
              experience: 120,
            },
          },
        },
      },
      action: { type: "produce.claimed", animal: "Chicken", id: "0" },
    });

    expect(state.inventory.Feather).toEqual(new Decimal(1.1));
  });

  it("gives 0.1 more merino wool when a Toxic Tuft is placed", () => {
    const state = claimProduce({
      createdAt: now,
      state: {
        ...INITIAL_FARM,
        inventory: {
          "Toxic Tuft": new Decimal(1),
        },
        collectibles: {
          "Toxic Tuft": [
            {
              coordinates: { x: 0, y: 0 },
              createdAt: 0,
              id: "1",
              readyAt: 0,
            },
          ],
        },
        barn: {
          ...INITIAL_FARM.barn,
          animals: {
            "0": {
              ...INITIAL_FARM.barn.animals["0"],
              type: "Sheep",
              state: "ready",
              experience: 240,
            },
          },
        },
      },
      action: { type: "produce.claimed", animal: "Sheep", id: "0" },
    });

    expect(state.inventory["Merino Wool"]).toEqual(new Decimal(1.1));
  });

  it("gives 0.1 more leather when a Mootant is placed", () => {
    const state = claimProduce({
      createdAt: now,
      state: {
        ...INITIAL_FARM,
        inventory: {
          Mootant: new Decimal(1),
        },
        collectibles: {
          Mootant: [
            {
              coordinates: { x: 0, y: 0 },
              createdAt: 0,
              id: "1",
              readyAt: 0,
            },
          ],
        },
        barn: {
          ...INITIAL_FARM.barn,
          animals: {
            "0": {
              ...INITIAL_FARM.barn.animals["0"],
              type: "Cow",
              state: "ready",
              experience: 360,
            },
          },
        },
      },
      action: { type: "produce.claimed", animal: "Cow", id: "0" },
    });

    expect(state.inventory.Leather).toEqual(new Decimal(1.1));
  });
});
