import React, { useCallback, useContext, useMemo, useState } from "react";
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
  findFermentationGroupByStoredSignature,
  getFermentationOutputGroups,
  type FermentationOutputGroup,
} from "features/game/lib/fermentationUi";
import {
  getFermentationRecipe,
  getMaxFermentationSlots,
  type FermentationRecipeName,
} from "features/game/types/fermentation";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { useNow } from "lib/utils/hooks/useNow";
import { useVisiting } from "lib/utils/visitUtils";
import type {
  GameState,
  Inventory,
  InventoryItemName,
} from "features/game/types/game";
import { ITEM_DETAILS } from "features/game/types/images";
import {
  getBasketItems,
  getChestItems,
} from "features/island/hud/components/inventory/utils/inventory";
import { getObjectEntries } from "lib/object";
import { secondsToString } from "lib/utils/time";
import { FermentationRackEmpty } from "./FermentationRackEmpty";
import { FermentationRackInProgress } from "./FermentationRackInProgress";

const OUTPUT_STORAGE_KEY = "lastFermentationOutputSignature";
const RECIPE_STORAGE_KEY = "lastFermentationRecipeId";

function getMergedInventory(state: GameState): Inventory {
  return {
    ...getBasketItems(state.inventory),
    ...getChestItems(state),
  };
}

function getFirstInsufficientIngredient(
  merged: Inventory,
  recipeId: FermentationRecipeName,
): InventoryItemName | undefined {
  const def = getFermentationRecipe(recipeId);

  for (const [ing, need] of getObjectEntries(def.ingredients)) {
    const name = ing as InventoryItemName;
    const have = merged[name] ?? new Decimal(0);

    if (have.lessThan(need ?? new Decimal(0))) {
      return name;
    }
  }

  return undefined;
}

function getPrimaryOutputItem(
  recipeId: FermentationRecipeName,
): InventoryItemName {
  const def = getFermentationRecipe(recipeId);
  const first = getObjectEntries(def.outputs)[0];
  if (!first) {
    throw new Error("Fermentation recipe has no outputs");
  }

  const [item] = first;
  return item as InventoryItemName;
}

export const FermentationRackPanel: React.FC = () => {
  const { gameService } = useContext(Context);
  const { t } = useAppTranslation();
  const { isVisiting } = useVisiting();

  const state = useSelector(gameService, (s) => s.context.state);

  const queue = state.agingShed.racks.fermentation;

  /** Stop ticking when every job is ready (last `readyAt`); no interval when queue is empty. */
  const fermentationClockEndAt = useMemo(() => {
    if (queue.length === 0) return undefined;
    return Math.max(...queue.map((job) => job.readyAt));
  }, [queue]);

  const now = useNow({
    live: queue.length > 0,
    autoEndAt: fermentationClockEndAt,
  });

  const groups = useMemo(() => getFermentationOutputGroups(), []);

  /** `null` = no explicit tap yet: UI uses first empty slot (see `effectiveSlotIndex`). */
  const [selectedSlotIndex, setSelectedSlotIndex] = useState<number | null>(
    null,
  );
  const [selectedSignature, setSelectedSignature] = useState<
    string | undefined
  >(undefined);
  const [selectedRecipeId, setSelectedRecipeId] = useState<
    FermentationRecipeName | undefined
  >(undefined);
  const [startError, setStartError] = useState<string | undefined>();
  const [collectError, setCollectError] = useState<string | undefined>();

  const maxSlots = getMaxFermentationSlots(state.agingShed.level);
  const slotsFull = queue.length >= maxSlots;

  const shedPlaced = hasPlacedAgingShed(state);

  const merged = getMergedInventory(state);

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

  const firstEmptySlotIndex = Math.min(queue.length, Math.max(0, maxSlots - 1));

  const effectiveSlotIndex = useMemo(() => {
    const base = selectedSlotIndex ?? firstEmptySlotIndex;
    return Math.min(Math.max(base, 0), Math.max(0, maxSlots - 1));
  }, [selectedSlotIndex, firstEmptySlotIndex, maxSlots]);

  const selectedJob = queue[effectiveSlotIndex];

  const applyOutputGroupSelection = useCallback(
    (group: FermentationOutputGroup) => {
      setSelectedSignature(group.signature);
      if (typeof window !== "undefined") {
        localStorage.setItem(OUTPUT_STORAGE_KEY, group.signature);
      }

      if (group.recipeIds.length === 1) {
        setSelectedRecipeId(group.recipeIds[0]);
        return;
      }

      const stored =
        typeof window !== "undefined"
          ? (localStorage.getItem(
              RECIPE_STORAGE_KEY,
            ) as FermentationRecipeName | null)
          : null;

      if (stored && group.recipeIds.includes(stored)) {
        setSelectedRecipeId(stored);
      } else {
        setSelectedRecipeId(undefined);
      }
    },
    [],
  );

  const handleOutputChange = useCallback(
    (sig: string) => {
      setStartError(undefined);

      const group = findFermentationGroupByStoredSignature(groups, sig);
      if (!group) {
        if (typeof window !== "undefined") {
          localStorage.removeItem(OUTPUT_STORAGE_KEY);
        }

        const fallback = groups[0];
        if (fallback) {
          applyOutputGroupSelection(fallback);
        } else {
          setSelectedSignature(undefined);
          setSelectedRecipeId(undefined);
        }
        return;
      }

      applyOutputGroupSelection(group);
    },
    [applyOutputGroupSelection, groups],
  );

  const selectVariant = (recipeId: FermentationRecipeName) => {
    setStartError(undefined);
    setSelectedRecipeId(recipeId);

    if (typeof window !== "undefined") {
      localStorage.setItem(RECIPE_STORAGE_KEY, recipeId);
    }
  };

  const handleStart = (recipeId: FermentationRecipeName) => {
    if (!canStart) return;

    setStartError(undefined);

    try {
      gameService.send("fermentation.started", {
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
      gameService.send("fermentation.collected");
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

      return t("agingShed.fermentation.insufficientIngredient", { item: name });
    }

    return undefined;
  })();

  return (
    <>
      <InnerPanel className="mb-1">
        <Label type="default" className="text-xs mb-2 ml-1">
          {t("agingShed.fermentation.fermentationSlots")}
        </Label>
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
                    isSelected={effectiveSlotIndex === index}
                    onClick={() => setSelectedSlotIndex(index)}
                  />
                  <span className="text-xxs text-center leading-tight mt-0.5 px-0.5 max-w-[68px]">
                    {ready
                      ? t("agingShed.fermentation.ready")
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
                  isSelected={effectiveSlotIndex === index}
                  onClick={() => setSelectedSlotIndex(index)}
                >
                  <div className="w-full h-full border border-dashed border-[#181425]/35 opacity-60 rounded-sm" />
                </Box>
              </div>
            );
          })}
        </div>
      </InnerPanel>

      {selectedJob ? (
        <FermentationRackInProgress
          job={selectedJob}
          now={now}
          canCollect={canCollect}
          collectError={collectError}
          onCollect={handleCollect}
        />
      ) : (
        <FermentationRackEmpty
          gameState={state}
          selectedSignature={selectedSignature}
          selectedRecipeId={selectedRecipeId}
          onSelectOutput={handleOutputChange}
          onSelectVariant={selectVariant}
          onStart={handleStart}
          startDisabled={!canStart}
          validationMessage={validationMessage}
          startError={startError}
        />
      )}
    </>
  );
};
