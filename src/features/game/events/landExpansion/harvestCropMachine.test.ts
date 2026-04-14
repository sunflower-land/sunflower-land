import { harvestCropMachine, getPackYieldAmount } from "./harvestCropMachine";
import { INITIAL_BUMPKIN, TEST_FARM } from "features/game/lib/constants";
import { GameState } from "features/game/types/game";
import { CROP_MACHINE_PLOTS } from "./supplyCropMachine";
import { KNOWN_IDS } from "features/game/types";
import { prngChance } from "lib/prng";

const GAME_STATE: GameState = { ...TEST_FARM, bumpkin: INITIAL_BUMPKIN };

describe("harvestCropMachine", () => {
  it("throws an error if Crop Machine does not exist", () => {
    expect(() =>
      harvestCropMachine({
        state: GAME_STATE,
        action: {
          type: "cropMachine.harvested",
          packIndex: 0,
          machineId: "1",
        },
        farmId: 1,
      }),
    ).toThrow("Crop Machine does not exist");
  });

  it("throws an error if queue is empty", () => {
    expect(() =>
      harvestCropMachine({
        state: {
          ...GAME_STATE,
          buildings: {
            "Crop Machine": [
              {
                coordinates: { x: 0, y: 0 },
                createdAt: 0,
                id: "1",
                readyAt: 123,
                unallocatedOilTime: 0,
                queue: [],
              },
            ],
          },
        },
        action: {
          type: "cropMachine.harvested",
          packIndex: 0,
          machineId: "1",
        },
        farmId: 1,
      }),
    ).toThrow("Nothing in the queue");
  });

  it("throws and error if there is no pack at the index", () => {
    expect(() =>
      harvestCropMachine({
        state: {
          ...GAME_STATE,
          buildings: {
            "Crop Machine": [
              {
                coordinates: { x: 0, y: 0 },
                createdAt: 0,
                id: "1",
                readyAt: 123,
                unallocatedOilTime: 0,
                queue: [
                  {
                    crop: "Sunflower",
                    growTimeRemaining: 0,
                    totalGrowTime:
                      (60 * 10 * 1000) / CROP_MACHINE_PLOTS(GAME_STATE),
                    seeds: 10,
                  },
                ],
              },
            ],
          },
        },
        action: {
          type: "cropMachine.harvested",
          packIndex: 1,
          machineId: "1",
        },
        farmId: 1,
      }),
    ).toThrow("Pack does not exist");
  });

  it("throws an error if the pack is not ready", () => {
    expect(() =>
      harvestCropMachine({
        state: {
          ...GAME_STATE,
          buildings: {
            "Crop Machine": [
              {
                coordinates: { x: 0, y: 0 },
                createdAt: 0,
                id: "1",
                readyAt: 123,
                unallocatedOilTime: 0,
                queue: [
                  {
                    crop: "Sunflower",
                    growTimeRemaining: 100,
                    totalGrowTime:
                      (60 * 10 * 1000) / CROP_MACHINE_PLOTS(GAME_STATE),
                    seeds: 10,
                  },
                ],
              },
            ],
          },
        },
        action: {
          type: "cropMachine.harvested",
          packIndex: 0,
          machineId: "1",
        },
        farmId: 1,
      }),
    ).toThrow("The pack is not ready yet");
  });

  it("adds the harvested crops to the player's inventory", () => {
    const dateNow = Date.now();
    const result = harvestCropMachine({
      state: {
        ...GAME_STATE,
        buildings: {
          "Crop Machine": [
            {
              coordinates: { x: 0, y: 0 },
              createdAt: 0,
              id: "1",
              readyAt: 123,
              unallocatedOilTime: 0,
              queue: [
                {
                  crop: "Sunflower",
                  growTimeRemaining: 0,
                  readyAt: dateNow - 1000,
                  totalGrowTime:
                    (60 * 10 * 1000) / CROP_MACHINE_PLOTS(GAME_STATE),
                  seeds: 10,
                },
              ],
            },
          ],
        },
        inventory: {},
        farmActivity: {},
      },
      action: {
        type: "cropMachine.harvested",
        packIndex: 0,
        machineId: "1",
      },
      farmId: 1,
    });

    // With 10 seeds and no boosts, we expect at least 10 (base yield)
    // PRNG may add more, so we check it's at least 10
    expect(result.inventory.Sunflower?.gte(10)).toBe(true);
  });

  it("removes the harvested seed pack from the queue", () => {
    const packIndex = 0;
    const dateNow = Date.now();
    const result = harvestCropMachine({
      state: {
        ...GAME_STATE,
        buildings: {
          "Crop Machine": [
            {
              coordinates: { x: 0, y: 0 },
              createdAt: 0,
              id: "1",
              readyAt: 123,
              unallocatedOilTime: 0,
              queue: [
                {
                  crop: "Sunflower",
                  growTimeRemaining: 0,
                  readyAt: dateNow - 1000,
                  totalGrowTime:
                    (60 * 10 * 1000) / CROP_MACHINE_PLOTS(GAME_STATE),
                  seeds: 10,
                },
              ],
            },
          ],
        },
        inventory: {},
        farmActivity: {},
      },
      action: {
        type: "cropMachine.harvested",
        packIndex,
        machineId: "1",
      },
      farmId: 1,
    });

    expect(
      result.buildings["Crop Machine"]?.[0].queue?.[packIndex],
    ).toBeUndefined();
  });

  it("adds bumpkin activity for harvested crops", () => {
    const dateNow = Date.now();
    const state = harvestCropMachine({
      state: {
        ...GAME_STATE,
        buildings: {
          "Crop Machine": [
            {
              coordinates: { x: 0, y: 0 },
              createdAt: 0,
              id: "1",
              readyAt: 123,
              unallocatedOilTime: 0,
              queue: [
                {
                  crop: "Sunflower",
                  growTimeRemaining: 0,
                  readyAt: dateNow - 1000,
                  totalGrowTime:
                    (60 * 10 * 1000) / CROP_MACHINE_PLOTS(GAME_STATE),
                  seeds: 10,
                },
                {
                  crop: "Sunflower",
                  growTimeRemaining: 0,
                  readyAt: dateNow - 2000,
                  totalGrowTime:
                    (60 * 10 * 1000) / CROP_MACHINE_PLOTS(GAME_STATE),
                  seeds: 10,
                },
              ],
            },
          ],
        },
        inventory: {},
        farmActivity: {},
      },
      action: {
        type: "cropMachine.harvested",
        packIndex: 0,
        machineId: "1",
      },
      farmId: 1,
    });

    expect(state.farmActivity["Sunflower Harvested"]).toEqual(10);
  });

  describe("getPackYieldAmount", () => {
    it("adds critical hit to the harvested crops", () => {
      const dateNow = Date.now();
      const farmId = 1; // Frontend may not use farmId, but needed for PRNG
      const itemId = KNOWN_IDS["Sunflower"];

      // Find a starting counter where we get 2 Green Amulet hits and 1 Stellar Sunflower hit
      // within the next 10 counters (for 10 seeds). Search range must be large enough for
      // 1/30 Stellar Sunflower chance.
      const SEARCH_RANGE = 500_000;
      function findStartCounter(): number {
        for (
          let startCounter = 0;
          startCounter < SEARCH_RANGE;
          startCounter++
        ) {
          let greenAmuletHits = 0;
          let stellarSunflowerHits = 0;

          for (let i = 0; i < 10; i++) {
            const counter = startCounter + i;
            if (
              prngChance({
                farmId,
                itemId,
                counter,
                chance: 10,
                criticalHitName: "Green Amulet",
              })
            ) {
              greenAmuletHits++;
            }
            if (
              prngChance({
                farmId,
                itemId,
                counter,
                chance: 1 / 30,
                criticalHitName: "Stellar Sunflower",
              })
            ) {
              stellarSunflowerHits++;
            }
          }

          if (greenAmuletHits >= 2 && stellarSunflowerHits >= 1) {
            return startCounter;
          }
        }
        return -1;
      }

      const startCounter = findStartCounter();
      if (startCounter < 0) {
        throw new Error(
          `Could not find start counter with >=2 Green Amulet and >=1 Stellar Sunflower hits in ${SEARCH_RANGE} blocks`,
        );
      }
      const { amount } = getPackYieldAmount({
        state: {
          ...GAME_STATE,
          buildings: {
            "Crop Machine": [
              {
                coordinates: { x: 0, y: 0 },
                createdAt: 0,
                id: "1",
                readyAt: 123,
                unallocatedOilTime: 0,
                queue: [
                  {
                    crop: "Sunflower",
                    growTimeRemaining: 0,
                    readyAt: dateNow - 1000,
                    totalGrowTime:
                      (60 * 10 * 1000) / CROP_MACHINE_PLOTS(GAME_STATE),
                    seeds: 10,
                  },
                ],
              },
            ],
          },
          bumpkin: {
            ...GAME_STATE.bumpkin,
            equipped: {
              ...GAME_STATE.bumpkin.equipped,
              necklace: "Green Amulet",
            },
          },
          collectibles: {
            "Stellar Sunflower": [
              {
                id: "1",
                coordinates: { x: 0, y: 0 },
                readyAt: 123,
                createdAt: 0,
              },
            ],
          },
          farmActivity: {
            "Sunflower Harvested": startCounter,
          },
        },
        pack: {
          crop: "Sunflower",
          growTimeRemaining: 0,
          readyAt: dateNow - 1000,
          totalGrowTime: (60 * 10 * 1000) / CROP_MACHINE_PLOTS(GAME_STATE),
          seeds: 10,
        },
        createdAt: dateNow,
        prngArgs: { farmId, initialCounter: startCounter },
      });

      // Calculate expected amount based on PRNG outcomes
      let expectedAmount = 0;
      let greenAmuletHits = 0;
      let stellarSunflowerHits = 0;

      for (let i = 0; i < 10; i++) {
        const counter = startCounter + i;
        let seedAmount = 1;

        const greenAmuletHit = prngChance({
          farmId,
          itemId,
          counter,
          chance: 10,
          criticalHitName: "Green Amulet",
        });

        const stellarSunflowerHit = prngChance({
          farmId,
          itemId,
          counter,
          chance: 1 / 30,
          criticalHitName: "Stellar Sunflower",
        });

        if (greenAmuletHit) {
          seedAmount *= 10;
          greenAmuletHits++;
        }

        if (stellarSunflowerHit) {
          seedAmount += 10;
          stellarSunflowerHits++;
        }

        expectedAmount += seedAmount;
      }

      // Verify we got the expected critical hits
      expect(greenAmuletHits).toBeGreaterThanOrEqual(2);
      expect(stellarSunflowerHits).toBeGreaterThanOrEqual(1);
      expect(amount).toEqual(expectedAmount);
    });

    it("doesn't add critical hit to the harvested crops if green amulet is not equipped", () => {
      const dateNow = Date.now();
      const farmId = 1;
      const itemId = KNOWN_IDS["Sunflower"];

      // Find a starting counter where we get 1 Stellar Sunflower hit within the next 10 counters.
      // Search range must be large enough for 1/30 Stellar Sunflower chance.
      const SEARCH_RANGE = 500_000;
      function findStartCounter(): number {
        for (
          let startCounter = 0;
          startCounter < SEARCH_RANGE;
          startCounter++
        ) {
          let stellarSunflowerHits = 0;

          for (let i = 0; i < 10; i++) {
            const counter = startCounter + i;
            if (
              prngChance({
                farmId,
                itemId,
                counter,
                chance: 1 / 30,
                criticalHitName: "Stellar Sunflower",
              })
            ) {
              stellarSunflowerHits++;
            }
          }

          if (stellarSunflowerHits >= 1) {
            return startCounter;
          }
        }
        return -1;
      }

      const startCounter = findStartCounter();
      if (startCounter < 0) {
        throw new Error(
          `Could not find start counter with >=1 Stellar Sunflower hit in ${SEARCH_RANGE} blocks`,
        );
      }
      const { amount } = getPackYieldAmount({
        state: {
          ...GAME_STATE,
          buildings: {
            "Crop Machine": [
              {
                coordinates: { x: 0, y: 0 },
                createdAt: 0,
                id: "1",
                readyAt: 123,
                unallocatedOilTime: 0,
                queue: [
                  {
                    crop: "Sunflower",
                    growTimeRemaining: 0,
                    readyAt: dateNow - 1000,
                    totalGrowTime:
                      (60 * 10 * 1000) / CROP_MACHINE_PLOTS(GAME_STATE),
                    seeds: 10,
                  },
                ],
              },
            ],
          },
          collectibles: {
            "Stellar Sunflower": [
              {
                id: "1",
                coordinates: { x: 0, y: 0 },
                readyAt: 123,
                createdAt: 0,
              },
            ],
          },
          farmActivity: {
            "Sunflower Harvested": startCounter,
          },
        },
        pack: {
          crop: "Sunflower",
          growTimeRemaining: 0,
          readyAt: dateNow - 1000,
          totalGrowTime: (60 * 10 * 1000) / CROP_MACHINE_PLOTS(GAME_STATE),
          seeds: 10,
        },
        createdAt: dateNow,
        prngArgs: { farmId, initialCounter: startCounter },
      });

      // Calculate expected amount based on PRNG outcomes
      // Green Amulet should not trigger (not equipped), but Stellar Sunflower can
      let expectedAmount = 0;
      let stellarSunflowerHits = 0;

      for (let i = 0; i < 10; i++) {
        const counter = startCounter + i;
        let seedAmount = 1;

        const stellarSunflowerHit = prngChance({
          farmId,
          itemId,
          counter,
          chance: 1 / 30,
          criticalHitName: "Stellar Sunflower",
        });

        if (stellarSunflowerHit) {
          seedAmount += 10;
          stellarSunflowerHits++;
        }

        expectedAmount += seedAmount;
      }

      // Verify we got at least 1 Stellar Sunflower hit
      expect(stellarSunflowerHits).toBeGreaterThanOrEqual(1);
      expect(amount).toEqual(expectedAmount);
    });
  });
});
