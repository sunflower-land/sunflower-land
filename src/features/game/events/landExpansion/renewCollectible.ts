import Decimal from "decimal.js-light";
import type { PlaceableLocation } from "features/game/types/collectibles";
import type { CollectibleName } from "features/game/types/craftables";
import type { GameState } from "features/game/types/game";
import { produce } from "immer";
import {
  hasCollectibleExpired,
  isInventoryRenewableCollectible,
  type InventoryRenewableCollectibleName,
} from "features/game/lib/renewableCollectibles";
import { isPetCollectible } from "./placeCollectible";
import { getExpiryCooldown } from "features/game/lib/collectibleBuilt";
import { appendBoostHistory } from "features/game/lib/boostWindows";

export type RenewCollectibleAction = {
  type: "collectible.renewed";
  name: InventoryRenewableCollectibleName;
  location: PlaceableLocation;
  id: string;
};

type Options = {
  state: Readonly<GameState>;
  action: RenewCollectibleAction;
  createdAt?: number;
};

export function renewCollectible({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  return produce(state, (stateCopy) => {
    if (!isInventoryRenewableCollectible(action.name as CollectibleName)) {
      throw new Error("Invalid renewable collectible");
    }

    const collectibleGroup =
      action.location === "home"
        ? stateCopy.home.collectibles[action.name]
        : action.location === "petHouse"
          ? isPetCollectible(action.name)
            ? stateCopy.petHouse.pets[action.name]
            : undefined
          : action.location === "interior"
            ? stateCopy.interior.ground.collectibles[action.name]
            : action.location === "level_one"
              ? stateCopy.interior.level_one?.collectibles[action.name]
              : stateCopy.collectibles[action.name];

    if (!collectibleGroup) {
      throw new Error("Invalid collectible");
    }

    const collectibleToRenew = collectibleGroup.find(
      (collectible) => collectible.id === action.id,
    );

    if (!collectibleToRenew) {
      throw new Error("Collectible does not exist");
    }

    if (
      !hasCollectibleExpired({
        name: action.name,
        collectible: collectibleToRenew,
        game: stateCopy,
        now: createdAt,
      })
    ) {
      throw new Error("Collectible is still active");
    }

    const available = stateCopy.inventory[action.name] ?? new Decimal(0);

    if (available.lt(1)) {
      throw new Error("Insufficient collectible inventory");
    }

    stateCopy.inventory[action.name] = available.sub(1);

    // Preserve the booster's previous active window before its createdAt is reset,
    // so any in-progress timer it boosted keeps the earned credit (see boostWindows).
    const previousCreatedAt = collectibleToRenew.createdAt ?? 0;
    appendBoostHistory(
      stateCopy,
      action.name,
      {
        from: previousCreatedAt,
        to: previousCreatedAt + getExpiryCooldown(action.name, stateCopy),
      },
      createdAt,
    );
    collectibleToRenew.createdAt = createdAt;

    return stateCopy;
  });
}
