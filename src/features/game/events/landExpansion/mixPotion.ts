import Decimal from "decimal.js-light";
import { getKeys } from "features/game/types/craftables";
import {
  Attempt,
  GameState,
  InventoryItemName,
  PotionName,
  PotionStatus,
} from "features/game/types/game";
import cloneDeep from "lodash.clonedeep";

const MAX_ATTEMPTS = 3;

export type Potions = [PotionName, PotionName, PotionName, PotionName];

export type MixPotionAction = {
  type: "potion.mixed";
  attemptNumber: 1 | 2 | 3;
  potions: Potions;
};

type Options = {
  state: Readonly<GameState>;
  action: MixPotionAction;
  createdAt: number;
};

export const POTIONS: Record<
  PotionName,
  { ingredients: Partial<Record<InventoryItemName, number>> }
> = {
  "Bloom Boost": {
    ingredients: {
      Sunflower: 10,
      Potato: 50,
    },
  },
  "Dream Drip": {
    ingredients: {
      Wood: 10,
    },
  },
  "Earth Essence": {
    ingredients: {
      Stone: 10,
    },
  },
  "Ember Elixir": {
    ingredients: {
      Carrot: 10,
    },
  },
  "Flower Power": {
    ingredients: {
      Sunflower: 20,
      Cauliflower: 10,
    },
  },
  "Golden Syrup": {
    ingredients: {
      Gold: 10,
    },
  },
  "Happy Hooch": {
    ingredients: {
      Wheat: 20,
    },
  },
  "Miracle Mix": {
    ingredients: {
      Cabbage: 10,
      Kale: 5,
    },
  },
  "Organic Oasis": {
    ingredients: {
      Radish: 10,
      Apple: 5,
    },
  },
  "Whisper Brew": {
    ingredients: {
      Eggplant: 10,
    },
  },
};

export function calculateScore(attempt: Attempt): number {
  const scoreMap: Record<PotionStatus, number> = {
    pending: 0,
    correct: 25,
    almost: 15,
    incorrect: 0,
    bomb: 0,
  };

  if (attempt.some((potion) => potion.status === "bomb")) {
    return 0;
  }
  const score = attempt.reduce((score, potion) => {
    return score + scoreMap[potion.status];
  }, 0);

  return score;
}

export function mixPotion({ state, action, createdAt }: Options): GameState {
  const stateCopy = cloneDeep<GameState>(state);

  const potions = action.potions;
  const attemptIndex = action.attemptNumber - 1;

  if (!stateCopy.potionHouse) {
    stateCopy.potionHouse = {
      game: { status: "in_progress", attempts: [] },
      history: {},
    };
  }

  if (
    stateCopy.potionHouse.game.status === "finished" &&
    action.attemptNumber !== 1
  ) {
    throw new Error("Cannot mix potion on a finished game");
  }

  if (stateCopy.potionHouse.game.status === "finished") {
    stateCopy.potionHouse.game = { status: "in_progress", attempts: [] };
  }

  if (action.attemptNumber > MAX_ATTEMPTS) {
    throw new Error(`Attempt ${MAX_ATTEMPTS} is the last attempt`);
  }

  if (stateCopy.potionHouse.game.attempts[attemptIndex]) {
    throw new Error(`Attempt ${action.attemptNumber} has already been made`);
  }

  if (stateCopy.potionHouse.game.attempts.length !== attemptIndex) {
    throw new Error(`Attempt ${attemptIndex} has not been made yet`);
  }

  potions.forEach((potionName) => {
    const potionIngredients = POTIONS[potionName].ingredients;

    getKeys(potionIngredients).forEach((ingredientName) => {
      const count = stateCopy.inventory[ingredientName] ?? new Decimal(0);
      const totalAmount = potionIngredients[ingredientName] ?? new Decimal(0);

      if (count.lessThan(totalAmount)) {
        throw new Error(`Insufficient ingredient: ${ingredientName}`);
      }

      stateCopy.inventory[ingredientName] = count.sub(totalAmount);
    });
  });

  const attempt: Attempt = [
    {
      potion: potions[0],
      status: "pending",
    },
    {
      potion: potions[1],
      status: "pending",
    },
    {
      potion: potions[2],
      status: "pending",
    },
    {
      potion: potions[3],
      status: "pending",
    },
  ];
  stateCopy.potionHouse.game.attempts.push(attempt);

  return stateCopy;
}
