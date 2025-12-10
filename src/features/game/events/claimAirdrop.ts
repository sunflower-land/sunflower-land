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
  isPlaceableResource,
  isTreeOrRock,
  isUpgradableResource,
} from "features/island/hud/components/inventory/utils/inventory";
import { PLACEABLE_LOCATIONS } from "../types/collectibles";
import { ResourceItem } from "../expansion/placeable/lib/collisionDetection";
import {
  RESOURCE_STATE_ACCESSORS,
  RESOURCE_MULTIPLIER,
} from "../types/resources";
import { BUMPKIN_ITEM_PART, BumpkinItem } from "../types/bumpkin";

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
    const amount = Number(airdrop.wearables[itemName] || 0);
    const newValue = previous + amount;

    if (newValue > 0) {
      return {
        ...acc,
        [itemName]: newValue,
      };
    } else {
      const newAcc = { ...acc };
      delete newAcc[itemName];
      return newAcc;
    }
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
      const amountToRemove = -amount; // Remove unnecessary cloneDeep
      let remainingToRemove = amountToRemove; // Track remaining across all locations

      // Remove placed collectibles from farm and home
      if (isPlaceableCollectible(itemName)) {
        PLACEABLE_LOCATIONS.forEach((location) => {
          if (remainingToRemove <= 0) return; // Skip if we've removed enough

          const placedCollectibles = (
            (location === "home"
              ? game.home.collectibles[itemName]
              : game.collectibles[itemName]) ?? []
          ).filter((collectible) => !!collectible.coordinates);

          // Calculate how many to remove from this location
          const toRemoveFromLocation = Math.min(
            remainingToRemove,
            placedCollectibles.length,
          );

          if (toRemoveFromLocation > 0) {
            // Get IDs to remove in one operation
            const collectibleIdsToRemove = placedCollectibles
              .slice(0, toRemoveFromLocation)
              .map((c) => c.id);

            // Remove all collectibles in one batch
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
            });

            // Update remaining count
            remainingToRemove -= toRemoveFromLocation;
          }
        });
      }

      if (isPlaceableBuilding(itemName)) {
        const placedBuildings = (game.buildings[itemName] ?? []).filter(
          (building) => !!building.coordinates,
        );

        // Calculate how many buildings to remove (considering what was already removed from collectibles)
        const toRemoveFromBuildings = Math.min(
          remainingToRemove,
          placedBuildings.length,
        );

        if (toRemoveFromBuildings > 0) {
          // Get IDs to remove in one operation
          const buildingIdsToRemove = placedBuildings
            .slice(0, toRemoveFromBuildings)
            .map((c) => c.id);

          // Remove all buildings in one batch
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
          });
        }
      }

      if (isPlaceableResource(itemName)) {
        const placedNodes = RESOURCE_STATE_ACCESSORS[itemName](game);
        const relavantNodes: [string, ResourceItem][] = Object.entries(
          placedNodes,
        ).filter(([, node]: [string, ResourceItem]) => {
          if (isTreeOrRock(node) && isUpgradableResource(itemName)) {
            return (node.multiplier ?? 1) === RESOURCE_MULTIPLIER[itemName];
          }

          return true;
        });
        const toRemoveFromNodes = Math.min(
          remainingToRemove,
          relavantNodes.length,
        );
        if (toRemoveFromNodes > 0) {
          const nodesToRemove = relavantNodes
            .slice(0, toRemoveFromNodes)
            .map(([id]) => id);
          nodesToRemove.forEach((id) => {
            delete placedNodes[id];
          });
          remainingToRemove -= toRemoveFromNodes;
        }
      }

      // Clone game state only once after all removals are complete
      game = cloneDeep(game);
    }
  });

  // Handle negative wearable airdrops - unequip from bumpkin and farmhands first
  getObjectEntries(airdrop.wearables ?? {}).forEach(([itemName, amount]) => {
    if (!amount || amount >= 0) return;

    const amountToRemove = -amount;
    let remainingToRemove = amountToRemove;

    const part = BUMPKIN_ITEM_PART[itemName as BumpkinItem];
    if (!part) {
      return;
    }

    // Unequip from main bumpkin first
    if (game.bumpkin?.equipped && game.bumpkin.equipped[part] === itemName) {
      delete game.bumpkin.equipped[part];
      remainingToRemove -= 1;
    }

    // Unequip from farmhands
    if (remainingToRemove > 0) {
      getKeys(game.farmHands.bumpkins).forEach((farmhandId) => {
        if (remainingToRemove <= 0) return;

        const farmhand = game.farmHands.bumpkins[farmhandId];
        if (farmhand?.equipped && farmhand.equipped[part] === itemName) {
          delete farmhand.equipped[part];
          remainingToRemove -= 1;
        }
      });
    }
  });

  return game;
}
