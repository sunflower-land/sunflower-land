import Decimal from "decimal.js-light";
import { trackActivity } from "features/game/types/bumpkinActivity";
import { LanternName, GameState } from "features/game/types/game";
import cloneDeep from "lodash.clonedeep";

export type CraftLanternAction = {
  type: "lantern.crafted";
  name: LanternName;
};

type Options = {
  state: Readonly<GameState>;
  action: CraftLanternAction;
};

export const craftLantern = ({ state, action }: Options): GameState => {
  const copy = cloneDeep<GameState>(state);

  if (!copy.bumpkin) {
    throw new Error("You do not have a Bumpkin");
  }

  if (!copy.lantern) {
    throw new Error(`${action.name} is not currently available`);
  }

  const { ingredients, sfl } = copy.lantern;

  if (sfl) {
    if (copy.balance.lt(sfl)) {
      throw new Error("Insufficient SFL balance");
    }

    copy.balance = copy.balance.sub(sfl);
  }

  const subtractedInventory = ingredients.reduce(
    (inventory, { name, amount }) => {
      const count = inventory[name] || new Decimal(0);
      if (count.lt(amount)) {
        throw new Error(`Insufficient ingredient: ${name}`);
      }

      return {
        ...inventory,
        [name]: count.sub(amount),
      };
    },
    copy.inventory
  );

  const currentLanternCount = copy.inventory[action.name] || new Decimal(0);

  copy.inventory = {
    ...subtractedInventory,
    [action.name]: currentLanternCount.add(1),
  };

  copy.bumpkin.activity = trackActivity(
    `${action.name} Crafted`,
    copy.bumpkin.activity
  );

  return copy;
};
