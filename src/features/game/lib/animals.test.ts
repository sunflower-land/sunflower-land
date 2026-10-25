import Decimal from "decimal.js-light";
import {
  getAnimalFavoriteFood,
  getAnimalLevel,
  getFeedItem,
  getAnimalReadyAt,
  getBoostedAwakeAt,
  getBoostedFoodQuantity,
  getResourceDropAmount,
  makeAnimalBuildingKey,
  ANIMAL_BUILDING_KEYS,
  isFoodForAnimal,
  isMuddy,
  getBountyLevel,
  getPigBristles,
  canTradeInPig,
} from "../lib/animals";
import { BUMPKIN_REVAMP_SKILL_TREE, SKILL_RANKS } from "../types/bumpkinSkills";
import {
  ANIMALS,
  ANIMAL_LEVELS,
  ANIMAL_FOOD_EXPERIENCE,
  ANIMAL_RESOURCE_DROP,
  PIG_BRISTLES_PER_LEVEL,
  isAnimalBuildingType,
  type AnimalLevel,
  type AnimalType,
} from "../types/animals";
import { REQUIRED_FOOD_QTY } from "../events/landExpansion/feedAnimal";
import { getKeys } from "lib/object";
import { INITIAL_FARM } from "./constants";
import type { Animal, GameState } from "../types/game";
import { ANIMAL_SLEEP_DURATION } from "../events/landExpansion/feedAnimal";

describe("getAnimalFavoriteFood", () => {
  it.each([
    ...Array(16)
      .fill(0)
      .map((_, level) => ["Chicken", level]),
    ...Array(16)
      .fill(0)
      .map((_, level) => ["Cow", level]),
    ...Array(16)
      .fill(0)
      .map((_, level) => ["Sheep", level]),
  ])("should return favorite food for %s at level %s", (animalType, level) => {
    const xp = ANIMAL_LEVELS[animalType as AnimalType][level as AnimalLevel];

    // Should not throw error
    const food = getAnimalFavoriteFood(animalType as AnimalType, xp);
    expect(food).toBeDefined();
  });
});

const ANIMAL: Animal = {
  id: "0",
  type: "Chicken",
  createdAt: 0,
  state: "idle",
  experience: 0,
  asleepAt: 0,
  awakeAt: 0,
  lovedAt: 0,
  item: "Petting Hand",
};

const withSkills = (skills: GameState["bumpkin"]["skills"]): GameState => ({
  ...INITIAL_FARM,
  bumpkin: { ...INITIAL_FARM.bumpkin, skills },
});

describe("Animals skill ranks", () => {
  describe("Double Bale", () => {
    const baleFarm = (skills: GameState["bumpkin"]["skills"]): GameState => {
      const game = withSkills(skills);

      return {
        ...game,
        collectibles: {
          ...game.collectibles,
          Bale: [
            { coordinates: { x: 0, y: 0 }, createdAt: 0, id: "0", readyAt: 0 },
          ],
        },
      };
    };

    it("rank 1 doubles Bale's effect, matching the pre-rank magnitude", () => {
      const { boostsUsed } = getResourceDropAmount({
        game: baleFarm({ "Double Bale": 1 }),
        animalType: "Chicken",
        resource: "Egg",
        baseAmount: 1,
        multiplier: 1,
        animal: ANIMAL,
      });

      expect(boostsUsed).toContainEqual({ name: "Double Bale", value: "+0.2" });
    });

    // Bale's base boost is 0.1, so a float 0.1 * 3 drifts to 0.30000000000000004
    // and leaks into the boost label. toEqual (not toBeCloseTo) is what catches it.
    it("rank 3 triples Bale's effect without float drift", () => {
      const { amount, boostsUsed } = getResourceDropAmount({
        game: baleFarm({ "Double Bale": 3 }),
        animalType: "Chicken",
        resource: "Egg",
        baseAmount: 1,
        multiplier: 1,
        animal: ANIMAL,
      });

      expect(boostsUsed).toContainEqual({ name: "Double Bale", value: "+0.3" });
      expect(amount).toEqual(1.3);
    });

    it("rank 2 applies 2.5x Bale's effect", () => {
      const { boostsUsed } = getResourceDropAmount({
        game: baleFarm({ "Double Bale": 2 }),
        animalType: "Chicken",
        resource: "Egg",
        baseAmount: 1,
        multiplier: 1,
        animal: ANIMAL,
      });

      expect(boostsUsed).toContainEqual({
        name: "Double Bale",
        value: "+0.25",
      });
    });

    it("leaves Bale's base effect alone when the skill is absent", () => {
      const { amount, boostsUsed } = getResourceDropAmount({
        game: baleFarm({}),
        animalType: "Chicken",
        resource: "Egg",
        baseAmount: 1,
        multiplier: 1,
        animal: ANIMAL,
      });

      expect(boostsUsed).not.toContainEqual(
        expect.objectContaining({ name: "Double Bale" }),
      );
      expect(amount).toEqual(1.1);
    });

    it("records the Bale label on an Egg drop (boost applies)", () => {
      const { boostsUsed } = getResourceDropAmount({
        game: baleFarm({}),
        animalType: "Chicken",
        resource: "Egg",
        baseAmount: 1,
        multiplier: 1,
        animal: ANIMAL,
      });

      expect(boostsUsed).toContainEqual({ name: "Bale", value: "+0.1" });
    });

    // Bale gives no Feather yield, so its label must not appear on a Feather drop.
    it("does not record the Bale label where it grants no yield", () => {
      const { amount, boostsUsed } = getResourceDropAmount({
        game: baleFarm({}),
        animalType: "Chicken",
        resource: "Feather",
        baseAmount: 1,
        multiplier: 1,
        animal: ANIMAL,
      });

      expect(boostsUsed).not.toContainEqual(
        expect.objectContaining({ name: "Bale" }),
      );
      expect(amount).toEqual(1);
    });
  });

  describe("Fine Fibers", () => {
    it.each([
      [1, 0.1],
      [2, 0.15],
      [3, 0.2],
    ])("adds rank %s's +%s to Feather", (rank, value) => {
      const { amount, boostsUsed } = getResourceDropAmount({
        game: withSkills({ "Fine Fibers": rank }),
        animalType: "Chicken",
        resource: "Feather",
        baseAmount: 1,
        multiplier: 1,
        animal: ANIMAL,
      });

      expect(amount).toEqual(1 + value);
      expect(boostsUsed).toContainEqual({
        name: "Fine Fibers",
        value: `+${value}`,
      });
    });
  });

  // The fibre skills stack additively on one accumulator, so a float
  // 0.1 + 0.35 lands on 0.44999999999999996 and 0.2 + 0.9 - 0.2 - 0.2 on
  // 0.7000000000000002. Same class of bug as Double Bale — the helper must
  // accumulate in Decimal.
  describe("stacked fibre yields", () => {
    it("stacks Fine Fibers and Featherweight on Feather without drift", () => {
      const { amount } = getResourceDropAmount({
        game: withSkills({ "Fine Fibers": 1, Featherweight: 1 }),
        animalType: "Chicken",
        resource: "Feather",
        baseAmount: 0,
        multiplier: 1,
        animal: ANIMAL,
      });

      expect(amount).toEqual(0.45);
    });

    it("nets all four fibre skills at rank 3 on Merino Wool without drift", () => {
      const { amount } = getResourceDropAmount({
        game: withSkills({
          "Fine Fibers": 3,
          "Merino Whisperer": 3,
          Featherweight: 3,
          "Leathercraft Mastery": 3,
        }),
        animalType: "Sheep",
        resource: "Merino Wool",
        baseAmount: 0,
        multiplier: 1,
        animal: { ...ANIMAL, type: "Sheep" },
      });

      // +0.2 Fine Fibers +0.9 Merino Whisperer -0.2 Featherweight -0.2 Leathercraft
      expect(amount).toEqual(0.7);
    });
  });

  // getResourceDropAmount rounds to 2dp at the boundary. Abundant Harvest r3
  // (+0.5) puts Egg on exactly 1.5, and Salt Lick's x1.05 then lands on 1.575 —
  // a genuine half-way value, so it pins the rounding direction.
  it("rounds a Salt Lick half-way yield up, as before", () => {
    const { amount } = getResourceDropAmount({
      game: withSkills({ "Abundant Harvest": 3 }),
      animalType: "Chicken",
      resource: "Egg",
      baseAmount: 1,
      multiplier: 1,
      animal: {
        ...ANIMAL,
        feedBuff: { name: "Salt Lick", harvestsRemaining: 3 },
      },
    });

    expect(amount).toEqual(1.58);
  });

  it("attributes an animal critical drop multiplier to Buckaroo", () => {
    const { amount, boostsUsed } = getResourceDropAmount({
      game: withSkills({ Buckaroo: 1 }),
      animalType: "Cow",
      resource: "Milk",
      baseAmount: 1,
      multiplier: 2,
      animal: { ...ANIMAL, type: "Cow" },
    });

    expect(amount).toEqual(2);
    expect(boostsUsed).toContainEqual({ name: "Buckaroo", value: "x2" });
  });

  describe("Featherweight", () => {
    it.each([
      [1, 0.35],
      [2, 0.45],
      [3, 0.55],
    ])("buffs Feather at rank %s by +%s", (rank, buff) => {
      const { amount } = getResourceDropAmount({
        game: withSkills({ Featherweight: rank }),
        animalType: "Chicken",
        resource: "Feather",
        baseAmount: 1,
        multiplier: 1,
        animal: ANIMAL,
      });

      expect(amount).toEqual(1 + buff);
    });

    // One debuff value is subtracted from BOTH of the other two fibres.
    it.each([
      [1, 0.1],
      [2, 0.15],
      [3, 0.2],
    ])("debuffs Merino Wool at rank %s by -%s", (rank, debuff) => {
      const { amount } = getResourceDropAmount({
        game: withSkills({ Featherweight: rank }),
        animalType: "Sheep",
        resource: "Merino Wool",
        baseAmount: 1,
        multiplier: 1,
        animal: { ...ANIMAL, type: "Sheep" },
      });

      expect(amount).toEqual(1 - debuff);
    });
  });

  describe("Efficient Feeding", () => {
    it.each([
      [1, 0.95],
      [2, 0.94],
      [3, 0.925],
    ])("multiplies feed at rank %s by x%s", (rank, multiplier) => {
      const { foodQuantity } = getBoostedFoodQuantity({
        now: Date.now(),
        animalType: "Chicken",
        foodQuantity: 100,
        game: withSkills({ "Efficient Feeding": rank }),
        animal: ANIMAL,
      });

      expect(foodQuantity).toEqual(new Decimal(100 * multiplier));
    });
  });

  describe("Clucky Grazing", () => {
    it.each([
      [1, 0.75],
      [2, 0.65],
      [3, 0.5],
    ])("cuts Chicken feed at rank %s to x%s", (rank, buff) => {
      const { foodQuantity } = getBoostedFoodQuantity({
        now: Date.now(),
        animalType: "Chicken",
        foodQuantity: 100,
        game: withSkills({ "Clucky Grazing": rank }),
        animal: ANIMAL,
      });

      expect(foodQuantity).toEqual(new Decimal(100 * buff));
    });

    it.each([
      [1, 1.5],
      [2, 1.55],
      [3, 1.65],
    ])("raises Cow feed at rank %s to x%s", (rank, debuff) => {
      const { foodQuantity } = getBoostedFoodQuantity({
        now: Date.now(),
        animalType: "Cow",
        foodQuantity: 100,
        game: withSkills({ "Clucky Grazing": rank }),
        animal: { ...ANIMAL, type: "Cow" },
      });

      expect(foodQuantity).toEqual(new Decimal(100 * debuff));
    });
  });

  describe("Swill Savvy", () => {
    it.each([
      [1, 0.75],
      [2, 0.65],
      [3, 0.5],
    ])("cuts Pig feed at rank %s to x%s", (rank, buff) => {
      const { foodQuantity, boostsUsed } = getBoostedFoodQuantity({
        now: Date.now(),
        animalType: "Pig",
        foodQuantity: 100,
        game: withSkills({ "Swill Savvy": rank }),
        animal: { ...ANIMAL, type: "Pig" },
      });

      expect(foodQuantity).toEqual(new Decimal(100 * buff));
      expect(boostsUsed).toContainEqual({
        name: "Swill Savvy",
        value: `x${buff}`,
      });
    });

    it.each([
      [1, 1.5],
      [2, 1.55],
      [3, 1.65],
    ])("raises Cow feed at rank %s to x%s", (rank, debuff) => {
      const { foodQuantity } = getBoostedFoodQuantity({
        now: Date.now(),
        animalType: "Cow",
        foodQuantity: 100,
        game: withSkills({ "Swill Savvy": rank }),
        animal: { ...ANIMAL, type: "Cow" },
      });

      expect(foodQuantity).toEqual(new Decimal(100 * debuff));
    });

    it("stacks with another diet skill's penalty on a Pig", () => {
      // Cow-Smart Nutrition rank 1 (x1.5 on every other animal) x Swill Savvy
      // rank 1 (x0.75 on Pigs).
      const { foodQuantity } = getBoostedFoodQuantity({
        now: Date.now(),
        animalType: "Pig",
        foodQuantity: 100,
        game: withSkills({ "Swill Savvy": 1, "Cow-Smart Nutrition": 1 }),
        animal: { ...ANIMAL, type: "Pig" },
      });

      expect(foodQuantity).toEqual(new Decimal(112.5));
    });
  });

  describe("Truffle Yield", () => {
    const truffles = (skills: GameState["bumpkin"]["skills"], baseAmount = 2) =>
      getResourceDropAmount({
        game: withSkills(skills),
        animalType: "Pig",
        resource: "Truffle",
        baseAmount,
        multiplier: 1,
        animal: { ...ANIMAL, type: "Pig" },
      });

    it.each([
      [1, 2.2],
      [2, 2.4],
      [3, 2.6],
    ])("adds a share of the Truffles at rank %s (2 -> %s)", (rank, amount) => {
      const { amount: total, boostsUsed } = truffles({ "Truffle Yield": rank });

      expect(total).toEqual(amount);
      expect(boostsUsed).toContainEqual({
        name: "Truffle Yield",
        value: `x${1 + rank / 10}`,
      });
    });

    it("leaves Truffles alone without the skill", () => {
      expect(truffles({}).amount).toEqual(2);
    });

    it("applies after the flat produce boosts", () => {
      // (1 + Barn Manager 0.1) x 1.3
      const { amount } = getResourceDropAmount({
        game: {
          ...withSkills({ "Truffle Yield": 3 }),
          inventory: { "Barn Manager": new Decimal(1) },
        },
        animalType: "Pig",
        resource: "Truffle",
        baseAmount: 1,
        multiplier: 1,
        animal: { ...ANIMAL, type: "Pig" },
      });

      expect(amount).toEqual(1.43);
    });

    it("does not boost other produce", () => {
      const { amount } = getResourceDropAmount({
        game: withSkills({ "Truffle Yield": 3 }),
        animalType: "Cow",
        resource: "Milk",
        baseAmount: 2,
        multiplier: 1,
        animal: { ...ANIMAL, type: "Cow" },
      });

      expect(amount).toEqual(2);
    });
  });

  describe("Pig skill definitions (#7721)", () => {
    it("gives Truffle Yield and Bristle Payout +10% / +20% / +30%", () => {
      expect(SKILL_RANKS["Truffle Yield"].ranks).toEqual([0.1, 0.2, 0.3]);
      expect(SKILL_RANKS["Bristle Payout"].ranks).toEqual([0.1, 0.2, 0.3]);
    });

    it("places them in the Animals tree with the standard tier costs", () => {
      const tiers = (
        ["Swill Savvy", "Truffle Yield", "Bristle Payout"] as const
      ).map((name) => {
        const { tree, requirements } = BUMPKIN_REVAMP_SKILL_TREE[name];
        return [name, tree, requirements.tier, requirements.points];
      });

      expect(tiers).toEqual([
        ["Swill Savvy", "Animals", 3, 3],
        ["Truffle Yield", "Animals", 2, 2],
        ["Bristle Payout", "Animals", 3, 3],
      ]);
    });
  });

  describe("Chonky Feed", () => {
    it.each([
      [1, 1.5],
      [2, 1.75],
      [3, 2],
    ])("raises feed cost at rank %s to x%s", (rank, feed) => {
      const { foodQuantity } = getBoostedFoodQuantity({
        now: Date.now(),
        animalType: "Chicken",
        foodQuantity: 100,
        game: withSkills({ "Chonky Feed": rank }),
        animal: ANIMAL,
      });

      expect(foodQuantity).toEqual(new Decimal(100 * feed));
    });
  });

  describe("Restless Animals", () => {
    it.each([
      [1, 0.9],
      [2, 0.85],
      [3, 0.8],
    ])("cuts sleep at rank %s to x%s", (rank, multiplier) => {
      const { awakeAt } = getBoostedAwakeAt({
        animalType: "Chicken",
        createdAt: 0,
        game: withSkills({ "Restless Animals": rank }),
      });

      expect(awakeAt).toEqual(ANIMAL_SLEEP_DURATION * multiplier);
    });
  });
});

// FE + BE jest run amoy, so SPEED_BOOSTS is ON by default here.
describe("SPEED_BOOSTS (windowed animal sleep)", () => {
  const HOUR = 60 * 60 * 1000;
  const now = Date.now();

  const withShrine = (
    name: "Collie Shrine" | "Bantam Shrine",
    createdAt: number,
  ): GameState => ({
    ...INITIAL_FARM,
    collectibles: {
      [name]: [
        { id: "1", createdAt, readyAt: createdAt, coordinates: { x: 0, y: 0 } },
      ],
    },
  });

  const sleeping = (
    overrides: Partial<Animal> & Pick<Animal, "type">,
  ): Animal => ({
    ...ANIMAL,
    asleepAt: now,
    awakeAt: now + ANIMAL_SLEEP_DURATION,
    ...overrides,
  });

  describe("getBoostedAwakeAt", () => {
    it("excludes the Collie Shrine from baseDurationMs and boostsUsed", () => {
      const { baseDurationMs, boostsUsed } = getBoostedAwakeAt({
        animalType: "Sheep",
        createdAt: now,
        game: withShrine("Collie Shrine", now),
      });

      expect(baseDurationMs).toEqual(ANIMAL_SLEEP_DURATION);
      expect(boostsUsed).not.toContainEqual(
        expect.objectContaining({ name: "Collie Shrine" }),
      );
    });

    it("excludes the Bantam Shrine from baseDurationMs and boostsUsed", () => {
      const { baseDurationMs, boostsUsed } = getBoostedAwakeAt({
        animalType: "Chicken",
        createdAt: now,
        game: withShrine("Bantam Shrine", now),
      });

      expect(baseDurationMs).toEqual(ANIMAL_SLEEP_DURATION);
      expect(boostsUsed).not.toContainEqual(
        expect.objectContaining({ name: "Bantam Shrine" }),
      );
    });

    it("keeps permanent boosts baked into baseDurationMs", () => {
      const { baseDurationMs, boostsUsed } = getBoostedAwakeAt({
        animalType: "Sheep",
        createdAt: now,
        game: {
          ...withShrine("Collie Shrine", now),
          collectibles: {
            ...withShrine("Collie Shrine", now).collectibles,
            "Farm Dog": [
              {
                id: "2",
                createdAt: 0,
                readyAt: 0,
                coordinates: { x: 2, y: 2 },
              },
            ],
          },
        },
      });

      expect(baseDurationMs).toEqual(ANIMAL_SLEEP_DURATION * 0.75);
      expect(boostsUsed).toContainEqual({ name: "Farm Dog", value: "x0.75" });
    });

    it("caches the projected wake time in awakeAt", () => {
      const { awakeAt } = getBoostedAwakeAt({
        animalType: "Chicken",
        createdAt: now,
        game: withShrine("Bantam Shrine", now),
      });

      expect(awakeAt).toEqual(now + ANIMAL_SLEEP_DURATION / 1.35);
    });
  });

  describe("getAnimalReadyAt", () => {
    it("falls back to the stored awakeAt for a legacy (unmarked) animal", () => {
      const animal = sleeping({ type: "Sheep" });

      expect(
        getAnimalReadyAt(animal, withShrine("Collie Shrine", now)),
      ).toEqual(animal.awakeAt);
    });

    it("runs a fully-covered sleep at the shrine's rate", () => {
      const animal = sleeping({
        type: "Sheep",
        baseDurationMs: ANIMAL_SLEEP_DURATION,
      });

      expect(
        getAnimalReadyAt(animal, withShrine("Collie Shrine", now)),
      ).toEqual(now + ANIMAL_SLEEP_DURATION / 1.35);
    });

    it("shortens a sleep already in progress when a shrine is placed", () => {
      // The whole point of the model: the shrine goes down 6h in and still
      // speeds up the remaining 18h.
      const animal = sleeping({
        type: "Chicken",
        baseDurationMs: ANIMAL_SLEEP_DURATION,
      });
      const placedAt = now + 6 * HOUR;

      const readyAt = getAnimalReadyAt(
        animal,
        withShrine("Bantam Shrine", placedAt),
      );

      expect(readyAt).toEqual(placedAt + (18 * HOUR) / 1.35);
    });

    it("credits only the overlap when the shrine expires mid-sleep", () => {
      // Shrine placed 7 days - 4h before the animal fell asleep, so it covers
      // only the first 4 hours; the rest runs at 1x.
      const shrineAt = now - (7 * 24 * HOUR - 4 * HOUR);
      const animal = sleeping({
        type: "Sheep",
        baseDurationMs: ANIMAL_SLEEP_DURATION,
      });

      const readyAt = getAnimalReadyAt(
        animal,
        withShrine("Collie Shrine", shrineAt),
      );

      // 4h of wall clock burns 4h * 1.35 of work; the remaining work runs at 1x.
      const worked = 4 * HOUR * 1.35;
      expect(readyAt).toEqual(
        now + 4 * HOUR + (ANIMAL_SLEEP_DURATION - worked),
      );
      expect(readyAt).toBeGreaterThan(now + ANIMAL_SLEEP_DURATION / 1.35);
    });

    it("does not apply a Collie Shrine to chickens (or Bantam to sheep)", () => {
      const chicken = sleeping({
        type: "Chicken",
        baseDurationMs: ANIMAL_SLEEP_DURATION,
      });
      const sheep = sleeping({
        type: "Sheep",
        baseDurationMs: ANIMAL_SLEEP_DURATION,
      });

      expect(
        getAnimalReadyAt(chicken, withShrine("Collie Shrine", now)),
      ).toEqual(now + ANIMAL_SLEEP_DURATION);
      expect(getAnimalReadyAt(sheep, withShrine("Bantam Shrine", now))).toEqual(
        now + ANIMAL_SLEEP_DURATION,
      );
    });
  });
});

describe("getFeedItem", () => {
  const requiredQty = new Decimal(1);

  it("keeps the favourite food when it is already selected", () => {
    const item = getFeedItem({
      animal: "Chicken",
      selectedItem: "Kernel Blend",
      favouriteFood: "Kernel Blend",
      inventory: { "Kernel Blend": new Decimal(5), Hay: new Decimal(5) },
      requiredQty,
      hasBeetleFeedingAccess: true,
    });

    expect(item).toBe("Kernel Blend");
  });

  it("keeps Omnifeed when it is selected even if the favourite food is available", () => {
    const item = getFeedItem({
      animal: "Chicken",
      selectedItem: "Omnifeed",
      favouriteFood: "Kernel Blend",
      inventory: { "Kernel Blend": new Decimal(5), Omnifeed: new Decimal(5) },
      requiredQty,
      hasBeetleFeedingAccess: true,
    });

    expect(item).toBe("Omnifeed");
  });

  it("switches a Pig off Omnifeed, which Pigs cannot eat", () => {
    const item = getFeedItem({
      animal: "Pig",
      selectedItem: "Omnifeed",
      favouriteFood: "Basic Slop",
      inventory: { "Basic Slop": new Decimal(5), Omnifeed: new Decimal(5) },
      requiredQty,
      hasBeetleFeedingAccess: true,
    });

    expect(item).toBe("Basic Slop");
  });

  it("keeps a selected Beetle as an explicit choice", () => {
    const item = getFeedItem({
      animal: "Chicken",
      selectedItem: "Amber Beetle",
      favouriteFood: "Kernel Blend",
      inventory: {
        "Kernel Blend": new Decimal(5),
        "Amber Beetle": new Decimal(1),
      },
      requiredQty,
      hasBeetleFeedingAccess: true,
    });

    expect(item).toBe("Amber Beetle");
  });

  it("keeps the selected favourite food even when a Beetle is held", () => {
    const item = getFeedItem({
      animal: "Chicken",
      selectedItem: "Kernel Blend",
      favouriteFood: "Kernel Blend",
      inventory: {
        "Kernel Blend": new Decimal(5),
        "Green Beetle": new Decimal(1),
      },
      requiredQty,
      hasBeetleFeedingAccess: true,
    });

    expect(item).toBe("Kernel Blend");
  });

  it("never switches to a Beetle on its own", () => {
    const item = getFeedItem({
      animal: "Chicken",
      selectedItem: "Hay",
      favouriteFood: "Kernel Blend",
      inventory: { Hay: new Decimal(5), "Green Beetle": new Decimal(1) },
      requiredQty,
      hasBeetleFeedingAccess: true,
    });

    expect(item).toBe("Hay");
  });

  it("treats a selected Beetle like any other item without Beetle feeding access", () => {
    const item = getFeedItem({
      animal: "Chicken",
      selectedItem: "Green Beetle",
      favouriteFood: "Kernel Blend",
      inventory: {
        "Kernel Blend": new Decimal(5),
        "Green Beetle": new Decimal(1),
      },
      requiredQty,
      hasBeetleFeedingAccess: false,
    });

    expect(item).toBe("Kernel Blend");
  });

  it("switches from a different food to the favourite food when enough is held", () => {
    const item = getFeedItem({
      animal: "Chicken",
      selectedItem: "Hay",
      favouriteFood: "Kernel Blend",
      inventory: { "Kernel Blend": new Decimal(1), Hay: new Decimal(5) },
      requiredQty,
      hasBeetleFeedingAccess: true,
    });

    expect(item).toBe("Kernel Blend");
  });

  it("switches from a non-food item to the favourite food when enough is held", () => {
    const item = getFeedItem({
      animal: "Chicken",
      selectedItem: "Axe",
      favouriteFood: "Kernel Blend",
      inventory: { "Kernel Blend": new Decimal(1), Axe: new Decimal(1) },
      requiredQty,
      hasBeetleFeedingAccess: true,
    });

    expect(item).toBe("Kernel Blend");
  });

  it("switches to the favourite food when nothing is selected", () => {
    const item = getFeedItem({
      animal: "Chicken",
      selectedItem: undefined,
      favouriteFood: "Kernel Blend",
      inventory: { "Kernel Blend": new Decimal(1) },
      requiredQty,
      hasBeetleFeedingAccess: true,
    });

    expect(item).toBe("Kernel Blend");
  });

  it("keeps the selected food when the favourite food is not held", () => {
    const item = getFeedItem({
      animal: "Chicken",
      selectedItem: "Hay",
      favouriteFood: "Kernel Blend",
      inventory: { Hay: new Decimal(5) },
      requiredQty,
      hasBeetleFeedingAccess: true,
    });

    expect(item).toBe("Hay");
  });

  it("keeps the selected food when there is not enough favourite food", () => {
    const item = getFeedItem({
      animal: "Chicken",
      selectedItem: "Hay",
      favouriteFood: "Kernel Blend",
      inventory: { "Kernel Blend": new Decimal(2), Hay: new Decimal(5) },
      requiredQty: new Decimal(3),
      hasBeetleFeedingAccess: true,
    });

    expect(item).toBe("Hay");
  });

  it("keeps a non-food selection when the favourite food is not held", () => {
    const item = getFeedItem({
      animal: "Chicken",
      selectedItem: "Axe",
      favouriteFood: "Kernel Blend",
      inventory: { Axe: new Decimal(1) },
      requiredQty,
      hasBeetleFeedingAccess: true,
    });

    expect(item).toBe("Axe");
  });
});

describe("animal building seam", () => {
  it("camelCases each animal building into its GameState key", () => {
    // The one-word "Pigpen" spelling is load-bearing: "Pig Pen" would produce
    // "pigPen", which is not the AnimalBuildingKey the GameState field uses.
    expect(makeAnimalBuildingKey("Hen House")).toEqual("henHouse");
    expect(makeAnimalBuildingKey("Barn")).toEqual("barn");
    expect(makeAnimalBuildingKey("Pigpen")).toEqual("pigpen");
  });

  it("exposes every animal building key, in a stable order", () => {
    // Order matters: checkAnimalHealth draws random numbers per building, and
    // its tests stub the generator with fixed sequences.
    expect(ANIMAL_BUILDING_KEYS).toEqual(["henHouse", "barn", "pigpen"]);
  });

  it("recognises animal buildings and nothing else", () => {
    expect(isAnimalBuildingType("Pigpen")).toBe(true);
    expect(isAnimalBuildingType("Barn")).toBe(true);
    expect(isAnimalBuildingType("Bakery")).toBe(false);
  });

  it("houses every animal in a building that exists in GameState", () => {
    getKeys(ANIMALS).forEach((animal) => {
      const key = makeAnimalBuildingKey(ANIMALS[animal].buildingRequired);

      expect(ANIMAL_BUILDING_KEYS).toContain(key);
      expect(INITIAL_FARM[key]).toBeDefined();
    });
  });
});

describe("animal data tables", () => {
  it.each(getKeys(ANIMALS))("has a complete set of tables for %s", (animal) => {
    expect(ANIMAL_LEVELS[animal]).toBeDefined();
    expect(ANIMAL_FOOD_EXPERIENCE[animal]).toBeDefined();
    expect(ANIMAL_RESOURCE_DROP[animal]).toBeDefined();
    expect(REQUIRED_FOOD_QTY[animal]).toBeGreaterThan(0);

    // Every level 0-15 present in each per-level table.
    Array.from({ length: 16 }, (_, level) => level as AnimalLevel).forEach(
      (level) => {
        expect(ANIMAL_LEVELS[animal][level]).toBeDefined();
        expect(ANIMAL_FOOD_EXPERIENCE[animal][level]).toBeDefined();
        expect(ANIMAL_RESOURCE_DROP[animal][level]).toBeDefined();
      },
    );
  });

  it.each(getKeys(ANIMALS))(
    "resolves exactly one favourite food at every level for %s",
    (animal) => {
      // getAnimalFavoriteFood throws "No favourite food" at RUNTIME when a
      // level has two joint-max non-Omnifeed foods - not a compile error.
      Array.from({ length: 16 }, (_, level) => level as AnimalLevel).forEach(
        (level) => {
          expect(() =>
            getAnimalFavoriteFood(animal, ANIMAL_LEVELS[animal][level]),
          ).not.toThrow();
        },
      );
    },
  );

  it.each(getKeys(ANIMALS))(
    "round-trips every XP threshold for %s",
    (animal) => {
      Array.from({ length: 16 }, (_, level) => level as AnimalLevel).forEach(
        (level) => {
          expect(getAnimalLevel(ANIMAL_LEVELS[animal][level], animal)).toEqual(
            level,
          );
        },
      );
    },
  );

  it("drops the #7721 Truffle curve: 1 / 2 / 3 / 4 at L1-3 / 4-7 / 8-14 / 15", () => {
    const truffles = Array.from({ length: 16 }, (_, level) =>
      (
        ANIMAL_RESOURCE_DROP.Pig[level as AnimalLevel].Truffle ?? new Decimal(0)
      ).toNumber(),
    );

    expect(truffles).toEqual([0, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 4]);
  });

  it("uses the Cow's XP thresholds for Pigs", () => {
    expect(ANIMAL_LEVELS.Pig).toEqual(ANIMAL_LEVELS.Cow);
    expect(ANIMAL_LEVELS.Pig[15]).toEqual(8160);
  });

  it("costs 100 coins to buy a Pig", () => {
    expect(ANIMALS.Pig.coins).toEqual(100);
  });

  it("drops only Truffles, from level 1, never fewer at a higher level", () => {
    const drops = ANIMAL_RESOURCE_DROP.Pig;

    expect(drops[0]).toEqual({});

    Array.from({ length: 15 }, (_, i) => (i + 1) as AnimalLevel).forEach(
      (level) => {
        expect(getKeys(drops[level])).toEqual(["Truffle"]);
        expect(drops[level].Truffle?.toNumber()).toBeGreaterThan(0);
        if (level > 1) {
          expect(
            drops[level].Truffle?.gte(
              drops[(level - 1) as AnimalLevel].Truffle!,
            ),
          ).toBe(true);
        }
      },
    );

    expect(drops[15].Truffle?.gt(drops[1].Truffle!)).toBe(true);
  });

  it("never drops Pig Bristles - they come only from trading a Pig in", () => {
    getKeys(ANIMAL_RESOURCE_DROP).forEach((animal) => {
      getKeys(ANIMAL_RESOURCE_DROP[animal]).forEach((level) => {
        expect(ANIMAL_RESOURCE_DROP[animal][level]["Pig Bristles"]).toBe(
          undefined,
        );
      });
    });
  });
});

describe("isFoodForAnimal", () => {
  const SLOPS = [
    "Basic Slop",
    "Hearty Slop",
    "Rich Slop",
    "Gourmet Slop",
  ] as const;

  it("feeds Pigs the four Slops and nothing else", () => {
    SLOPS.forEach((slop) => expect(isFoodForAnimal("Pig", slop)).toBe(true));
    (
      ["Hay", "Kernel Blend", "NutriBarley", "Mixed Grain", "Omnifeed"] as const
    ).forEach((food) => expect(isFoodForAnimal("Pig", food)).toBe(false));
  });

  it.each(["Chicken", "Sheep", "Cow"] as const)(
    "never feeds a %s a Slop",
    (animal) => {
      SLOPS.forEach((slop) =>
        expect(isFoodForAnimal(animal, slop)).toBe(false),
      );
      expect(isFoodForAnimal(animal, "Omnifeed")).toBe(true);
    },
  );

  it("ignores inherited keys", () => {
    expect(isFoodForAnimal("Pig", "constructor" as "Hay")).toBe(false);
  });
});

describe("Mud XP bonus", () => {
  it("recognises a muddy animal only while it has charges left", () => {
    expect(isMuddy({ ...ANIMAL, mud: { harvestsRemaining: 1 } })).toBe(true);
    expect(isMuddy({ ...ANIMAL, mud: { harvestsRemaining: 0 } })).toBe(false);
    // Coatings stored the old per-feed way no longer count (testnet only).
    expect(
      isMuddy({
        ...ANIMAL,
        mud: { feedsRemaining: 3 } as unknown as Animal["mud"],
      }),
    ).toBe(false);
    expect(isMuddy(ANIMAL)).toBe(false);
  });
});

describe("Pig Bristles trade-in (#7721)", () => {
  const pigAt = (level: number, overrides: Partial<Animal> = {}): Animal => ({
    ...ANIMAL,
    id: "p",
    type: "Pig",
    experience: ANIMAL_LEVELS.Pig[level as AnimalLevel],
    ...overrides,
  });

  const withCattlegrim = (game: GameState = INITIAL_FARM): GameState => ({
    ...game,
    bumpkin: {
      ...game.bumpkin,
      equipped: { ...game.bumpkin.equipped, hat: "Cattlegrim" },
    },
  });

  describe("getBountyLevel", () => {
    it("is the Pig's level while idle, sick or asleep", () => {
      expect(getBountyLevel(pigAt(6))).toEqual(6);
      expect(getBountyLevel(pigAt(6, { state: "sick" }))).toEqual(6);
      expect(
        getBountyLevel(pigAt(6, { awakeAt: Date.now() + 60_000 })),
      ).toEqual(6);
    });

    it("counts a ready Pig one level lower, as its badge shows", () => {
      expect(getBountyLevel(pigAt(6, { state: "ready" }))).toEqual(5);
    });

    it("keeps a ready max-level Pig at the max level", () => {
      expect(getBountyLevel(pigAt(15, { state: "ready" }))).toEqual(15);
    });
  });

  describe("getPigBristles", () => {
    it("pays the #7721 curve per level", () => {
      const curve = Array.from(
        { length: 16 },
        (_, level) =>
          getPigBristles({ game: INITIAL_FARM, pig: pigAt(level) }).amount,
      );

      expect(curve).toEqual([0, 0, 0, 1, 1, 2, 3, 3, 4, 5, 6, 6, 7, 8, 9, 12]);
      expect(PIG_BRISTLES_PER_LEVEL[15]).toEqual(12);
    });

    it("pays a ready Pig for the level below", () => {
      expect(
        getPigBristles({
          game: INITIAL_FARM,
          pig: pigAt(6, { state: "ready" }),
        }).amount,
      ).toEqual(2);
      expect(
        getPigBristles({
          game: INITIAL_FARM,
          pig: pigAt(15, { state: "ready" }),
        }).amount,
      ).toEqual(12);
    });

    it("adds the generic produce boosts", () => {
      const game: GameState = {
        ...withCattlegrim(),
        inventory: { "Barn Manager": new Decimal(1) },
      };

      const { amount, boostsUsed } = getPigBristles({ game, pig: pigAt(15) });

      // 12 + Cattlegrim 0.25 + Barn Manager 0.1
      expect(amount).toEqual(12.35);
      expect(boostsUsed.map((boost) => boost.name)).toEqual(
        expect.arrayContaining(["Cattlegrim", "Barn Manager"]),
      );
    });

    it("adds a Retreat bud's animal produce boost", () => {
      const game: GameState = {
        ...INITIAL_FARM,
        buds: {
          1: {
            type: "Retreat",
            colour: "Red",
            stem: "Seashell",
            aura: "No Aura",
            ears: "No Ears",
            coordinates: { x: 0, y: 0 },
          },
        },
      };

      const { amount, boostsUsed } = getPigBristles({ game, pig: pigAt(15) });

      // 12 + Retreat 0.2
      expect(amount).toEqual(12.2);
      expect(boostsUsed.map((boost) => boost.name)).toContain("Bud #1");
    });

    it.each([
      [1, 13.2],
      [2, 14.4],
      [3, 15.6],
    ])("Bristle Payout rank %s pays %s at level 15", (rank, expected) => {
      const { amount, boostsUsed } = getPigBristles({
        game: withSkills({ "Bristle Payout": rank }),
        pig: pigAt(15),
      });

      expect(amount).toEqual(expected);
      expect(boostsUsed.map((boost) => boost.name)).toContain("Bristle Payout");
    });

    it("applies Bristle Payout after the flat boosts", () => {
      const { amount } = getPigBristles({
        game: withCattlegrim(withSkills({ "Bristle Payout": 1 })),
        pig: pigAt(15),
      });

      // (12 + 0.25) x 1.1 = 13.475, kept to 2 dp like produce
      expect(amount).toEqual(13.48);
    });

    const withRetreatBud = (game: GameState): GameState => ({
      ...game,
      buds: {
        1: {
          type: "Retreat",
          colour: "Red",
          stem: "Seashell",
          aura: "No Aura",
          ears: "No Ears",
          coordinates: { x: 0, y: 0 },
        },
      },
    });

    it("adds a Retreat bud's boost after Bristle Payout, unscaled", () => {
      const { amount } = getPigBristles({
        game: withRetreatBud(withSkills({ "Bristle Payout": 1 })),
        pig: pigAt(15),
      });

      // 12 x 1.1 + Retreat 0.2 = 13.4, not (12 + 0.2) x 1.1 = 13.42
      expect(amount).toEqual(13.4);
    });

    it("adds a Retreat bud's boost after Truffle Yield, unscaled", () => {
      const { amount } = getResourceDropAmount({
        game: withRetreatBud(withSkills({ "Truffle Yield": 1 })),
        animalType: "Pig",
        resource: "Truffle",
        baseAmount: 4,
        multiplier: 0,
        animal: pigAt(15),
      });

      // 4 x 1.1 + Retreat 0.2 = 4.6, not (4 + 0.2) x 1.1 = 4.62
      expect(amount).toEqual(4.6);
    });

    it("does not scale Truffles with Bristle Payout", () => {
      const { amount } = getResourceDropAmount({
        game: withSkills({ "Bristle Payout": 3 }),
        animalType: "Pig",
        resource: "Truffle",
        baseAmount: 4,
        multiplier: 0,
        animal: pigAt(15),
      });

      expect(amount).toEqual(4);
    });

    it("takes exactly 25% off a sick Pig after boosts", () => {
      expect(
        getPigBristles({
          game: INITIAL_FARM,
          pig: pigAt(5, { state: "sick" }),
        }),
      ).toEqual(expect.objectContaining({ amount: 1.5, beforeSickness: 2 }));

      // 6 x 1.1 = 6.6 -> x 0.75 = 4.95
      expect(
        getPigBristles({
          game: withSkills({ "Bristle Payout": 1 }),
          pig: pigAt(10, { state: "sick" }),
        }),
      ).toEqual(expect.objectContaining({ amount: 4.95, beforeSickness: 6.6 }));
    });

    it("pays nothing under level 3, boosts included", () => {
      const { amount, beforeSickness, boostsUsed } = getPigBristles({
        game: withCattlegrim(withSkills({ "Bristle Payout": 3 })),
        pig: pigAt(2),
      });

      expect(amount).toEqual(0);
      expect(beforeSickness).toEqual(0);
      expect(boostsUsed).toEqual([]);
    });
  });

  describe("canTradeInPig", () => {
    const now = Date.now();

    it("allows an awake Pig that pays Bristles, sick or ready included", () => {
      expect(canTradeInPig({ pig: pigAt(3), game: INITIAL_FARM, now })).toBe(
        true,
      );
      expect(
        canTradeInPig({
          pig: pigAt(3, { state: "sick" }),
          game: INITIAL_FARM,
          now,
        }),
      ).toBe(true);
      expect(
        canTradeInPig({
          pig: pigAt(4, { state: "ready" }),
          game: INITIAL_FARM,
          now,
        }),
      ).toBe(true);
    });

    it("rejects a sleeping Pig", () => {
      expect(
        canTradeInPig({
          pig: pigAt(10, { asleepAt: now, awakeAt: now + 60_000 }),
          game: INITIAL_FARM,
          now,
        }),
      ).toBe(false);
    });

    it("rejects a Pig that would pay nothing", () => {
      expect(canTradeInPig({ pig: pigAt(2), game: INITIAL_FARM, now })).toBe(
        false,
      );
      // Ready at level 3 counts as level 2.
      expect(
        canTradeInPig({
          pig: pigAt(3, { state: "ready" }),
          game: INITIAL_FARM,
          now,
        }),
      ).toBe(false);
    });
  });
});

describe("getBoostedAwakeAt: Truffle Seasoning (Chapter 16)", () => {
  const now = Date.now();
  const SEASONING = {
    name: "Truffle Seasoning",
    harvestsRemaining: 1,
  } as const;

  it("halves the sleep of an animal carrying a Truffle Seasoning", () => {
    const { baseDurationMs, boostsUsed } = getBoostedAwakeAt({
      animalType: "Cow",
      createdAt: now,
      game: INITIAL_FARM,
      feedBuff: SEASONING,
    });

    expect(baseDurationMs).toEqual(ANIMAL_SLEEP_DURATION / 2);
    expect(boostsUsed).toContainEqual({
      name: "Truffle Seasoning",
      value: "x0.5",
    });
  });

  it("stacks with the permanent sleep boosts", () => {
    const { baseDurationMs } = getBoostedAwakeAt({
      animalType: "Cow",
      createdAt: now,
      game: { ...INITIAL_FARM, inventory: { Wrangler: new Decimal(1) } },
      feedBuff: SEASONING,
    });

    expect(baseDurationMs).toEqual(ANIMAL_SLEEP_DURATION * 0.9 * 0.5);
  });

  it("ignores the other treats", () => {
    const { baseDurationMs, boostsUsed } = getBoostedAwakeAt({
      animalType: "Cow",
      createdAt: now,
      game: INITIAL_FARM,
      feedBuff: { name: "Honey Treat", harvestsRemaining: 3 },
    });

    expect(baseDurationMs).toEqual(ANIMAL_SLEEP_DURATION);
    expect(boostsUsed).toEqual([]);
  });
});
