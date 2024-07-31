import { INITIAL_BUMPKIN, TEST_FARM } from "features/game/lib/constants";
import { plantGreenhouse } from "./plantGreenhouse";
import Decimal from "decimal.js-light";
import { GameState } from "features/game/types/game";
import { GREENHOUSE_CROP_TIME_SECONDS } from "./harvestGreenHouse";

const farm: GameState = {
  ...TEST_FARM,
  bumpkin: INITIAL_BUMPKIN,
};

describe("plantGreenhouse", () => {
  it("requires greenhouse exists", () => {
    expect(() =>
      plantGreenhouse({
        action: {
          type: "greenhouse.planted",
          id: 1,
          seed: "Rice Seed",
        },
        state: farm,
      }),
    ).toThrow("Greenhouse does not exist");
  });

  it("requires player has seed", () => {
    expect(() =>
      plantGreenhouse({
        action: {
          type: "greenhouse.planted",
          id: 1,
          seed: "Rice Seed",
        },
        state: {
          ...farm,
          buildings: {
            Greenhouse: [
              {
                coordinates: { x: 0, y: 0 },
                id: "1",
                createdAt: 0,
                readyAt: 0,
              },
            ],
          },
        },
      }),
    ).toThrow("Missing Rice Seed");
  });

  it("requires player has oil", () => {
    expect(() =>
      plantGreenhouse({
        action: {
          type: "greenhouse.planted",
          id: 1,
          seed: "Rice Seed",
        },
        state: {
          ...farm,
          inventory: {
            "Rice Seed": new Decimal(10),
          },
          buildings: {
            Greenhouse: [
              {
                coordinates: { x: 0, y: 0 },
                id: "1",
                createdAt: 0,
                readyAt: 0,
              },
            ],
          },
        },
      }),
    ).toThrow("Not enough Oil");
  });

  it("requires pot exists", () => {
    expect(() =>
      plantGreenhouse({
        action: {
          type: "greenhouse.planted",
          id: 12,
          seed: "Rice Seed",
        },
        state: {
          ...farm,
          inventory: {
            "Rice Seed": new Decimal(1),
          },
          greenhouse: {
            oil: 50,
            pots: {},
          },
          buildings: {
            Greenhouse: [
              {
                coordinates: { x: 0, y: 0 },
                id: "1",
                createdAt: 0,
                readyAt: 0,
              },
            ],
          },
        },
      }),
    ).toThrow("Not a valid pot");
  });

  it("requires plant does not already exist", () => {
    expect(() =>
      plantGreenhouse({
        action: {
          type: "greenhouse.planted",
          id: 1,
          seed: "Rice Seed",
        },
        state: {
          ...farm,
          inventory: {
            "Rice Seed": new Decimal(1),
          },
          greenhouse: {
            oil: 50,
            pots: {
              1: {
                plant: {
                  amount: 2,
                  name: "Rice",
                  plantedAt: 0,
                },
              },
            },
          },
          buildings: {
            Greenhouse: [
              {
                coordinates: { x: 0, y: 0 },
                id: "1",
                createdAt: 0,
                readyAt: 0,
              },
            ],
          },
        },
      }),
    ).toThrow("Plant already exists");
  });

  it("plants", () => {
    const now = Date.now();
    const state = plantGreenhouse({
      action: {
        type: "greenhouse.planted",
        id: 1,
        seed: "Rice Seed",
      },
      state: {
        ...farm,
        inventory: {
          "Rice Seed": new Decimal(1),
        },
        greenhouse: {
          oil: 50,
          pots: {
            1: {},
          },
        },
        buildings: {
          Greenhouse: [
            {
              coordinates: { x: 0, y: 0 },
              id: "1",
              createdAt: 0,
              readyAt: 0,
            },
          ],
        },
      },
      createdAt: now,
    });

    expect(state.greenhouse.pots[1]).toEqual({
      plant: {
        amount: 1,
        name: "Rice",
        plantedAt: now,
      },
    });
  });

  it("subtracts seed", () => {
    const now = Date.now();
    const state = plantGreenhouse({
      action: {
        type: "greenhouse.planted",
        id: 1,
        seed: "Rice Seed",
      },
      state: {
        ...farm,
        inventory: {
          "Rice Seed": new Decimal(2),
        },
        greenhouse: {
          oil: 50,
          pots: {
            1: {},
          },
        },
        buildings: {
          Greenhouse: [
            {
              coordinates: { x: 0, y: 0 },
              id: "1",
              createdAt: 0,
              readyAt: 0,
            },
          ],
        },
      },
      createdAt: now,
    });

    expect(state.inventory["Rice Seed"]).toEqual(new Decimal(1));
  });

  it("tracks analytics", () => {
    const now = Date.now();
    const state = plantGreenhouse({
      action: {
        type: "greenhouse.planted",
        id: 1,
        seed: "Rice Seed",
      },
      state: {
        ...farm,
        inventory: {
          "Rice Seed": new Decimal(2),
        },
        greenhouse: {
          oil: 50,
          pots: {
            1: {},
          },
        },
        buildings: {
          Greenhouse: [
            {
              coordinates: { x: 0, y: 0 },
              id: "1",
              createdAt: 0,
              readyAt: 0,
            },
          ],
        },
      },
      createdAt: now,
    });

    expect(state.bumpkin?.activity?.["Rice Planted"]).toEqual(1);
  });

  it("boosts +1 rice yield when Non La Hat is equipped", () => {
    const now = Date.now();
    const state = plantGreenhouse({
      action: {
        type: "greenhouse.planted",
        id: 1,
        seed: "Rice Seed",
      },
      state: {
        ...farm,
        inventory: {
          "Rice Seed": new Decimal(1),
        },
        greenhouse: {
          oil: 50,
          pots: {
            1: {},
          },
        },
        buildings: {
          Greenhouse: [
            {
              coordinates: { x: 0, y: 0 },
              id: "1",
              createdAt: 0,
              readyAt: 0,
            },
          ],
        },
        bumpkin: {
          ...INITIAL_BUMPKIN,
          equipped: {
            ...INITIAL_BUMPKIN.equipped,
            hat: "Non La Hat",
          },
        },
      },
      createdAt: now,
    });

    expect(state.greenhouse.pots[1]).toEqual({
      plant: {
        amount: 2,
        name: "Rice",
        plantedAt: now,
      },
    });
  });

  it("boosts +2 Greenhouse Crop yield when Pharaoh Gnome is placed", () => {
    const now = Date.now();
    const state = plantGreenhouse({
      action: {
        type: "greenhouse.planted",
        id: 1,
        seed: "Rice Seed",
      },
      state: {
        ...farm,
        inventory: {
          "Rice Seed": new Decimal(1),
        },
        greenhouse: {
          oil: 50,
          pots: {
            1: {},
          },
        },
        collectibles: {
          "Pharaoh Gnome": [
            {
              id: "1",
              createdAt: 0,
              coordinates: {
                x: 0,
                y: 0,
              },
              readyAt: 0,
            },
          ],
        },
        buildings: {
          Greenhouse: [
            {
              coordinates: { x: 0, y: 0 },
              id: "1",
              createdAt: 0,
              readyAt: 0,
            },
          ],
        },
      },
      createdAt: now,
    });

    expect(state.greenhouse.pots[1]).toEqual({
      plant: {
        amount: 3,
        name: "Rice",
        plantedAt: now,
      },
    });
  });

  it("boosts +0.2 grape yield when Grape Pants is equipped", () => {
    const now = Date.now();
    const state = plantGreenhouse({
      action: {
        type: "greenhouse.planted",
        id: 1,
        seed: "Grape Seed",
      },
      state: {
        ...farm,
        inventory: {
          "Grape Seed": new Decimal(1),
        },
        greenhouse: {
          oil: 50,
          pots: {
            1: {},
          },
        },
        buildings: {
          Greenhouse: [
            {
              coordinates: { x: 0, y: 0 },
              id: "1",
              createdAt: 0,
              readyAt: 0,
            },
          ],
        },
        bumpkin: {
          ...INITIAL_BUMPKIN,
          equipped: {
            ...INITIAL_BUMPKIN.equipped,
            pants: "Grape Pants",
          },
        },
      },
      createdAt: now,
    });

    expect(state.greenhouse.pots[1]).toEqual({
      plant: {
        amount: 1.2,
        name: "Grape",
        plantedAt: now,
      },
    });
  });

  it("gives a 50% time boost when Turbo Sprout is placed", () => {
    const now = Date.now();
    const state = plantGreenhouse({
      action: {
        type: "greenhouse.planted",
        id: 1,
        seed: "Rice Seed",
      },
      state: {
        ...farm,
        inventory: {
          "Rice Seed": new Decimal(1),
        },
        greenhouse: {
          oil: 50,
          pots: {
            1: {},
          },
        },
        buildings: {
          Greenhouse: [
            {
              coordinates: { x: 0, y: 0 },
              id: "1",
              createdAt: 0,
              readyAt: 0,
            },
          ],
        },
        collectibles: {
          "Turbo Sprout": [
            { id: "1", createdAt: 0, coordinates: { x: 0, y: 0 }, readyAt: 0 },
          ],
        },
      },
      createdAt: now,
    });

    const boostedTime = (GREENHOUSE_CROP_TIME_SECONDS["Rice"] * 1000) / 2;
    expect(state.greenhouse.pots[1]).toEqual({
      plant: {
        amount: 1,
        name: "Rice",
        plantedAt: now - boostedTime,
      },
    });
  });

  it("boosts +2 Greenhouse Fruit yield when Pharaoh Gnome is placed", () => {
    const now = Date.now();
    const state = plantGreenhouse({
      action: {
        type: "greenhouse.planted",
        id: 1,
        seed: "Grape Seed",
      },
      state: {
        ...farm,
        inventory: {
          "Grape Seed": new Decimal(1),
        },
        greenhouse: {
          oil: 50,
          pots: {
            1: {},
          },
        },
        buildings: {
          Greenhouse: [
            {
              coordinates: { x: 0, y: 0 },
              id: "1",
              createdAt: 0,
              readyAt: 0,
            },
          ],
        },
        collectibles: {
          "Pharaoh Gnome": [
            {
              id: "1",
              createdAt: 0,
              coordinates: { x: 0, y: 0 },
              readyAt: 0,
            },
          ],
        },
      },
      createdAt: now,
    });

    expect(state.greenhouse.pots[1]).toEqual({
      plant: {
        amount: 3,
        name: "Grape",
        plantedAt: now,
      },
    });
  });

  it("boosts +0.25 grape yield when Vinny is placed", () => {
    const now = Date.now();
    const state = plantGreenhouse({
      action: {
        type: "greenhouse.planted",
        id: 1,
        seed: "Grape Seed",
      },
      state: {
        ...farm,
        inventory: {
          "Grape Seed": new Decimal(1),
        },
        greenhouse: {
          oil: 50,
          pots: {
            1: {},
          },
        },
        buildings: {
          Greenhouse: [
            {
              coordinates: { x: 0, y: 0 },
              id: "1",
              createdAt: 0,
              readyAt: 0,
            },
          ],
        },
        collectibles: {
          Vinny: [
            { id: "1", createdAt: 0, coordinates: { x: 0, y: 0 }, readyAt: 0 },
          ],
        },
      },
      createdAt: now,
    });

    expect(state.greenhouse.pots[1]).toEqual({
      plant: {
        amount: 1.25,
        name: "Grape",
        plantedAt: now,
      },
    });
  });

  it("boosts +1 grape yield when Grape Granny is placed", () => {
    const now = Date.now();
    const state = plantGreenhouse({
      action: {
        type: "greenhouse.planted",
        id: 1,
        seed: "Grape Seed",
      },
      state: {
        ...farm,
        inventory: {
          "Grape Seed": new Decimal(1),
        },
        greenhouse: {
          oil: 50,
          pots: {
            1: {},
          },
        },
        buildings: {
          Greenhouse: [
            {
              coordinates: { x: 0, y: 0 },
              id: "1",
              createdAt: 0,
              readyAt: 0,
            },
          ],
        },
        collectibles: {
          "Grape Granny": [
            { id: "1", createdAt: 0, coordinates: { x: 0, y: 0 }, readyAt: 0 },
          ],
        },
      },
      createdAt: now,
    });

    expect(state.greenhouse.pots[1]).toEqual({
      plant: {
        amount: 2,
        name: "Grape",
        plantedAt: now,
      },
    });
  });

  it("doesn't boost Grape by when Camel Onesie is equipped", () => {
    const now = Date.now();
    const state = plantGreenhouse({
      action: {
        type: "greenhouse.planted",
        id: 1,
        seed: "Grape Seed",
      },
      state: {
        ...farm,
        bumpkin: {
          ...INITIAL_BUMPKIN,
          equipped: {
            onesie: "Camel Onesie",
            ...INITIAL_BUMPKIN.equipped,
          },
        },
        inventory: {
          "Grape Seed": new Decimal(1),
        },
        greenhouse: {
          oil: 50,
          pots: {
            1: {},
          },
        },
        buildings: {
          Greenhouse: [
            {
              coordinates: { x: 0, y: 0 },
              id: "1",
              createdAt: 0,
              readyAt: 0,
            },
          ],
        },
      },
      createdAt: now,
    });

    expect(state.greenhouse.pots[1]).toEqual({
      plant: {
        amount: 1,
        name: "Grape",
        plantedAt: now,
      },
    });
  });

  it("boosts +1 Olive yield when Olive Shield is equipped", () => {
    const now = Date.now();
    const state = plantGreenhouse({
      action: {
        type: "greenhouse.planted",
        id: 1,
        seed: "Olive Seed",
      },
      state: {
        ...farm,
        inventory: {
          "Olive Seed": new Decimal(1),
        },
        greenhouse: {
          oil: 50,
          pots: {
            1: {},
          },
        },
        buildings: {
          Greenhouse: [
            {
              coordinates: { x: 0, y: 0 },
              id: "1",
              createdAt: 0,
              readyAt: 0,
            },
          ],
        },
        bumpkin: {
          ...INITIAL_BUMPKIN,
          equipped: {
            ...INITIAL_BUMPKIN.equipped,
            secondaryTool: "Olive Shield",
          },
        },
      },
      createdAt: now,
    });

    expect(state.greenhouse.pots[1]).toEqual({
      plant: {
        amount: 2,
        name: "Olive",
        plantedAt: now,
      },
    });
  });

  it("boosts +0.25 rice yield when Rice Panda is placed", () => {
    const now = Date.now();
    const state = plantGreenhouse({
      action: {
        type: "greenhouse.planted",
        id: 1,
        seed: "Rice Seed",
      },
      state: {
        ...farm,
        inventory: {
          "Rice Seed": new Decimal(1),
        },
        greenhouse: {
          oil: 50,
          pots: {
            1: {},
          },
        },
        buildings: {
          Greenhouse: [
            {
              coordinates: { x: 0, y: 0 },
              id: "1",
              createdAt: 0,
              readyAt: 0,
            },
          ],
        },
        collectibles: {
          "Rice Panda": [
            { id: "1", createdAt: 0, coordinates: { x: 0, y: 0 }, readyAt: 0 },
          ],
        },
      },
      createdAt: now,
    });

    expect(state.greenhouse.pots[1]).toEqual({
      plant: {
        amount: 1.25,
        name: "Rice",
        plantedAt: now,
      },
    });
  });

  it("uses oil", () => {
    const now = Date.now();
    const state = plantGreenhouse({
      action: {
        type: "greenhouse.planted",
        id: 1,
        seed: "Rice Seed",
      },
      state: {
        ...farm,
        inventory: {
          "Rice Seed": new Decimal(1),
        },
        greenhouse: {
          oil: 50,
          pots: {
            1: {},
          },
        },
        buildings: {
          Greenhouse: [
            {
              coordinates: { x: 0, y: 0 },
              id: "1",
              createdAt: 0,
              readyAt: 0,
            },
          ],
        },
        collectibles: {
          "Rice Panda": [
            { id: "1", createdAt: 0, coordinates: { x: 0, y: 0 }, readyAt: 0 },
          ],
        },
      },
      createdAt: now,
    });

    expect(state.greenhouse.oil).toEqual(46);
  });

  it("applies normal crop yield boosts", () => {
    const now = Date.now();
    const state = plantGreenhouse({
      action: {
        type: "greenhouse.planted",
        id: 1,
        seed: "Rice Seed",
      },
      state: {
        ...farm,
        inventory: {
          "Rice Seed": new Decimal(1),
        },
        greenhouse: {
          oil: 50,
          pots: {
            1: {},
          },
        },
        buildings: {
          Greenhouse: [
            {
              coordinates: { x: 0, y: 0 },
              id: "1",
              createdAt: 0,
              readyAt: 0,
            },
          ],
        },
        collectibles: {
          Scarecrow: [
            { id: "1", createdAt: 0, coordinates: { x: 0, y: 0 }, readyAt: 0 },
          ],
        },
      },
      createdAt: now,
    });

    expect(state.greenhouse.pots[1]).toEqual({
      plant: {
        amount: 1.2,
        name: "Rice",
        plantedAt: expect.any(Number),
      },
    });
  });

  it("does not apply Castle bud crop yield boost", () => {
    const now = Date.now();
    const state = plantGreenhouse({
      action: {
        type: "greenhouse.planted",
        id: 1,
        seed: "Rice Seed",
      },
      state: {
        ...farm,
        inventory: {
          "Rice Seed": new Decimal(1),
        },
        greenhouse: {
          oil: 50,
          pots: {
            1: {},
          },
        },
        buds: {
          "1": {
            type: "Castle",
            aura: "No Aura",
            colour: "Blue",
            ears: "Ears",
            stem: "Egg Head",
            coordinates: {
              x: 0,
              y: 0,
            },
          },
        },
        buildings: {
          Greenhouse: [
            {
              coordinates: { x: 0, y: 0 },
              id: "1",
              createdAt: 0,
              readyAt: 0,
            },
          ],
        },
        collectibles: {},
      },
      createdAt: now,
    });

    expect(state.greenhouse.pots[1]).toEqual({
      plant: {
        amount: 1,
        name: "Rice",
        plantedAt: expect.any(Number),
      },
    });
  });

  it("applies normal fruit yield boosts", () => {
    const now = Date.now();
    const state = plantGreenhouse({
      action: {
        type: "greenhouse.planted",
        id: 1,
        seed: "Grape Seed",
      },
      state: {
        ...farm,
        inventory: {
          "Grape Seed": new Decimal(1),
        },
        greenhouse: {
          oil: 50,
          pots: {
            1: {},
          },
        },
        buildings: {
          Greenhouse: [
            {
              coordinates: { x: 0, y: 0 },
              id: "1",
              createdAt: 0,
              readyAt: 0,
            },
          ],
        },
        buds: {
          1: {
            type: "Beach",
            aura: "No Aura",
            colour: "Beige",
            ears: "Ears",
            stem: "Egg Head",
            coordinates: { x: 0, y: 0 },
          },
        },
      },
      createdAt: now,
    });

    expect(state.greenhouse.pots[1]).toEqual({
      plant: {
        amount: 1.2,
        name: "Grape",
        plantedAt: now,
      },
    });
  });

  it("applies time warp totem speed boost", () => {
    const now = Date.now();
    const state = plantGreenhouse({
      action: {
        type: "greenhouse.planted",
        id: 1,
        seed: "Rice Seed",
      },
      state: {
        ...farm,
        inventory: {
          "Rice Seed": new Decimal(1),
        },
        greenhouse: {
          oil: 50,
          pots: {
            1: {},
          },
        },
        buildings: {
          Greenhouse: [
            {
              coordinates: { x: 0, y: 0 },
              id: "1",
              createdAt: 0,
              readyAt: 0,
            },
          ],
        },
        collectibles: {
          "Time Warp Totem": [
            {
              id: "1",
              createdAt: now,
              coordinates: { x: 0, y: 0 },
              readyAt: now,
            },
          ],
        },
      },
      createdAt: now,
    });

    expect(state.greenhouse.pots[1]).toEqual({
      plant: {
        amount: 1,
        name: "Rice",
        plantedAt: now - GREENHOUSE_CROP_TIME_SECONDS.Rice * 0.5 * 1000,
      },
    });
  });

  it("applies Saphiro bud speed boost", () => {
    const now = Date.now();
    const state = plantGreenhouse({
      action: {
        type: "greenhouse.planted",
        id: 1,
        seed: "Rice Seed",
      },
      state: {
        ...farm,
        inventory: {
          "Rice Seed": new Decimal(1),
        },
        greenhouse: {
          oil: 50,
          pots: {
            1: {},
          },
        },
        buds: {
          "1": {
            type: "Saphiro",
            aura: "No Aura",
            colour: "Blue",
            ears: "Ears",
            stem: "Egg Head",
            coordinates: {
              x: 0,
              y: 0,
            },
          },
        },
        buildings: {
          Greenhouse: [
            {
              coordinates: { x: 0, y: 0 },
              id: "1",
              createdAt: 0,
              readyAt: 0,
            },
          ],
        },
      },
      createdAt: now,
    });

    expect(state.greenhouse.pots[1]).toEqual({
      plant: {
        amount: 1,
        name: "Rice",
        plantedAt: now - GREENHOUSE_CROP_TIME_SECONDS.Rice * 0.1 * 1000,
      },
    });
  });

  it("applies normal fruit speed boosts", () => {
    const now = Date.now();
    const state = plantGreenhouse({
      action: {
        type: "greenhouse.planted",
        id: 1,
        seed: "Grape Seed",
      },
      state: {
        ...farm,
        inventory: {
          "Grape Seed": new Decimal(1),
        },
        greenhouse: {
          oil: 50,
          pots: {
            1: {},
          },
        },
        buildings: {
          Greenhouse: [
            {
              coordinates: { x: 0, y: 0 },
              id: "1",
              createdAt: 0,
              readyAt: 0,
            },
          ],
        },
        collectibles: {
          "Time Warp Totem": [
            {
              id: "1",
              createdAt: now,
              coordinates: { x: 0, y: 0 },
              readyAt: now,
            },
          ],
        },
      },
      createdAt: now,
    });

    expect(state.greenhouse.pots[1]).toEqual({
      plant: {
        amount: 1,
        name: "Grape",
        plantedAt: now - GREENHOUSE_CROP_TIME_SECONDS.Grape * 0.5 * 1000,
      },
    });
  });
});
