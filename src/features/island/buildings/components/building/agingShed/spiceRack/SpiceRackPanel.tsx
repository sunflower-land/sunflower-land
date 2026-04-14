import React, { useContext, useState } from "react";
import { useSelector } from "@xstate/react";
import classNames from "classnames";
import Decimal from "decimal.js-light";
import { v4 as uuidv4 } from "uuid";

import { Box } from "components/ui/Box";
import { InnerPanel } from "components/ui/Panel";
import { Label } from "components/ui/Label";
import { Context } from "features/game/GameProvider";
import { hasPlacedAgingShed } from "features/game/events/landExpansion/hasPlacedAgingShed";
import {
  getSpiceRackRecipe,
  getMaxSpiceRackSlots,
  type SpiceRackRecipeName,
} from "features/game/types/spiceRack";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { useNow } from "lib/utils/hooks/useNow";
import { useVisiting } from "lib/utils/visitUtils";
import type { Inventory, InventoryItemName } from "features/game/types/game";
import { ITEM_DETAILS } from "features/game/types/images";
import { mergeBasketAndChestInventory } from "features/island/hud/components/inventory/utils/inventory";
import { getObjectEntries } from "lib/object";
import { secondsToString } from "lib/utils/time";
import { SpiceRackEmpty } from "./SpiceRackEmpty";
import { SpiceRackInProgress } from "./SpiceRackInProgress";

function getPrimaryOutputItem(
  recipeId: SpiceRackRecipeName,
): InventoryItemName {
  const def = getSpiceRackRecipe(recipeId);
  const first = getObjectEntries(def.outputs)[0];
  if (!first) {
    throw new Error("Spice rack recipe has no outputs");
  }

  const [item] = first;
  return item as InventoryItemName;
}

function getFirstInsufficientIngredient(
  merged: Inventory,
  recipeId: SpiceRackRecipeName,
): InventoryItemName | undefined {
  const def = getSpiceRackRecipe(recipeId);

  for (const [ing, need] of getObjectEntries(def.ingredients)) {
    const name = ing as InventoryItemName;
    const have = merged[name] ?? new Decimal(0);

    if (have.lessThan(need ?? new Decimal(0))) {
      return name;
    }
  }

  return undefined;
}

export const SpiceRackPanel: React.FC = () => {
  const { gameService } = useContext(Context);
  const { t } = useAppTranslation();
  const { isVisiting } = useVisiting();

  const state = useSelector(gameService, (s) => s.context.state);

  const queue = state.agingShed.racks.spice;

  const spiceClockEndAt =
    queue.length === 0
      ? undefined
      : Math.max(...queue.map((job) => job.readyAt));

  const now = useNow({
    live: queue.length > 0,
    autoEndAt: spiceClockEndAt,
  });

  const [selectedSlotIndex, setSelectedSlotIndex] = useState<number | null>(
    null,
  );
  const [selectedRecipeId, setSelectedRecipeId] = useState<
    SpiceRackRecipeName | undefined
  >();
  const [startError, setStartError] = useState<string | undefined>();
  const [collectError, setCollectError] = useState<string | undefined>();

  const maxSlots = getMaxSpiceRackSlots(state.agingShed.level);
  const slotsFull = queue.length >= maxSlots;

  const shedPlaced = hasPlacedAgingShed(state);
  const activeSelectedSlotIndex =
    selectedSlotIndex !== null &&
    selectedSlotIndex < queue.length &&
    selectedSlotIndex < maxSlots
      ? selectedSlotIndex
      : null;

  const merged = mergeBasketAndChestInventory(state);

  const insufficientIngredient =
    selectedRecipeId !== undefined
      ? getFirstInsufficientIngredient(merged, selectedRecipeId)
      : undefined;

  const canStart =
    !isVisiting &&
    shedPlaced &&
    selectedRecipeId !== undefined &&
    !slotsFull &&
    insufficientIngredient === undefined;

  const readyJobs = queue.filter((job) => job.readyAt <= now);
  const canCollect = !isVisiting && shedPlaced && readyJobs.length > 0;

  const selectedJob =
    activeSelectedSlotIndex !== null
      ? queue[activeSelectedSlotIndex]
      : undefined;

  const handleRecipeSelect = (recipeId: SpiceRackRecipeName) => {
    setStartError(undefined);
    setSelectedRecipeId(recipeId);
  };

  const handleStart = (recipeId: SpiceRackRecipeName) => {
    if (!canStart) return;

    setStartError(undefined);

    try {
      gameService.send("spiceRack.started", {
        recipe: recipeId,
        jobId: uuidv4().slice(0, 8),
      });
      gameService.send("SAVE");
    } catch (e) {
      setStartError(e instanceof Error ? e.message : String(e));
    }
  };

  const handleCollect = () => {
    setCollectError(undefined);

    try {
      gameService.send("spiceRack.collected");
      gameService.send("SAVE");
    } catch (e) {
      setCollectError(e instanceof Error ? e.message : String(e));
    }
  };

  const validationMessage = (() => {
    if (isVisiting) {
      return undefined;
    }

    if (!shedPlaced) {
      return t("error.requiredBuildingNotExist");
    }

    if (slotsFull) {
      return t("error.noAvailableSlots");
    }

    if (selectedRecipeId && insufficientIngredient) {
      const name =
        ITEM_DETAILS[insufficientIngredient]?.translatedName ??
        String(insufficientIngredient);

      return t("agingShed.spice.insufficientIngredient", { item: name });
    }

    return undefined;
  })();

  return (
    <>
      <InnerPanel className="mb-1">
        <Label type="default" className="text-xs mb-2 ml-1">
          {t("agingShed.spice.spiceSlots")}
        </Label>
        <p className="text-xs mb-2 ml-1">{t("agingShed.spice.description")}</p>
        <div className="flex flex-wrap gap-1 px-1 pb-1 items-start">
          {Array.from({ length: maxSlots }).map((_, index) => {
            const isFilled = index < queue.length;
            const isInactiveEmpty = index > queue.length;

            if (isFilled) {
              const job = queue[index];
              const outputItem = getPrimaryOutputItem(job.recipe);
              const ready = job.readyAt <= now;
              const remainingSec = Math.max(0, (job.readyAt - now) / 1000);

              return (
                <div
                  key={job.id}
                  className="flex flex-col items-center max-w-[72px]"
                >
                  <Box
                    image={ITEM_DETAILS[outputItem]?.image}
                    disabled={false}
                    hideCount
                    isSelected={activeSelectedSlotIndex === index}
                    onClick={() =>
                      setSelectedSlotIndex((current) =>
                        current === index ? null : index,
                      )
                    }
                  />
                  <span className="text-xxs text-center leading-tight mt-0.5 px-0.5 max-w-[68px]">
                    {ready
                      ? t("agingShed.spice.ready")
                      : secondsToString(remainingSec, { length: "short" })}
                  </span>
                </div>
              );
            }

            return (
              <div
                key={`empty-${index}`}
                className={classNames(
                  "flex flex-col items-center max-w-[72px]",
                  isInactiveEmpty && "opacity-40 pointer-events-none",
                )}
              >
                <Box
                  hideCount
                  disabled={isInactiveEmpty}
                  isSelected={activeSelectedSlotIndex === index}
                  onClick={() =>
                    setSelectedSlotIndex((current) =>
                      current === index ? null : index,
                    )
                  }
                >
                  <div className="w-full h-full border border-dashed border-[#181425]/35 opacity-60 rounded-sm" />
                </Box>
              </div>
            );
          })}
        </div>
      </InnerPanel>

      {selectedJob ? (
        <SpiceRackInProgress
          job={selectedJob}
          now={now}
          canCollect={canCollect}
          collectError={collectError}
          onCollect={handleCollect}
        />
      ) : (
        <SpiceRackEmpty
          gameState={state}
          selectedRecipeId={selectedRecipeId}
          onSelectRecipe={handleRecipeSelect}
          onStart={handleStart}
          startDisabled={!canStart}
          validationMessage={validationMessage}
          startError={startError}
        />
      )}
    </>
  );
};
