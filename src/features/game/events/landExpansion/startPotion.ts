import Decimal from "decimal.js-light";
import { trackActivity } from "features/game/types/bumpkinActivity";
import { PotionName, GameState } from "features/game/types/game";
import cloneDeep from "lodash.clonedeep";

export type Potions = [PotionName, PotionName, PotionName, PotionName];

export type StartPotionAction = {
  type: "potion.started";
};

type Options = {
  state: Readonly<GameState>;
  action: StartPotionAction;
};

export const GAME_FEE = 320;

export function startPotion({ state }: Options): GameState {
  const stateCopy = cloneDeep<GameState>(state);

  const { bumpkin, coins } = stateCopy;

  if (!bumpkin) {
    throw new Error("Bumpkin not found");
  }

  if (stateCopy.potionHouse?.game.status === "in_progress") {
    throw new Error("There is already a game in progress");
  }

  if (stateCopy.coins < GAME_FEE) {
    throw new Error("Insufficient coins to start a game");
  }

  stateCopy.coins = coins - GAME_FEE;
  bumpkin.activity = trackActivity(
    "Coins Spent",
    bumpkin?.activity,
    new Decimal(GAME_FEE)
  );

  stateCopy.potionHouse = {
    game: { status: "in_progress", attempts: [] },
    history: stateCopy.potionHouse?.history ?? {},
  };

  return stateCopy;
}
