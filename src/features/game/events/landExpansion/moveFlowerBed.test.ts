import { TEST_FARM } from "features/game/lib/constants";
import { moveFlowerBed } from "./moveFlowerBed";

describe("moveFlowerBed", () => {
  it("throws if moving a patch that doesn't exist", () => {
    expect(() =>
      moveFlowerBed({
        state: TEST_FARM,
        action: {
          type: "flowerBed.moved",
          coordinates: { x: 0, y: 0 },
          id: "not a real id",
        },
      }),
    ).toThrow("Flower bed does not exist");
  });

  it("throws if a collision is detected", () => {
    expect(() =>
      moveFlowerBed({
        state: {
          ...TEST_FARM,
          flowers: {
            discovered: {},
            flowerBeds: {
              "1": { x: 1, y: 1, createdAt: 0, height: 1, width: 3 },
              "2": { x: 0, y: 0, createdAt: 0, height: 1, width: 3 },
            },
          },
        },
        action: {
          type: "flowerBed.moved",
          coordinates: { x: 0, y: 0 },
          id: "1",
        },
      }),
    ).toThrow("Flower Bed collides");
  });

  it("moves a patch", () => {
    const result = moveFlowerBed({
      state: {
        ...TEST_FARM,
        crops: {},
        flowers: {
          discovered: {},
          flowerBeds: {
            "1": { x: 1, y: 1, createdAt: 0, height: 0, width: 0 },
          },
        },
      },
      action: {
        type: "flowerBed.moved",
        coordinates: { x: 0, y: 0 },
        id: "1",
      },
    });

    expect(result.flowers.flowerBeds["1"]).toMatchObject({ x: 0, y: 0 });
  });
});
