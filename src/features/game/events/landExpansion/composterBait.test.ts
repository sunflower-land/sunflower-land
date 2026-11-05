import { INITIAL_BUMPKIN, TEST_FARM } from "features/game/lib/constants";
import type { GameState } from "features/game/types/game";
import { WORM_AMOUNTS, getWormRange, rollWormAmount } from "./composterBait";
import { composterDetails } from "features/game/types/composters";

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

describe("Straw House", () => {
  const withStrawHouse = (game: GameState): GameState => ({
    ...game,
    collectibles: {
      ...game.collectibles,
      "Straw House": [
        { id: "1", createdAt: 0, coordinates: { x: 0, y: 0 }, readyAt: 0 },
      ],
    },
  });

  it.each(["Compost Bin", "Turbo Composter", "Premium Composter"] as const)(
    "triples the base worm range of the %s",
    (building) => {
      const amounts = WORM_AMOUNTS[composterDetails[building].worm];
      const { min, max, boostsUsed } = getWormRange({
        state: withStrawHouse(GAME_STATE),
        building,
      });

      expect(min).toBe(Math.min(...amounts) * 3);
      expect(max).toBe(Math.max(...amounts) * 3);
      expect(boostsUsed).toContainEqual({ name: "Straw House", value: "x3" });
    },
  );

  it("triples the base worm range before the additive boosts", () => {
    const { min, max } = getWormRange({
      state: withStrawHouse(stateWithSkills({ "Wormy Treat": 1 })),
      building: "Premium Composter",
    });
    const base = baseRange();

    expect(min).toBe(base.min * 3 + 1);
    expect(max).toBe(base.max * 3 + 1);
  });

  it("triples the rolled worm amount", () => {
    const args = {
      building: "Compost Bin" as const,
      farmId: 1,
      counter: 7,
    };
    const { worms: base } = rollWormAmount({ ...args, state: GAME_STATE });
    const { worms } = rollWormAmount({
      ...args,
      state: withStrawHouse(GAME_STATE),
    });

    expect(worms).toBe(base * 3);
  });
});
