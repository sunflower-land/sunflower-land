import Decimal from "decimal.js-light";
import { TEST_BUMPKIN } from "features/game/lib/bumpkinData";
import { INITIAL_FARM } from "features/game/lib/constants";
import { CropPlot, GameState, Skills } from "features/game/types/game";
import { harvest } from "./harvest";
import { CROPS } from "features/game/types/crops";
import { prngChance } from "lib/prng";
import { KNOWN_IDS } from "features/game/types";

const dateNow = Date.now();
const GAME_STATE: GameState = {
  ...INITIAL_FARM,
  crops: {
    "12": {
      createdAt: dateNow,
      x: 0,
      y: -2,
    },
  },
  balance: new Decimal(0),
  inventory: {},
  bumpkin: TEST_BUMPKIN,
};

describe("harvest", () => {
  it("does not harvest on non-existent plot", () => {
    expect(() =>
      harvest({
        state: GAME_STATE,
        action: {
          type: "crop.harvested",

          index: "-1",
        },
        createdAt: dateNow,
      }),
    ).toThrow("Plot does not exist");
  });

  it("does not harvest empty air", () => {
    expect(() =>
      harvest({
        state: GAME_STATE,
        action: {
          type: "crop.harvested",
          index: "12",
        },
        createdAt: dateNow,
      }),
    ).toThrow("Nothing was planted");
  });

  it("does not harvest if the crop is not ripe", () => {
    const plot = GAME_STATE.crops[0];

    const plantedAt = dateNow - 100;

    expect(() =>
      harvest({
        state: {
          ...GAME_STATE,
          crops: {
            0: {
              ...plot,
              crop: {
                name: "Sunflower",
                plantedAt,
              },
            },
          },
        },
        action: {
          type: "crop.harvested",
          index: "0",
        },
        createdAt: dateNow,
      }),
    ).toThrow(`Not ready`);
  });

  it("harvests a crop", () => {
    const plot = GAME_STATE.crops[0];

    const state = harvest({
      state: {
        ...GAME_STATE,
        inventory: {
          Radish: new Decimal(42),
          Sunflower: new Decimal(2),
        },
        crops: {
          0: {
            ...plot,
            crop: {
              name: "Sunflower",
              plantedAt: dateNow - 2 * 60 * 1000,
            },
          },
        },
      },
      action: {
        type: "crop.harvested",

        index: "0",
      },
      createdAt: dateNow,
    });

    expect(state.inventory).toEqual({
      ...state.inventory,
      Sunflower: new Decimal(3),
    });

    const plotAfterHarvest = state.crops?.[0].crop;

    expect(plotAfterHarvest).not.toBeDefined();
  });

  it("harvests an eggplant", () => {
    const plot = GAME_STATE.crops[0];

    const state = harvest({
      state: {
        ...GAME_STATE,
        inventory: {},
        crops: {
          0: {
            ...plot,
            crop: {
              name: "Eggplant",
              plantedAt: dateNow - 16 * 60 * 60 * 60 * 1000,
            },
          },
        },
      },
      action: {
        type: "crop.harvested",
        index: "0",
      },
      createdAt: dateNow,
    });

    expect(state.inventory).toEqual({
      ...state.inventory,
      Eggplant: new Decimal(1),
    });

    const plotAfterHarvest = state.crops?.[0].crop;

    expect(plotAfterHarvest).not.toBeDefined();
  });

  it("harvests a buffed crop amount", () => {
    const { crops } = GAME_STATE;
    const plot = (crops as Record<number, CropPlot>)[0];

    const state = harvest({
      state: {
        ...GAME_STATE,
        bumpkin: {
          ...TEST_BUMPKIN,
          equipped: {
            ...TEST_BUMPKIN.equipped,
            necklace: "Green Amulet",
          },
        },
        crops: {
          0: {
            ...plot,
            crop: {
              name: "Sunflower",
              plantedAt: dateNow - 2 * 60 * 1000,
              criticalHit: { "Green Amulet": 1 },
            },
          },
        },
      },
      action: {
        type: "crop.harvested",

        index: "0",
      },
      createdAt: dateNow,
    });

    expect(state.inventory.Sunflower).toEqual(new Decimal(10));
  });

  it("adds corn yield with Corn Silk Hair", () => {
    const { crops } = GAME_STATE;
    const plot = (crops as Record<number, CropPlot>)[0];

    const state = harvest({
      state: {
        ...GAME_STATE,
        bumpkin: {
          ...TEST_BUMPKIN,
          equipped: {
            ...TEST_BUMPKIN.equipped,
            hair: "Corn Silk Hair",
          },
        },
        crops: {
          0: {
            ...plot,
            crop: {
              name: "Corn",
              plantedAt: dateNow - CROPS.Corn.harvestSeconds * 1000,
            },
          },
        },
      },
      action: {
        type: "crop.harvested",
        index: "0",
      },
      createdAt: dateNow,
    });

    expect(state.inventory.Corn).toEqual(new Decimal(3));
  });

  it("harvests a unbuffed crop amount if green amulet is not equipped", () => {
    const { crops } = GAME_STATE;
    const plot = (crops as Record<number, CropPlot>)[0];

    const state = harvest({
      state: {
        ...GAME_STATE,
        bumpkin: {
          ...TEST_BUMPKIN,
          equipped: {
            ...TEST_BUMPKIN.equipped,
            necklace: undefined,
          },
        },
        crops: {
          0: {
            ...plot,
            crop: {
              name: "Sunflower",
              plantedAt: dateNow - 2 * 60 * 1000,
              criticalHit: { "Green Amulet": 1 },
            },
          },
        },
      },
      action: {
        type: "crop.harvested",

        index: "0",
      },
      createdAt: dateNow,
    });

    expect(state.inventory.Sunflower).toEqual(new Decimal(1));
  });

  it("harvests a buffed amount if an item is equipped after planting", () => {
    const { crops } = GAME_STATE;
    const plot = (crops as Record<number, CropPlot>)[0];

    const state = harvest({
      state: {
        ...GAME_STATE,
        bumpkin: {
          ...TEST_BUMPKIN,
          equipped: {
            ...TEST_BUMPKIN.equipped,
            necklace: "Sunflower Amulet",
          },
        },
        crops: {
          0: {
            ...plot,
            crop: {
              name: "Sunflower",
              plantedAt: dateNow - 2 * 60 * 1000,
            },
          },
        },
      },
      action: {
        type: "crop.harvested",

        index: "0",
      },
      createdAt: dateNow,
    });

    expect(state.inventory.Sunflower).toEqual(new Decimal(1.1));
  });

  it("harvests a buffed amount if a fertiliser is applied after planting", () => {
    const { crops } = GAME_STATE;
    const plot = (crops as Record<number, CropPlot>)[0];

    const state = harvest({
      state: {
        ...GAME_STATE,
        bumpkin: { ...TEST_BUMPKIN },
        crops: {
          0: {
            ...plot,
            crop: {
              name: "Sunflower",
              plantedAt: dateNow - 2 * 60 * 1000,
            },
            fertiliser: {
              name: "Sprout Mix",
              fertilisedAt: dateNow - 2 * 60 * 1000,
            },
          },
        },
      },
      action: {
        type: "crop.harvested",

        index: "0",
      },
      createdAt: dateNow,
    });

    expect(state.inventory.Sunflower).toEqual(new Decimal(1.2));
  });

  it("harvests a buffed amount if a fertiliser is applied after planting with knowledge crab", () => {
    const { crops } = GAME_STATE;
    const plot = (crops as Record<number, CropPlot>)[0];

    const state = harvest({
      state: {
        ...GAME_STATE,
        bumpkin: { ...TEST_BUMPKIN },
        crops: {
          0: {
            ...plot,
            crop: {
              name: "Sunflower",
              plantedAt: dateNow - 2 * 60 * 1000,
            },
            fertiliser: {
              name: "Sprout Mix",
              fertilisedAt: dateNow - 2 * 60 * 1000,
            },
          },
        },
        collectibles: {
          "Knowledge Crab": [
            {
              id: "123",
              coordinates: { x: 0, y: 0 },
              readyAt: dateNow - 2 * 60 * 1000,
              createdAt: dateNow - 2 * 60 * 1000,
            },
          ],
        },
      },
      action: {
        type: "crop.harvested",

        index: "0",
      },
      createdAt: dateNow,
    });

    expect(state.inventory.Sunflower).toEqual(new Decimal(1.4));
  });

  it("collects item rewards", () => {
    const { crops } = GAME_STATE;
    const plot = (crops as Record<number, CropPlot>)[0];
    const farmId = 1;
    const itemId = KNOWN_IDS["Sunflower"];

    // Find a counter where Native skill (1/20) grants seed reward for Sunflower harvest.
    // Search range must be large enough for 1/20 chance.
    const SEARCH_RANGE = 100_000;
    function findNativeRewardCounter(): number {
      for (let counter = 0; counter < SEARCH_RANGE; counter++) {
        if (
          prngChance({
            farmId,
            itemId,
            counter,
            chance: 5,
            criticalHitName: "Sunflower",
          })
        ) {
          return counter;
        }
      }
      return -1;
    }

    const counter = findNativeRewardCounter();
    if (counter < 0) {
      throw new Error(
        `Could not find counter where Native skill grants seed reward in ${SEARCH_RANGE} attempts`,
      );
    }

    const state = harvest({
      farmId,
      state: {
        ...GAME_STATE,
        inventory: {
          Potato: new Decimal(2),
          "Pumpkin Seed": new Decimal(5),
        },
        bumpkin: {
          ...GAME_STATE.bumpkin,
          skills: { Native: 1 } as Skills,
        },
        farmActivity: {
          "Sunflower Harvested": counter,
        },
        crops: {
          0: {
            ...plot,
            crop: {
              name: "Sunflower",
              plantedAt: dateNow - 2 * 60 * 1000,
            },
          },
        },
      },
      action: {
        type: "crop.harvested",
        index: "0",
      },
      createdAt: dateNow,
    });

    // Native reward: 2 or 3 Sunflower Seed (same prng; when 1/20 hits, 50 check also hits → 2)
    const nativeSeedAmount = prngChance({
      farmId,
      itemId,
      counter,
      chance: 50,
      criticalHitName: "Sunflower Seed",
    })
      ? 2
      : 3;

    expect(state.inventory).toEqual({
      Potato: new Decimal(2),
      "Pumpkin Seed": new Decimal(5),
      Sunflower: new Decimal(1),
      "Sunflower Seed": new Decimal(nativeSeedAmount),
    });
  });

  describe("BumpkinActivity", () => {
    it("increments Sunflowers Harvested activity by 1", () => {
      const { crops } = GAME_STATE;
      const plot = (crops as Record<number, CropPlot>)[0];

      const state = harvest({
        state: {
          ...GAME_STATE,
          crops: {
            0: {
              ...plot,
              crop: {
                name: "Sunflower",
                plantedAt: dateNow - 2 * 60 * 1000,
              },
            },
          },
        },
        action: {
          type: "crop.harvested",

          index: "0",
        },
        createdAt: dateNow,
      });

      expect(state.farmActivity["Sunflower Harvested"]).toEqual(1);
    });

    it("increments Sunflowers Harvested activity by 2", () => {
      const { crops } = GAME_STATE;
      const plot = (crops as Record<number, CropPlot>)[0];

      const stateOne = harvest({
        state: {
          ...GAME_STATE,
          crops: {
            0: {
              ...plot,
              crop: {
                name: "Sunflower",
                plantedAt: dateNow - 2 * 60 * 1000,
              },
            },
          },
        },
        action: {
          type: "crop.harvested",

          index: "0",
        },
        createdAt: dateNow,
      });

      const state = harvest({
        state: {
          ...stateOne,
          crops: {
            0: {
              ...plot,
              crop: {
                name: "Potato",
                plantedAt: dateNow - 6 * 60 * 1000,
              },
            },
          },
        },
        action: {
          type: "crop.harvested",

          index: "0",
        },
        createdAt: dateNow,
      });

      expect(state.farmActivity["Sunflower Harvested"]).toEqual(1);
      expect(state.farmActivity["Potato Harvested"]).toEqual(1);
    });
  });

  it("should throw an error if trying to harvest a crop if its plot is frozen", () => {
    const { crops } = GAME_STATE;
    const plot = (crops as Record<number, CropPlot>)[0];

    expect(() =>
      harvest({
        state: {
          ...GAME_STATE,
          calendar: {
            dates: [],
            greatFreeze: {
              startedAt: new Date().getTime(),
              triggeredAt: dateNow - 1000,
            },
          },
          crops: {
            // Add at least 2 plots so one will be destroyed
            1: {
              ...plot,
              createdAt: dateNow - 2000, // older plot
              crop: {
                name: "Sunflower",
                plantedAt: dateNow - 2 * 60 * 1000,
              },
            },
            2: {
              ...plot,
              createdAt: dateNow - 1000, // newer plot
              crop: {
                name: "Sunflower",
                plantedAt: dateNow - 2 * 60 * 1000,
              },
            },
          },
        },
        action: {
          type: "crop.harvested",
          index: "1",
        },
        createdAt: dateNow,
      }),
    ).toThrow("Plot is affected by greatFreeze");
  });

  describe("cropBuffs", () => {
    const firstId = Object.keys(GAME_STATE.crops)[0];

    it("gives double the yield of Soybeans when Soybliss is placed and ready", () => {
      const state = harvest({
        state: {
          ...GAME_STATE,
          bumpkin: TEST_BUMPKIN,
          inventory: {
            "Soybean Seed": new Decimal(1),
          },
          season: {
            season: "spring",
            startedAt: 0,
          },
          collectibles: {
            Soybliss: [
              {
                id: "123",
                createdAt: dateNow,
                coordinates: { x: 1, y: 1 },
                readyAt: dateNow - 5 * 60 * 1000,
              },
            ],
          },
          crops: {
            [firstId]: {
              ...GAME_STATE.crops[firstId],
              crop: {
                name: "Soybean",
                plantedAt:
                  dateNow - (CROPS["Soybean"].harvestSeconds ?? 0) * 1000,
              },
            },
          },
        },
        createdAt: dateNow,
        action: {
          type: "crop.harvested",
          index: firstId,
        },
      });

      const crops = state.crops;

      expect(crops[firstId].crop).toBeUndefined();
      expect(state.inventory.Soybean).toEqual(new Decimal(2));
    });

    it("gives double the yield of Cauliflowers when Golden Cauliflower is placed and ready", () => {
      const state = harvest({
        state: {
          ...GAME_STATE,
          bumpkin: TEST_BUMPKIN,
          inventory: {
            "Cauliflower Seed": new Decimal(1),
            "Golden Cauliflower": new Decimal(1),
          },
          season: {
            season: "spring",
            startedAt: 0,
          },
          collectibles: {
            "Golden Cauliflower": [
              {
                id: "123",
                createdAt: dateNow,
                coordinates: { x: 1, y: 1 },
                readyAt: dateNow - 5 * 60 * 1000,
              },
            ],
          },
          crops: {
            [firstId]: {
              ...GAME_STATE.crops[firstId],
              crop: {
                name: "Cauliflower",
                plantedAt:
                  dateNow - (CROPS["Cauliflower"].harvestSeconds ?? 0) * 1000,
              },
            },
          },
        },
        createdAt: dateNow,
        action: {
          type: "crop.harvested",
          index: firstId,
        },
      });

      const crops = state.crops;

      expect(crops[firstId].crop).toBeUndefined();
      expect(state.inventory.Cauliflower).toEqual(new Decimal(2));
    });

    it("gives +0.2 to the yield of crops when Scarecrow is placed and ready", () => {
      const state = harvest({
        state: {
          ...GAME_STATE,
          bumpkin: TEST_BUMPKIN,
          inventory: {
            "Sunflower Seed": new Decimal(1),
          },
          season: {
            season: "spring",
            startedAt: 0,
          },
          collectibles: {
            Scarecrow: [
              {
                id: "123",
                createdAt: dateNow,
                coordinates: { x: 1, y: 1 },
                readyAt: dateNow - 5 * 60 * 1000,
              },
            ],
          },
          crops: {
            [firstId]: {
              ...GAME_STATE.crops[firstId],
              crop: {
                name: "Sunflower",
                plantedAt:
                  dateNow - (CROPS["Sunflower"].harvestSeconds ?? 0) * 1000,
              },
            },
          },
        },
        createdAt: dateNow,
        action: {
          type: "crop.harvested",
          index: firstId,
        },
      });

      const crops = state.crops;

      expect(crops[firstId].crop).toBeUndefined();
      expect(state.inventory.Sunflower).toEqual(new Decimal(1.2));
    });

    it("gives +0.2 to the yield of crops when Coder Skill (legacy) is in inventory", () => {
      const state = harvest({
        state: {
          ...GAME_STATE,
          bumpkin: TEST_BUMPKIN,
          inventory: {
            Coder: new Decimal(1),
          },
          season: {
            season: "spring",
            startedAt: 0,
          },
          crops: {
            [firstId]: {
              ...GAME_STATE.crops[firstId],
              crop: {
                name: "Sunflower",
                plantedAt:
                  dateNow - (CROPS["Sunflower"].harvestSeconds ?? 0) * 1000,
              },
            },
          },
        },
        createdAt: dateNow,
        action: {
          type: "crop.harvested",
          index: firstId,
        },
      });

      const crops = state.crops;

      expect(crops[firstId].crop).toBeUndefined();
      expect(state.inventory.Sunflower).toEqual(new Decimal(1.2));
    });

    it("gives 20% more parsnip if bumpkin is equipped with Parsnip Tool", () => {
      const state = harvest({
        state: {
          ...GAME_STATE,
          bumpkin: {
            ...TEST_BUMPKIN,
            equipped: { ...TEST_BUMPKIN.equipped, tool: "Parsnip" },
          },
          inventory: {
            "Parsnip Seed": new Decimal(1),
          },
          season: {
            season: "spring",
            startedAt: 0,
          },
          crops: {
            [firstId]: {
              ...GAME_STATE.crops[firstId],
              crop: {
                name: "Parsnip",
                plantedAt:
                  dateNow - (CROPS["Parsnip"].harvestSeconds ?? 0) * 1000,
              },
            },
          },
        },
        createdAt: dateNow,
        action: {
          type: "crop.harvested",
          index: firstId,
        },
      });

      const crops = state.crops;

      expect(crops[firstId].crop).toBeUndefined();
      expect(state.inventory.Parsnip).toEqual(new Decimal(1.2));
    });

    it("gives +0.25 to the yield of Cabbage when Cabbage Boy is placed and ready", () => {
      const state = harvest({
        state: {
          ...GAME_STATE,
          bumpkin: TEST_BUMPKIN,
          inventory: {
            "Cabbage Seed": new Decimal(1),
          },
          season: {
            season: "spring",
            startedAt: 0,
          },
          collectibles: {
            "Cabbage Boy": [
              {
                id: "123",
                createdAt: dateNow,
                coordinates: { x: 1, y: 1 },
                readyAt: dateNow - 5 * 60 * 1000,
              },
            ],
          },
          crops: {
            [firstId]: {
              ...GAME_STATE.crops[firstId],
              crop: {
                name: "Cabbage",
                plantedAt:
                  dateNow - (CROPS["Cabbage"].harvestSeconds ?? 0) * 1000,
              },
            },
          },
        },
        createdAt: dateNow,
        action: {
          type: "crop.harvested",
          index: firstId,
        },
      });

      const crops = state.crops;

      expect(crops[firstId].crop).toBeUndefined();
      expect(state.inventory.Cabbage).toEqual(new Decimal(1.25));
    });

    it("gives +0.5 to the yield of Cabbage when Cabbage Boy and Girl are placed and ready", () => {
      const state = harvest({
        state: {
          ...GAME_STATE,
          bumpkin: TEST_BUMPKIN,
          inventory: {
            "Cabbage Seed": new Decimal(1),
            "Cabbage Girl": new Decimal(1),
            "Cabbage Boy": new Decimal(1),
          },
          season: {
            season: "spring",
            startedAt: 0,
          },
          collectibles: {
            "Cabbage Boy": [
              {
                id: "123",
                createdAt: dateNow,
                coordinates: { x: 1, y: 1 },
                readyAt: dateNow - 5 * 60 * 1000,
              },
            ],
            "Cabbage Girl": [
              {
                id: "123",
                createdAt: dateNow,
                coordinates: { x: 1, y: 2 },
                readyAt: dateNow - 5 * 60 * 1000,
              },
            ],
          },
          crops: {
            [firstId]: {
              ...GAME_STATE.crops[firstId],
              crop: {
                name: "Cabbage",
                plantedAt:
                  dateNow - (CROPS["Cabbage"].harvestSeconds ?? 0) * 1000,
              },
            },
          },
        },
        createdAt: dateNow,
        action: {
          type: "crop.harvested",
          index: firstId,
        },
      });

      const crops = state.crops;

      expect(crops[firstId].crop).toBeUndefined();
      expect(state.inventory.Cabbage).toEqual(new Decimal(1.5));
    });

    it("gives +0.25 to the yield of Cabbage when Cabbage Boy is placed and ready", () => {
      const state = harvest({
        state: {
          ...GAME_STATE,
          bumpkin: TEST_BUMPKIN,
          inventory: {
            "Cabbage Seed": new Decimal(1),
          },
          season: {
            season: "spring",
            startedAt: 0,
          },
          collectibles: {
            "Cabbage Boy": [
              {
                id: "123",
                createdAt: dateNow,
                coordinates: { x: 1, y: 1 },
                readyAt: dateNow - 5 * 60 * 1000,
              },
            ],
          },
          crops: {
            [firstId]: {
              ...GAME_STATE.crops[firstId],
              crop: {
                name: "Cabbage",
                plantedAt:
                  dateNow - (CROPS["Cabbage"].harvestSeconds ?? 0) * 1000,
              },
            },
          },
        },
        createdAt: dateNow,
        action: {
          type: "crop.harvested",
          index: firstId,
        },
      });

      const crops = state.crops;

      expect(crops[firstId].crop).toBeUndefined();
      expect(state.inventory.Cabbage).toEqual(new Decimal(1.25));
    });

    it("gives +0.1 to the yield of Cabbage when Karkinos is placed and ready", () => {
      const state = harvest({
        state: {
          ...GAME_STATE,
          bumpkin: TEST_BUMPKIN,
          inventory: {
            "Cabbage Seed": new Decimal(1),
          },
          season: {
            season: "spring",
            startedAt: 0,
          },
          collectibles: {
            Karkinos: [
              {
                id: "123",
                createdAt: dateNow,
                coordinates: { x: 1, y: 1 },
                readyAt: dateNow - 5 * 60 * 1000,
              },
            ],
          },
          crops: {
            [firstId]: {
              ...GAME_STATE.crops[firstId],
              crop: {
                name: "Cabbage",
                plantedAt:
                  dateNow - (CROPS["Cabbage"].harvestSeconds ?? 0) * 1000,
              },
            },
          },
        },
        createdAt: dateNow,
        action: {
          type: "crop.harvested",
          index: firstId,
        },
      });

      const crops = state.crops;

      expect(crops[firstId].crop).toBeUndefined();
      expect(state.inventory.Cabbage).toEqual(new Decimal(1.1));
    });

    it("doesn't give a buff if both Cabbage Boy and Karkinos are placed", () => {
      const state = harvest({
        state: {
          ...GAME_STATE,
          bumpkin: TEST_BUMPKIN,
          inventory: {
            "Cabbage Seed": new Decimal(1),
          },
          season: {
            season: "spring",
            startedAt: 0,
          },
          collectibles: {
            "Cabbage Boy": [
              {
                id: "123",
                createdAt: dateNow,
                coordinates: { x: 1, y: 1 },
                readyAt: dateNow - 5 * 60 * 1000,
              },
            ],
            Karkinos: [
              {
                id: "123",
                createdAt: dateNow,
                coordinates: { x: 1, y: 2 },
                readyAt: dateNow - 5 * 60 * 1000,
              },
            ],
          },
          crops: {
            [firstId]: {
              ...GAME_STATE.crops[firstId],
              crop: {
                name: "Cabbage",
                plantedAt:
                  dateNow - (CROPS["Cabbage"].harvestSeconds ?? 0) * 1000,
              },
            },
          },
        },
        createdAt: dateNow,
        action: {
          type: "crop.harvested",
          index: firstId,
        },
      });

      const crops = state.crops;

      expect(crops[firstId].crop).toBeUndefined();
      expect(state.inventory.Cabbage).toEqual(new Decimal(1.25));
    });
    it("gives +0.2 to the yield of Eggplant when Purple Trail is placed and ready", () => {
      const state = harvest({
        state: {
          ...GAME_STATE,
          bumpkin: TEST_BUMPKIN,
          inventory: {
            "Eggplant Seed": new Decimal(1),
          },
          season: {
            season: "spring",
            startedAt: 0,
          },
          collectibles: {
            "Purple Trail": [
              {
                id: "123",
                createdAt: dateNow,
                coordinates: { x: 1, y: 1 },
                readyAt: dateNow - 5 * 60 * 1000,
              },
            ],
          },
          crops: {
            [firstId]: {
              ...GAME_STATE.crops[firstId],
              crop: {
                name: "Eggplant",
                plantedAt:
                  dateNow - (CROPS["Eggplant"].harvestSeconds ?? 0) * 1000,
              },
            },
          },
        },
        createdAt: dateNow,
        action: {
          type: "crop.harvested",
          index: firstId,
        },
      });

      const crops = state.crops;

      expect(crops[firstId].crop).toBeUndefined();
      expect(state.inventory.Eggplant).toEqual(new Decimal(1.2));
    });
    it("gives +1 to the yield of Eggplant when Maximus is placed and ready", () => {
      const state = harvest({
        state: {
          ...GAME_STATE,
          bumpkin: TEST_BUMPKIN,
          inventory: {
            "Eggplant Seed": new Decimal(1),
          },
          season: {
            season: "spring",
            startedAt: 0,
          },
          collectibles: {
            Maximus: [
              {
                id: "123",
                createdAt: dateNow,
                coordinates: { x: 1, y: 1 },
                readyAt: dateNow - 5 * 60 * 1000,
              },
            ],
          },
          crops: {
            [firstId]: {
              ...GAME_STATE.crops[firstId],
              crop: {
                name: "Eggplant",
                plantedAt:
                  dateNow - (CROPS["Eggplant"].harvestSeconds ?? 0) * 1000,
              },
            },
          },
        },
        createdAt: dateNow,
        action: {
          type: "crop.harvested",
          index: firstId,
        },
      });

      const crops = state.crops;

      expect(crops[firstId].crop).toBeUndefined();
      expect(state.inventory.Eggplant).toEqual(new Decimal(2));
    });

    it("gives +2 to the yield of Artichoke when Giant Artichoke is placed and ready", () => {
      const state = harvest({
        state: {
          ...GAME_STATE,
          bumpkin: TEST_BUMPKIN,
          inventory: {
            "Artichoke Seed": new Decimal(1),
          },
          season: {
            season: "spring",
            startedAt: 0,
          },
          collectibles: {
            "Giant Artichoke": [
              {
                id: "123",
                createdAt: dateNow,
                coordinates: { x: 1, y: 1 },
                readyAt: dateNow - 5 * 60 * 1000,
              },
            ],
          },
          crops: {
            [firstId]: {
              ...GAME_STATE.crops[firstId],
              crop: {
                name: "Artichoke",
                plantedAt:
                  dateNow - (CROPS["Artichoke"].harvestSeconds ?? 0) * 1000,
              },
            },
          },
        },
        createdAt: dateNow,
        action: {
          type: "crop.harvested",
          index: firstId,
        },
      });

      const crops = state.crops;

      expect(crops[firstId].crop).toBeUndefined();
      expect(state.inventory.Artichoke).toEqual(new Decimal(3));
    });

    it("gives +3 to the yield of Onion when Giant Onion is placed and ready", () => {
      const state = harvest({
        state: {
          ...GAME_STATE,
          bumpkin: TEST_BUMPKIN,
          inventory: {
            "Onion Seed": new Decimal(1),
          },
          season: {
            season: "spring",
            startedAt: 0,
          },
          collectibles: {
            "Giant Onion": [
              {
                id: "123",
                createdAt: dateNow,
                coordinates: { x: 1, y: 1 },
                readyAt: dateNow - 5 * 60 * 1000,
              },
            ],
          },
          crops: {
            [firstId]: {
              ...GAME_STATE.crops[firstId],
              crop: {
                name: "Onion",
                plantedAt:
                  dateNow - (CROPS["Onion"].harvestSeconds ?? 0) * 1000,
              },
            },
          },
        },
        createdAt: dateNow,
        action: {
          type: "crop.harvested",
          index: firstId,
        },
      });

      const crops = state.crops;

      expect(crops[firstId].crop).toBeUndefined();
      expect(state.inventory.Onion).toEqual(new Decimal(4));
    });

    it("gives +0.2 to the yield of Cabbage in AOE range when Scary Mike is placed and ready", () => {
      const state = harvest({
        state: {
          ...GAME_STATE,
          bumpkin: TEST_BUMPKIN,
          inventory: {
            "Cabbage Seed": new Decimal(1),
          },
          season: {
            season: "spring",
            startedAt: 0,
          },
          collectibles: {
            "Scary Mike": [
              {
                id: "123",
                createdAt: dateNow,
                coordinates: { x: 0, y: 0 },
                // ready at < now
                readyAt: dateNow - 12 * 60 * 1000,
              },
            ],
          },
          crops: {
            [firstId]: {
              ...GAME_STATE.crops[firstId],
              crop: {
                name: "Cabbage",
                plantedAt:
                  dateNow - (CROPS["Cabbage"].harvestSeconds ?? 0) * 1000,
              },
            },
          },
        },
        createdAt: dateNow,
        action: {
          type: "crop.harvested",
          index: firstId,
        },
      });

      const crops = state.crops;

      expect(crops[firstId].crop).toBeUndefined();
      expect(state.inventory.Cabbage).toEqual(new Decimal(1.2));
    });

    it("sets the AOE last used time to now", () => {
      const state = harvest({
        state: {
          ...GAME_STATE,
          bumpkin: TEST_BUMPKIN,
          inventory: {
            "Cabbage Seed": new Decimal(1),
          },
          season: {
            season: "spring",
            startedAt: 0,
          },
          collectibles: {
            "Scary Mike": [
              {
                id: "123",
                createdAt: dateNow,
                coordinates: { x: 0, y: 0 },
                // ready at < now
                readyAt: dateNow - 12 * 60 * 1000,
              },
            ],
          },
          crops: {
            [firstId]: {
              ...GAME_STATE.crops[firstId],
              crop: {
                name: "Cabbage",
                plantedAt:
                  dateNow - (CROPS["Cabbage"].harvestSeconds ?? 0) * 1000,
              },
            },
          },
        },
        createdAt: dateNow,
        action: {
          type: "crop.harvested",
          index: firstId,
        },
      });

      expect(state.aoe["Scary Mike"]).toEqual({
        0: {
          "-2": dateNow,
        },
      });
    });

    it("does not apply the AOE if the AOE is not ready", () => {
      const state = harvest({
        state: {
          ...GAME_STATE,
          bumpkin: TEST_BUMPKIN,
          inventory: {
            "Cabbage Seed": new Decimal(1),
          },
          season: {
            season: "spring",
            startedAt: 0,
          },
          collectibles: {
            "Scary Mike": [
              {
                id: "123",
                createdAt: dateNow,
                coordinates: { x: 0, y: 0 },
                // ready at < now
                readyAt: dateNow - 12 * 60 * 1000,
              },
            ],
          },
          aoe: {
            "Scary Mike": {
              0: {
                "-2": dateNow,
              },
            },
          },
          crops: {
            [firstId]: {
              ...GAME_STATE.crops[firstId],
              crop: {
                name: "Cabbage",
                plantedAt:
                  dateNow - (CROPS["Cabbage"].harvestSeconds ?? 0) * 1000,
              },
            },
          },
        },
        createdAt: dateNow,
        action: {
          type: "crop.harvested",
          index: firstId,
        },
      });

      expect(state.inventory.Cabbage).toEqual(new Decimal(1));
    });

    it("applies the AOE if the AOE is ready", () => {
      const state = harvest({
        state: {
          ...GAME_STATE,
          bumpkin: TEST_BUMPKIN,
          inventory: {
            "Cabbage Seed": new Decimal(1),
          },
          season: {
            season: "spring",
            startedAt: 0,
          },
          collectibles: {
            "Scary Mike": [
              {
                id: "123",
                createdAt: dateNow,
                coordinates: { x: 0, y: 0 },
                // ready at < now
                readyAt: dateNow - 12 * 60 * 1000,
              },
            ],
          },
          aoe: {
            "Scary Mike": {
              0: {
                "-2": dateNow - CROPS["Cabbage"].harvestSeconds * 1000,
              },
            },
          },
          crops: {
            [firstId]: {
              ...GAME_STATE.crops[firstId],
              crop: {
                name: "Cabbage",
                plantedAt:
                  dateNow - (CROPS["Cabbage"].harvestSeconds ?? 0) * 1000,
              },
            },
          },
        },
        createdAt: dateNow,
        action: {
          type: "crop.harvested",
          index: firstId,
        },
      });

      expect(state.inventory.Cabbage).toEqual(new Decimal(1.2));
    });

    it("applies the AOE on a crop with boosted time", () => {
      const boostedTime = CROPS["Cabbage"].harvestSeconds * 1000 * 0.5;

      const state = harvest({
        state: {
          ...GAME_STATE,
          bumpkin: TEST_BUMPKIN,
          inventory: {
            "Cabbage Seed": new Decimal(1),
          },
          season: {
            season: "spring",
            startedAt: 0,
          },
          collectibles: {
            "Scary Mike": [
              {
                id: "123",
                createdAt: dateNow,
                coordinates: { x: 0, y: 0 },
                // ready at < now
                readyAt: dateNow - 12 * 60 * 1000,
              },
            ],
          },
          aoe: {
            "Scary Mike": {
              0: {
                "-2":
                  dateNow -
                  (CROPS["Cabbage"].harvestSeconds * 1000 - boostedTime),
              },
            },
          },
          crops: {
            [firstId]: {
              ...GAME_STATE.crops[firstId],
              crop: {
                name: "Cabbage",
                plantedAt:
                  dateNow - (CROPS["Cabbage"].harvestSeconds ?? 0) * 1000,
                boostedTime,
              },
            },
          },
        },
        createdAt: dateNow,
        action: {
          type: "crop.harvested",
          index: firstId,
        },
      });

      expect(state.inventory.Cabbage).toEqual(new Decimal(1.2));
    });

    it("applies the bud boost", () => {
      const state = harvest({
        state: {
          ...GAME_STATE,
          bumpkin: TEST_BUMPKIN,
          inventory: {
            "Cabbage Seed": new Decimal(1),
          },
          season: {
            season: "spring",
            startedAt: 0,
          },
          buds: {
            1: {
              aura: "No Aura",
              colour: "Green",
              type: "Castle",
              ears: "Ears",
              stem: "Egg Head",
              coordinates: {
                x: 0,
                y: 0,
              },
            },
          },
          crops: {
            [firstId]: {
              ...GAME_STATE.crops[firstId],
              crop: {
                name: "Cabbage",
                plantedAt:
                  dateNow - (CROPS["Cabbage"].harvestSeconds ?? 0) * 1000,
              },
            },
          },
        },
        createdAt: dateNow,
        action: {
          type: "crop.harvested",
          index: firstId,
        },
      });

      const crops = state.crops;

      expect(crops[firstId].crop).toBeUndefined();
      expect(state.inventory.Cabbage).toEqual(new Decimal(1.3));
    });

    it("gives +0.1 to the yield of Sunflower when Sunflower Amulet is equipped", () => {
      const state = harvest({
        state: {
          ...GAME_STATE,
          bumpkin: {
            ...TEST_BUMPKIN,
            equipped: {
              ...TEST_BUMPKIN.equipped,
              necklace: "Sunflower Amulet",
            },
          },
          inventory: {
            "Sunflower Seed": new Decimal(1),
          },
          season: {
            season: "spring",
            startedAt: 0,
          },

          crops: {
            [firstId]: {
              ...GAME_STATE.crops[firstId],
              crop: {
                name: "Sunflower",
                plantedAt:
                  dateNow - (CROPS["Sunflower"].harvestSeconds ?? 0) * 1000,
              },
            },
          },
        },
        createdAt: dateNow,
        action: {
          type: "crop.harvested",
          index: firstId,
        },
      });

      const crops = state.crops;

      expect(crops[firstId].crop).toBeUndefined();
      expect(state.inventory.Sunflower).toEqual(new Decimal(1.1));
    });

    it("gives 1.2x Carrot when Easter Bunny is placed and ready", () => {
      const state = harvest({
        state: {
          ...GAME_STATE,
          bumpkin: TEST_BUMPKIN,
          inventory: { "Carrot Seed": new Decimal(1) },
          season: { season: "spring", startedAt: 0 },
          collectibles: {
            "Easter Bunny": [
              {
                id: "123",
                createdAt: dateNow,
                coordinates: { x: 1, y: 1 },
                readyAt: dateNow - 5 * 60 * 1000,
              },
            ],
          },
          crops: {
            [firstId]: {
              ...GAME_STATE.crops[firstId],
              crop: {
                name: "Carrot",
                plantedAt:
                  dateNow - (CROPS["Carrot"].harvestSeconds ?? 0) * 1000,
              },
            },
          },
        },
        createdAt: dateNow,
        action: { type: "crop.harvested", index: firstId },
      });
      expect(state.crops[firstId].crop).toBeUndefined();
      expect(state.inventory.Carrot).toEqual(new Decimal(1.2));
    });

    it("gives 1.2x Pumpkin when Victoria Sisters is placed and ready", () => {
      const state = harvest({
        state: {
          ...GAME_STATE,
          bumpkin: TEST_BUMPKIN,
          inventory: { "Pumpkin Seed": new Decimal(1) },
          season: { season: "autumn", startedAt: 0 },
          collectibles: {
            "Victoria Sisters": [
              {
                id: "123",
                createdAt: dateNow,
                coordinates: { x: 1, y: 1 },
                readyAt: dateNow - 5 * 60 * 1000,
              },
            ],
          },
          crops: {
            [firstId]: {
              ...GAME_STATE.crops[firstId],
              crop: {
                name: "Pumpkin",
                plantedAt:
                  dateNow - (CROPS["Pumpkin"].harvestSeconds ?? 0) * 1000,
              },
            },
          },
        },
        createdAt: dateNow,
        action: { type: "crop.harvested", index: firstId },
      });
      expect(state.crops[firstId].crop).toBeUndefined();
      expect(state.inventory.Pumpkin).toEqual(new Decimal(1.2));
    });

    it("gives 1.2x Beetroot when Beetroot Amulet is equipped", () => {
      const state = harvest({
        state: {
          ...GAME_STATE,
          bumpkin: {
            ...TEST_BUMPKIN,
            equipped: {
              ...TEST_BUMPKIN.equipped,
              necklace: "Beetroot Amulet",
            },
          },
          inventory: { "Beetroot Seed": new Decimal(1) },
          season: { season: "summer", startedAt: 0 },
          crops: {
            [firstId]: {
              ...GAME_STATE.crops[firstId],
              crop: {
                name: "Beetroot",
                plantedAt:
                  dateNow - (CROPS["Beetroot"].harvestSeconds ?? 0) * 1000,
              },
            },
          },
        },
        createdAt: dateNow,
        action: { type: "crop.harvested", index: firstId },
      });
      expect(state.crops[firstId].crop).toBeUndefined();
      expect(state.inventory.Beetroot).toEqual(new Decimal(1.2));
    });

    it("gives +0.2 to the yield of crops when Kuebiko is placed and ready", () => {
      const state = harvest({
        state: {
          ...GAME_STATE,
          bumpkin: TEST_BUMPKIN,
          inventory: { "Sunflower Seed": new Decimal(1) },
          season: { season: "spring", startedAt: 0 },
          collectibles: {
            Kuebiko: [
              {
                id: "123",
                createdAt: dateNow,
                coordinates: { x: 1, y: 1 },
                readyAt: dateNow - 5 * 60 * 1000,
              },
            ],
          },
          crops: {
            [firstId]: {
              ...GAME_STATE.crops[firstId],
              crop: {
                name: "Sunflower",
                plantedAt:
                  dateNow - (CROPS["Sunflower"].harvestSeconds ?? 0) * 1000,
              },
            },
          },
        },
        createdAt: dateNow,
        action: { type: "crop.harvested", index: firstId },
      });
      expect(state.crops[firstId].crop).toBeUndefined();
      expect(state.inventory.Sunflower).toEqual(new Decimal(1.2));
    });

    it("gives +0.1 to the yield of Carrot when Pablo The Bunny is placed and ready", () => {
      const state = harvest({
        state: {
          ...GAME_STATE,
          bumpkin: TEST_BUMPKIN,
          inventory: { "Carrot Seed": new Decimal(1) },
          season: { season: "spring", startedAt: 0 },
          collectibles: {
            "Pablo The Bunny": [
              {
                id: "123",
                createdAt: dateNow,
                coordinates: { x: 1, y: 1 },
                readyAt: dateNow - 5 * 60 * 1000,
              },
            ],
          },
          crops: {
            [firstId]: {
              ...GAME_STATE.crops[firstId],
              crop: {
                name: "Carrot",
                plantedAt:
                  dateNow - (CROPS["Carrot"].harvestSeconds ?? 0) * 1000,
              },
            },
          },
        },
        createdAt: dateNow,
        action: { type: "crop.harvested", index: firstId },
      });
      expect(state.crops[firstId].crop).toBeUndefined();
      expect(state.inventory.Carrot).toEqual(new Decimal(1.1));
    });

    it("gives +0.2 to the yield of Kale when Foliant is placed and ready", () => {
      const state = harvest({
        state: {
          ...GAME_STATE,
          bumpkin: TEST_BUMPKIN,
          inventory: { "Kale Seed": new Decimal(1) },
          season: { season: "spring", startedAt: 0 },
          collectibles: {
            Foliant: [
              {
                id: "123",
                createdAt: dateNow,
                coordinates: { x: 1, y: 1 },
                readyAt: dateNow - 5 * 60 * 1000,
              },
            ],
          },
          crops: {
            [firstId]: {
              ...GAME_STATE.crops[firstId],
              crop: {
                name: "Kale",
                plantedAt: dateNow - (CROPS["Kale"].harvestSeconds ?? 0) * 1000,
              },
            },
          },
        },
        createdAt: dateNow,
        action: { type: "crop.harvested", index: firstId },
      });
      expect(state.crops[firstId].crop).toBeUndefined();
      expect(state.inventory.Kale).toEqual(new Decimal(1.2));
    });

    it("gives +0.1 to the yield of Eggplant when Eggplant Onesie is equipped", () => {
      const state = harvest({
        state: {
          ...GAME_STATE,
          bumpkin: {
            ...TEST_BUMPKIN,
            equipped: {
              ...TEST_BUMPKIN.equipped,
              onesie: "Eggplant Onesie",
            },
          },
          inventory: { "Eggplant Seed": new Decimal(1) },
          season: { season: "summer", startedAt: 0 },
          crops: {
            [firstId]: {
              ...GAME_STATE.crops[firstId],
              crop: {
                name: "Eggplant",
                plantedAt:
                  dateNow - (CROPS["Eggplant"].harvestSeconds ?? 0) * 1000,
              },
            },
          },
        },
        createdAt: dateNow,
        action: { type: "crop.harvested", index: firstId },
      });
      expect(state.crops[firstId].crop).toBeUndefined();
      expect(state.inventory.Eggplant).toEqual(new Decimal(1.1));
    });

    it("gives +0.5 to the yield of Yam when Giant Yam is placed and ready", () => {
      const state = harvest({
        state: {
          ...GAME_STATE,
          bumpkin: TEST_BUMPKIN,
          inventory: { "Yam Seed": new Decimal(1) },
          season: { season: "autumn", startedAt: 0 },
          collectibles: {
            "Giant Yam": [
              {
                id: "123",
                createdAt: dateNow,
                coordinates: { x: 1, y: 1 },
                readyAt: dateNow - 5 * 60 * 1000,
              },
            ],
          },
          crops: {
            [firstId]: {
              ...GAME_STATE.crops[firstId],
              crop: {
                name: "Yam",
                plantedAt: dateNow - (CROPS["Yam"].harvestSeconds ?? 0) * 1000,
              },
            },
          },
        },
        createdAt: dateNow,
        action: { type: "crop.harvested", index: firstId },
      });
      expect(state.crops[firstId].crop).toBeUndefined();
      expect(state.inventory.Yam).toEqual(new Decimal(1.5));
    });

    it("gives +0.1 to the yield of Soybean when Tofu Mask is equipped", () => {
      const state = harvest({
        state: {
          ...GAME_STATE,
          bumpkin: {
            ...TEST_BUMPKIN,
            equipped: {
              ...TEST_BUMPKIN.equipped,
              hat: "Tofu Mask",
            },
          },
          inventory: { "Soybean Seed": new Decimal(1) },
          season: { season: "spring", startedAt: 0 },
          crops: {
            [firstId]: {
              ...GAME_STATE.crops[firstId],
              crop: {
                name: "Soybean",
                plantedAt:
                  dateNow - (CROPS["Soybean"].harvestSeconds ?? 0) * 1000,
              },
            },
          },
        },
        createdAt: dateNow,
        action: { type: "crop.harvested", index: firstId },
      });
      expect(state.crops[firstId].crop).toBeUndefined();
      expect(state.inventory.Soybean).toEqual(new Decimal(1.1));
    });

    it("gives +0.1 to the yield of Corn when Corn Onesie is equipped", () => {
      const state = harvest({
        state: {
          ...GAME_STATE,
          bumpkin: {
            ...TEST_BUMPKIN,
            equipped: { ...TEST_BUMPKIN.equipped, onesie: "Corn Onesie" },
          },
          inventory: { "Corn Seed": new Decimal(1) },
          season: { season: "spring", startedAt: 0 },
          crops: {
            [firstId]: {
              ...GAME_STATE.crops[firstId],
              crop: {
                name: "Corn",
                plantedAt: dateNow - (CROPS["Corn"].harvestSeconds ?? 0) * 1000,
              },
            },
          },
        },
        createdAt: dateNow,
        action: { type: "crop.harvested", index: firstId },
      });
      expect(state.crops[firstId].crop).toBeUndefined();
      expect(state.inventory.Corn).toEqual(new Decimal(1.1));
    });

    it("gives +2 to the yield of Wheat when Sickle is equipped", () => {
      const state = harvest({
        state: {
          ...GAME_STATE,
          bumpkin: {
            ...TEST_BUMPKIN,
            equipped: { ...TEST_BUMPKIN.equipped, tool: "Sickle" },
          },
          inventory: { "Wheat Seed": new Decimal(1) },
          season: { season: "spring", startedAt: 0 },
          crops: {
            [firstId]: {
              ...GAME_STATE.crops[firstId],
              crop: {
                name: "Wheat",
                plantedAt:
                  dateNow - (CROPS["Wheat"].harvestSeconds ?? 0) * 1000,
              },
            },
          },
        },
        createdAt: dateNow,
        action: { type: "crop.harvested", index: firstId },
      });
      expect(state.crops[firstId].crop).toBeUndefined();
      expect(state.inventory.Wheat).toEqual(new Decimal(3));
    });

    it("gives +2 to the yield of Barley when Sheaf of Plenty is placed and ready", () => {
      const state = harvest({
        state: {
          ...GAME_STATE,
          bumpkin: TEST_BUMPKIN,
          inventory: { "Barley Seed": new Decimal(1) },
          season: { season: "spring", startedAt: 0 },
          collectibles: {
            "Sheaf of Plenty": [
              {
                id: "123",
                createdAt: dateNow,
                coordinates: { x: 1, y: 1 },
                readyAt: dateNow - 5 * 60 * 1000,
              },
            ],
          },
          crops: {
            [firstId]: {
              ...GAME_STATE.crops[firstId],
              crop: {
                name: "Barley",
                plantedAt:
                  dateNow - (CROPS["Barley"].harvestSeconds ?? 0) * 1000,
              },
            },
          },
        },
        createdAt: dateNow,
        action: { type: "crop.harvested", index: firstId },
      });
      expect(state.crops[firstId].crop).toBeUndefined();
      expect(state.inventory.Barley).toEqual(new Decimal(3));
    });

    it("gives +2 to the yield of Kale when Giant Kale is placed and ready", () => {
      const state = harvest({
        state: {
          ...GAME_STATE,
          bumpkin: TEST_BUMPKIN,
          inventory: { "Kale Seed": new Decimal(1) },
          season: { season: "spring", startedAt: 0 },
          collectibles: {
            "Giant Kale": [
              {
                id: "123",
                createdAt: dateNow,
                coordinates: { x: 1, y: 1 },
                readyAt: dateNow - 5 * 60 * 1000,
              },
            ],
          },
          crops: {
            [firstId]: {
              ...GAME_STATE.crops[firstId],
              crop: {
                name: "Kale",
                plantedAt: dateNow - (CROPS["Kale"].harvestSeconds ?? 0) * 1000,
              },
            },
          },
        },
        createdAt: dateNow,
        action: { type: "crop.harvested", index: firstId },
      });
      expect(state.crops[firstId].crop).toBeUndefined();
      expect(state.inventory.Kale).toEqual(new Decimal(3));
    });

    it("gives +1 to the yield of spring crop when Blossom Ward is equipped", () => {
      const state = harvest({
        state: {
          ...GAME_STATE,
          bumpkin: {
            ...TEST_BUMPKIN,
            equipped: {
              ...TEST_BUMPKIN.equipped,
              secondaryTool: "Blossom Ward",
            },
          },
          inventory: { "Carrot Seed": new Decimal(1) },
          season: { season: "spring", startedAt: 0 },
          crops: {
            [firstId]: {
              ...GAME_STATE.crops[firstId],
              crop: {
                name: "Carrot",
                plantedAt:
                  dateNow - (CROPS["Carrot"].harvestSeconds ?? 0) * 1000,
              },
            },
          },
        },
        createdAt: dateNow,
        action: { type: "crop.harvested", index: firstId },
      });
      expect(state.crops[firstId].crop).toBeUndefined();
      expect(state.inventory.Carrot).toEqual(new Decimal(2));
    });

    it("gives +1 to the yield of winter crop when Frozen Heart is equipped", () => {
      const state = harvest({
        state: {
          ...GAME_STATE,
          bumpkin: {
            ...TEST_BUMPKIN,
            equipped: {
              ...TEST_BUMPKIN.equipped,
              secondaryTool: "Frozen Heart",
            },
          },
          inventory: { "Cauliflower Seed": new Decimal(1) },
          season: { season: "winter", startedAt: 0 },
          crops: {
            [firstId]: {
              ...GAME_STATE.crops[firstId],
              crop: {
                name: "Cauliflower",
                plantedAt:
                  dateNow - (CROPS["Cauliflower"].harvestSeconds ?? 0) * 1000,
              },
            },
          },
        },
        createdAt: dateNow,
        action: { type: "crop.harvested", index: firstId },
      });
      expect(state.crops[firstId].crop).toBeUndefined();
      expect(state.inventory.Cauliflower).toEqual(new Decimal(2));
    });

    it("gives +3 to the yield of any crop when Infernal Pitchfork is equipped", () => {
      const state = harvest({
        state: {
          ...GAME_STATE,
          bumpkin: {
            ...TEST_BUMPKIN,
            equipped: {
              ...TEST_BUMPKIN.equipped,
              tool: "Infernal Pitchfork",
            },
          },
          inventory: { "Sunflower Seed": new Decimal(1) },
          season: { season: "spring", startedAt: 0 },
          crops: {
            [firstId]: {
              ...GAME_STATE.crops[firstId],
              crop: {
                name: "Sunflower",
                plantedAt:
                  dateNow - (CROPS["Sunflower"].harvestSeconds ?? 0) * 1000,
              },
            },
          },
        },
        createdAt: dateNow,
        action: { type: "crop.harvested", index: firstId },
      });
      expect(state.crops[firstId].crop).toBeUndefined();
      expect(state.inventory.Sunflower).toEqual(new Decimal(4));
    });

    it("gives +1 to the yield of any crop when Legendary Shrine is active", () => {
      const state = harvest({
        state: {
          ...GAME_STATE,
          bumpkin: TEST_BUMPKIN,
          inventory: { "Sunflower Seed": new Decimal(1) },
          season: { season: "spring", startedAt: 0 },
          collectibles: {
            "Legendary Shrine": [
              {
                id: "123",
                createdAt: dateNow - 1000,
                coordinates: { x: 1, y: 1 },
              },
            ],
          },
          crops: {
            [firstId]: {
              ...GAME_STATE.crops[firstId],
              crop: {
                name: "Sunflower",
                plantedAt:
                  dateNow - (CROPS["Sunflower"].harvestSeconds ?? 0) * 1000,
              },
            },
          },
        },
        createdAt: dateNow,
        action: { type: "crop.harvested", index: firstId },
      });
      expect(state.crops[firstId].crop).toBeUndefined();
      expect(state.inventory.Sunflower).toEqual(new Decimal(2));
    });

    it("gives +0.5 to the yield of overnight crop when Hoot is placed and ready", () => {
      const state = harvest({
        state: {
          ...GAME_STATE,
          bumpkin: TEST_BUMPKIN,
          inventory: { "Radish Seed": new Decimal(1) },
          season: { season: "summer", startedAt: 0 },
          collectibles: {
            Hoot: [
              {
                id: "123",
                createdAt: dateNow,
                coordinates: { x: 1, y: 1 },
                readyAt: dateNow - 5 * 60 * 1000,
              },
            ],
          },
          crops: {
            [firstId]: {
              ...GAME_STATE.crops[firstId],
              crop: {
                name: "Radish",
                plantedAt:
                  dateNow - (CROPS["Radish"].harvestSeconds ?? 0) * 1000,
              },
            },
          },
        },
        createdAt: dateNow,
        action: { type: "crop.harvested", index: firstId },
      });
      expect(state.crops[firstId].crop).toBeUndefined();
      expect(state.inventory.Radish).toEqual(new Decimal(1.5));
    });

    it("gives +0.1 to the yield of Corn when Poppy is placed and ready", () => {
      const state = harvest({
        state: {
          ...GAME_STATE,
          bumpkin: TEST_BUMPKIN,
          inventory: { "Corn Seed": new Decimal(1) },
          season: { season: "spring", startedAt: 0 },
          collectibles: {
            Poppy: [
              {
                id: "123",
                createdAt: dateNow,
                coordinates: { x: 1, y: 1 },
                readyAt: dateNow - 5 * 60 * 1000,
              },
            ],
          },
          crops: {
            [firstId]: {
              ...GAME_STATE.crops[firstId],
              crop: {
                name: "Corn",
                plantedAt: dateNow - (CROPS["Corn"].harvestSeconds ?? 0) * 1000,
              },
            },
          },
        },
        createdAt: dateNow,
        action: { type: "crop.harvested", index: firstId },
      });
      expect(state.crops[firstId].crop).toBeUndefined();
      expect(state.inventory.Corn).toEqual(new Decimal(1.1));
    });

    it("gives +0.5 to the yield of Pumpkin when Freya Fox is placed and ready", () => {
      const state = harvest({
        state: {
          ...GAME_STATE,
          bumpkin: TEST_BUMPKIN,
          inventory: { "Pumpkin Seed": new Decimal(1) },
          season: { season: "autumn", startedAt: 0 },
          collectibles: {
            "Freya Fox": [
              {
                id: "123",
                createdAt: dateNow,
                coordinates: { x: 1, y: 1 },
                readyAt: dateNow - 5 * 60 * 1000,
              },
            ],
          },
          crops: {
            [firstId]: {
              ...GAME_STATE.crops[firstId],
              crop: {
                name: "Pumpkin",
                plantedAt:
                  dateNow - (CROPS["Pumpkin"].harvestSeconds ?? 0) * 1000,
              },
            },
          },
        },
        createdAt: dateNow,
        action: { type: "crop.harvested", index: firstId },
      });
      expect(state.crops[firstId].crop).toBeUndefined();
      expect(state.inventory.Pumpkin).toEqual(new Decimal(1.5));
    });

    it("gives +0.2 to the yield of Carrot when Lab Grown Carrot is placed and ready", () => {
      const state = harvest({
        state: {
          ...GAME_STATE,
          bumpkin: TEST_BUMPKIN,
          inventory: { "Carrot Seed": new Decimal(1) },
          season: { season: "spring", startedAt: 0 },
          collectibles: {
            "Lab Grown Carrot": [
              {
                id: "123",
                createdAt: dateNow,
                coordinates: { x: 1, y: 1 },
                readyAt: dateNow - 5 * 60 * 1000,
              },
            ],
          },
          crops: {
            [firstId]: {
              ...GAME_STATE.crops[firstId],
              crop: {
                name: "Carrot",
                plantedAt:
                  dateNow - (CROPS["Carrot"].harvestSeconds ?? 0) * 1000,
              },
            },
          },
        },
        createdAt: dateNow,
        action: { type: "crop.harvested", index: firstId },
      });
      expect(state.crops[firstId].crop).toBeUndefined();
      expect(state.inventory.Carrot).toEqual(new Decimal(1.2));
    });

    it("gives +0.3 to the yield of Pumpkin when Lab Grown Pumpkin is placed and ready", () => {
      const state = harvest({
        state: {
          ...GAME_STATE,
          bumpkin: TEST_BUMPKIN,
          inventory: { "Pumpkin Seed": new Decimal(1) },
          season: { season: "autumn", startedAt: 0 },
          collectibles: {
            "Lab Grown Pumpkin": [
              {
                id: "123",
                createdAt: dateNow,
                coordinates: { x: 1, y: 1 },
                readyAt: dateNow - 5 * 60 * 1000,
              },
            ],
          },
          crops: {
            [firstId]: {
              ...GAME_STATE.crops[firstId],
              crop: {
                name: "Pumpkin",
                plantedAt:
                  dateNow - (CROPS["Pumpkin"].harvestSeconds ?? 0) * 1000,
              },
            },
          },
        },
        createdAt: dateNow,
        action: { type: "crop.harvested", index: firstId },
      });
      expect(state.crops[firstId].crop).toBeUndefined();
      expect(state.inventory.Pumpkin).toEqual(new Decimal(1.3));
    });

    it("gives +0.4 to the yield of Radish when Lab Grown Radish is placed and ready", () => {
      const state = harvest({
        state: {
          ...GAME_STATE,
          bumpkin: TEST_BUMPKIN,
          inventory: { "Radish Seed": new Decimal(1) },
          season: { season: "summer", startedAt: 0 },
          collectibles: {
            "Lab Grown Radish": [
              {
                id: "123",
                createdAt: dateNow,
                coordinates: { x: 1, y: 1 },
                readyAt: dateNow - 5 * 60 * 1000,
              },
            ],
          },
          crops: {
            [firstId]: {
              ...GAME_STATE.crops[firstId],
              crop: {
                name: "Radish",
                plantedAt:
                  dateNow - (CROPS["Radish"].harvestSeconds ?? 0) * 1000,
              },
            },
          },
        },
        createdAt: dateNow,
        action: { type: "crop.harvested", index: firstId },
      });
      expect(state.crops[firstId].crop).toBeUndefined();
      expect(state.inventory.Radish).toEqual(new Decimal(1.4));
    });

    it("gives +0.1 to basic crop when Young Farmer skill is active", () => {
      const state = harvest({
        state: {
          ...GAME_STATE,
          bumpkin: {
            ...TEST_BUMPKIN,
            skills: { ...TEST_BUMPKIN.skills, "Young Farmer": 1 },
          },
          inventory: { "Sunflower Seed": new Decimal(1) },
          season: { season: "spring", startedAt: 0 },
          crops: {
            [firstId]: {
              ...GAME_STATE.crops[firstId],
              crop: {
                name: "Sunflower",
                plantedAt:
                  dateNow - (CROPS["Sunflower"].harvestSeconds ?? 0) * 1000,
              },
            },
          },
        },
        createdAt: dateNow,
        action: { type: "crop.harvested", index: firstId },
      });
      expect(state.crops[firstId].crop).toBeUndefined();
      expect(state.inventory.Sunflower).toEqual(new Decimal(1.1));
    });

    it("gives +0.1 to medium crop when Experienced Farmer skill is active", () => {
      const state = harvest({
        state: {
          ...GAME_STATE,
          bumpkin: {
            ...TEST_BUMPKIN,
            skills: { ...TEST_BUMPKIN.skills, "Experienced Farmer": 1 },
          },
          inventory: { "Cabbage Seed": new Decimal(1) },
          season: { season: "spring", startedAt: 0 },
          crops: {
            [firstId]: {
              ...GAME_STATE.crops[firstId],
              crop: {
                name: "Cabbage",
                plantedAt:
                  dateNow - (CROPS["Cabbage"].harvestSeconds ?? 0) * 1000,
              },
            },
          },
        },
        createdAt: dateNow,
        action: { type: "crop.harvested", index: firstId },
      });
      expect(state.crops[firstId].crop).toBeUndefined();
      expect(state.inventory.Cabbage).toEqual(new Decimal(1.1));
    });

    it("gives +0.1 to advanced crop when Old Farmer skill is active", () => {
      const state = harvest({
        state: {
          ...GAME_STATE,
          bumpkin: {
            ...TEST_BUMPKIN,
            skills: { ...TEST_BUMPKIN.skills, "Old Farmer": 1 },
          },
          inventory: { "Eggplant Seed": new Decimal(1) },
          season: { season: "summer", startedAt: 0 },
          crops: {
            [firstId]: {
              ...GAME_STATE.crops[firstId],
              crop: {
                name: "Eggplant",
                plantedAt:
                  dateNow - (CROPS["Eggplant"].harvestSeconds ?? 0) * 1000,
              },
            },
          },
        },
        createdAt: dateNow,
        action: { type: "crop.harvested", index: firstId },
      });
      expect(state.crops[firstId].crop).toBeUndefined();
      expect(state.inventory.Eggplant).toEqual(new Decimal(1.1));
    });

    it("gives +1 to advanced crop when Acre Farm skill is active", () => {
      const state = harvest({
        state: {
          ...GAME_STATE,
          bumpkin: {
            ...TEST_BUMPKIN,
            skills: { ...TEST_BUMPKIN.skills, "Acre Farm": 1 },
          },
          inventory: { "Eggplant Seed": new Decimal(1) },
          season: { season: "summer", startedAt: 0 },
          crops: {
            [firstId]: {
              ...GAME_STATE.crops[firstId],
              crop: {
                name: "Eggplant",
                plantedAt:
                  dateNow - (CROPS["Eggplant"].harvestSeconds ?? 0) * 1000,
              },
            },
          },
        },
        createdAt: dateNow,
        action: { type: "crop.harvested", index: firstId },
      });
      expect(state.crops[firstId].crop).toBeUndefined();
      expect(state.inventory.Eggplant).toEqual(new Decimal(2));
    });

    it("gives +0.2 to any crop when Power hour buff is active", () => {
      const state = harvest({
        state: {
          ...GAME_STATE,
          bumpkin: TEST_BUMPKIN,
          inventory: { "Sunflower Seed": new Decimal(1) },
          season: { season: "spring", startedAt: 0 },
          crops: {
            [firstId]: {
              ...GAME_STATE.crops[firstId],
              crop: {
                name: "Sunflower",
                plantedAt:
                  dateNow - (CROPS["Sunflower"].harvestSeconds ?? 0) * 1000,
              },
            },
          },
          buffs: {
            "Power hour": {
              startedAt: dateNow - 1000,
              durationMS: 60 * 60 * 1000,
            },
          },
        },
        createdAt: dateNow,
        action: { type: "crop.harvested", index: firstId },
      });
      expect(state.crops[firstId].crop).toBeUndefined();
      expect(state.inventory.Sunflower).toEqual(new Decimal(1.2));
    });

    it("gives +1 Potato when Peeled Potato triggers (prng 20%)", () => {
      const farmId = 1;
      const getCounter = () => {
        for (let counter = 0; counter < 1000; counter++) {
          if (
            prngChance({
              farmId,
              itemId: KNOWN_IDS["Potato"],
              counter,
              chance: 20,
              criticalHitName: "Peeled Potato",
            })
          )
            return counter;
        }
        return 0;
      };
      const counter = getCounter();
      const state = harvest({
        farmId,
        state: {
          ...GAME_STATE,
          bumpkin: TEST_BUMPKIN,
          inventory: { "Potato Seed": new Decimal(1) },
          season: { season: "summer", startedAt: 0 },
          collectibles: {
            "Peeled Potato": [
              {
                id: "123",
                createdAt: dateNow,
                coordinates: { x: 1, y: 1 },
                readyAt: dateNow - 5 * 60 * 1000,
              },
            ],
          },
          crops: {
            [firstId]: {
              ...GAME_STATE.crops[firstId],
              crop: {
                name: "Potato",
                plantedAt:
                  dateNow - (CROPS["Potato"].harvestSeconds ?? 0) * 1000,
              },
            },
          },
          farmActivity: { "Potato Harvested": counter },
        },
        createdAt: dateNow,
        action: { type: "crop.harvested", index: firstId },
      });
      expect(state.crops[firstId].crop).toBeUndefined();
      expect(state.inventory.Potato).toEqual(new Decimal(2));
    });

    it("gives +10 Potato when Potent Potato triggers (prng)", () => {
      const farmId = 1;
      const getCounter = () => {
        for (let counter = 0; counter < 1000; counter++) {
          if (
            prngChance({
              farmId,
              itemId: KNOWN_IDS["Potato"],
              counter,
              chance: 10 / 3,
              criticalHitName: "Potent Potato",
            })
          )
            return counter;
        }
        return 0;
      };
      const counter = getCounter();
      const state = harvest({
        farmId,
        state: {
          ...GAME_STATE,
          bumpkin: TEST_BUMPKIN,
          inventory: { "Potato Seed": new Decimal(1) },
          season: { season: "summer", startedAt: 0 },
          collectibles: {
            "Potent Potato": [
              {
                id: "123",
                createdAt: dateNow,
                coordinates: { x: 1, y: 1 },
                readyAt: dateNow - 5 * 60 * 1000,
              },
            ],
          },
          crops: {
            [firstId]: {
              ...GAME_STATE.crops[firstId],
              crop: {
                name: "Potato",
                plantedAt:
                  dateNow - (CROPS["Potato"].harvestSeconds ?? 0) * 1000,
              },
            },
          },
          farmActivity: { "Potato Harvested": counter },
        },
        createdAt: dateNow,
        action: { type: "crop.harvested", index: firstId },
      });
      expect(state.crops[firstId].crop).toBeUndefined();
      expect(state.inventory.Potato).toEqual(new Decimal(11));
    });

    it("gives +10 Sunflower when Stellar Sunflower triggers (prng)", () => {
      const farmId = 1;
      const getCounter = () => {
        for (let counter = 0; counter < 1000; counter++) {
          if (
            prngChance({
              farmId,
              itemId: KNOWN_IDS["Sunflower"],
              counter,
              chance: 10 / 3,
              criticalHitName: "Stellar Sunflower",
            })
          )
            return counter;
        }
        return 0;
      };
      const counter = getCounter();
      const state = harvest({
        farmId,
        state: {
          ...GAME_STATE,
          bumpkin: TEST_BUMPKIN,
          inventory: { "Sunflower Seed": new Decimal(1) },
          season: { season: "spring", startedAt: 0 },
          collectibles: {
            "Stellar Sunflower": [
              {
                id: "123",
                createdAt: dateNow,
                coordinates: { x: 1, y: 1 },
                readyAt: dateNow - 5 * 60 * 1000,
              },
            ],
          },
          crops: {
            [firstId]: {
              ...GAME_STATE.crops[firstId],
              crop: {
                name: "Sunflower",
                plantedAt:
                  dateNow - (CROPS["Sunflower"].harvestSeconds ?? 0) * 1000,
              },
            },
          },
          farmActivity: { "Sunflower Harvested": counter },
        },
        createdAt: dateNow,
        action: { type: "crop.harvested", index: firstId },
      });
      expect(state.crops[firstId].crop).toBeUndefined();
      expect(state.inventory.Sunflower).toEqual(new Decimal(11));
    });

    it("gives +10 Radish when Radical Radish triggers (prng)", () => {
      const farmId = 1;
      const getCounter = () => {
        for (let counter = 0; counter < 1000; counter++) {
          if (
            prngChance({
              farmId,
              itemId: KNOWN_IDS["Radish"],
              counter,
              chance: 10 / 3,
              criticalHitName: "Radical Radish",
            })
          )
            return counter;
        }
        return 0;
      };
      const counter = getCounter();
      const state = harvest({
        farmId,
        state: {
          ...GAME_STATE,
          bumpkin: TEST_BUMPKIN,
          inventory: { "Radish Seed": new Decimal(1) },
          season: { season: "summer", startedAt: 0 },
          collectibles: {
            "Radical Radish": [
              {
                id: "123",
                createdAt: dateNow,
                coordinates: { x: 1, y: 1 },
                readyAt: dateNow - 5 * 60 * 1000,
              },
            ],
          },
          crops: {
            [firstId]: {
              ...GAME_STATE.crops[firstId],
              crop: {
                name: "Radish",
                plantedAt:
                  dateNow - (CROPS["Radish"].harvestSeconds ?? 0) * 1000,
              },
            },
          },
          farmActivity: { "Radish Harvested": counter },
        },
        createdAt: dateNow,
        action: { type: "crop.harvested", index: firstId },
      });
      expect(state.crops[firstId].crop).toBeUndefined();
      expect(state.inventory.Radish).toEqual(new Decimal(11));
    });

    it("gives +0.5 to Cabbage in AOE when Sir Goldensnout is placed and ready", () => {
      const state = harvest({
        state: {
          ...GAME_STATE,
          bumpkin: TEST_BUMPKIN,
          inventory: { "Cabbage Seed": new Decimal(1) },
          season: { season: "spring", startedAt: 0 },
          collectibles: {
            "Sir Goldensnout": [
              {
                id: "123",
                createdAt: dateNow,
                coordinates: { x: 0, y: 0 },
                readyAt: dateNow - 12 * 60 * 1000,
              },
            ],
          },
          crops: {
            [firstId]: {
              ...GAME_STATE.crops[firstId],
              x: 0,
              y: -2,
              crop: {
                name: "Cabbage",
                plantedAt:
                  dateNow - (CROPS["Cabbage"].harvestSeconds ?? 0) * 1000,
              },
            },
          },
        },
        createdAt: dateNow,
        action: { type: "crop.harvested", index: firstId },
      });
      expect(state.crops[firstId].crop).toBeUndefined();
      expect(state.inventory.Cabbage).toEqual(new Decimal(1.5));
    });

    it("gives +0.2 to advanced crop in AOE when Laurie the Chuckle Crow is placed and ready", () => {
      const state = harvest({
        state: {
          ...GAME_STATE,
          bumpkin: TEST_BUMPKIN,
          inventory: { "Eggplant Seed": new Decimal(1) },
          season: { season: "summer", startedAt: 0 },
          collectibles: {
            "Laurie the Chuckle Crow": [
              {
                id: "123",
                createdAt: dateNow,
                coordinates: { x: 0, y: 0 },
                readyAt: dateNow - 12 * 60 * 1000,
              },
            ],
          },
          crops: {
            [firstId]: {
              ...GAME_STATE.crops[firstId],
              x: 0,
              y: -2,
              crop: {
                name: "Eggplant",
                plantedAt:
                  dateNow - (CROPS["Eggplant"].harvestSeconds ?? 0) * 1000,
              },
            },
          },
        },
        createdAt: dateNow,
        action: { type: "crop.harvested", index: firstId },
      });
      expect(state.crops[firstId].crop).toBeUndefined();
      expect(state.inventory.Eggplant).toEqual(new Decimal(1.2));
    });

    it("gives +1 to Corn in AOE when Queen Cornelia is placed and ready", () => {
      const state = harvest({
        state: {
          ...GAME_STATE,
          bumpkin: TEST_BUMPKIN,
          inventory: { "Corn Seed": new Decimal(1) },
          season: { season: "spring", startedAt: 0 },
          collectibles: {
            "Queen Cornelia": [
              {
                id: "123",
                createdAt: dateNow,
                coordinates: { x: 0, y: 0 },
                readyAt: dateNow - 12 * 60 * 1000,
              },
            ],
          },
          crops: {
            [firstId]: {
              ...GAME_STATE.crops[firstId],
              x: 0,
              y: -2,
              crop: {
                name: "Corn",
                plantedAt: dateNow - (CROPS["Corn"].harvestSeconds ?? 0) * 1000,
              },
            },
          },
        },
        createdAt: dateNow,
        action: { type: "crop.harvested", index: firstId },
      });
      expect(state.crops[firstId].crop).toBeUndefined();
      expect(state.inventory.Corn).toEqual(new Decimal(2));
    });

    it("gives +0.2 beeSwarm bonus when Pollen Power Up skill and beeSwarm on plot", () => {
      const state = harvest({
        state: {
          ...GAME_STATE,
          bumpkin: {
            ...TEST_BUMPKIN,
            skills: { ...TEST_BUMPKIN.skills, "Pollen Power Up": 1 },
          },
          inventory: { "Sunflower Seed": new Decimal(1) },
          season: { season: "spring", startedAt: 0 },
          crops: {
            [firstId]: {
              ...GAME_STATE.crops[firstId],
              crop: {
                name: "Sunflower",
                plantedAt:
                  dateNow - (CROPS["Sunflower"].harvestSeconds ?? 0) * 1000,
              },
              beeSwarm: { count: 1, swarmActivatedAt: dateNow - 1000 },
            },
          },
        },
        createdAt: dateNow,
        action: { type: "crop.harvested", index: firstId },
      });
      expect(state.crops[firstId].crop).toBeUndefined();
      expect(state.inventory.Sunflower).toEqual(new Decimal(1.3));
    });

    it("gives +1 to medium crop when Hectare Farm skill is active", () => {
      const state = harvest({
        state: {
          ...GAME_STATE,
          bumpkin: {
            ...TEST_BUMPKIN,
            skills: { ...TEST_BUMPKIN.skills, "Hectare Farm": 1 },
          },
          inventory: { "Cabbage Seed": new Decimal(1) },
          season: { season: "spring", startedAt: 0 },
          crops: {
            [firstId]: {
              ...GAME_STATE.crops[firstId],
              crop: {
                name: "Cabbage",
                plantedAt:
                  dateNow - (CROPS["Cabbage"].harvestSeconds ?? 0) * 1000,
              },
            },
          },
        },
        createdAt: dateNow,
        action: { type: "crop.harvested", index: firstId },
      });
      expect(state.crops[firstId].crop).toBeUndefined();
      expect(state.inventory.Cabbage).toEqual(new Decimal(2));
    });

    it("gives +1 and guardian boost when Bountiful Harvest and Spring Guardian active", () => {
      const state = harvest({
        state: {
          ...GAME_STATE,
          bumpkin: TEST_BUMPKIN,
          inventory: { "Sunflower Seed": new Decimal(1) },
          season: { season: "spring", startedAt: 0 },
          calendar: {
            ...GAME_STATE.calendar,
            bountifulHarvest: {
              startedAt: dateNow - 1000,
              triggeredAt: dateNow,
            },
          },
          collectibles: {
            "Spring Guardian": [
              {
                id: "123",
                createdAt: dateNow,
                coordinates: { x: 1, y: 1 },
                readyAt: dateNow - 5 * 60 * 1000,
              },
            ],
          },
          crops: {
            [firstId]: {
              ...GAME_STATE.crops[firstId],
              crop: {
                name: "Sunflower",
                plantedAt:
                  dateNow - (CROPS["Sunflower"].harvestSeconds ?? 0) * 1000,
              },
            },
          },
        },
        createdAt: dateNow,
        action: { type: "crop.harvested", index: firstId },
      });
      expect(state.crops[firstId].crop).toBeUndefined();
      expect(state.inventory.Sunflower).toEqual(new Decimal(3));
    });

    it("yield -0.5 if insect plague is active", () => {
      const state = harvest({
        state: {
          ...GAME_STATE,
          calendar: {
            dates: [
              {
                name: "insectPlague",
                date: new Date().toISOString().split("T")[0],
              },
            ],
            insectPlague: {
              startedAt: new Date().getTime(),
              triggeredAt: Date.now(),
              protected: false,
            },
          },
          inventory: {
            "Sunflower Seed": new Decimal(1),
          },
          crops: {
            [firstId]: {
              ...GAME_STATE.crops[firstId],
              crop: {
                name: "Sunflower",
                plantedAt:
                  dateNow - (CROPS["Sunflower"].harvestSeconds ?? 0) * 1000,
              },
            },
          },
        },
        action: {
          type: "crop.harvested",
          index: firstId,
        },
        createdAt: dateNow,
      });

      const crops = state.crops;

      expect(crops[firstId].crop).toBeUndefined();
      expect(state.inventory.Sunflower).toEqual(new Decimal(0.5));
    });

    it("should not deduct 0.5 if insect plague is active and farm is protected", () => {
      const state = harvest({
        state: {
          ...GAME_STATE,
          calendar: {
            dates: [
              {
                name: "insectPlague",
                date: new Date().toISOString().split("T")[0],
              },
            ],
            insectPlague: {
              startedAt: new Date().getTime(),
              triggeredAt: Date.now(),
              protected: true,
            },
          },
          inventory: {
            "Sunflower Seed": new Decimal(1),
          },
          crops: {
            [firstId]: {
              ...GAME_STATE.crops[firstId],
              crop: {
                name: "Sunflower",
                plantedAt:
                  dateNow - (CROPS["Sunflower"].harvestSeconds ?? 0) * 1000,
              },
            },
          },
        },
        action: {
          type: "crop.harvested",
          index: firstId,
        },
        createdAt: dateNow,
      });

      const crops = state.crops;

      expect(crops[firstId].crop).toBeUndefined();
      expect(state.inventory.Sunflower).toEqual(new Decimal(1));
    });
  });
});
