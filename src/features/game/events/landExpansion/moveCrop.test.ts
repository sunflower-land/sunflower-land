import "lib/__mocks__/configMock";
import { INITIAL_BUMPKIN, TEST_FARM } from "features/game/lib/constants";
import { MOVE_CROP_ERRORS, moveCrop } from "./moveCrop";

describe("moveCrop", () => {
  const dateNow = Date.now();

  it("does not move crop with invalid id", () => {
    expect(() =>
      moveCrop({
        state: {
          ...TEST_FARM,
          crops: {
            1: {
              height: 1,
              width: 1,
              x: 1,
              y: 1,
              createdAt: dateNow,
            },
          },
        },
        action: {
          type: "crop.moved",
          id: "2",
          coordinates: { x: 2, y: 2 },
        },
      }),
    ).toThrow(MOVE_CROP_ERRORS.CROP_NOT_PLACED);
  });

  it("moves a crop", () => {
    const gameState = moveCrop({
      state: {
        ...TEST_FARM,
        crops: {
          123: {
            height: 1,
            width: 1,
            x: 1,
            y: 1,
            createdAt: 0,
          },
          456: {
            height: 1,
            width: 1,
            x: 4,
            y: 4,
            createdAt: 0,
          },
          789: {
            height: 1,
            width: 1,
            x: 8,
            y: 8,
            createdAt: 0,
          },
        },
      },
      action: {
        type: "crop.moved",
        id: "123",
        coordinates: { x: 2, y: 2 },
      },
    });

    expect(gameState.crops).toEqual({
      "123": { height: 1, width: 1, x: 2, y: 2, createdAt: 0 },
      "456": { height: 1, width: 1, x: 4, y: 4, createdAt: 0 },
      "789": { height: 1, width: 1, x: 8, y: 8, createdAt: 0 },
    });
  });

  it("does not move locked crop by Basic Scarecrow", () => {
    expect(() =>
      moveCrop({
        state: {
          ...TEST_FARM,
          bumpkin: INITIAL_BUMPKIN,
          collectibles: {
            "Basic Scarecrow": [
              {
                id: "1",
                coordinates: { x: 0, y: 0 },
                createdAt: dateNow,
                readyAt: 0,
              },
            ],
          },
          crops: {
            1: {
              height: 1,
              width: 1,
              x: 0,
              y: -2,
              createdAt: dateNow,
              crop: {
                name: "Potato",
                amount: 1,
                plantedAt: dateNow,
              },
            },
          },
        },
        action: {
          type: "crop.moved",
          id: "1",
          coordinates: { x: 2, y: 2 },
        },
      }),
    ).toThrow(MOVE_CROP_ERRORS.AOE_LOCKED);
  });

  it("does not move locked crop by Scary Mike", () => {
    expect(() =>
      moveCrop({
        state: {
          ...TEST_FARM,
          bumpkin: INITIAL_BUMPKIN,
          collectibles: {
            "Scary Mike": [
              {
                id: "1",
                coordinates: { x: 0, y: 0 },
                createdAt: dateNow,
                readyAt: 0,
              },
            ],
          },
          crops: {
            1: {
              height: 1,
              width: 1,
              x: 0,
              y: -2,
              createdAt: dateNow,
              crop: {
                name: "Cauliflower",
                amount: 1,
                plantedAt: dateNow,
              },
            },
          },
        },
        action: {
          type: "crop.moved",
          id: "1",
          coordinates: { x: 2, y: 2 },
        },
      }),
    ).toThrow(MOVE_CROP_ERRORS.AOE_LOCKED);
  });

  it("does not move locked crop by Sir Goldensnout", () => {
    expect(() =>
      moveCrop({
        state: {
          ...TEST_FARM,
          bumpkin: INITIAL_BUMPKIN,
          collectibles: {
            "Sir Goldensnout": [
              {
                id: "1",
                coordinates: { x: 0, y: 0 },
                createdAt: dateNow,
                readyAt: 0,
              },
            ],
          },
          crops: {
            1: {
              height: 1,
              width: 1,
              x: 0,
              y: -2,
              createdAt: dateNow,
              crop: {
                name: "Potato",
                amount: 1,
                plantedAt: dateNow,
              },
            },
          },
        },
        action: {
          type: "crop.moved",
          id: "1",
          coordinates: { x: 2, y: 2 },
        },
      }),
    ).toThrow(MOVE_CROP_ERRORS.AOE_LOCKED);
  });

  it("does not move locked crop by Laurie the Chuckle Crow", () => {
    expect(() =>
      moveCrop({
        state: {
          ...TEST_FARM,
          bumpkin: INITIAL_BUMPKIN,
          collectibles: {
            "Laurie the Chuckle Crow": [
              {
                id: "1",
                coordinates: { x: 0, y: 0 },
                createdAt: dateNow,
                readyAt: 0,
              },
            ],
          },
          crops: {
            1: {
              height: 1,
              width: 1,
              x: 0,
              y: -2,
              createdAt: dateNow,
              crop: {
                name: "Eggplant",
                amount: 1,
                plantedAt: dateNow,
              },
            },
          },
        },
        action: {
          type: "crop.moved",
          id: "1",
          coordinates: { x: 2, y: 2 },
        },
      }),
    ).toThrow(MOVE_CROP_ERRORS.AOE_LOCKED);

    expect(() =>
      moveCrop({
        state: {
          ...TEST_FARM,
          bumpkin: INITIAL_BUMPKIN,
          collectibles: {
            "Laurie the Chuckle Crow": [
              {
                id: "1",
                coordinates: { x: 0, y: 0 },
                createdAt: dateNow,
                readyAt: 0,
              },
            ],
          },
          crops: {
            1: {
              height: 1,
              width: 1,
              x: 0,
              y: -2,
              createdAt: dateNow,
              crop: {
                name: "Corn",
                amount: 1,
                plantedAt: dateNow,
              },
            },
          },
        },
        action: {
          type: "crop.moved",
          id: "1",
          coordinates: { x: 2, y: 2 },
        },
      }),
    ).toThrow(MOVE_CROP_ERRORS.AOE_LOCKED);
  });
});
