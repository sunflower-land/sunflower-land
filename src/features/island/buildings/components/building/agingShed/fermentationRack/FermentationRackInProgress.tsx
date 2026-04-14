import React, { useContext, useState } from "react";
import Decimal from "decimal.js-light";

import { Button } from "components/ui/Button";
import { IngredientsPopover } from "components/ui/IngredientsPopover";
import { InnerPanel } from "components/ui/Panel";
import { Label } from "components/ui/Label";
import { RequirementLabel } from "components/ui/RequirementsLabel";
import type { FermentationJob } from "features/game/lib/agingShed";
import { getFermentationRecipe } from "features/game/types/fermentation";
import type { InventoryItemName } from "features/game/types/game";
import { ITEM_DETAILS } from "features/game/types/images";
import {
  getAgingInputMultiplier,
  getAgingOutput,
} from "features/game/types/agingFormulas";
import { Context } from "features/game/GameProvider";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { getObjectEntries } from "lib/object";
import { secondsToString } from "lib/utils/time";
import { SUNNYSIDE } from "assets/sunnyside";
import { Box } from "components/ui/Box";
import { useSelector } from "@xstate/react";
import { COLLECTIBLE_BUFF_LABELS } from "features/game/types/collectibleItemBuffs";

type Props = {
  job: FermentationJob;
  now: number;
  onCollect: () => void;
  canCollect: boolean;
  collectError?: string;
};

export const FermentationRackInProgress: React.FC<Props> = ({
  job,
  now,
  onCollect,
  canCollect,
  collectError,
}) => {
  const { t } = useAppTranslation();
  const [showIngredients, setShowIngredients] = useState(false);
  const { gameService } = useContext(Context);
  const state = useSelector(gameService, (state) => state.context.state);

  const skills = state.bumpkin.skills;
  const recipeDef = getFermentationRecipe(job.recipe);
  const outputEntry = getObjectEntries(recipeDef.outputs)[0];
  const outputItem = outputEntry?.[0];
  const outputAmount = getAgingOutput(
    skills,
    outputEntry?.[1] ?? new Decimal(0),
    outputItem,
  );

  const timeRemainingMs = Math.max(0, job.readyAt - now);
  const isReady = timeRemainingMs <= 0;

  const ingredientKeys = (getObjectEntries(recipeDef.ingredients).map(
    ([name]) => name,
  ) ?? []) as InventoryItemName[];

  return (
    <>
      <InnerPanel className="mb-1">
        <div className="flex justify-between items-start">
          {outputItem && (
            <Label type="default" className="text-xs">
              {`${ITEM_DETAILS[outputItem]?.translatedName ?? String(outputItem)} x${outputAmount.toString()}`}
            </Label>
          )}
          <Label
            type={isReady ? "success" : "info"}
            className="ml-1"
            icon={isReady ? SUNNYSIDE.icons.confirm : SUNNYSIDE.icons.stopwatch}
          >
            {isReady
              ? t("agingShed.fermentation.ready")
              : `${t("ready.in")}: ${secondsToString(timeRemainingMs / 1000, {
                  length: "medium",
                  removeTrailingZeros: true,
                })}`}
          </Label>
        </div>
        <div className="flex flex-wrap mt-1 gap-1">
          {outputItem &&
            COLLECTIBLE_BUFF_LABELS[outputItem]?.({
              skills,
              collectibles: state.collectibles,
            }).map((label) => {
              return (
                <Label
                  key={label.shortDescription}
                  type={label.labelType}
                  className="text-xs ml-1"
                  icon={label.boostTypeIcon}
                  secondaryIcon={label.boostedItemIcon}
                >
                  {label.shortDescription}
                </Label>
              );
            })}
        </div>
        <div className="flex items-center">
          {outputItem && <Box image={ITEM_DETAILS[outputItem]?.image} />}
          <div
            className="flex flex-wrap p-2 gap-2 cursor-pointer items-center"
            onClick={() => setShowIngredients(!showIngredients)}
          >
            <IngredientsPopover
              show={showIngredients}
              ingredients={ingredientKeys}
              onClick={() => setShowIngredients(false)}
              title={t("ingredients")}
            />

            {getObjectEntries(recipeDef.ingredients).map(([itemName, need]) => {
              const needDecimal = new Decimal(need ?? 0).mul(
                getAgingInputMultiplier(skills),
              );
              const balanceDecimal =
                state.inventory[itemName] ?? new Decimal(0);

              return (
                <RequirementLabel
                  key={String(itemName)}
                  type="item"
                  item={itemName}
                  balance={balanceDecimal}
                  requirement={needDecimal}
                />
              );
            })}

            <RequirementLabel
              type="time"
              waitSeconds={Math.max(0, (job.readyAt - job.startedAt) / 1000)}
            />
          </div>
        </div>
        {collectError && (
          <Label type="danger" className="text-xs mb-2 mx-2">
            {collectError}
          </Label>
        )}
      </InnerPanel>
      <Button disabled={!canCollect} onClick={onCollect}>
        {t("agingShed.fermentation.collect")}
      </Button>
    </>
  );
};
