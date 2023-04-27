import Decimal from "decimal.js-light";
import { trackActivity } from "features/game/types/bumpkinActivity";
import { getKeys } from "features/game/types/craftables";
import { GameState, LanternName } from "features/game/types/game";
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

  if (!copy.dawnBreaker || !copy.dawnBreaker?.availableLantern) {
    throw new Error(`${action.name} is not currently available`);
  }

  const { availableLantern, currentWeek, lanternsCraftedByWeek } =
    copy.dawnBreaker;

  const { startAt, ingredients, sfl: requiredSFL } = availableLantern;

  if (requiredSFL) {
    if (copy.balance.lt(requiredSFL)) {
      throw new Error("Insufficient SFL balance");
    }

    copy.balance = copy.balance.sub(requiredSFL);
  }

  const subtractedInventory = getKeys(ingredients).reduce((inventory, name) => {
    const count = inventory[name] ?? new Decimal(0);
    const amount = ingredients[name] ?? new Decimal(0);
    if (count.lt(amount)) {
      throw new Error(`Insufficient ingredient: ${name}`);
    }

    return {
      ...inventory,
      [name]: count.sub(amount),
    };
  }, copy.inventory);

  const currentLanternCount = copy.inventory[action.name] || new Decimal(0);

  copy.inventory = {
    ...subtractedInventory,
    [action.name]: currentLanternCount.add(1),
  };

  copy.bumpkin.activity = trackActivity(
    `${action.name} Crafted`,
    copy.bumpkin.activity
  );

  // Keep a count of lanterns crafted per week
  const lanternsCraftedThisWeek = lanternsCraftedByWeek[currentWeek] ?? 0;

  lanternsCraftedByWeek[currentWeek] = lanternsCraftedThisWeek + 1;

  return copy;
};
