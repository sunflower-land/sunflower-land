import {
  Attempt,
  GameState,
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

export function mixPotion({ state, action }: Options): GameState {
  const stateCopy = cloneDeep<GameState>(state);

  const potions = action.potions;
  const attemptIndex = action.attemptNumber - 1;

  if (!stateCopy.potionHouse) {
    throw new Error("You cannot mix potions without a potion house");
  }

  if (
    stateCopy.potionHouse.game.status === "finished" &&
    action.attemptNumber !== 1
  ) {
    throw new Error("Cannot mix potion on a finished game");
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
