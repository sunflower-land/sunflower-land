import cloneDeep from "lodash.clonedeep";
import Decimal from "decimal.js-light";
import { DawnBreaker, GameState } from "features/game/types/game";

export type TendDawnFlowerAction = {
  type: "dawnFlower.tended";
};

type Options = {
  state: Readonly<GameState>;
  action: TendDawnFlowerAction;
  createdAt?: number;
};

export const DAWN_FLOWER_COOLDOWN = 1;

export function tendDawnFlower({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  const game = cloneDeep(state);
  const { bumpkin } = game;

  if (bumpkin === undefined) {
    throw new Error("You do not have a Bumpkin");
  }

  if (bumpkin.equipped.onesie !== "Eggplant Onesie") {
    throw new Error("Bumpkin not wearing Eggplant Onesie");
  }

  if (!game.dawnBreaker?.dawnFlower) {
    (game.dawnBreaker as DawnBreaker).dawnFlower = {
      plantedAt: createdAt,
      tendedAt: createdAt,
      tendedCount: 1,
    };

    return game;
  }

  if (game.dawnBreaker.dawnFlower.tendedAt > createdAt - DAWN_FLOWER_COOLDOWN) {
    throw new Error("Flower in cooldown");
  }

  if (game.dawnBreaker.dawnFlower.tendedCount === 10) {
    throw new Error("Dawn Flower already harvested");
  }
  game.dawnBreaker.dawnFlower = {
    plantedAt: createdAt,
    tendedAt: createdAt,
    tendedCount: game.dawnBreaker.dawnFlower.tendedCount + 1,
  };

  if (game.dawnBreaker.dawnFlower.tendedCount === 10) {
    game.inventory["Dawn Flower"] = new Decimal(1);
  }

  return game;
}
