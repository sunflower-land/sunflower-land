import type { TemporaryCollectibleName } from "features/game/lib/collectibleBuilt";
import {
  EXPIRY_COOLDOWNS,
  isCollectibleBuilt,
} from "features/game/lib/collectibleBuilt";
import type { BumpkinRevampSkillName } from "features/game/types/bumpkinSkills";
import type { CollectibleName } from "features/game/types/craftables";
import type { GameState, InventoryItemName } from "features/game/types/game";
import type { ItemDetails } from "features/game/types/images";
import { ITEM_DETAILS } from "features/game/types/images";
import { translate } from "lib/i18n/translate";

type DescriptionSource = Pick<
  ItemDetails,
  "description" | "boostedDescriptions"
>;

/**
 * Prose descriptions for the windowed speed model, overriding the legacy
 * `ITEM_DETAILS` copy, which states a time *reduction* ("-25% for 4 hours")
 * while the windowed model grants a speed *multiplier* over a rebalanced
 * duration. Durations are interpolated from `EXPIRY_COOLDOWNS` rather than
 * hardcoded, so the next rebalance cannot drift the copy again.
 */
function getSpeedBoostDescriptions(): Partial<
  Record<InventoryItemName, DescriptionSource>
> {
  const hours = (name: TemporaryCollectibleName) =>
    EXPIRY_COOLDOWNS[name] / (60 * 60 * 1000);

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
 * The speed-model rewrite of an item's description, or `undefined` when the
 * item has no rewrite. Surfaces that render their own copy instead of
 * `ITEM_DETAILS` (shop `shortDescription`s) fall back to theirs.
 */
export function getSpeedBoostDescription({
  item,
}: {
  item: InventoryItemName;
}): string | undefined {
  return getSpeedBoostDescriptions()[item]?.description;
}

export function getItemDescription({
  item,
  game,
}: {
  item: InventoryItemName;
  game: GameState;
}) {
  const details: DescriptionSource =
    getSpeedBoostDescriptions()[item] ?? ITEM_DETAILS[item];

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
