import { Equipped } from "features/game/types/bumpkin";
import { getKeys } from "features/game/types/craftables";
import { GameState, Wardrobe } from "features/game/types/game";
import cloneDeep from "lodash.clonedeep";

export type EquipBumpkinAction = {
  type: "bumpkin.equipped";
  equipment: Equipped;
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

  if (action.equipment.dress && action.equipment.shirt) {
    throw new Error("Cannot equip shirt while wearing dress");
  }

  if (action.equipment.dress && action.equipment.pants) {
    throw new Error("Cannot equip pants while wearing dress");
  }

  if (!action.equipment.body) {
    throw new Error("Body is required");
  }

  if (!action.equipment.shoes) {
    throw new Error("Shoes are required");
  }

  if (!action.equipment.hair) {
    throw new Error("Hair is required");
  }

  if (
    !action.equipment.dress &&
    !(action.equipment.shirt && action.equipment.pants)
  ) {
    throw new Error("Bumpkin is naked!");
  }

  const available = game.wardrobe;

  Object.values(action.equipment).forEach((name) => {
    if (!available[name]) {
      throw new Error(`${name} is not available for use`);
    }
  });

  bumpkin.equipped = action.equipment;

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
