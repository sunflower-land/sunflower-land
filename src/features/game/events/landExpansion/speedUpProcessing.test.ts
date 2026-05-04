// 1: Less than 1 minute
// 2: Less than 5 minutes
// 3: Less than 10 minutes
// 4: Less than 30 minutes
// 5: Less than 1 hr
// 8: Less than 2 hrs
// 10: Less than 4 hrs
// 12: Less than 6 hrs
// 12: Less than 12 hrs
// 14: Less than 24 hrs
// 16: Less than 36 hrs
// 20: Less than 48 hrs

import { INITIAL_FARM } from "features/game/lib/constants";
import { speedUpProcessing } from "./speedUpProcessing";
import Decimal from "decimal.js-light";
import { FISH_PROCESSING_TIME_SECONDS } from "features/game/types/fishProcessing";
import { ProcessedResource } from "features/game/types/processedFood";
import { GameState } from "features/game/types/game";

describe("instantProcessing", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2025-07-01T00:00:00Z"));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  const farmId = 1;

  it("throws when the building does not exist", () => {
    expect(() =>
      speedUpProcessing({
        farmId,
        action: {
          buildingId: "123",
          buildingName: "Fish Market",
          type: "processing.spedUp",
        },
        state: {
          ...INITIAL_FARM,
          buildings: {},
        },
      }),
    ).toThrow("Building does not exist");
  });

  it("requires item is processing", () => {
    expect(() =>
      speedUpProcessing({
        farmId,
        action: {
          buildingId: "123",
          buildingName: "Fish Market",
          type: "processing.spedUp",
        },
        state: {
          ...INITIAL_FARM,
          buildings: {
            "Fish Market": [
              {
                id: "123",
                coordinates: { x: 0, y: 0 },
                createdAt: 0,
                readyAt: 0,
              },
            ],
          },
        },
      }),
    ).toThrow("Nothing is processing");
  });

  it("requires player has the gems", () => {
    expect(() =>
      speedUpProcessing({
        farmId,
        action: {
          buildingId: "123",
          buildingName: "Fish Market",
          type: "processing.spedUp",
        },
        state: {
          ...INITIAL_FARM,
          inventory: { Gem: new Decimal(0) },
          buildings: {
            "Fish Market": [
              {
                id: "123",
                coordinates: { x: 0, y: 0 },
                createdAt: 0,
                readyAt: 0,
                processing: [
                  {
                    name: "Fish Stick",
                    readyAt: Date.now() + 30000,
                  },
                ],
              },
            ],
          },
        },
      }),
    ).toThrow("Insufficient gems");
  });

  it("charges gems for a fish stick", () => {
    const state = speedUpProcessing({
      farmId,
      action: {
        buildingId: "123",
        buildingName: "Fish Market",
        type: "processing.spedUp",
      },
      state: {
        ...INITIAL_FARM,
        inventory: { Gem: new Decimal(100) },
        buildings: {
          "Fish Market": [
            {
              id: "123",
              coordinates: { x: 0, y: 0 },
              createdAt: 0,
              readyAt: 0,
              processing: [
                {
                  name: "Fish Stick",
                  readyAt: Date.now() + 30000,
                },
              ],
            },
          ],
        },
      },
    });

    expect(state.inventory.Gem).toEqual(new Decimal(99));
  });

  it("instantly finishes the processing", () => {
    const now = Date.now();
    const state = speedUpProcessing({
      farmId,
      action: {
        buildingId: "123",
        buildingName: "Fish Market",
        type: "processing.spedUp",
      },
      state: {
        ...INITIAL_FARM,
        inventory: { Gem: new Decimal(100) },
        buildings: {
          "Fish Market": [
            {
              id: "123",
              coordinates: { x: 0, y: 0 },
              createdAt: 0,
              readyAt: 0,
              processing: [
                {
                  name: "Fish Stick",
                  readyAt: now + 30000,
                },
              ],
            },
          ],
        },
        createdAt: now,
      },
    });

    expect(state.inventory["Fish Stick"]).toEqual(new Decimal(1));
    expect(state.buildings["Fish Market"]?.[0].processing).toEqual([]);
  });

  it("only speeds up the item that is currently processing", () => {
    const now = Date.now();
    const state = speedUpProcessing({
      farmId,
      action: {
        buildingId: "123",
        buildingName: "Fish Market",
        type: "processing.spedUp",
      },
      state: {
        ...INITIAL_FARM,
        inventory: { Gem: new Decimal(100) },
        buildings: {
          "Fish Market": [
            {
              id: "123",
              coordinates: { x: 0, y: 0 },
              createdAt: 0,
              readyAt: 0,
              processing: [
                {
                  name: "Fish Stick",
                  readyAt: now + 30000,
                },
                {
                  name: "Fish Oil",
                  readyAt: now + 30000 + 2000,
                },
              ],
            },
          ],
        },
        createdAt: now,
      },
    });

    const building = state.buildings["Fish Market"]?.[0];

    expect(building?.processing).toMatchObject([
      {
        name: "Fish Oil",
        readyAt: expect.any(Number),
      },
    ]);
  });

  it("updates all the items readyAt times correctly", () => {
    const now = Date.now();
    const PROCESSING_TIME = (name: ProcessedResource) =>
      FISH_PROCESSING_TIME_SECONDS[name] * 1000;

    const state = speedUpProcessing({
      farmId,
      state: {
        ...INITIAL_FARM,
        inventory: { Gem: new Decimal(100) },
        buildings: {
          "Fish Market": [
            {
              id: "123",
              coordinates: { x: 0, y: 0 },
              createdAt: 0,
              readyAt: 0,
              processing: [
                {
                  name: "Fish Stick",
                  readyAt: now + PROCESSING_TIME("Fish Stick"),
                },
                {
                  name: "Fish Oil",
                  readyAt:
                    now +
                    PROCESSING_TIME("Fish Stick") +
                    PROCESSING_TIME("Fish Oil"),
                },
                {
                  name: "Fish Oil",
                  readyAt:
                    now +
                    PROCESSING_TIME("Fish Stick") +
                    PROCESSING_TIME("Fish Oil") +
                    PROCESSING_TIME("Fish Oil"),
                },
                {
                  name: "Fish Oil",
                  readyAt:
                    now +
                    PROCESSING_TIME("Fish Stick") +
                    PROCESSING_TIME("Fish Oil") +
                    PROCESSING_TIME("Fish Oil") +
                    PROCESSING_TIME("Fish Oil"),
                },
              ],
            },
          ],
        },
      },
      action: {
        buildingId: "123",
        buildingName: "Fish Market",
        type: "processing.spedUp",
      },
      createdAt: now,
    });

    const building = state.buildings["Fish Market"]?.[0];
    const queue = building?.processing;

    // The first fried stick should be ready now and is removed from the queue
    // Remaining recipes should have their readyAt times updated
    expect(queue?.[0].readyAt).toBe(now + PROCESSING_TIME("Fish Oil"));
    expect(queue?.[1].readyAt).toBe(
      now + PROCESSING_TIME("Fish Oil") + PROCESSING_TIME("Fish Oil"),
    );
    expect(queue?.[2].readyAt).toBe(
      now +
        PROCESSING_TIME("Fish Oil") +
        PROCESSING_TIME("Fish Oil") +
        PROCESSING_TIME("Fish Oil"),
    );
  });

  it("updates the gem history", () => {
    const PROCESSING_TIME = (name: ProcessedResource) =>
      FISH_PROCESSING_TIME_SECONDS[name] * 1000;
    const now = Date.now();
    const state = speedUpProcessing({
      farmId,
      state: {
        ...INITIAL_FARM,
        inventory: { Gem: new Decimal(100) },
        buildings: {
          "Fish Market": [
            {
              id: "123",
              coordinates: { x: 0, y: 0 },
              createdAt: 0,
              readyAt: 0,
              processing: [
                {
                  name: "Fish Oil",
                  readyAt: now + PROCESSING_TIME("Fish Oil"),
                },
              ],
            },
          ],
        },
      },
      action: {
        buildingId: "123",
        buildingName: "Fish Market",
        type: "processing.spedUp",
      },
      createdAt: now,
    });

    expect(state.gems.history).toEqual({
      [new Date(now).toISOString().substring(0, 10)]: {
        spent: 40,
      },
    });
  });

  describe("Bubble Aura on the gem path", () => {
    // The Bubble Aura PRNG is deterministic given (farmId, itemId, counter,
    // chance, criticalHitName). Sweep counters until the predicate returns
    // true so each test pins one branch (hit / miss).
    const findCounter = (predicate: (counter: number) => boolean): number => {
      for (let counter = 0; counter < 200; counter++) {
        if (predicate(counter)) return counter;
      }
      throw new Error("No matching deterministic Bubble Aura counter found");
    };
    const rollFishFlake = (counter: number): boolean => {
      const { prngChance } = jest.requireActual(
        "lib/prng",
      ) as typeof import("lib/prng");
      const { KNOWN_IDS } = jest.requireActual(
        "features/game/types",
      ) as typeof import("features/game/types");
      return prngChance({
        farmId,
        itemId: KNOWN_IDS["Fish Flake"],
        counter,
        chance: 20,
        criticalHitName: "Bubble Aura",
      });
    };

    const baseStateWithProcessing = (overrides: {
      auraEquipped: boolean;
      processedCounter?: number;
    }): GameState => ({
      ...INITIAL_FARM,
      bumpkin: {
        ...INITIAL_FARM.bumpkin!,
        equipped: {
          ...INITIAL_FARM.bumpkin!.equipped,
          aura: overrides.auraEquipped ? "Bubble Aura" : undefined,
        },
      },
      inventory: { Gem: new Decimal(100) },
      farmActivity:
        overrides.processedCounter !== undefined
          ? {
              ...INITIAL_FARM.farmActivity,
              "Fish Flake Processed": overrides.processedCounter,
            }
          : INITIAL_FARM.farmActivity,
      buildings: {
        "Fish Market": [
          {
            id: "123",
            coordinates: { x: 0, y: 0 },
            createdAt: 0,
            readyAt: 0,
            processing: [{ name: "Fish Flake", readyAt: Date.now() + 30000 }],
          },
        ],
      },
    });

    it("increments the `${name} Processed` counter even without the aura", () => {
      const state = speedUpProcessing({
        farmId,
        action: {
          buildingId: "123",
          buildingName: "Fish Market",
          type: "processing.spedUp",
        },
        state: baseStateWithProcessing({ auraEquipped: false }),
        createdAt: Date.now(),
      });

      expect(state.farmActivity["Fish Flake Processed"]).toBe(1);
      expect(state.inventory["Fish Flake"]).toEqual(new Decimal(1));
    });

    it("yields 2 and bumps the counter when the aura procs (deterministic hit)", () => {
      const hitCounter = findCounter(rollFishFlake);
      const createdAt = Date.now();
      const state = speedUpProcessing({
        farmId,
        action: {
          buildingId: "123",
          buildingName: "Fish Market",
          type: "processing.spedUp",
        },
        state: baseStateWithProcessing({
          auraEquipped: true,
          processedCounter: hitCounter,
        }),
        createdAt,
      });

      expect(state.inventory["Fish Flake"]).toEqual(new Decimal(2));
      expect(state.farmActivity["Fish Flake Processed"]).toBe(hitCounter + 1);
      expect(state.boostsUsedAt?.["Bubble Aura"]).toBe(createdAt);
    });

    it("yields 1 when the aura misses (deterministic miss)", () => {
      const missCounter = findCounter((c) => !rollFishFlake(c));
      const createdAt = Date.now();
      const state = speedUpProcessing({
        farmId,
        action: {
          buildingId: "123",
          buildingName: "Fish Market",
          type: "processing.spedUp",
        },
        state: baseStateWithProcessing({
          auraEquipped: true,
          processedCounter: missCounter,
        }),
        createdAt,
      });

      expect(state.inventory["Fish Flake"]).toEqual(new Decimal(1));
      expect(state.farmActivity["Fish Flake Processed"]).toBe(missCounter + 1);
      expect(state.boostsUsedAt?.["Bubble Aura"]).toBeUndefined();
    });

    it("preserves the -20% Bubble Aura time boost on the recalculated queue", () => {
      const now = Date.now();
      const PROCESSING_TIME_MS = (name: ProcessedResource) =>
        FISH_PROCESSING_TIME_SECONDS[name] * 1000;

      // Existing queue was built while Bubble Aura was equipped, so each
      // readyAt is +0.8 * baseTime from the previous one.
      const fishStick = now + 0.8 * PROCESSING_TIME_MS("Fish Stick");
      const oil1 = fishStick + 0.8 * PROCESSING_TIME_MS("Fish Oil");
      const oil2 = oil1 + 0.8 * PROCESSING_TIME_MS("Fish Oil");

      const state = speedUpProcessing({
        farmId,
        state: {
          ...INITIAL_FARM,
          bumpkin: {
            ...INITIAL_FARM.bumpkin!,
            equipped: {
              ...INITIAL_FARM.bumpkin!.equipped,
              aura: "Bubble Aura",
            },
          },
          inventory: { Gem: new Decimal(100) },
          buildings: {
            "Fish Market": [
              {
                id: "123",
                coordinates: { x: 0, y: 0 },
                createdAt: 0,
                readyAt: 0,
                processing: [
                  { name: "Fish Stick", readyAt: fishStick },
                  { name: "Fish Oil", readyAt: oil1 },
                  { name: "Fish Oil", readyAt: oil2 },
                ],
              },
            ],
          },
        },
        action: {
          buildingId: "123",
          buildingName: "Fish Market",
          type: "processing.spedUp",
        },
        createdAt: now,
      });

      const queue = state.buildings["Fish Market"]?.[0].processing;

      // After speeding up the head Fish Stick the two remaining Fish Oil
      // items should be re-anchored at `now` and still use the boosted
      // 0.8 × base processing time.
      expect(queue?.[0].readyAt).toBe(
        now + 0.8 * PROCESSING_TIME_MS("Fish Oil"),
      );
      expect(queue?.[1].readyAt).toBe(
        now + 2 * 0.8 * PROCESSING_TIME_MS("Fish Oil"),
      );
    });

    // The next two tests document a known intentional behaviour: queue recalc
    // (after gem-instant or cancel) consults the player's CURRENT aura, not
    // the aura state at queue time. This matches cooking's recalculateQueue
    // pattern. If we ever lock duration at queue time we'd update both.
    it("[intentional] re-expands queued items to base time if Bubble Aura was unequipped before gem-cook", () => {
      const now = Date.now();
      const PROCESSING_TIME_MS = (name: ProcessedResource) =>
        FISH_PROCESSING_TIME_SECONDS[name] * 1000;

      // Queue was built with Bubble Aura equipped (boosted readyAts).
      const fishStick = now + 0.8 * PROCESSING_TIME_MS("Fish Stick");
      const oil1 = fishStick + 0.8 * PROCESSING_TIME_MS("Fish Oil");

      const state = speedUpProcessing({
        farmId,
        // Aura is NOT equipped at the time of gem-cook.
        state: {
          ...INITIAL_FARM,
          inventory: { Gem: new Decimal(100) },
          buildings: {
            "Fish Market": [
              {
                id: "123",
                coordinates: { x: 0, y: 0 },
                createdAt: 0,
                readyAt: 0,
                processing: [
                  { name: "Fish Stick", readyAt: fishStick },
                  { name: "Fish Oil", readyAt: oil1 },
                ],
              },
            ],
          },
        },
        action: {
          buildingId: "123",
          buildingName: "Fish Market",
          type: "processing.spedUp",
        },
        createdAt: now,
      });

      const queue = state.buildings["Fish Market"]?.[0].processing;
      // Remaining Fish Oil now uses the unboosted base duration.
      expect(queue?.[0].readyAt).toBe(now + PROCESSING_TIME_MS("Fish Oil"));
    });

    it("[intentional] retroactively shortens queued items if Bubble Aura was equipped before gem-cook", () => {
      const now = Date.now();
      const PROCESSING_TIME_MS = (name: ProcessedResource) =>
        FISH_PROCESSING_TIME_SECONDS[name] * 1000;

      // Queue was built without Bubble Aura (unboosted readyAts).
      const fishStick = now + PROCESSING_TIME_MS("Fish Stick");
      const oil1 = fishStick + PROCESSING_TIME_MS("Fish Oil");

      const state = speedUpProcessing({
        farmId,
        // Aura IS equipped at the time of gem-cook.
        state: {
          ...INITIAL_FARM,
          bumpkin: {
            ...INITIAL_FARM.bumpkin!,
            equipped: {
              ...INITIAL_FARM.bumpkin!.equipped,
              aura: "Bubble Aura",
            },
          },
          inventory: { Gem: new Decimal(100) },
          buildings: {
            "Fish Market": [
              {
                id: "123",
                coordinates: { x: 0, y: 0 },
                createdAt: 0,
                readyAt: 0,
                processing: [
                  { name: "Fish Stick", readyAt: fishStick },
                  { name: "Fish Oil", readyAt: oil1 },
                ],
              },
            ],
          },
        },
        action: {
          buildingId: "123",
          buildingName: "Fish Market",
          type: "processing.spedUp",
        },
        createdAt: now,
      });

      const queue = state.buildings["Fish Market"]?.[0].processing;
      // Remaining Fish Oil retroactively gets the boosted duration.
      expect(queue?.[0].readyAt).toBe(
        now + 0.8 * PROCESSING_TIME_MS("Fish Oil"),
      );
    });
  });

  describe("Dino Egg Trophy coin payment", () => {
    it("throws when paymentMethod is 'coins' without a placed Dino Egg Trophy", () => {
      expect(() =>
        speedUpProcessing({
          farmId,
          action: {
            buildingId: "123",
            buildingName: "Fish Market",
            type: "processing.spedUp",
            paymentMethod: "coins",
          },
          state: {
            ...INITIAL_FARM,
            coins: 100_000,
            buildings: {
              "Fish Market": [
                {
                  id: "123",
                  coordinates: { x: 0, y: 0 },
                  createdAt: 0,
                  readyAt: 0,
                  processing: [
                    { name: "Fish Stick", readyAt: Date.now() + 30000 },
                  ],
                },
              ],
            },
          },
        }),
      ).toThrow("Dino Egg Trophy required");
    });

    it("charges coins at 50 per gem and finishes processing when trophy is placed", () => {
      const now = Date.now();
      const state = speedUpProcessing({
        farmId,
        action: {
          buildingId: "123",
          buildingName: "Fish Market",
          type: "processing.spedUp",
          paymentMethod: "coins",
        },
        createdAt: now,
        state: {
          ...INITIAL_FARM,
          coins: 1000,
          inventory: { Gem: new Decimal(0) },
          collectibles: {
            "Dino Egg Trophy": [
              {
                id: "trophy-1",
                createdAt: 0,
                coordinates: { x: 0, y: 0 },
                readyAt: 0,
              },
            ],
          },
          buildings: {
            "Fish Market": [
              {
                id: "123",
                coordinates: { x: 0, y: 0 },
                createdAt: 0,
                readyAt: 0,
                processing: [{ name: "Fish Stick", readyAt: now + 30000 }],
              },
            ],
          },
        },
      });

      // 30s remaining ⇒ 1 gem ⇒ 50 coins.
      expect(state.coins).toBe(950);
      expect(state.inventory.Gem).toEqual(new Decimal(0));
      expect(state.inventory["Fish Stick"]).toEqual(new Decimal(1));
    });
  });
});
//   const farmId = 1;
//   it("returns the correct amount of gems for a 1 hour recipe", () => {
//     expect(
//       getInstantGems({
//         readyAt: Date.now() + 1 * 60 * 60 * 1000,
//         game: INITIAL_FARM,
//       }),
//     ).toEqual(5);
//   });

//   it("returns the 20% more when player has spent 100 gems in a day", () => {
//     const now = new Date("2024-01-01T03:00:00Z");
//     expect(
//       getInstantGems({
//         readyAt: now.getTime() + 1 * 60 * 60 * 1000,
//         game: {
//           ...INITIAL_FARM,
//           gems: {
//             history: {
//               "2024-01-01": { spent: 100 },
//             },
//           },
//         },
//         now: now.getTime(),
//       }),
//     ).toEqual(6);
//   });

//   it("returns the 40% more when player has spent 200 gems in a day", () => {
//     const now = new Date("2024-01-01T03:00:00Z");
//     expect(
//       getInstantGems({
//         readyAt: now.getTime() + 1 * 60 * 60 * 1000,
//         game: {
//           ...INITIAL_FARM,
//           gems: {
//             history: {
//               "2024-01-01": { spent: 200 },
//             },
//           },
//         },
//         now: now.getTime(),
//       }),
//     ).toEqual(7);
//   });

//   it("returns the 100% more when player has spent 500 gems in a day", () => {
//     const now = new Date("2024-01-01T03:00:00Z");
//     expect(
//       getInstantGems({
//         readyAt: now.getTime() + 1 * 60 * 60 * 1000,
//         game: {
//           ...INITIAL_FARM,
//           gems: {
//             history: {
//               "2024-01-01": { spent: 500 },
//             },
//           },
//         },
//         now: now.getTime(),
//       }),
//     ).toEqual(10);
//   });

//   it("doesn't remove other ready recipes when speeding up the current recipe", () => {
//     const now = Date.now();

//     const state = speedUpRecipe({
//       farmId,
//       state: {
//         ...INITIAL_FARM,
//         buildings: {
//           "Fire Pit": [
//             {
//               id: "123",
//               coordinates: { x: 0, y: 0 },
//               createdAt: 0,
//               readyAt: 0,
//               crafting: [
//                 {
//                   name: "Mashed Potato", // Ready recipe
//                   readyAt: now - 1000,
//                 },
//                 {
//                   name: "Radish Cake",
//                   readyAt: now + 30000 + 2000,
//                 },
//               ],
//             },
//           ],
//         },
//       },
//       action: {
//         type: "recipe.spedUp",
//         buildingId: "123",
//         buildingName: "Fire Pit",
//       },
//       createdAt: now,
//     });

//     expect(state.buildings["Fire Pit"]?.[0].crafting).toMatchObject([
//       {
//         name: "Mashed Potato",
//         readyAt: expect.any(Number),
//       },
//     ]);
//     expect(state.inventory["Radish Cake"]).toEqual(new Decimal(1));
//   });
// });
