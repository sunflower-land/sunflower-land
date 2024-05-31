import { Equipped } from "features/game/types/bumpkin";
import { getKeys } from "features/game/types/craftables";
import { Bumpkin, GameState, Wardrobe } from "features/game/types/game";
import { BumpkinParts } from "lib/utils/tokenUriBuilder";
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
    throw new Error("You do not have a Bumpkin!");
  }

  assertEquipment({ game, equipment: action.equipment, bumpkin });

  bumpkin.equipped = action.equipment;

  return game;
}

export function assertEquipment({
  equipment,
  game,
  bumpkin,
}: {
  equipment: BumpkinParts;
  game: GameState;
  bumpkin: Pick<Bumpkin, "equipped">;
}) {
  if (equipment.dress && equipment.shirt) {
    throw new Error("Cannot equip shirt while wearing dress");
  }

  if (equipment.dress && equipment.pants) {
    throw new Error("Cannot equip pants while wearing dress");
  }

  if (!equipment.body) {
    throw new Error("Body is required");
  }

  if (!equipment.shoes) {
    throw new Error("Shoes are required");
  }

  if (!equipment.hair) {
    throw new Error("Hair is required");
  }

  if (!equipment.dress && !(equipment.shirt && equipment.pants)) {
    throw new Error("Bumpkin is naked!");
  }

  const available = availableWardrobe(game);

  Object.values(equipment).forEach((name) => {
    const alreadyEquipped = Object.values(bumpkin.equipped).includes(name);

    if (!alreadyEquipped && !available[name]) {
      throw new Error(`${name} is not available for use`);
    }
  });

  return true;
}

/**
 * Return the available (unequipped) wardrobe items
 */
export function availableWardrobe(game: GameState): Wardrobe {
  // TODO check in use by farm hands
  const equipped = [
    game.bumpkin?.equipped as Equipped,
    ...Object.values(game.farmHands.bumpkins).map((f) => f.equipped),
  ];

  const inUse = equipped.reduce((acc, parts) => {
    return Object.values(parts).reduce((acc, name) => {
      const previous = acc[name] ?? 0;

      return {
        ...acc,
        [name]: previous + 1,
      };
    }, acc);
  }, {} as Wardrobe);

  return getKeys(game.wardrobe).reduce((acc, name) => {
    let amount = game.wardrobe[name] ?? 0;

    if (inUse[name]) {
      amount -= inUse[name] ?? 0;
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
