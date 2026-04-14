import { INITIAL_BUMPKIN, TEST_FARM } from "features/game/lib/constants";
import { fertiliseGreenhouse } from "./fertiliseGreenhouse";
import { harvestGreenHouse, getReadyAt } from "./harvestGreenHouse";
import { plantGreenhouse } from "./plantGreenhouse";
import { GameState } from "features/game/types/game";
import Decimal from "decimal.js-light";

const farm: GameState = {
  ...TEST_FARM,
  bumpkin: INITIAL_BUMPKIN,
};

const greenhouseFarm = (): GameState => ({
  ...farm,
  inventory: {
    ...farm.inventory,
    "Rice Seed": new Decimal(5),
    "Greenhouse Goodie": new Decimal(10),
  },
  greenhouse: { oil: 50, pots: {} },
  buildings: {
    ...farm.buildings,
    Greenhouse: [
      {
        coordinates: { x: 0, y: 0 },
        id: "1",
        createdAt: 0,
        readyAt: 0,
      },
    ],
  },
});

describe("plantGreenhouse", () => {
  it("requires greenhouse exists", () => {
    expect(() =>
      harvestGreenHouse({
        action: {
          type: "greenhouse.harvested",
          id: 1,
        },
        state: farm,
        farmId: 1,
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
        farmId: 1,
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
        farmId: 1,
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
        farmId: 1,
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
      farmId: 1,
    });

    expect(state.inventory.Rice).toEqual(new Decimal(1));
  });

  it("clears plant", () => {
    const state = harvestGreenHouse({
      farmId: 1,
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

  it("clears fertiliser on harvest", () => {
    const state = harvestGreenHouse({
      farmId: 1,
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
                name: "Rice",
                plantedAt: Date.now() - 72 * 60 * 60 * 1000,
              },
              fertiliser: {
                name: "Greenhouse Goodie",
                fertilisedAt: 1,
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
    expect(state.greenhouse.pots[1].fertiliser).toBeUndefined();
  });

  it("adds Greenhouse Goodie +0.2 when plant has preset amount", () => {
    const plantedAt = Date.now() - 72 * 60 * 60 * 1000;
    const greenhouseBuilding = [
      {
        coordinates: { x: 0, y: 0 },
        id: "1",
        createdAt: 0,
        readyAt: 0,
      },
    ] as const;

    const withoutGoodie = harvestGreenHouse({
      farmId: 1,
      action: { type: "greenhouse.harvested", id: 1 },
      state: {
        ...farm,
        greenhouse: {
          oil: 50,
          pots: {
            1: {
              plant: {
                name: "Rice",
                plantedAt,
                amount: 5,
              },
            },
          },
        },
        buildings: { ...farm.buildings, Greenhouse: [...greenhouseBuilding] },
      },
    });

    const withGoodie = harvestGreenHouse({
      farmId: 1,
      action: { type: "greenhouse.harvested", id: 1 },
      state: {
        ...farm,
        greenhouse: {
          oil: 50,
          pots: {
            1: {
              plant: {
                name: "Rice",
                plantedAt,
                amount: 5,
              },
              fertiliser: { name: "Greenhouse Goodie", fertilisedAt: 1 },
            },
          },
        },
        buildings: { ...farm.buildings, Greenhouse: [...greenhouseBuilding] },
      },
    });

    expect(withoutGoodie.inventory.Rice).toEqual(new Decimal(5));
    expect(withGoodie.inventory.Rice).toEqual(new Decimal(5.2));
  });

  it("same Rice yield when Greenhouse Goodie applied before vs after planting", () => {
    const t0 = 20_000_000_000_000;

    let beforePlant = fertiliseGreenhouse({
      state: greenhouseFarm(),
      action: {
        type: "greenhouse.fertilised",
        id: 1,
        fertiliser: "Greenhouse Goodie",
      },
      createdAt: t0,
    });
    beforePlant = plantGreenhouse({
      state: beforePlant,
      action: { type: "greenhouse.planted", id: 1, seed: "Rice Seed" },
      createdAt: t0 + 1,
    });
    const plantedAtBefore = beforePlant.greenhouse.pots[1].plant!.plantedAt;
    const harvestAtBefore = getReadyAt({
      plant: "Rice",
      createdAt: plantedAtBefore,
    });
    beforePlant = harvestGreenHouse({
      state: beforePlant,
      action: { type: "greenhouse.harvested", id: 1 },
      createdAt: harvestAtBefore,
      farmId: 1,
    });

    let afterPlant = plantGreenhouse({
      state: greenhouseFarm(),
      action: { type: "greenhouse.planted", id: 1, seed: "Rice Seed" },
      createdAt: t0 + 1,
    });
    afterPlant = fertiliseGreenhouse({
      state: afterPlant,
      action: {
        type: "greenhouse.fertilised",
        id: 1,
        fertiliser: "Greenhouse Goodie",
      },
      createdAt: t0 + 2,
    });
    const plantedAtAfter = afterPlant.greenhouse.pots[1].plant!.plantedAt;
    const harvestAtAfter = getReadyAt({
      plant: "Rice",
      createdAt: plantedAtAfter,
    });
    afterPlant = harvestGreenHouse({
      state: afterPlant,
      action: { type: "greenhouse.harvested", id: 1 },
      createdAt: harvestAtAfter,
      farmId: 1,
    });

    expect(beforePlant.inventory.Rice).toEqual(afterPlant.inventory.Rice);
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
      farmId: 1,
    });

    expect(state.farmActivity["Rice Harvested"]).toEqual(1);
  });

  it("boosts +0.25 Olive yield with Olive Royalty Shirt equipped", () => {
    const state = harvestGreenHouse({
      farmId: 1,
      action: { type: "greenhouse.harvested", id: 1 },
      state: {
        ...farm,
        bumpkin: {
          ...INITIAL_BUMPKIN,
          equipped: {
            ...INITIAL_BUMPKIN.equipped,
            shirt: "Olive Royalty Shirt",
          },
        },
        greenhouse: {
          oil: 50,
          pots: {
            1: {
              plant: {
                name: "Olive",
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
    expect(state.inventory.Olive).toEqual(new Decimal(1.25));
  });

  it("boosts +1 Olive yield with Olive Shield equipped", () => {
    const state = harvestGreenHouse({
      farmId: 1,
      action: { type: "greenhouse.harvested", id: 1 },
      state: {
        ...farm,
        bumpkin: {
          ...INITIAL_BUMPKIN,
          equipped: {
            ...INITIAL_BUMPKIN.equipped,
            secondaryTool: "Olive Shield",
          },
        },
        greenhouse: {
          oil: 50,
          pots: {
            1: {
              plant: {
                name: "Olive",
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
    expect(state.inventory.Olive).toEqual(new Decimal(2));
  });

  it("boosts +1 Rice yield with Non La Hat equipped", () => {
    const state = harvestGreenHouse({
      farmId: 1,
      action: { type: "greenhouse.harvested", id: 1 },
      state: {
        ...farm,
        bumpkin: {
          ...INITIAL_BUMPKIN,
          equipped: {
            ...INITIAL_BUMPKIN.equipped,
            hat: "Non La Hat",
          },
        },
        greenhouse: {
          oil: 50,
          pots: {
            1: {
              plant: {
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

  it("boosts +0.25 Rice yield with Rice Panda placed", () => {
    const state = harvestGreenHouse({
      farmId: 1,
      action: { type: "greenhouse.harvested", id: 1 },
      state: {
        ...farm,
        collectibles: {
          "Rice Panda": [
            {
              id: "1",
              coordinates: { x: 0, y: 0 },
              createdAt: 0,
              readyAt: 0,
            },
          ],
        },
        greenhouse: {
          oil: 50,
          pots: {
            1: {
              plant: {
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
    expect(state.inventory.Rice).toEqual(new Decimal(1.25));
  });

  it("boosts +2 greenhouse crop yield with Pharaoh Gnome placed", () => {
    const state = harvestGreenHouse({
      farmId: 1,
      action: { type: "greenhouse.harvested", id: 1 },
      state: {
        ...farm,
        collectibles: {
          "Pharaoh Gnome": [
            {
              id: "1",
              coordinates: { x: 0, y: 0 },
              createdAt: 0,
              readyAt: 0,
            },
          ],
        },
        greenhouse: {
          oil: 50,
          pots: {
            1: {
              plant: {
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
    expect(state.inventory.Rice).toEqual(new Decimal(3));
  });

  it("boosts +0.1 greenhouse crop yield with Glass Room skill", () => {
    const state = harvestGreenHouse({
      farmId: 1,
      action: { type: "greenhouse.harvested", id: 1 },
      state: {
        ...farm,
        bumpkin: {
          ...INITIAL_BUMPKIN,
          skills: { ...INITIAL_BUMPKIN.skills, "Glass Room": 1 },
        },
        greenhouse: {
          oil: 50,
          pots: {
            1: {
              plant: {
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
    expect(state.inventory.Rice).toEqual(new Decimal(1.1));
  });

  it("boosts +0.5 greenhouse crop yield with Seeded Bounty skill", () => {
    const state = harvestGreenHouse({
      farmId: 1,
      action: { type: "greenhouse.harvested", id: 1 },
      state: {
        ...farm,
        bumpkin: {
          ...INITIAL_BUMPKIN,
          skills: { ...INITIAL_BUMPKIN.skills, "Seeded Bounty": 1 },
        },
        greenhouse: {
          oil: 50,
          pots: {
            1: {
              plant: {
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
    expect(state.inventory.Rice).toEqual(new Decimal(1.5));
  });

  it("boosts +1 greenhouse crop yield with Greasy Plants skill", () => {
    const state = harvestGreenHouse({
      farmId: 1,
      action: { type: "greenhouse.harvested", id: 1 },
      state: {
        ...farm,
        bumpkin: {
          ...INITIAL_BUMPKIN,
          skills: { ...INITIAL_BUMPKIN.skills, "Greasy Plants": 1 },
        },
        greenhouse: {
          oil: 50,
          pots: {
            1: {
              plant: {
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
});
