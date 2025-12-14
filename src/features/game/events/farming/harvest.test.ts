import Decimal from "decimal.js-light";
import { TEST_BUMPKIN } from "features/game/lib/bumpkinData";
import { INITIAL_FARM } from "features/game/lib/constants";
import { CropPlot, GameState } from "features/game/types/game";
import { harvest } from "./harvest";
import { CROPS } from "features/game/types/crops";

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

  it("collects a coins reward", () => {
    const { crops } = GAME_STATE;
    const plot = (crops as Record<number, CropPlot>)[0];

    const state = harvest({
      state: {
        ...GAME_STATE,
        coins: 0,
        crops: {
          0: {
            ...plot,
            crop: {
              name: "Sunflower",
              plantedAt: dateNow - 2 * 60 * 1000,
              reward: {
                coins: 1,
                items: [],
              },
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

    expect(state.coins).toEqual(1);
  });

  it("collects item rewards", () => {
    const { crops } = GAME_STATE;
    const plot = (crops as Record<number, CropPlot>)[0];

    const state = harvest({
      state: {
        ...GAME_STATE,
        inventory: {
          Potato: new Decimal(2),
          "Pumpkin Seed": new Decimal(5),
        },
        crops: {
          0: {
            ...plot,
            crop: {
              name: "Sunflower",
              plantedAt: dateNow - 2 * 60 * 1000,
              reward: {
                items: [
                  {
                    amount: 1,
                    name: "Pumpkin Seed",
                  },
                  {
                    amount: 3,
                    name: "Carrot Seed",
                  },
                ],
              },
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
      Potato: new Decimal(2),
      "Pumpkin Seed": new Decimal(6),
      "Carrot Seed": new Decimal(3),
      Sunflower: new Decimal(1),
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
