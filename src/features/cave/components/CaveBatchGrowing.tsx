import React from "react";

import { getCavePatchComposition } from "features/game/types/cavePatch";
import type { CaveBatch } from "features/game/types/game";
import { ITEM_DETAILS } from "features/game/types/images";
import { SUNNYSIDE } from "assets/sunnyside";
import { secondsToString } from "lib/utils/time";

import { Label } from "components/ui/Label";
import { InnerPanel } from "components/ui/Panel";
import { ResizableBar } from "components/ui/ProgressBar";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { getCaveBatchPercentage } from "features/cave/lib/caveBatchProgress";
import { CaveBuriedTiles, RECIPE_IMAGE } from "./CaveBuriedTiles";

interface Props {
  batch: CaveBatch;
  now: number;
}

/**
 * The growing batch, shown while its slot is selected (like a filled Aging
 * Shed slot): time left, progress and what it will bury. There is no Gem/Coin
 * finish — instant batches would flood the market with Beetles.
 */
export const CaveBatchGrowing: React.FC<Props> = ({ batch, now }) => {
  const { t } = useAppTranslation();

  return (
    <InnerPanel className="mb-1">
      <div className="flex flex-wrap gap-1 ml-1 mb-2">
        <Label
          type="default"
          icon={ITEM_DETAILS[RECIPE_IMAGE[batch.recipe]].image}
        >
          {t(`cave.recipe.${batch.recipe}` as const)}
        </Label>
        <Label type="default" icon={SUNNYSIDE.icons.stopwatch}>
          {t("cave.batch.growing")}
        </Label>
      </div>
      <div className="mx-1 mb-2">
        <span className="text-xs">
          {secondsToString(Math.max(0, (batch.readyAt - now) / 1000), {
            length: "medium",
          })}
        </span>
        <ResizableBar
          percentage={getCaveBatchPercentage(batch, now)}
          type="progress"
        />
      </div>
      <CaveBuriedTiles
        counts={getCavePatchComposition(batch.recipe, batch.skills)}
      />
    </InnerPanel>
  );
};
