import type { GameState } from "../../types/game";
import type { CollectibleName } from "features/game/types/craftables";
import type { PlaceableLocation } from "features/game/types/collectibles";
import type { HourglassType } from "features/island/collectibles/components/Hourglass";
import Decimal from "decimal.js-light";
import { produce } from "immer";
import { PET_SHRINES } from "features/game/types/pets";
import {
  getExpiryCooldown,
  type TemporaryCollectibleName,
} from "features/game/lib/collectibleBuilt";
import { isPetCollectible } from "./placeCollectible";
import { getKeys } from "lib/object";
import { appendBoostHistory } from "features/game/lib/boostWindows";

export type BurnCollectibleAction = {
  type: "collectible.burned";
  name: CollectibleName;
  location: PlaceableLocation;
  id: string;
};

type Options = {
  state: Readonly<GameState>;
  action: BurnCollectibleAction;
  createdAt?: number;
};

export const HOURGLASSES: HourglassType[] = [
  "Gourmet Hourglass",
  "Harvest Hourglass",
  "Timber Hourglass",
  "Orchard Hourglass",
  "Blossom Hourglass",
  "Fisher's Hourglass",
  "Ore Hourglass",
];
export const LIMITED_ITEMS: CollectibleName[] = [
  ...HOURGLASSES,
  "Time Warp Totem",
  "Super Totem",
  ...getKeys(PET_SHRINES),
  "Obsidian Shrine",
];

export function burnCollectible({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  return produce(state, (stateCopy) => {
    if (!LIMITED_ITEMS.includes(action.name)) {
      throw new Error(`Cannot burn ${action.name}`);
    }

    const getCollectibleGroup = (
      location: PlaceableLocation,
      name: CollectibleName,
    ) => {
      if (location === "home") {
        return stateCopy.home.collectibles[name];
      } else if (location === "petHouse") {
        if (!isPetCollectible(name)) {
          throw new Error(
            "Only pet collectibles can be placed in the pet house",
          );
        }
        return stateCopy.petHouse.pets[name];
      } else if (location === "interior") {
        return stateCopy.interior.ground.collectibles[name];
      } else if (location === "level_one") {
        const levelOne = stateCopy.interior.level_one;
        if (!levelOne) {
          throw new Error("Level one floor has not been unlocked");
        }
        return levelOne.collectibles[name];
      } else {
        return stateCopy.collectibles[name];
      }
    };

    let collectibleGroup = getCollectibleGroup(action.location, action.name);

    if (!collectibleGroup) {
      throw new Error("Invalid collectible");
    }

    const collectibleToRemove = collectibleGroup.find(
      (collectible) => collectible.id === action.id,
    );

    if (!collectibleToRemove) {
      throw new Error("Collectible does not exist");
    }

    const cooldown = getExpiryCooldown(
      action.name as TemporaryCollectibleName,
      stateCopy,
    );

    if ((collectibleToRemove.createdAt ?? 0) + cooldown > createdAt) {
      throw new Error("Collectible is still active");
    }

    // Preserve this booster's active window before its record is deleted, so any
    // in-progress timer it boosted keeps the earned credit (see boostWindows).
    const burnedCreatedAt = collectibleToRemove.createdAt ?? 0;
    appendBoostHistory(
      stateCopy,
      action.name as TemporaryCollectibleName,
      { from: burnedCreatedAt, to: burnedCreatedAt + cooldown },
      createdAt,
    );

    collectibleGroup = collectibleGroup.filter(
      (collectible) => collectible.id !== collectibleToRemove.id,
    );

    if (collectibleGroup.length === 0) {
      if (action.location === "home") {
        delete stateCopy.home.collectibles[action.name];
      } else if (action.location === "petHouse") {
        if (!isPetCollectible(action.name)) {
          throw new Error(
            "Only pet collectibles can be placed in the pet house",
          );
        }
        delete stateCopy.petHouse.pets[action.name];
      } else if (action.location === "interior") {
        delete stateCopy.interior.ground.collectibles[action.name];
      } else if (action.location === "level_one") {
        delete stateCopy.interior.level_one!.collectibles[action.name];
      } else {
        delete stateCopy.collectibles[action.name];
      }
    } else {
      if (action.location === "home") {
        stateCopy.home.collectibles[action.name] = collectibleGroup;
      } else if (action.location === "petHouse") {
        if (!isPetCollectible(action.name)) {
          throw new Error(
            "Only pet collectibles can be placed in the pet house",
          );
        }
        stateCopy.petHouse.pets[action.name] = collectibleGroup;
      } else if (action.location === "interior") {
        stateCopy.interior.ground.collectibles[action.name] = collectibleGroup;
      } else if (action.location === "level_one") {
        stateCopy.interior.level_one!.collectibles[action.name] =
          collectibleGroup;
      } else {
        stateCopy.collectibles[action.name] = collectibleGroup;
      }
    }

    const previous = stateCopy.inventory[action.name] || new Decimal(0);
    stateCopy.inventory[action.name] = previous.sub(1);

    return stateCopy;
  });
}
