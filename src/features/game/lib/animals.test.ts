import Decimal from "decimal.js-light";
import {
  getAnimalFavoriteFood,
  getBoostedAwakeAt,
  getBoostedFoodQuantity,
  getResourceDropAmount,
} from "../lib/animals";
import {
  ANIMAL_LEVELS,
  type AnimalLevel,
  type AnimalType,
} from "../types/animals";
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
        animalType: "Cow",
        foodQuantity: 100,
        game: withSkills({ "Clucky Grazing": rank }),
        animal: { ...ANIMAL, type: "Cow" },
      });

      expect(foodQuantity).toEqual(new Decimal(100 * debuff));
    });
  });

  describe("Chonky Feed", () => {
    it.each([
      [1, 1.5],
      [2, 1.75],
      [3, 2],
    ])("raises feed cost at rank %s to x%s", (rank, feed) => {
      const { foodQuantity } = getBoostedFoodQuantity({
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
