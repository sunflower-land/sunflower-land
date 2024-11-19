import Decimal from "decimal.js-light";
import {
  getAnimalLevel,
  makeAnimalBuildingKey,
} from "features/game/lib/animals";
import { AnimalLevel, ANIMALS, AnimalType } from "features/game/types/animals";
import { GameState, LoveAnimalItem } from "features/game/types/game";
import { produce } from "immer";

export type LoveAnimalAction = {
  type: "animal.loved";
  animal: AnimalType;
  id: string;
  item: LoveAnimalItem;
};

type Options = {
  state: Readonly<GameState>;
  action: LoveAnimalAction;
  createdAt?: number;
};

export function loveAnimal({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  return produce(state, (copy) => {
    const { buildingRequired } = ANIMALS[action.animal];
    const buildingKey = makeAnimalBuildingKey(buildingRequired);
    const animal = copy[buildingKey].animals[action.id];

    if (createdAt > animal.awakeAt) {
      throw new Error("The animal is not sleeping");
    }

    // You can love an animal twice in a night
    const loveAnimalPeriod = (animal.awakeAt - animal.asleepAt) / 3;

    if (createdAt < animal.asleepAt + loveAnimalPeriod) {
      throw new Error("The animal has not been sleeping for more than 8 hours");
    }

    if (createdAt < animal.lovedAt + loveAnimalPeriod) {
      throw new Error("The animal was loved in the last 8 hours");
    }

    if (animal.item !== action.item) {
      throw new Error(`${action.item} is the wrong item`);
    }

    if ((copy.inventory[action.item] ?? new Decimal(0)).lt(1)) {
      throw new Error(`Missing item, ${action.item}`);
    }

    const level = getAnimalLevel(animal.experience, animal.type);

    animal.experience += ITEM_XP[action.item];
    animal.lovedAt = createdAt;

    animal.item = getAnimalItem(
      getAnimalLevel(animal.experience, action.animal),
      Math.random,
    );

    if (level !== getAnimalLevel(animal.experience, animal.type)) {
      animal.state = "ready";
    }

    return copy;
  });
}

const ANIMAL_ITEM_CHANCES: Record<
  AnimalLevel,
  Record<LoveAnimalItem, number>
> = {
  0: {
    "Petting Hand": 0,
    Brush: 0,
    "Music Box": 0,
  },
  1: {
    "Petting Hand": 10,
    Brush: 0,
    "Music Box": 0,
  },
  2: {
    "Petting Hand": 8,
    Brush: 2,
    "Music Box": 0,
  },
  3: {
    "Petting Hand": 7,
    Brush: 3,
    "Music Box": 0,
  },
  4: {
    "Petting Hand": 6,
    Brush: 3,
    "Music Box": 1,
  },
  5: {
    "Petting Hand": 5,
    Brush: 4,
    "Music Box": 1,
  },
  6: {
    "Petting Hand": 5,
    Brush: 3,
    "Music Box": 2,
  },
  7: {
    "Petting Hand": 4,
    Brush: 4,
    "Music Box": 2,
  },
  8: {
    "Petting Hand": 4,
    Brush: 3,
    "Music Box": 3,
  },
  9: {
    "Petting Hand": 3,
    Brush: 4,
    "Music Box": 3,
  },
  10: {
    "Petting Hand": 3,
    Brush: 3,
    "Music Box": 4,
  },
  11: {
    "Petting Hand": 2,
    Brush: 4,
    "Music Box": 4,
  },
  12: {
    "Petting Hand": 2,
    Brush: 3,
    "Music Box": 5,
  },
  13: {
    "Petting Hand": 1,
    Brush: 4,
    "Music Box": 5,
  },
  14: {
    "Petting Hand": 1,
    Brush: 3,
    "Music Box": 6,
  },
  15: {
    "Petting Hand": 1,
    Brush: 2,
    "Music Box": 7,
  },
};

export const ITEM_XP: Record<LoveAnimalItem, number> = {
  "Petting Hand": 25,
  Brush: 40,
  "Music Box": 50,
};

function getAnimalItem(level: AnimalLevel, randomGenerator: () => number) {
  // Pick weighted item from array - https://gist.github.com/oepn/33bc587bc09ce9895c43
  const weighted = Object.entries(ANIMAL_ITEM_CHANCES[level])
    .map(([item, weighting]) => new Array(weighting).fill(item))
    .reduce((acc, current) => [...acc, ...current], [] as LoveAnimalItem[]);

  const random = weighted[Math.floor(randomGenerator() * weighted.length)];
  return random;
}
