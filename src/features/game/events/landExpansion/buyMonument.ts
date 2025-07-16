import Decimal from "decimal.js-light";
import { detectCollision } from "features/game/expansion/placeable/lib/collisionDetection";
import { trackActivity } from "features/game/types/bumpkinActivity";
import {
  COLLECTIBLES_DIMENSIONS,
  getKeys,
} from "features/game/types/craftables";
import { GameState } from "features/game/types/game";
import {
  LANDSCAPING_MONUMENTS,
  LandscapingMonumentName,
  LOVE_CHARM_MONUMENTS,
} from "features/game/types/monuments";
import { produce } from "immer";

export type BuyMonumentAction = {
  type: "monument.bought";
  name: LandscapingMonumentName;
  id?: string;
  coordinates?: {
    x: number;
    y: number;
  };
};

type Options = {
  state: Readonly<GameState>;
  action: BuyMonumentAction;
  createdAt?: number;
};

export function buyMonument({
  state,
  action,
  createdAt = Date.now(),
}: Options) {
  return produce(state, (stateCopy) => {
    const { name } = action;
    const desiredItem = LANDSCAPING_MONUMENTS[name];

    if (!desiredItem) {
      throw new Error("This item is not a monument");
    }

    // Convert createdAt to the start of the day (midnight UTC)
    const createdAtDay = Math.floor(createdAt / (1000 * 60 * 60 * 24));
    const monumentCreatedAt = stateCopy.monuments?.[name]?.createdAt;

    if (
      monumentCreatedAt &&
      Math.floor(monumentCreatedAt / (1000 * 60 * 60 * 24)) === createdAtDay
    ) {
      throw new Error("Monument already bought today");
    }

    // You can only buy one love charm monument total
    if (name in LOVE_CHARM_MONUMENTS && !!stateCopy.monuments?.[name]) {
      throw new Error("Max monument reached");
    }

    const { bumpkin } = stateCopy;

    if (!bumpkin) {
      throw new Error("Bumpkin not found");
    }

    const price = desiredItem.coins ?? 0;

    if (price && stateCopy.coins < price) {
      throw new Error("Insufficient coins");
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
      stateCopy.inventory,
    );

    const oldAmount = stateCopy.inventory[name] ?? new Decimal(0);

    bumpkin.activity = trackActivity(
      "Coins Spent",
      bumpkin?.activity,
      new Decimal(price),
    );
    bumpkin.activity = trackActivity(
      `${name} Bought`,
      bumpkin?.activity,
      new Decimal(1),
    );

    if (action.coordinates && action.id) {
      const dimensions = COLLECTIBLES_DIMENSIONS[name];
      const collides = detectCollision({
        state: stateCopy,
        position: {
          x: action.coordinates.x,
          y: action.coordinates.y,
          height: dimensions.height,
          width: dimensions.width,
        },
        location: "farm",
        name,
      });

      if (collides) {
        throw new Error("Monument collides");
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

    stateCopy.coins = stateCopy.coins - price;
    stateCopy.inventory = {
      ...subtractedInventory,
      [name]: oldAmount.add(1),
    };

    if (!stateCopy.monuments) {
      stateCopy.monuments = {};
    }

    stateCopy.monuments[name] = {
      createdAt,
    };

    return stateCopy;
  });
}
