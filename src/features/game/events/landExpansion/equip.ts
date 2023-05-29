import { Equipped } from "features/game/types/bumpkin";
import { getKeys } from "features/game/types/craftables";
import { GameState, Wardrobe } from "features/game/types/game";
import cloneDeep from "lodash.clonedeep";

export type EquipBumpkinAction = {
  type: "bumpkin.equipped";
  equipment: Partial<Equipped>;
};

type Options = {
  state: Readonly<GameState>;
  action: EquipBumpkinAction;
  createdAt?: number;
};

export function equip({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  const game = cloneDeep(state);
  const { bumpkin } = game;

  if (bumpkin === undefined) {
    throw new Error("You do not have a Bumpkin");
  }

  // TODO - check if item available in wardrobe
  const available = availableWardrobe(game);

  Object.values(action.equipment).forEach((name) => {
    if (!available[name]) {
      throw new Error(`${name} is not available for use`);
    }
  });

  bumpkin.equipped = {
    ...bumpkin.equipped,
    ...action.equipment,
  };

  return game;
}

/**
 * Return the available (unequipped) wardrobe items
 */
export function availableWardrobe(game: GameState): Wardrobe {
  const inUse = Object.values(game.bumpkin?.equipped as Equipped);

  return getKeys(game.wardrobe).reduce((acc, name) => {
    let amount = game.wardrobe[name] ?? 0;

    if (inUse.includes(name)) {
      amount -= 1;
    }

    if (amount === 0) {
      return acc;
    }

    return {
      ...acc,
      [name]: amount,
    };
  }, {});
}
