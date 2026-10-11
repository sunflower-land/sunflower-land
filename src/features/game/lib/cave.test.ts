import { TEST_FARM } from "features/game/lib/constants";
import type { GameState, PlacedItem } from "features/game/types/game";
import { isCaveBuildingReady } from "./cave";

const now = 1_000_000;

const withCave = (cave?: PlacedItem): GameState => ({
  ...TEST_FARM,
  buildings: { ...TEST_FARM.buildings, ...(cave ? { Cave: [cave] } : {}) },
});

describe("isCaveBuildingReady", () => {
  it("is ready once a placed Cave has finished construction", () => {
    expect(
      isCaveBuildingReady(
        withCave({
          id: "1",
          coordinates: { x: 0, y: 0 },
          createdAt: 0,
          readyAt: now,
        }),
        now,
      ),
    ).toBe(true);
  });

  it("is not ready without a Cave building", () => {
    expect(isCaveBuildingReady(withCave(), now)).toBe(false);
  });

  it("is not ready while the Cave is under construction", () => {
    expect(
      isCaveBuildingReady(
        withCave({
          id: "1",
          coordinates: { x: 0, y: 0 },
          createdAt: 0,
          readyAt: now + 1,
        }),
        now,
      ),
    ).toBe(false);
  });

  it("is not ready while the Cave is in the chest", () => {
    expect(
      isCaveBuildingReady(withCave({ id: "1", createdAt: 0, readyAt: 0 }), now),
    ).toBe(false);
  });
});
