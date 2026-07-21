import { INITIAL_BUMPKIN, TEST_FARM } from "features/game/lib/constants";
import { plantGreenhouse } from "./plantGreenhouse";
import Decimal from "decimal.js-light";
import type { GameState } from "features/game/types/game";
import { GREENHOUSE_CROP_TIME_SECONDS } from "features/game/lib/greenhouseGrowTimes";
import { CONFIG } from "lib/config";

// Pin the legacy (mainnet, SPEED_BOOSTS off) behaviour for this file's existing
// tests — jest runs on amoy where the flag is ON. The windowed model is covered
// in the dedicated SPEED_BOOSTS describes.
const originalNetwork = CONFIG.NETWORK;
beforeAll(() => {
  (CONFIG as { NETWORK: "mainnet" | "amoy" }).NETWORK = "mainnet";
});
afterAll(() => {
  (CONFIG as { NETWORK: "mainnet" | "amoy" }).NETWORK = originalNetwork;
});

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

describe("plantGreenhouse ascension skill ranks", () => {
  const plantWith = ({
    seed,
    skills,
    oil = 50,
    seedAmount = 5,
    now,
  }: {
    seed: "Rice Seed" | "Olive Seed" | "Grape Seed";
    skills: GameState["bumpkin"]["skills"];
    oil?: number;
    seedAmount?: number;
    now: number;
  }) =>
    plantGreenhouse({
      action: { type: "greenhouse.planted", seed, id: 1 },
      createdAt: now,
      state: {
        ...farm,
        bumpkin: { ...INITIAL_BUMPKIN, skills },
        inventory: { [seed]: new Decimal(seedAmount) },
        greenhouse: { oil, pots: { 1: {} } },
        buildings: {
          Greenhouse: [
            { coordinates: { x: 0, y: 0 }, id: "1", createdAt: 0, readyAt: 0 },
          ],
        },
      },
    });

  // Replicates the consumer's growth math exactly so the expected plantedAt is
  // bit-identical (offset = cropTime - cropTime * multiplier).
  const plantedAtWithMultiplier = (
    crop: keyof typeof GREENHOUSE_CROP_TIME_SECONDS,
    mult: number,
    now: number,
  ) => {
    const t = GREENHOUSE_CROP_TIME_SECONDS[crop];
    return now - (t - t * mult) * 1000;
  };

  // Rice and Shine — all greenhouse produce, x0.95/x0.94/x0.925 (rank 1 == now).
  it("scales Rice and Shine growth with rank (x0.95/x0.94/x0.925)", () => {
    const now = Date.now();
    [
      [1, 0.95],
      [2, 0.94],
      [3, 0.925],
    ].forEach(([rank, mult]) => {
      const state = plantWith({
        seed: "Rice Seed",
        skills: { "Rice and Shine": rank },
        now,
      });
      expect(state.greenhouse.pots[1]?.plant?.plantedAt).toEqual(
        plantedAtWithMultiplier("Rice", mult, now),
      );
    });
  });

  // Olive Express — Olive only, x0.9/x0.85/x0.8 (rank 1 == now).
  it("scales Olive Express growth with rank (x0.9/x0.85/x0.8)", () => {
    const now = Date.now();
    [
      [1, 0.9],
      [2, 0.85],
      [3, 0.8],
    ].forEach(([rank, mult]) => {
      const state = plantWith({
        seed: "Olive Seed",
        skills: { "Olive Express": rank },
        now,
      });
      expect(state.greenhouse.pots[1]?.plant?.plantedAt).toEqual(
        plantedAtWithMultiplier("Olive", mult, now),
      );
    });
  });

  // Rice Rocket — Rice only, x0.9/x0.85/x0.8 (rank 1 == now).
  it("scales Rice Rocket growth with rank (x0.9/x0.85/x0.8)", () => {
    const now = Date.now();
    [
      [1, 0.9],
      [2, 0.85],
      [3, 0.8],
    ].forEach(([rank, mult]) => {
      const state = plantWith({
        seed: "Rice Seed",
        skills: { "Rice Rocket": rank },
        now,
      });
      expect(state.greenhouse.pots[1]?.plant?.plantedAt).toEqual(
        plantedAtWithMultiplier("Rice", mult, now),
      );
    });
  });

  // Vine Velocity — Grape only, x0.9/x0.85/x0.8 (rank 1 == now).
  it("scales Vine Velocity growth with rank (x0.9/x0.85/x0.8)", () => {
    const now = Date.now();
    [
      [1, 0.9],
      [2, 0.85],
      [3, 0.8],
    ].forEach(([rank, mult]) => {
      const state = plantWith({
        seed: "Grape Seed",
        skills: { "Vine Velocity": rank },
        now,
      });
      expect(state.greenhouse.pots[1]?.plant?.plantedAt).toEqual(
        plantedAtWithMultiplier("Grape", mult, now),
      );
    });
  });

  // Slick Saver — flat Oil reduction 1/1.5/2 (rank 1 == now). Rice base = 4 oil.
  it("scales Slick Saver oil reduction with rank (-1/-1.5/-2)", () => {
    const now = Date.now();
    expect(
      plantWith({ seed: "Rice Seed", skills: { "Slick Saver": 1 }, now })
        .greenhouse.oil,
    ).toEqual(47);
    expect(
      plantWith({ seed: "Rice Seed", skills: { "Slick Saver": 2 }, now })
        .greenhouse.oil,
    ).toEqual(47.5);
    expect(
      plantWith({ seed: "Rice Seed", skills: { "Slick Saver": 3 }, now })
        .greenhouse.oil,
    ).toEqual(48);
  });

  // Greasy Plants — Oil-usage multiplier debuff 2x/3x/4x (rank 1 == now).
  it("scales Greasy Plants oil consumption with rank (x2/x3/x4)", () => {
    const now = Date.now();
    expect(
      plantWith({ seed: "Rice Seed", skills: { "Greasy Plants": 1 }, now })
        .greenhouse.oil,
    ).toEqual(42);
    expect(
      plantWith({ seed: "Rice Seed", skills: { "Greasy Plants": 2 }, now })
        .greenhouse.oil,
    ).toEqual(38);
    expect(
      plantWith({ seed: "Rice Seed", skills: { "Greasy Plants": 3 }, now })
        .greenhouse.oil,
    ).toEqual(34);
  });

  // Seeded Bounty — the seed debuff is FIXED (+1 seed) at every rank; it does
  // NOT scale with rank (only the harvest yield leg scales).
  it("keeps the Seeded Bounty seed cost fixed at +1 for all ranks", () => {
    const now = Date.now();
    [1, 2, 3].forEach((rank) => {
      const state = plantWith({
        seed: "Rice Seed",
        skills: { "Seeded Bounty": rank },
        seedAmount: 2,
        now,
      });
      // 1 base + 1 fixed debuff = 2 seeds used regardless of rank.
      expect(state.inventory["Rice Seed"]).toEqual(new Decimal(0));
    });
  });

  it("throws with only 1 seed even at Seeded Bounty rank 3 (fixed +1 debuff)", () => {
    const now = Date.now();
    expect(() =>
      plantWith({
        seed: "Rice Seed",
        skills: { "Seeded Bounty": 3 },
        seedAmount: 1,
        now,
      }),
    ).toThrow("Missing Rice Seed");
  });
});

describe("plantGreenhouse under SPEED_BOOSTS (windowed)", () => {
  beforeAll(() => {
    (CONFIG as { NETWORK: "mainnet" | "amoy" }).NETWORK = "amoy";
  });
  afterAll(() => {
    (CONFIG as { NETWORK: "mainnet" | "amoy" }).NETWORK = originalNetwork;
  });

  const greenhouseState = (extra: Partial<GameState> = {}): GameState => ({
    ...farm,
    inventory: {
      "Rice Seed": new Decimal(5),
      "Grape Seed": new Decimal(5),
    },
    greenhouse: {
      oil: 50,
      pots: { 1: {} },
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
    ...extra,
  });

  it("keeps the real plantedAt and stores the base grow duration", () => {
    const now = Date.now();
    const state = plantGreenhouse({
      action: { type: "greenhouse.planted", id: 1, seed: "Rice Seed" },
      state: greenhouseState(),
      createdAt: now,
    });

    expect(state.greenhouse.pots[1]).toEqual({
      plant: {
        name: "Rice",
        plantedAt: now,
        baseDurationMs: GREENHOUSE_CROP_TIME_SECONDS.Rice * 1000,
      },
    });
  });

  it("keeps permanent boosts baked into baseDurationMs (Turbo Sprout)", () => {
    const now = Date.now();
    const state = plantGreenhouse({
      action: { type: "greenhouse.planted", id: 1, seed: "Rice Seed" },
      state: greenhouseState({
        collectibles: {
          "Turbo Sprout": [
            { id: "1", createdAt: 0, coordinates: { x: 0, y: 0 }, readyAt: 0 },
          ],
        },
      }),
      createdAt: now,
    });

    expect(state.greenhouse.pots[1].plant).toEqual({
      name: "Rice",
      plantedAt: now,
      baseDurationMs: (GREENHOUSE_CROP_TIME_SECONDS.Rice * 1000) / 2,
    });
  });

  it("excludes the Tortoise Shrine from baseDurationMs AND boostsUsed", () => {
    const now = Date.now();
    const state = plantGreenhouse({
      action: { type: "greenhouse.planted", id: 1, seed: "Rice Seed" },
      state: greenhouseState({
        collectibles: {
          "Tortoise Shrine": [
            {
              id: "1",
              createdAt: now,
              coordinates: { x: 0, y: 0 },
              readyAt: now,
            },
          ],
        },
      }),
      createdAt: now,
    });

    // The shrine's 1.5× applies live over the grow via
    // getGreenhouseBoostWindows — intentionally NOT baked at plant time and
    // NOT recorded in boostsUsed (its contribution is derived, not locked in).
    expect(state.greenhouse.pots[1].plant?.baseDurationMs).toEqual(
      GREENHOUSE_CROP_TIME_SECONDS.Rice * 1000,
    );
    expect(state.greenhouse.pots[1].plant?.plantedAt).toEqual(now);
    expect(state.boostsUsedAt?.["Tortoise Shrine"]).toBeUndefined();
  });

  it("does not bake a pre-applied Greenhouse Glow at plant time", () => {
    const now = Date.now();
    const state = plantGreenhouse({
      action: { type: "greenhouse.planted", id: 1, seed: "Rice Seed" },
      state: greenhouseState({
        greenhouse: {
          oil: 50,
          pots: {
            1: {
              fertiliser: {
                name: "Greenhouse Glow",
                fertilisedAt: now - 1000,
              },
            },
          },
        },
      }),
      createdAt: now,
    });

    // The pot's open-ended `[fertilisedAt, ∞)` window covers the whole grow
    // (getGreenhouseGlowWindows) — nothing is baked into the stored duration.
    expect(state.greenhouse.pots[1].plant?.baseDurationMs).toEqual(
      GREENHOUSE_CROP_TIME_SECONDS.Rice * 1000,
    );
    expect(state.boostsUsedAt?.["Greenhouse Glow"]).toBeUndefined();
  });
});
