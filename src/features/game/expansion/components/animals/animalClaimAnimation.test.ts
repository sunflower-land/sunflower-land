import Decimal from "decimal.js-light";
import { INITIAL_FARM } from "features/game/lib/constants";
import { getAnimalProduce } from "features/game/lib/animals";
import { feedAnimal } from "features/game/events/landExpansion/feedAnimal";
import { feedAllAnimals } from "features/game/events/landExpansion/feedAllAnimals";
import type { Animal, GameState } from "features/game/types/game";
import { getAnimalClaimSnapshot } from "./animalClaimAnimation";

const now = Date.now();
const placed = {
  id: "1",
  coordinates: { x: 0, y: 0 },
  createdAt: 0,
  readyAt: 0,
};

function farm(experience = 0): GameState {
  const animal: Animal = {
    id: "1",
    type: "Cow",
    state: "idle",
    experience,
    createdAt: 0,
    asleepAt: 0,
    awakeAt: 0,
    lovedAt: 0,
    item: "Petting Hand",
    feedBuff: { name: "Salt Lick", harvestsRemaining: 1 },
  };
  return {
    ...INITIAL_FARM,
    inventory: { "Amber Beetle": new Decimal(1) },
    buildings: { Barn: [placed] },
    collectibles: {},
    barn: { level: 3, animals: { "1": animal } },
  };
}

function withGoldenCow(state: GameState): GameState {
  return { ...state, collectibles: { "Golden Cow": [placed] } };
}

describe("bulk claim animation snapshot", () => {
  it("retains every pending level and the last treat charge after bulk claiming", () => {
    const fed = feedAnimal({
      state: farm(),
      action: {
        type: "animal.fed",
        animal: "Cow",
        id: "1",
        item: "Amber Beetle",
      },
      createdAt: now,
    });
    const before = withGoldenCow(fed);
    const after = feedAllAnimals({
      state: before,
      action: { type: "animals.fedAll", building: "Barn" },
      createdAt: now,
    });
    const snapshot = getAnimalClaimSnapshot(
      before.barn.animals["1"],
      after.barn.animals["1"],
    );
    const drops = getAnimalProduce({ game: after, animal: snapshot });
    expect(drops.map(({ resource, amount }) => [resource, amount])).toEqual([
      ["Milk", 3.15],
      ["Leather", 3.15],
    ]);
    expect(after.inventory.Milk?.toNumber()).toBe(3.15);
    expect(after.inventory.Leather?.toNumber()).toBe(3.15);
    expect(after.barn.animals["1"].pendingProduceLevels).toBeUndefined();
    expect(after.barn.animals["1"].feedBuff).toBeUndefined();
    expect(snapshot.pendingProduceLevels).toEqual([1, 2, 3]);
    expect(snapshot.feedBuff?.harvestsRemaining).toBe(1);
  });

  it("reconstructs a feed-and-claim in the same bulk event using pre-claim buffs", () => {
    const before = withGoldenCow(farm(170));
    const after = feedAllAnimals({
      state: before,
      action: { type: "animals.fedAll", building: "Barn" },
      createdAt: now,
    });
    const snapshot = getAnimalClaimSnapshot(
      before.barn.animals["1"],
      after.barn.animals["1"],
    );
    const drops = getAnimalProduce({ game: after, animal: snapshot });
    expect(snapshot.experience).toBe(after.barn.animals["1"].experience);
    expect(snapshot.pendingProduceLevels).toEqual([1]);
    expect(drops.find(({ resource }) => resource === "Milk")?.amount).toBe(
      1.05,
    );
    expect(after.inventory.Milk?.toNumber()).toBe(1.05);
    expect(before.barn.animals["1"].experience).toBe(170);
    expect(before.barn.animals["1"].pendingProduceLevels).toBeUndefined();
    expect(after.barn.animals["1"].pendingProduceLevels).toBeUndefined();
    expect(after.barn.animals["1"].feedBuff).toBeUndefined();
  });

  it("includes skipped levels when a boosted free feed and claim happen together", () => {
    const base = farm();
    const before: GameState = {
      ...base,
      bumpkin: { ...base.bumpkin, skills: { "Chonky Feed": 3 } },
      buildings: { "Hen House": [placed] },
      collectibles: { "Gold Egg": [placed] },
      henHouse: {
        level: 3,
        animals: { "1": { ...base.barn.animals["1"], type: "Chicken" } },
      },
    };
    const after = feedAllAnimals({
      state: before,
      action: { type: "animals.fedAll", building: "Hen House" },
      createdAt: now,
    });
    const snapshot = getAnimalClaimSnapshot(
      before.henHouse.animals["1"],
      after.henHouse.animals["1"],
    );
    expect(snapshot.pendingProduceLevels).toEqual([1, 2]);
    expect(getAnimalProduce({ game: after, animal: snapshot })[0].amount).toBe(
      2.1,
    );
    expect(after.inventory.Egg?.toNumber()).toBe(2.1);
    expect(after.henHouse.animals["1"].pendingProduceLevels).toBeUndefined();
  });
});
