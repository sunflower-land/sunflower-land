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

  it("requires greenhouse to be placed", () => {
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
                id: "1",
                coordinates: undefined,
                createdAt: 0,
                readyAt: 0,
              },
            ],
          },
        },
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

    expect(state.farmActivity["Rice Planted"]).toEqual(1);
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
        name: "Grape",
        plantedAt: now,
      },
    });
  });

  it("boosts +0.25 grape yield when Faction Shield is equipped", () => {
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
            wings: "Goblin Quiver",
          },
        },
        faction: {
          name: "goblins",
          pledgedAt: 0,
          history: {},
          points: 0,
        },
      },
      createdAt: now,
    });

    expect(state.greenhouse.pots[1]).toEqual({
      plant: {
        name: "Grape",
        plantedAt: now,
      },
    });
  });

  it("boosts of Faction Shield wont apply when pledged in different faction", () => {
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
            wings: "Goblin Quiver",
          },
        },
        faction: {
          name: "nightshades",
          pledgedAt: 0,
          history: {},
          points: 0,
        },
      },
      createdAt: now,
    });

    expect(state.greenhouse.pots[1]).toEqual({
      plant: {
        name: "Grape",
        plantedAt: now,
      },
    });
  });

  it("boosts of Faction Shield wont apply when not pledged in a faction", () => {
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
            wings: "Goblin Quiver",
          },
        },
      },
      createdAt: now,
    });

    expect(state.greenhouse.pots[1]).toEqual({
      plant: {
        name: "Grape",
        plantedAt: now,
      },
    });
  });

  it("boosts +0.25 Olive yield when Faction Quiver is equipped", () => {
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
            wings: "Goblin Quiver",
          },
        },
        faction: {
          name: "goblins",
          pledgedAt: 0,
          history: {},
          points: 0,
        },
      },
      createdAt: now,
    });

    expect(state.greenhouse.pots[1]).toEqual({
      plant: {
        name: "Olive",
        plantedAt: now,
      },
    });
  });

  it("boosts in Olive of Faction Quiver wont apply when pledged in different faction", () => {
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
            wings: "Goblin Quiver",
          },
        },
        faction: {
          name: "nightshades",
          pledgedAt: 0,
          history: {},
          points: 0,
        },
      },
      createdAt: now,
    });

    expect(state.greenhouse.pots[1]).toEqual({
      plant: {
        name: "Olive",
        plantedAt: now,
      },
    });
  });

  it("boosts in Olive of Faction Quiver wont apply when not pledged in a faction", () => {
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
            wings: "Goblin Quiver",
          },
        },
      },
      createdAt: now,
    });

    expect(state.greenhouse.pots[1]).toEqual({
      plant: {
        name: "Olive",
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
        name: "Rice",
        plantedAt: now - GREENHOUSE_CROP_TIME_SECONDS.Rice * 0.5 * 1000,
      },
    });
  });

  it("applies Super Totem speed boost", () => {
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
          "Super Totem": [
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
        name: "Rice",
        plantedAt: now - GREENHOUSE_CROP_TIME_SECONDS.Rice * 0.5 * 1000,
      },
    });
  });

  it("doesn't stack Super Totem and Time Warp totem", () => {
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
          "Super Totem": [
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
        name: "Grape",
        plantedAt: now - GREENHOUSE_CROP_TIME_SECONDS.Grape * 0.5 * 1000,
      },
    });
  });

  it("applies Super Totem normal fruit speed boosts", () => {
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
          "Super Totem": [
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
        name: "Grape",
        plantedAt: now - GREENHOUSE_CROP_TIME_SECONDS.Grape * 0.5 * 1000,
      },
    });
  });

  it("boosts Olive growth speed by 10% with Olive Express skill", () => {
    const now = Date.now();
    const state = plantGreenhouse({
      action: {
        type: "greenhouse.planted",
        seed: "Olive Seed",
        id: 1,
      },
      state: {
        ...farm,
        bumpkin: {
          ...INITIAL_BUMPKIN,
          skills: {
            "Olive Express": 1,
          },
        },
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
      },
      createdAt: now,
    });

    expect(state.greenhouse.pots[1]).toEqual({
      plant: {
        name: "Olive",
        plantedAt: now - GREENHOUSE_CROP_TIME_SECONDS.Olive * 0.1 * 1000,
      },
    });
  });

  it("boosts Rice growth speed by 10% with Rice Rocket skill", () => {
    const now = Date.now();
    const state = plantGreenhouse({
      action: {
        type: "greenhouse.planted",
        seed: "Rice Seed",
        id: 1,
      },
      state: {
        ...farm,
        bumpkin: {
          ...INITIAL_BUMPKIN,
          skills: {
            "Rice Rocket": 1,
          },
        },
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
        name: "Rice",
        plantedAt: now - GREENHOUSE_CROP_TIME_SECONDS.Rice * 0.1 * 1000,
      },
    });
  });

  it("boosts Grape growth speed by 10% with Vine Velocity skill", () => {
    const now = Date.now();
    const state = plantGreenhouse({
      action: {
        type: "greenhouse.planted",
        seed: "Grape Seed",
        id: 1,
      },
      state: {
        ...farm,
        bumpkin: {
          ...INITIAL_BUMPKIN,
          skills: {
            "Vine Velocity": 1,
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
        name: "Grape",
        plantedAt: now - GREENHOUSE_CROP_TIME_SECONDS.Grape * 0.1 * 1000,
      },
    });
  });

  it("requires 1 less oil with Slick Saver skill", () => {
    const now = Date.now();
    const state = plantGreenhouse({
      action: {
        type: "greenhouse.planted",
        seed: "Rice Seed",
        id: 1,
      },
      state: {
        ...farm,
        bumpkin: {
          ...INITIAL_BUMPKIN,
          skills: {
            "Slick Saver": 1,
          },
        },
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

    expect(state.greenhouse.oil).toEqual(47);
  });

  it("requires 1 more seed with Seeded Bounty skill", () => {
    const now = Date.now();
    const state = plantGreenhouse({
      action: {
        type: "greenhouse.planted",
        seed: "Rice Seed",
        id: 1,
      },
      state: {
        ...farm,
        bumpkin: {
          ...INITIAL_BUMPKIN,
          skills: {
            "Seeded Bounty": 1,
          },
        },
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

    expect(state.inventory["Rice Seed"]).toEqual(new Decimal(0));
  });

  it("does not give 50% time boost when Solflare Aegis is worn in summer season", () => {
    const now = Date.now();
    const state = plantGreenhouse({
      action: {
        type: "greenhouse.planted",
        id: 1,
        seed: "Rice Seed",
      },
      state: {
        ...farm,
        bumpkin: {
          ...INITIAL_BUMPKIN,
          equipped: {
            ...INITIAL_BUMPKIN.equipped,
            secondaryTool: "Solflare Aegis",
          },
        },
        inventory: {
          "Rice Seed": new Decimal(1),
        },
        greenhouse: {
          oil: 50,
          pots: {
            1: {},
          },
        },
        season: {
          season: "summer",
          startedAt: 0,
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
        name: "Rice",
        plantedAt: now,
      },
    });
  });

  it("does not give 50% time boost when Autumn's Embrace is worn in summer season", () => {
    const now = Date.now();
    const state = plantGreenhouse({
      action: {
        type: "greenhouse.planted",
        id: 1,
        seed: "Rice Seed",
      },
      state: {
        ...farm,
        bumpkin: {
          ...INITIAL_BUMPKIN,
          equipped: {
            ...INITIAL_BUMPKIN.equipped,
            secondaryTool: "Autumn's Embrace",
          },
        },
        inventory: {
          "Rice Seed": new Decimal(1),
        },
        greenhouse: {
          oil: 50,
          pots: {
            1: {},
          },
        },
        season: {
          season: "autumn",
          startedAt: 0,
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
        name: "Rice",
        plantedAt: now,
      },
    });
  });

  it("does not give a 50% time boost to FRUITS when Autumn's Embrace is worn in summer season", () => {
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
            ...INITIAL_BUMPKIN.equipped,
            secondaryTool: "Autumn's Embrace",
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
        season: {
          season: "autumn",
          startedAt: 0,
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
        name: "Grape",
        plantedAt: now,
      },
    });
  });

  it("does not boost +1 Greenhouse Crop yield when wearing Blossom Ward at Spring Season", () => {
    const now = Date.now();
    const state = plantGreenhouse({
      action: {
        type: "greenhouse.planted",
        id: 1,
        seed: "Rice Seed",
      },
      state: {
        ...farm,
        bumpkin: {
          ...INITIAL_BUMPKIN,
          equipped: {
            ...INITIAL_BUMPKIN.equipped,
            secondaryTool: "Blossom Ward",
          },
        },
        inventory: {
          "Rice Seed": new Decimal(1),
        },
        season: {
          season: "spring",
          startedAt: 0,
        },
        greenhouse: {
          oil: 50,
          pots: {
            1: {},
          },
        },
        collectibles: {},
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
        name: "Rice",
        plantedAt: now,
      },
    });
  });

  it("does not boost +1 Greenhouse Crop yield when wearing Frozen Heart at Winter Season", () => {
    const now = Date.now();
    const state = plantGreenhouse({
      action: {
        type: "greenhouse.planted",
        id: 1,
        seed: "Rice Seed",
      },
      state: {
        ...farm,
        bumpkin: {
          ...INITIAL_BUMPKIN,
          equipped: {
            ...INITIAL_BUMPKIN.equipped,
            secondaryTool: "Frozen Heart",
          },
        },
        inventory: {
          "Rice Seed": new Decimal(1),
        },
        season: {
          season: "winter",
          startedAt: 0,
        },
        greenhouse: {
          oil: 50,
          pots: {
            1: {},
          },
        },
        collectibles: {},
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
        name: "Rice",
        plantedAt: now,
      },
    });
  });

  it("does not give yield boosts to FRUITS wearing Blossom Ward at Spring Season", () => {
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
            ...INITIAL_BUMPKIN.equipped,
            secondaryTool: "Blossom Ward",
          },
        },
        inventory: {
          "Grape Seed": new Decimal(1),
        },
        season: {
          season: "spring",
          startedAt: 0,
        },
        greenhouse: {
          oil: 50,
          pots: {
            1: {},
          },
        },
        collectibles: {},
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
        name: "Grape",
        plantedAt: now,
      },
    });
  });
  it("does not give 5% time boost to Greenhouse Crops when wearing Green Thumb skill", () => {
    const now = Date.now();
    const state = plantGreenhouse({
      action: {
        type: "greenhouse.planted",
        id: 1,
        seed: "Rice Seed",
      },
      state: {
        ...farm,
        bumpkin: {
          ...farm.bumpkin,
          skills: {
            "Green Thumb": 1,
          },
        },
        inventory: {
          "Rice Seed": new Decimal(1),
        },
        greenhouse: {
          oil: 50,
          pots: {
            1: {},
          },
        },
        collectibles: {},
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
        name: "Rice",
        plantedAt: now,
      },
    });
  });
});
