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

  const { ingredients, sfl: requiredSFL } = availableLantern;

  // Requirements are multiplied by the number of lanterns crafted + 1 (for the current week)
  // eg. 1st lantern requires 1x, 2nd lantern requires 2x, 3rd lantern requires 3x, etc.
  let multiplier = 1;
  const currentCraftCount = lanternsCraftedByWeek[currentWeek];

  if (currentCraftCount) {
    multiplier = currentCraftCount + 1;
  }

  if (requiredSFL) {
    let cost = requiredSFL.mul(multiplier);

    // Season Pass holders get a 25% discount on SFL
    if (copy.inventory["Dawn Breaker Banner"]) {
      cost = cost.mul(0.75);
    }

    if (copy.balance.lt(cost)) {
      throw new Error("Insufficient SFL balance");
    }

    copy.balance = copy.balance.sub(cost);
  }

  const subtractedInventory = getKeys(ingredients).reduce((inventory, name) => {
    const count = inventory[name] ?? new Decimal(0);
    const amount = (ingredients[name] ?? new Decimal(0)).mul(multiplier);

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
