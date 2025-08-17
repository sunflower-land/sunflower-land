import Decimal from "decimal.js-light";
import { getKeys } from "../types/craftables";
import { GameState } from "../types/game";

import cloneDeep from "lodash.clonedeep";
import { getObjectEntries } from "../expansion/lib/utils";
import { removeBuilding } from "./landExpansion/removeBuilding";
import { removeCollectible } from "./landExpansion/removeCollectible";
import {
  isPlaceableCollectible,
  isPlaceableBuilding,
} from "features/island/hud/components/inventory/utils/inventory";
import { PLACEABLE_LOCATIONS } from "../types/collectibles";

export function addVipDays({
  game,
  vipDays,
  createdAt,
}: {
  game: GameState;
  vipDays: number;
  createdAt: number;
}): GameState["vip"] {
  return {
    ...game.vip,
    bundles: game.vip?.bundles ?? [],
    expiresAt:
      Math.max(game.vip?.expiresAt ?? createdAt, createdAt) +
      vipDays * 24 * 60 * 60 * 1000,
  };
}

export type ClaimAirdropAction = {
  type: "airdrop.claimed";
  id: string;
};

type Options = {
  state: Readonly<GameState>;
  action: ClaimAirdropAction;
  createdAt?: number;
};

export function claimAirdrop({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  let game: GameState = cloneDeep(state);

  if (!game.airdrops || game.airdrops.length === 0) {
    throw new Error("No airdrops exist");
  }

  const airdrop = game.airdrops.find((item) => item.id === action.id);

  if (!airdrop) {
    throw new Error(`Airdrop #${action.id} does not exist`);
  }

  game.inventory = getKeys(airdrop.items).reduce((acc, itemName) => {
    const previous = acc[itemName] || new Decimal(0);

    return {
      ...acc,
      [itemName]: previous.add(airdrop.items[itemName] || 0),
    };
  }, game.inventory);

  game.wardrobe = getKeys(airdrop.wearables ?? {}).reduce((acc, itemName) => {
    const previous = acc[itemName] || 0;

    return {
      ...acc,
      [itemName]: previous + (airdrop.wearables[itemName] || 0),
    };
  }, game.wardrobe);

  // Add VIP (don't set purchased bundle though)
  if (airdrop.vipDays) {
    game.vip = addVipDays({
      game,
      vipDays: airdrop.vipDays,
      createdAt: Date.now(),
    });
  }

  game.balance = game.balance.add(airdrop.sfl);
  game.airdrops = game.airdrops.filter((item) => item.id !== action.id);
  game.coins = game.coins + (airdrop.coins ?? 0);

  getObjectEntries(airdrop.items).forEach(([itemName, amount]) => {
    if (amount && amount < 0) {
      let amountToRemove = cloneDeep(-amount);
      // Remove placed collectibles from farm and home
      if (isPlaceableCollectible(itemName)) {
        PLACEABLE_LOCATIONS.forEach((location) => {
          const placedCollectibles = (
            (location === "home"
              ? game.home.collectibles[itemName]
              : game.collectibles[itemName]) ?? []
          ).filter((collectible) => !!collectible.coordinates);

          // Remove only the amount of the item in the array
          const collectibleIdsToRemove = placedCollectibles
            .slice(0, amountToRemove)
            .map((c) => c.id);

          collectibleIdsToRemove.forEach((collectibleId) => {
            game = removeCollectible({
              state: game,
              action: {
                type: "collectible.removed",
                name: itemName,
                id: collectibleId,
                location,
              },
              createdAt,
            });
            // Clone the game state to avoid mutating the original state
            game = cloneDeep(game);
            amountToRemove--;
          });
        });
      }
      if (isPlaceableBuilding(itemName)) {
        const placedBuildings = (game.buildings[itemName] ?? []).filter(
          (building) => !!building.coordinates,
        );
        // Remove only the amount of the item in the array
        const buildingIdsToRemove = placedBuildings
          .slice(0, amountToRemove)
          .map((c) => c.id);

        buildingIdsToRemove.forEach((buildingId) => {
          game = removeBuilding({
            state: game,
            action: {
              type: "building.removed",
              name: itemName,
              id: buildingId,
            },
            createdAt,
          });
          game = cloneDeep(game);
          amountToRemove--;
        });
      }
    }
  });

  return game;
}
