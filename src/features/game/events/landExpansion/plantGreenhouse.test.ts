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
      })
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
      })
    ).toThrow("Missing Rice Seed");
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
      })
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
      })
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

  it("boosts +0.25 rice yield when Non La Hat is equipped", () => {
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
});
