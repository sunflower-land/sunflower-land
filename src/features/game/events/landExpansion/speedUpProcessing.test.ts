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
import { ProcessedFood } from "features/game/types/processedFood";

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
    const PROCESSING_TIME = (name: ProcessedFood) =>
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
