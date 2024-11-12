import { getAnimalFavoriteFood } from "../lib/animals";
import { ANIMAL_LEVELS, AnimalLevel, AnimalType } from "../types/animals";

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
