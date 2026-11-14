import Decimal from "decimal.js-light";
import { getAnimalLevel, getAnimalMaxLevel } from "features/game/lib/animals";
import { ANIMAL_LEVELS, type AnimalLevel } from "features/game/types/animals";
import type { Animal, GameState } from "features/game/types/game";
import { handleFoodXP } from "features/game/events/landExpansion/feedAnimal";
import type { BeetleName } from "features/game/types/beetles";

/**
 * How many levels feeding `feeds` `beetle`s raises `animal`: a batch can
 * overshoot several level thresholds at once, so the Beetle feeding mode
 * confirms with the player before feeding when this is more than one.
 * Client-only: it never runs inside the `animal.fed` reducer, so it lives
 * outside the event file the server mirrors.
 *
 * `getAnimalLevel` caps at max level, where levels stop rising and every
 * `cycleXP` of XP is one produce cycle instead (see `hasAnimalCompletedCycle`
 * in `lib/animals`); cycles count towards the overshoot so a batch that
 * blasts through several of them still asks for confirmation.
 */
export function getBeetleLevelGain({
  state,
  animal,
  beetle,
  feeds,
}: {
  state: GameState;
  animal: Animal;
  beetle: BeetleName;
  feeds: number;
}): number {
  const { foodXp } = handleFoodXP({
    state,
    animal: animal.type,
    level: getAnimalLevel(animal.experience, animal.type),
    food: beetle,
    mud: animal.mud,
  });

  const animalType = animal.type;
  const beforeFeedXp = animal.experience;
  const afterFeedXp = new Decimal(beforeFeedXp)
    .add(new Decimal(foodXp).mul(feeds))
    .toNumber();

  const levelGain =
    getAnimalLevel(afterFeedXp, animalType) -
    getAnimalLevel(beforeFeedXp, animalType);

  const maxLevel = getAnimalMaxLevel(animalType);
  const maxLevelXp = ANIMAL_LEVELS[animalType][maxLevel];
  const levelBeforeMaxXp =
    ANIMAL_LEVELS[animalType][(maxLevel - 1) as AnimalLevel];
  const cycleXp = maxLevelXp - levelBeforeMaxXp;

  const cyclesBefore =
    beforeFeedXp >= maxLevelXp
      ? Math.floor((beforeFeedXp - maxLevelXp) / cycleXp)
      : 0;
  const cyclesAfter =
    afterFeedXp >= maxLevelXp
      ? Math.floor((afterFeedXp - maxLevelXp) / cycleXp)
      : 0;

  return levelGain + Math.max(0, cyclesAfter - cyclesBefore);
}
