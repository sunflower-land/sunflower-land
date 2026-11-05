import React from "react";

import { CAVE_RECIPES } from "features/game/types/caveRecipes";
import { getCavePatchComposition } from "features/game/types/cavePatch";
import type { CaveBatch } from "features/game/types/game";
import { ITEM_DETAILS } from "features/game/types/images";
import { SUNNYSIDE } from "assets/sunnyside";
import { secondsToString } from "lib/utils/time";

import { Box } from "components/ui/Box";
import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";
import { InnerPanel } from "components/ui/Panel";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import powerup from "assets/icons/level_up.png";
import { CaveBuriedTiles, RECIPE_IMAGE } from "./CaveBuriedTiles";

interface Props {
  batch: CaveBatch;
  now: number;
}

/**
 * The growing batch, laid out like a burning Lava Pit: the mix and time left,
 * what it is, what it will bury and a disabled action. There is no Gem/Coin
 * finish — instant batches would flood the market with Beetles.
 */
export const CaveBatchGrowing: React.FC<Props> = ({ batch, now }) => {
  const { t } = useAppTranslation();

  const image = ITEM_DETAILS[RECIPE_IMAGE[batch.recipe]].image;
  const { mudYieldMultiplier } = CAVE_RECIPES[batch.recipe];
  const secondsLeft = Math.max(0, (batch.readyAt - now) / 1000);

  return (
    <InnerPanel className="mb-1">
      {/* Clear of the panel's close button in the top right. */}
      <div className="flex flex-wrap justify-between gap-1 ml-1 mr-8 mb-2">
        <Label type="default" icon={image}>
          {t(`cave.recipe.${batch.recipe}` as const)}
        </Label>
        <Label type="info" icon={SUNNYSIDE.icons.stopwatch}>
          {`${t("ready.in")}: ${secondsToString(secondsLeft, {
            length: "medium",
          })}`}
        </Label>
      </div>
      <div className="flex items-start mb-2 cursor-context-menu hover:brightness-100">
        <Box image={image} className="-mt-2 -mb-1" />
        <div className="flex flex-col items-start">
          {mudYieldMultiplier > 1 && (
            <Label
              type="success"
              icon={powerup}
              secondaryIcon={ITEM_DETAILS.Mud.image}
              className="mb-1"
            >
              {t("cave.recipe.mudYield", { multiplier: mudYieldMultiplier })}
            </Label>
          )}
          {batch.recipe !== "Mud" && (
            <p className="text-xs ml-0.5">
              {t(`cave.recipe.${batch.recipe}.description` as const)}
            </p>
          )}
        </div>
      </div>
      <CaveBuriedTiles
        counts={getCavePatchComposition(batch.recipe, batch.skills)}
      />
      <Button disabled className="mt-1">
        {t("cave.batch.growing")}
      </Button>
    </InnerPanel>
  );
};
