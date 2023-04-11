import Decimal from "decimal.js-light";
import { detectCollision } from "features/game/expansion/placeable/lib/collisionDetection";
import { trackActivity } from "features/game/types/bumpkinActivity";
import {
  COLLECTIBLES_DIMENSIONS,
  getKeys,
} from "features/game/types/craftables";
import {
  HELIOS_DECORATIONS,
  ShopDecorationName,
} from "features/game/types/decorations";
import { GameState } from "features/game/types/game";
import cloneDeep from "lodash.clonedeep";

export type buyDecorationAction = {
  type: "decoration.bought";
  name: ShopDecorationName;
  id: string;
  coordinates?: {
    x: number;
    y: number;
  };
};

type Options = {
  state: Readonly<GameState>;
  action: buyDecorationAction;
};

export function buyDecoration({ state, action }: Options) {
  const stateCopy = cloneDeep(state);
  console.log("BUY!");
  const { name } = action;
  const desiredItem = HELIOS_DECORATIONS()[name];

  if (!desiredItem) {
    throw new Error("This item is not a decoration");
  }

  const { bumpkin } = stateCopy;

  if (!bumpkin) {
    throw new Error("Bumpkin not found");
  }

  const totalExpenses = desiredItem.sfl;

  if (totalExpenses && stateCopy.balance.lessThan(totalExpenses)) {
    throw new Error("Insufficient tokens");
  }

  const subtractedInventory = getKeys(desiredItem.ingredients)?.reduce(
    (inventory, ingredient) => {
      const count = inventory[ingredient] || new Decimal(0);
      const desiredCount =
        desiredItem.ingredients[ingredient] || new Decimal(0);

      if (count.lessThan(desiredCount)) {
        throw new Error(`Insufficient ingredient: ${ingredient}`);
      }

      return {
        ...inventory,
        [ingredient]: count.sub(desiredCount),
      };
    },
    stateCopy.inventory
  );

  const oldAmount = stateCopy.inventory[name] ?? new Decimal(0);

  bumpkin.activity = trackActivity(
    "SFL Spent",
    bumpkin?.activity,
    totalExpenses ?? new Decimal(0)
  );
  bumpkin.activity = trackActivity(
    `${name} Bought`,
    bumpkin?.activity,
    new Decimal(1)
  );

  if (action.coordinates && action.id) {
    const dimensions = COLLECTIBLES_DIMENSIONS[name];
    const collides = detectCollision(stateCopy, {
      x: action.coordinates.x,
      y: action.coordinates.y,
      height: dimensions.height,
      width: dimensions.width,
    });

    if (collides) {
      throw new Error("Decoration collides");
    }

    const previous = stateCopy.collectibles[name] ?? [];

    if (previous.find((item) => item.id === action.id)) {
      throw new Error("ID already exists");
    }

    stateCopy.collectibles[name] = previous.concat({
      id: action.id,
      coordinates: { x: action.coordinates.x, y: action.coordinates.y },
      readyAt: Date.now(),
      createdAt: Date.now(),
    });
  }

  return {
    ...stateCopy,
    balance: totalExpenses
      ? stateCopy.balance.sub(totalExpenses)
      : stateCopy.balance,
    inventory: {
      ...stateCopy.inventory,
      ...subtractedInventory,
      [name]: oldAmount.add(1) as Decimal,
    },
  };
}
