import React, { useContext, useEffect, useMemo, useState } from "react";
import { useSelector } from "@xstate/react";
import classNames from "classnames";
import Decimal from "decimal.js-light";
import { v4 as uuidv4 } from "uuid";
import confetti from "canvas-confetti";

import { Box } from "components/ui/Box";
import { InnerPanel } from "components/ui/Panel";
import { Label } from "components/ui/Label";
import { Context } from "features/game/GameProvider";
import { hasPlacedAgingShed } from "features/game/events/landExpansion/hasPlacedAgingShed";
import {
  getAgingSaltCost,
  getAgingSlotCount,
  getFishBaseXP,
} from "features/game/types/aging";
import type { FishName } from "features/game/types/fishing";
import type { GameState, Inventory } from "features/game/types/game";
import { ITEM_DETAILS } from "features/game/types/images";
import {
  getBasketItems,
  getChestItems,
} from "features/island/hud/components/inventory/utils/inventory";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { useNow } from "lib/utils/hooks/useNow";
import { useVisiting } from "lib/utils/visitUtils";
import { secondsToString } from "lib/utils/time";
import { AgingRackEmpty } from "./AgingRackEmpty";
import { AgingRackInProgress } from "./AgingRackInProgress";

function getMergedInventory(state: GameState): Inventory {
  return {
    ...getBasketItems(state.inventory),
    ...getChestItems(state),
  };
}

export const AgingRackPanel: React.FC = () => {
  const { gameService, showAnimations } = useContext(Context);
  const { t } = useAppTranslation();
  const { isVisiting } = useVisiting();

  const state = useSelector(gameService, (s) => s.context.state);
  const queue = state.agingShed.racks.aging;

  const agingClockEndAt = useMemo(() => {
    if (queue.length === 0) return undefined;
    return Math.max(...queue.map((slot) => slot.readyAt));
  }, [queue]);

  const now = useNow({ live: queue.length > 0, autoEndAt: agingClockEndAt });

  const [selectedSlotIndex, setSelectedSlotIndex] = useState<number | null>(
    null,
  );
  const [selectedFish, setSelectedFish] = useState<FishName | undefined>();
  const [startError, setStartError] = useState<string | undefined>();
  const [collectError, setCollectError] = useState<string | undefined>();

  const maxSlots = getAgingSlotCount(state.agingShed.level);
  const slotsFull = queue.length >= maxSlots;
  const shedPlaced = hasPlacedAgingShed(state);
  const merged = useMemo(() => getMergedInventory(state), [state]);

  const readySlots = queue.filter((slot) => slot.readyAt <= now);
  const canCollect = !isVisiting && shedPlaced && readySlots.length > 0;

  const firstEmptySlotIndex = Math.min(queue.length, Math.max(0, maxSlots - 1));
  const effectiveSlotIndex = useMemo(() => {
    const base = selectedSlotIndex ?? firstEmptySlotIndex;
    return Math.min(Math.max(base, 0), Math.max(0, maxSlots - 1));
  }, [selectedSlotIndex, firstEmptySlotIndex, maxSlots]);

  const selectedSlot = queue[effectiveSlotIndex];

  const saltNeeded = selectedFish
    ? getAgingSaltCost(getFishBaseXP(selectedFish))
    : undefined;
  const hasSalt = saltNeeded
    ? (merged["Salt"] ?? new Decimal(0)).gte(saltNeeded)
    : false;
  const hasFish = selectedFish
    ? (merged[selectedFish] ?? new Decimal(0)).gte(1)
    : false;

  const canStart =
    !isVisiting &&
    shedPlaced &&
    selectedFish !== undefined &&
    !slotsFull &&
    hasSalt &&
    hasFish;

  const handleStart = () => {
    if (!canStart || !selectedFish) return;
    setStartError(undefined);
    try {
      gameService.send("agingRack.started", {
        fish: selectedFish,
        slotId: uuidv4().slice(0, 8),
      });
      gameService.send("SAVE");
    } catch (e) {
      setStartError(e instanceof Error ? e.message : String(e));
    }
  };

  const handleCollect = () => {
    setCollectError(undefined);
    try {
      gameService.send("agingRack.collected");
      gameService.send("SAVE");
    } catch (e) {
      setCollectError(e instanceof Error ? e.message : String(e));
    }
  };

  const lastCollect = state.agingShed.lastAgingCollect;

  useEffect(() => {
    if (!lastCollect?.length || !showAnimations) return;

    const gotPrime = lastCollect.some((r) => r.primeAged);
    if (gotPrime) {
      confetti();
    }
  }, [lastCollect, showAnimations]);

  const validationMessage = (() => {
    if (isVisiting) return undefined;
    if (!shedPlaced) return t("error.requiredBuildingNotExist");
    if (slotsFull) return t("error.noAvailableSlots");
    if (selectedFish && !hasSalt)
      return t("agingShed.agingRack.insufficientSalt");
    if (selectedFish && !hasFish) {
      const name =
        ITEM_DETAILS[selectedFish]?.translatedName ?? String(selectedFish);
      return t("agingShed.agingRack.insufficientFish", { item: name });
    }
    return undefined;
  })();

  return (
    <>
      <InnerPanel className="mb-1">
        <Label type="default" className="text-xs mb-2 ml-1">
          {t("agingShed.agingRack.agingSlots")}
        </Label>
        <div className="flex flex-wrap gap-1 px-1 pb-1 items-start">
          {Array.from({ length: maxSlots }).map((_, index) => {
            const isFilled = index < queue.length;
            const isInactiveEmpty = index > queue.length;

            if (isFilled) {
              const slot = queue[index];
              const ready = slot.readyAt <= now;
              const totalDuration = slot.readyAt - slot.startedAt;
              const elapsed = Math.min(now - slot.startedAt, totalDuration);
              const percentage =
                totalDuration > 0 ? (elapsed / totalDuration) * 100 : 100;
              const remainingSec = Math.max(0, (slot.readyAt - now) / 1000);
              const isSelected = effectiveSlotIndex === index;

              return (
                <Box
                  key={slot.id}
                  image={ITEM_DETAILS[slot.fish]?.image}
                  disabled={false}
                  hideCount
                  isSelected={isSelected}
                  onClick={() => setSelectedSlotIndex(index)}
                  progress={{
                    percentage,
                    type: "progress",
                    label: ready
                      ? "Ready"
                      : secondsToString(remainingSec, { length: "short" }),
                  }}
                />
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

      {selectedSlot ? (
        <AgingRackInProgress
          slot={selectedSlot}
          now={now}
          canCollect={canCollect}
          collectError={collectError}
          onCollect={handleCollect}
        />
      ) : (
        <AgingRackEmpty
          gameState={state}
          selectedFish={selectedFish}
          onSelectFish={setSelectedFish}
          onStart={handleStart}
          startDisabled={!canStart}
          validationMessage={validationMessage}
          startError={startError}
        />
      )}
    </>
  );
};
