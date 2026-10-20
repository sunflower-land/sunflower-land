import React from "react";

import type {
  CaveRecipeName,
  CaveTileType,
} from "features/game/types/caveRecipes";
import type { InventoryItemName } from "features/game/types/game";
import type { BeetleName } from "features/game/types/beetles";
import { BEETLE_RARITY_WEIGHTS } from "features/game/types/cavePatch";
import {
  ITEM_DETAILS,
  getTranslatedItemName,
} from "features/game/types/images";
import { getKeys } from "lib/object";
import { SUNNYSIDE } from "assets/sunnyside";
import { Label } from "components/ui/Label";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

/** A representative item image for each recipe / buried tile kind. */
export const RECIPE_IMAGE: Record<CaveRecipeName, InventoryItemName> = {
  Mushroom: "Wild Mushroom",
  Beetle: "Green Beetle",
  Mud: "Mud",
};
export const TILE_IMAGE: Record<CaveTileType, string> = {
  Mushroom: ITEM_DETAILS["Wild Mushroom"].image,
  Beetle: ITEM_DETAILS["Green Beetle"].image,
  Mud: ITEM_DETAILS["Mud"].image,
};

/**
 * The chance of each Beetle kind in a patch's Beetle tiles. With Rare Breeds
 * the boosted odds are shown next to the base odds, struck through.
 */
export const CaveBeetleOdds: React.FC<{
  odds?: Record<BeetleName, number>;
}> = ({ odds = BEETLE_RARITY_WEIGHTS }) => {
  const { t } = useAppTranslation();

  return (
    <>
      <p className="text-xxs ml-1 mb-1">{t("cave.batch.beetleOdds")}</p>
      <div className="flex flex-wrap gap-1 ml-1 mb-1">
        {getKeys(BEETLE_RARITY_WEIGHTS).map((beetle) => {
          const base = BEETLE_RARITY_WEIGHTS[beetle];
          const chance = odds[beetle] ?? base;
          return (
            <Label
              key={beetle}
              type={chance === base ? "default" : "vibrant"}
              icon={ITEM_DETAILS[beetle].image}
            >
              {/* The icon's alt text is generic, so name the Beetle for
                  screen readers and hide the bare percentages from them. */}
              <span className="sr-only">
                {chance === base
                  ? t("cave.batch.beetleChance", {
                      beetle: getTranslatedItemName(beetle),
                      chance,
                    })
                  : t("cave.batch.beetleChanceBoosted", {
                      beetle: getTranslatedItemName(beetle),
                      chance,
                      base,
                    })}
              </span>
              <span aria-hidden>
                {`${chance}%`}
                {chance !== base && (
                  <span className="line-through opacity-60 ml-1">{`${base}%`}</span>
                )}
              </span>
            </Label>
          );
        })}
      </div>
    </>
  );
};

/**
 * What a patch buries: the count of each kind, plus the tiles already `dug`
 * of a patch being dug.
 */
export const CaveBuriedTiles: React.FC<{
  counts: Record<CaveTileType, number>;
  dug?: number;
}> = ({ counts, dug = 0 }) => {
  const { t } = useAppTranslation();

  return (
    <>
      <p className="text-xxs ml-1 mb-1">{t("cave.batch.buried")}</p>
      <div className="flex flex-wrap gap-1 ml-1 mb-1">
        {getKeys(counts).map((tile) => {
          const count = counts[tile];
          if (count <= 0) return null;
          return (
            <Label key={tile} type="default" icon={TILE_IMAGE[tile]}>
              {count}
            </Label>
          );
        })}
        {dug > 0 && (
          <Label type="default" icon={SUNNYSIDE.tools.sand_shovel}>
            {dug}
          </Label>
        )}
      </div>
    </>
  );
};
