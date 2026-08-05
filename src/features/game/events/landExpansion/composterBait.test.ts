import { INITIAL_BUMPKIN, TEST_FARM } from "features/game/lib/constants";
import type { GameState } from "features/game/types/game";
import { WORM_AMOUNTS, getWormRange } from "./composterBait";

const GAME_STATE: GameState = { ...TEST_FARM, bumpkin: INITIAL_BUMPKIN };

const stateWithSkills = (
  skills: GameState["bumpkin"]["skills"],
): GameState => ({
  ...GAME_STATE,
  bumpkin: { ...INITIAL_BUMPKIN, skills },
});

const baseRange = () => {
  const amounts = WORM_AMOUNTS["Red Wiggler"];
  return { min: Math.min(...amounts), max: Math.max(...amounts) };
};

describe("composterBait skill ranks", () => {
  it.each([
    [1, 1],
    [2, 2],
    [3, 3],
  ])("Wormy Treat rank %i adds +%i worms", (rank, delta) => {
    const { min, max } = getWormRange({
      state: stateWithSkills({ "Wormy Treat": rank }),
      building: "Premium Composter",
    });
    const base = baseRange();
    expect(min).toBe(base.min + delta);
    expect(max).toBe(base.max + delta);
  });

  it.each([
    [1, 2],
    [2, 5],
    [3, 8],
  ])("Composting Overhaul rank %i adds +%i worms", (rank, delta) => {
    const { min, max } = getWormRange({
      state: stateWithSkills({ "Composting Overhaul": rank }),
      building: "Premium Composter",
    });
    const base = baseRange();
    expect(min).toBe(base.min + delta);
    expect(max).toBe(base.max + delta);
  });

  it.each([
    [1, 2],
    [2, 3],
    [3, 4],
  ])("Composting Revamp rank %i removes %i worms", (rank, delta) => {
    const { max } = getWormRange({
      state: stateWithSkills({ "Composting Revamp": rank }),
      building: "Premium Composter",
    });
    const base = baseRange();
    expect(max).toBe(Math.max(0, base.max - delta));
  });

  it("never drops the worm range below zero", () => {
    const { min, max } = getWormRange({
      state: stateWithSkills({ "Composting Revamp": 3 }),
      building: "Premium Composter",
    });
    expect(min).toBeGreaterThanOrEqual(0);
    expect(max).toBeGreaterThanOrEqual(0);
  });
});
