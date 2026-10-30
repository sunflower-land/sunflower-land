import Decimal from "decimal.js-light";
import { TEST_FARM } from "features/game/lib/constants";
import type { GameState, Skills } from "features/game/types/game";
import { digCaveTile } from "features/game/events/landExpansion/digCaveTile";
import { drillCaveTiles } from "features/game/events/landExpansion/drillCaveTiles";
import { getCaveDigFeedback } from "./digFeedback";

const state = (skills: Skills = {}): GameState => ({
  ...TEST_FARM,
  buildings: {
    ...TEST_FARM.buildings,
    Cave: [
      { id: "cave", createdAt: 0, readyAt: 0, coordinates: { x: 0, y: 0 } },
    ],
  },
  inventory: {
    ...TEST_FARM.inventory,
    "Sand Shovel": new Decimal(100),
    "Sand Drill": new Decimal(100),
  },
  bumpkin: { ...TEST_FARM.bumpkin, skills },
  farmActivity: { ...TEST_FARM.farmActivity, "Cave Tile Dug": 0 },
  boostsUsedAt: {
    "Sturdy Shovel": 1000,
    "Sturdy Drill": 1000,
    "Twin Beetles": 1000,
  },
  cave: {
    builtAt: 1,
    tier: 1,
    machines: {
      "1": {
        batch: {
          recipe: "Mushroom",
          startedAt: 0,
          readyAt: 1,
          seed: "00112233445566778899aabbccddeeff",
        },
      },
    },
  },
});
// (2,3) is a Green Beetle when first dug at 1002 on this seed (digs draw
// their board from the seed and their createdAt).
const point = { x: 2, y: 3 };
const square = [{ x: 2, y: 2 }, { x: 3, y: 2 }, point, { x: 3, y: 3 }];
const dig = (before: GameState, farmId: number, p = point) =>
  digCaveTile({
    state: before,
    action: { type: "cave.dug", machineId: "1", ...p },
    farmId,
    createdAt: 1002,
  });
const feedback = (
  before: GameState,
  after: GameState,
  coords = [point],
  tool: "Sand Shovel" | "Sand Drill" = "Sand Shovel",
) => getCaveDigFeedback({ before, after, coords, tool, machineId: "1" });

it("does not replay saved timestamps on ordinary digs, failed actions or reloads", () => {
  const before = state();
  expect(feedback(before, before)).toEqual([]);
  expect(feedback(before, { ...before })).toEqual([]);
  expect(feedback(before, dig(before, 1))).toEqual([]);
});

it("reports the real saved shovel and ignores misses", () => {
  const before = state({ "Sturdy Shovel": 3 });
  const results = new Set<boolean>();
  for (let id = 1; id <= 100; id++) {
    const after = dig(before, id);
    const saved = after.inventory["Sand Shovel"]!.eq(
      before.inventory["Sand Shovel"]!,
    );
    results.add(saved);
    expect(feedback(before, after)).toEqual(
      saved ? [{ kind: "shovelSaved", item: "Sand Shovel" }] : [],
    );
  }
  expect(results.size).toBe(2);
});

it("reports one saved drill for the whole 2x2 action", () => {
  const before = state({ "Sturdy Drill": 3 });
  const results = new Set<boolean>();
  for (let id = 1; id <= 100; id++) {
    const after = drillCaveTiles({
      state: before,
      action: { type: "cave.drilled", machineId: "1", coords: square },
      farmId: id,
      createdAt: 1000,
    });
    const saved = after.inventory["Sand Drill"]!.eq(
      before.inventory["Sand Drill"]!,
    );
    results.add(saved);
    expect(feedback(before, after, square, "Sand Drill")).toEqual(
      saved ? [{ kind: "drillSaved", item: "Sand Drill" }] : [],
    );
  }
  expect(results.size).toBe(2);
});

it("distinguishes Twin Beetles from the normal beetle reward, retaining its colour", () => {
  const before = state({ "Twin Beetles": 3 });
  const results = new Set<boolean>();
  for (let id = 1; id <= 100; id++) {
    const after = dig(before, id);
    const bonus =
      after.inventory["Green Beetle"]!.minus(
        before.inventory["Green Beetle"] ?? 0,
      ).toNumber() - 1;
    results.add(bonus > 0);
    expect(feedback(before, after)).toEqual(
      bonus
        ? [{ kind: "bonusBeetle", item: "Green Beetle", amount: bonus }]
        : [],
    );
  }
  expect(results.size).toBe(2);
});

it("reports both tool saving and bonus beetles when they fire together", () => {
  const before = state({ "Sturdy Shovel": 3, "Twin Beetles": 3 });
  const match = Array.from({ length: 200 }, (_, i) => dig(before, i + 1)).find(
    (after) => feedback(before, after).length === 2,
  );
  expect(match).toBeDefined();
  expect(feedback(before, match!)).toEqual([
    { kind: "shovelSaved", item: "Sand Shovel" },
    { kind: "bonusBeetle", item: "Green Beetle", amount: 1 },
  ]);
});

it("skips previously dug beetles in partial drill squares and duplicate coordinates", () => {
  const before = state({ "Twin Beetles": 3 });
  before.cave!.machines["1"].batch!.dug = { "3,3": { dugAt: 500 } };
  before.inventory["Green Beetle"] = new Decimal(20);
  const after = drillCaveTiles({
    state: before,
    action: { type: "cave.drilled", machineId: "1", coords: square },
    farmId: 1,
    createdAt: 1000,
  });
  expect(feedback(before, after, [...square, ...square], "Sand Drill")).toEqual(
    [],
  );
});

it("detects successive actions with the same timestamp without repeating the previous hit", () => {
  const before = state({ "Sturdy Shovel": 3 });
  let checked = false;
  for (let id = 1; id <= 200; id++) {
    const first = dig(before, id, { x: 0, y: 0 });
    const secondPoint = { x: 1, y: 0 };
    const second = dig(first, id, secondPoint);
    if (
      feedback(before, first, [{ x: 0, y: 0 }]).length &&
      !second.inventory["Sand Shovel"]!.eq(first.inventory["Sand Shovel"]!)
    ) {
      expect(first.boostsUsedAt!["Sturdy Shovel"]).toBe(1002);
      expect(second.boostsUsedAt!["Sturdy Shovel"]).toBe(1002);
      expect(feedback(first, second, [secondPoint])).toEqual([]);
      checked = true;
      break;
    }
  }
  expect(checked).toBe(true);
});
