import type { TemporaryCollectibleName } from "features/game/lib/collectibleBuilt";
import {
  getExpiryCooldown,
  isCollectibleBuilt,
} from "features/game/lib/collectibleBuilt";
import type { BumpkinRevampSkillName } from "features/game/types/bumpkinSkills";
import type { CollectibleName } from "features/game/types/craftables";
import type { GameState, InventoryItemName } from "features/game/types/game";
import type { ItemDetails } from "features/game/types/images";
import { ITEM_DETAILS } from "features/game/types/images";
import { hasFeatureAccess } from "lib/flags";
import { translate } from "lib/i18n/translate";

type DescriptionSource = Pick<
  ItemDetails,
  "description" | "boostedDescriptions"
>;

/**
 * Prose descriptions that only hold under the `SPEED_BOOSTS` flag, mirroring the
 * `.speed` buff-label variants in `collectibleItemBuffs`. The legacy copy states a
 * time *reduction* ("-25% for 4 hours") while the windowed model grants a speed
 * *multiplier* over a rebalanced duration, so the two read as contradictions
 * side by side in the shop. Durations are interpolated from `getExpiryCooldown`
 * rather than hardcoded, so the next rebalance cannot drift the copy again.
 */
function getSpeedBoostDescriptions(
  game: GameState,
): Partial<Record<InventoryItemName, DescriptionSource>> {
  const hours = (name: TemporaryCollectibleName) =>
    getExpiryCooldown(name, game) / (60 * 60 * 1000);

  return {
    "Time Warp Totem": {
      description: translate("description.time.warp.totem.speed", {
        hours: hours("Time Warp Totem"),
      }),
    },
    "Gourmet Hourglass": {
      description: translate("description.factionShop.cookingBoost.speed", {
        hours: hours("Gourmet Hourglass"),
      }),
    },
    "Harvest Hourglass": {
      description: translate("description.factionShop.cropBoost.speed", {
        hours: hours("Harvest Hourglass"),
      }),
    },
    "Timber Hourglass": {
      description: translate("description.factionShop.woodBoost.speed", {
        hours: hours("Timber Hourglass"),
      }),
    },
    "Ore Hourglass": {
      description: translate("description.factionShop.mineralBoost.speed", {
        hours: hours("Ore Hourglass"),
      }),
    },
    "Orchard Hourglass": {
      description: translate("description.factionShop.fruitBoost.speed", {
        hours: hours("Orchard Hourglass"),
      }),
    },
    "Blossom Hourglass": {
      description: translate("description.factionShop.flowerBoost.speed", {
        hours: hours("Blossom Hourglass"),
      }),
    },
    "Turbofruit Mix": {
      description: translate("compost.turbofruitMix.speed"),
      boostedDescriptions: [
        {
          name: "Fruitful Bounty",
          description: translate("compost.turbofruitMixBoosted.speed"),
        },
      ],
    },
    "Turbo Sprout": {
      description: translate("description.turbo.sprout.speed"),
    },
  };
}

/**
 * The `SPEED_BOOSTS` rewrite of an item's description, or `undefined` when the
 * player is flag-off or the item has no rewrite. Surfaces that render their own
 * copy instead of `ITEM_DETAILS` (shop `shortDescription`s) fall back to theirs.
 */
export function getSpeedBoostDescription({
  item,
  game,
}: {
  item: InventoryItemName;
  game: GameState;
}): string | undefined {
  if (!hasFeatureAccess(game, "SPEED_BOOSTS")) return undefined;

  return getSpeedBoostDescriptions(game)[item]?.description;
}

export function getItemDescription({
  item,
  game,
}: {
  item: InventoryItemName;
  game: GameState;
}) {
  const details: DescriptionSource =
    (hasFeatureAccess(game, "SPEED_BOOSTS")
      ? getSpeedBoostDescriptions(game)[item]
      : undefined) ?? ITEM_DETAILS[item];

  let description = details.description;

  if (details.boostedDescriptions) {
    for (const boostedDescription of details.boostedDescriptions) {
      if (
        isCollectibleBuilt({
          name: boostedDescription.name as CollectibleName,
          game,
        }) ||
        game.bumpkin?.skills[boostedDescription.name as BumpkinRevampSkillName]
      ) {
        description = boostedDescription.description;
      }
    }
  }

  return description;
}
