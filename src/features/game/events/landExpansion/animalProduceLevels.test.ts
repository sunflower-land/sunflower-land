import Decimal from "decimal.js-light";
import { INITIAL_FARM } from "features/game/lib/constants";
import {
  addAnimalExperience,
  getAnimalLevel,
  getAnimalProduce,
  makeAnimalBuildingKey,
} from "features/game/lib/animals";
import {
  ANIMALS,
  ANIMAL_LEVELS,
  type AnimalType,
} from "features/game/types/animals";
import type {
  Animal,
  AnimalResource,
  GameState,
} from "features/game/types/game";
import { feedAnimal } from "./feedAnimal";
import { claimProduce } from "./claimProduce";
import { loveAnimal } from "./loveAnimal";

const now = Date.now();

function farm(
  type: AnimalType,
  experience = 0,
  overrides: Partial<Animal> = {},
): GameState {
  const key = makeAnimalBuildingKey(ANIMALS[type].buildingRequired);
  return {
    ...INITIAL_FARM,
    inventory: {
      "Amber Beetle": new Decimal(3),
      "Green Beetle": new Decimal(3),
      "Petting Hand": new Decimal(3),
    },
    collectibles: {},
    buildings: {
      [ANIMALS[type].buildingRequired]: [
        { id: "1", coordinates: { x: 0, y: 0 }, createdAt: 0, readyAt: 0 },
      ],
    },
    [key]: {
      level: 3,
      animals: {
        "1": {
          id: "1",
          type,
          state: "idle",
          createdAt: 0,
          experience,
          asleepAt: 0,
          awakeAt: 0,
          lovedAt: 0,
          item: "Petting Hand",
          ...overrides,
        },
      },
    },
  };
}

const feed = (
  state: GameState,
  animal: AnimalType,
  item: "Amber Beetle" | "Green Beetle" = "Amber Beetle",
  createdAt = now,
) =>
  feedAnimal({
    state,
    action: { type: "animal.fed", animal, id: "1", item },
    createdAt,
  });
const claim = (state: GameState, animal: AnimalType, createdAt = now) =>
  claimProduce({
    state,
    action: { type: "produce.claimed", animal, id: "1" },
    createdAt,
  });

describe("animal produce across skipped levels", () => {
  it.each([
    { type: "Chicken", level: 6, drops: { Egg: 9, Feather: 4 } },
    { type: "Cow", level: 3, drops: { Milk: 3, Leather: 3 } },
    { type: "Sheep", level: 4, drops: { Wool: 5, "Merino Wool": 4 } },
    { type: "Pig", level: 3, drops: { Truffle: 3 } },
  ] as const)(
    "awards every crossed level to a $type",
    ({ type, level, drops }) => {
      const key = makeAnimalBuildingKey(ANIMALS[type].buildingRequired);
      const fed = feed(farm(type), type);
      expect(fed[key].animals["1"].experience).toBe(800);
      expect(getAnimalLevel(800, type)).toBe(level);
      expect(fed.inventory["Amber Beetle"]?.toNumber()).toBe(2);
      const preview = getAnimalProduce({
        game: fed,
        animal: fed[key].animals["1"],
      });
      const claimed = claim(fed, type);
      for (const [resource, amount] of Object.entries(drops)) {
        expect(claimed.inventory[resource as AnimalResource]?.toNumber()).toBe(
          amount,
        );
        expect(preview.find((drop) => drop.resource === resource)?.amount).toBe(
          amount,
        );
      }
      const animal = claimed[key].animals["1"];
      expect(animal.experience).toBe(800);
      expect(animal.pendingProduceLevels).toBeUndefined();
      expect(animal.state).toBe("idle");
      expect(animal.awakeAt).toBeGreaterThan(now);
      expect(() => claim(claimed, type)).toThrow(
        "Animal is not ready to claim produce",
      );
      expect(() => claim(claimed, type, animal.awakeAt + 1)).toThrow(
        "Animal is not ready to claim produce",
      );
    },
  );

  it("only pays new levels when feeding an existing level-1 cow", () => {
    const claimed = claim(feed(farm("Cow", 180), "Cow"), "Cow");
    expect(claimed.barn.animals["1"].experience).toBe(980);
    expect(claimed.inventory.Milk?.toNumber()).toBe(2);
    expect(claimed.inventory.Leather?.toNumber()).toBe(2);
  });

  it("applies flat boosts, critical multiplier and Salt Lick to each reward", () => {
    const base = farm("Chicken", 0, {
      multiplier: 2,
      feedBuff: { name: "Salt Lick", harvestsRemaining: 2 },
    });
    base.inventory["Barn Manager"] = new Decimal(1);
    const claimed = claim(feed(base, "Chicken"), "Chicken");
    expect(claimed.inventory.Egg?.toNumber()).toBe(20.16);
    expect(claimed.inventory.Feather?.toNumber()).toBe(9.24);
    expect(claimed.henHouse.animals["1"].feedBuff?.harvestsRemaining).toBe(1);
  });

  it("keeps the muddy pig's XP and consumes one charge for one claim", () => {
    const claimed = claim(
      feed(farm("Pig", 100, { mud: { harvestsRemaining: 2 } }), "Pig"),
      "Pig",
    );
    expect(claimed.pigpen.animals["1"].experience).toBe(1100);
    expect(claimed.inventory.Truffle?.toNumber()).toBe(5);
    expect(claimed.pigpen.animals["1"].mud?.harvestsRemaining).toBe(1);
  });

  it("does not infer historical rewards for a legacy ready animal", () => {
    const claimed = claim(farm("Cow", 800, { state: "ready" }), "Cow");
    expect(claimed.inventory.Milk?.toNumber()).toBe(1);
    expect(claimed.inventory.Leather?.toNumber()).toBe(1);
  });

  it("does not repeat earlier rewards in the next production cycle", () => {
    const first = claim(feed(farm("Cow"), "Cow"), "Cow");
    const second = claim(
      feed(first, "Cow", "Amber Beetle", first.barn.animals["1"].awakeAt + 1),
      "Cow",
      first.barn.animals["1"].awakeAt + 1,
    );
    // The second feed crosses levels 4 and 5, each worth two Milk and one Leather.
    expect(second.inventory.Milk?.toNumber()).toBe(7);
    expect(second.inventory.Leather?.toNumber()).toBe(5);
  });

  it("retains already earned produce when another feed stays in the same level", () => {
    const first = feed(farm("Cow", 80), "Cow", "Green Beetle");
    const second = feed(first, "Cow", "Green Beetle");
    expect(second.barn.animals["1"].state).toBe("ready");
    expect(claim(second, "Cow").inventory.Milk?.toNumber()).toBe(1);
  });

  it("tracks a petting level-up and retains it through a beetle feed", () => {
    const base = farm("Cow", 170, {
      asleepAt: now - 24 * 60 * 60 * 1000,
      awakeAt: now,
      lovedAt: 0,
    });
    const loved = loveAnimal({
      state: base,
      action: {
        type: "animal.loved",
        animal: "Cow",
        id: "1",
        item: "Petting Hand",
      },
      createdAt: now,
    });
    expect(loved.barn.animals["1"].state).toBe("ready");
    expect(claim(feed(loved, "Cow"), "Cow").inventory.Milk?.toNumber()).toBe(3);
  });

  it("preserves an old ready payout when further XP crosses another level", () => {
    const claimed = claim(
      feed(farm("Cow", 180, { state: "ready" }), "Cow"),
      "Cow",
    );
    expect(claimed.inventory.Milk?.toNumber()).toBe(3);
  });

  it("pays the last level once when reaching the top, then keeps existing max-level cycles", () => {
    const claimed = claim(
      feed(farm("Chicken", ANIMAL_LEVELS.Chicken[14]), "Chicken"),
      "Chicken",
    );
    expect(claimed.inventory.Egg?.toNumber()).toBe(5);
    const animal = { ...claimed.henHouse.animals["1"] };
    const cycleXp = ANIMAL_LEVELS.Chicken[15] - ANIMAL_LEVELS.Chicken[14];
    expect(addAnimalExperience(animal, cycleXp)).toBe(true);
    expect(animal.pendingProduceLevels).toEqual([15]);
  });
});
