import { INITIAL_BUMPKIN, TEST_FARM } from "features/game/lib/constants";
import { harvestGreenHouse } from "./harvestGreenHouse";
import { GameState } from "features/game/types/game";
import Decimal from "decimal.js-light";

const farm: GameState = {
  ...TEST_FARM,
  bumpkin: INITIAL_BUMPKIN,
};

describe("plantGreenhouse", () => {
  it("requires greenhouse exists", () => {
    expect(() =>
      harvestGreenHouse({
        action: {
          type: "greenhouse.harvested",
          id: 1,
        },
        state: farm,
      }),
    ).toThrow("Greenhouse does not exist");
  });

  it("requires pot exists", () => {
    expect(() =>
      harvestGreenHouse({
        action: {
          type: "greenhouse.harvested",
          id: 10,
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
    ).toThrow("Pot does not exist");
  });
  it("requires plant exists", () => {
    expect(() =>
      harvestGreenHouse({
        action: {
          type: "greenhouse.harvested",
          id: 1,
        },
        state: {
          ...farm,
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
      }),
    ).toThrow("Plant does not exist");
  });
  it("requires plant is ready", () => {
    expect(() =>
      harvestGreenHouse({
        action: {
          type: "greenhouse.harvested",
          id: 1,
        },
        state: {
          ...farm,
          greenhouse: {
            oil: 50,
            pots: {
              1: {
                plant: {
                  amount: 1,
                  name: "Rice",
                  plantedAt: Date.now() - 100,
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
    ).toThrow("Plant is not ready");
  });
  it("harvests plant", () => {
    const state = harvestGreenHouse({
      action: {
        type: "greenhouse.harvested",
        id: 1,
      },
      state: {
        ...farm,
        greenhouse: {
          oil: 50,
          pots: {
            1: {
              plant: {
                amount: 2,
                name: "Rice",
                plantedAt: Date.now() - 72 * 60 * 60 * 1000,
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
    });

    expect(state.inventory.Rice).toEqual(new Decimal(2));
  });

  it("clears plant", () => {
    const state = harvestGreenHouse({
      action: {
        type: "greenhouse.harvested",
        id: 1,
      },
      state: {
        ...farm,
        greenhouse: {
          oil: 50,
          pots: {
            1: {
              plant: {
                amount: 2,
                name: "Rice",
                plantedAt: Date.now() - 72 * 60 * 60 * 1000,
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
    });

    expect(state.greenhouse.pots[1].plant).toBeUndefined();
  });
  it("tracks analytics", () => {
    const state = harvestGreenHouse({
      action: {
        type: "greenhouse.harvested",
        id: 1,
      },
      state: {
        ...farm,
        greenhouse: {
          oil: 50,
          pots: {
            1: {
              plant: {
                amount: 2,
                name: "Rice",
                plantedAt: Date.now() - 72 * 60 * 60 * 1000,
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
    });

    expect(state.bumpkin?.activity?.["Rice Harvested"]).toEqual(1);
  });
});
