import React from "react";

import {
  getCaveBeetleProgress,
  getCavePatchComposition,
  getUndugCaveTiles,
} from "features/game/types/cavePatch";
import type { CaveBatch } from "features/game/types/game";
import { ITEM_DETAILS } from "features/game/types/images";

import { Label } from "components/ui/Label";
import { InnerPanel } from "components/ui/Panel";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { CaveBuriedTiles } from "./CaveBuriedTiles";

/**
 * A ready batch being dug, shown while its slot is selected: Beetles found so
 * far and what is still buried.
 */
export const CaveBatchReady: React.FC<{ batch: CaveBatch }> = ({ batch }) => {
  const { t } = useAppTranslation();

  const beetles = getCaveBeetleProgress(batch);
  const dug = Object.keys(batch.dug ?? {}).length;
  // Until the save that rolls the board returns, nothing is dug yet.
  const buried = batch.seed
    ? getUndugCaveTiles(batch)
    : getCavePatchComposition(batch.recipe, batch.skills);

  return (
    <InnerPanel className="mb-1">
      <div className="flex flex-wrap gap-1 ml-1 mb-2">
        <Label type="success">{t("cave.batch.ready")}</Label>
        <Label type="default" icon={ITEM_DETAILS["Green Beetle"].image}>
          {t("cave.dig.beetlesFound", beetles)}
        </Label>
      </div>
      <p className="text-xs ml-1 mb-2">{t("cave.batch.readyDescription")}</p>
      <CaveBuriedTiles counts={buried} dug={dug} />
    </InnerPanel>
  );
};
