import Decimal from "decimal.js-light";
import { detectCollision } from "features/game/expansion/placeable/lib/collisionDetection";
import { trackActivity } from "features/game/types/bumpkinActivity";
import {
  COLLECTIBLES_DIMENSIONS,
  getKeys,
} from "features/game/types/craftables";
import {
  BASIC_DECORATIONS,
  LANDSCAPING_DECORATIONS,
  LandscapingDecorationName,
  POTION_HOUSE_DECORATIONS,
  SEASONAL_DECORATIONS,
  SeasonalDecorationName,
  ShopDecorationName,
} from "features/game/types/decorations";
import { GameState } from "features/game/types/game";
import { analytics } from "lib/analytics";
import cloneDeep from "lodash.clonedeep";

export type buyDecorationAction = {
  type: "decoration.bought";
  name: ShopDecorationName | SeasonalDecorationName | LandscapingDecorationName;
  id?: string;
  coordinates?: {
    x: number;
    y: number;
  };
};

type Options = {
  state: Readonly<GameState>;
  action: buyDecorationAction;
  createdAt?: number;
};

const DECORATIONS = (state: GameState) => {
  return {
    ...BASIC_DECORATIONS(),
    ...LANDSCAPING_DECORATIONS(),
    ...SEASONAL_DECORATIONS(state),
    ...POTION_HOUSE_DECORATIONS(),
  };
};
export function buyDecoration({
  state,
  action,
  createdAt = Date.now(),
}: Options) {
  const stateCopy = cloneDeep(state);
  const { name } = action;
  const desiredItem = DECORATIONS(stateCopy)[name];

  if (!desiredItem) {
    throw new Error("This item is not a decoration");
  }

  const { bumpkin } = stateCopy;

  if (!bumpkin) {
    throw new Error("Bumpkin not found");
  }

  if (desiredItem.from && desiredItem.from?.getTime() > createdAt) {
    throw new Error("Too early");
  }

  if (desiredItem.to && desiredItem.to?.getTime() < createdAt) {
    throw new Error("Too late");
  }

  const totalExpenses = desiredItem.sfl;

  if (totalExpenses && stateCopy.balance.lessThan(totalExpenses)) {
    throw new Error("Insufficient tokens");
  }

  if (desiredItem.limit && stateCopy.inventory[name]?.gte(desiredItem.limit)) {
    throw new Error("Max limit reached");
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

  if (desiredItem.ingredients["Block Buck"]) {
    // https://developers.google.com/analytics/devguides/collection/ga4/reference/events?client_type=gtag#spend_virtual_currency
    analytics.logEvent("spend_virtual_currency", {
      value: desiredItem.ingredients["Block Buck"].toNumber() ?? 1,
      virtual_currency_name: "Block Buck",
      item_name: `${name}`,
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
