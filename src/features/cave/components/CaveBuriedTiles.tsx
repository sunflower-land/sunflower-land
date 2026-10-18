import React from "react";

import type {
  CaveRecipeName,
  CaveTileType,
} from "features/game/types/caveRecipes";
import type { InventoryItemName } from "features/game/types/game";
import { ITEM_DETAILS } from "features/game/types/images";
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
