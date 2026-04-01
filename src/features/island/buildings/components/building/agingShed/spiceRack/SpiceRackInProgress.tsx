import React, { useContext, useMemo, useState } from "react";
import Decimal from "decimal.js-light";
import { useSelector } from "@xstate/react";

import { Button } from "components/ui/Button";
import { IngredientsPopover } from "components/ui/IngredientsPopover";
import { InnerPanel } from "components/ui/Panel";
import { Label } from "components/ui/Label";
import { RequirementLabel } from "components/ui/RequirementsLabel";
import type { SpiceRackJob } from "features/game/lib/agingShed";
import { getSpiceRackRecipe } from "features/game/types/spiceRack";
import type { InventoryItemName } from "features/game/types/game";
import { ITEM_DETAILS } from "features/game/types/images";
import { Context } from "features/game/GameProvider";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { getObjectEntries } from "lib/object";
import { secondsToString } from "lib/utils/time";
import { SUNNYSIDE } from "assets/sunnyside";
import { Box } from "components/ui/Box";

type Props = {
  job: SpiceRackJob;
  now: number;
  onCollect: () => void;
  canCollect: boolean;
  collectError?: string;
};

export const SpiceRackInProgress: React.FC<Props> = ({
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

  const recipeDef = useMemo(() => getSpiceRackRecipe(job.recipe), [job.recipe]);
  const outputEntry = getObjectEntries(recipeDef.outputs)[0];
  const outputItem = outputEntry?.[0] as InventoryItemName | undefined;
  const outputAmount = outputEntry?.[1];

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
              {`${ITEM_DETAILS[outputItem]?.translatedName ?? String(outputItem)} x${(outputAmount ?? new Decimal(0)).toString()}`}
            </Label>
          )}
          <Label
            type={isReady ? "success" : "info"}
            className="ml-1"
            icon={isReady ? SUNNYSIDE.icons.confirm : SUNNYSIDE.icons.stopwatch}
          >
            {isReady
              ? t("agingShed.spice.ready")
              : `${t("ready.in")}: ${secondsToString(timeRemainingMs / 1000, {
                  length: "medium",
                  removeTrailingZeros: true,
                })}`}
          </Label>
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
              const needDecimal = new Decimal(need ?? 0);
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
        {t("agingShed.spice.collect")}
      </Button>
    </>
  );
};
