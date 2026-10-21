import React from "react";

import {
  getCaveBeetleProgress,
  getCavePatchComposition,
  getUndugCaveTiles,
} from "features/game/types/cavePatch";
import type { CaveBatch } from "features/game/types/game";
import { ITEM_DETAILS } from "features/game/types/images";

import { Box } from "components/ui/Box";
import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";
import { InnerPanel } from "components/ui/Panel";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { CaveBuriedTiles, RECIPE_IMAGE } from "./CaveBuriedTiles";

interface Props {
  batch: CaveBatch;
  /** Closes the popover so the player can dig the patch. */
  onDig: () => void;
}

/**
 * A ready batch being dug, laid out like a finished Lava Pit: the mix, Beetles
 * found so far, what is still buried and a button back to the patch.
 */
export const CaveBatchReady: React.FC<Props> = ({ batch, onDig }) => {
  const { t } = useAppTranslation();

  const image = ITEM_DETAILS[RECIPE_IMAGE[batch.recipe]].image;
  const beetles = getCaveBeetleProgress(batch);
  const dug = Object.keys(batch.dug ?? {}).length;
  // Until the save that rolls the board returns, nothing is dug yet.
  const buried = batch.seed
    ? getUndugCaveTiles(batch)
    : getCavePatchComposition(batch.recipe, batch.skills);

  return (
    <InnerPanel className="mb-1">
      {/* Clear of the panel's close button in the top right. */}
      <div className="flex flex-wrap justify-between gap-1 ml-1 mr-8 mb-2">
        <Label type="default" icon={image}>
          {t(`cave.recipe.${batch.recipe}` as const)}
        </Label>
        <Label type="success">{t("cave.batch.ready")}</Label>
      </div>
      <div className="flex items-start mb-2 cursor-context-menu hover:brightness-100">
        <Box
          image={ITEM_DETAILS["Green Beetle"].image}
          className="-mt-2 -mb-1"
        />
        <div className="flex flex-col items-start">
          <Label type="default" className="mb-1">
            {t("cave.dig.beetlesFound", beetles)}
          </Label>
          <p className="text-xs ml-0.5">{t("cave.batch.readyDescription")}</p>
        </div>
      </div>
      <CaveBuriedTiles counts={buried} dug={dug} />
      <Button onClick={onDig} className="mt-1">
        {t("lets.go")}
      </Button>
    </InnerPanel>
  );
};
