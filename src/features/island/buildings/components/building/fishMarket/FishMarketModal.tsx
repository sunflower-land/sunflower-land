import React, { useContext, useState } from "react";
import { useActor } from "@xstate/react";
import Decimal from "decimal.js-light";

import { Modal } from "components/ui/Modal";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { OuterPanel } from "components/ui/Panel";
import { SplitScreenView } from "components/ui/SplitScreenView";
import { CraftingRequirements } from "components/ui/layouts/CraftingRequirements";
import { Box } from "components/ui/Box";
import { Label } from "components/ui/Label";
import { Button } from "components/ui/Button";
import { ResizableBar } from "components/ui/ProgressBar";

import { Context } from "features/game/GameProvider";
import { ProcessedProduct, InventoryItemName } from "features/game/types/game";
import {
  FISH_PROCESSING_TIME_SECONDS,
  getFishProcessingRequirements,
} from "features/game/types/fishProcessing";
import { ProcessedFood } from "features/game/types/processedFood";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { hasVipAccess } from "features/game/lib/vipAccess";
import { MAX_FISH_PROCESSING_SLOTS } from "features/game/events/landExpansion/processedFood";
import { useCountdown } from "lib/utils/hooks/useCountdown";
import { ITEM_DETAILS } from "features/game/types/images";
import { SUNNYSIDE } from "assets/sunnyside";
import { secondsToString } from "lib/utils/time";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onProcess: (item: ProcessedFood) => void;
  onCollect: () => void;
  processing?: ProcessedProduct;
  queue: ProcessedProduct[];
  ready: ProcessedProduct[];
}

const PROCESSED_ITEMS: ProcessedFood[] = [
  "Fish Flake",
  "Fish Stick",
  "Fish Oil",
];

export const FishMarketModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onProcess,
  onCollect,
  processing,
  queue,
  ready,
}) => {
  const { t } = useAppTranslation();
  const { gameService } = useContext(Context);
  const [
    {
      context: { state },
    },
  ] = useActor(gameService);

  const [selected, setSelected] = useState<ProcessedFood>(PROCESSED_ITEMS[0]);

  const season = state.season.season;
  const requirements = getFishProcessingRequirements({
    item: selected,
    season,
  });

  const lessIngredients = () =>
    Object.entries(requirements).some(([name, amount]) =>
      amount.greaterThan(state.inventory[name as InventoryItemName] ?? 0),
    );

  const availableSlots = hasVipAccess({ game: state })
    ? MAX_FISH_PROCESSING_SLOTS
    : 1;

  const totalQueued = ready.length + queue.length + (processing ? 1 : 0);
  const isQueueFull = totalQueued >= availableSlots;

  const { totalSeconds: secondsLeft } = useCountdown(processing?.readyAt ?? 0);
  const totalSeconds = processing
    ? (processing.readyAt - processing.startedAt) / 1000
    : FISH_PROCESSING_TIME_SECONDS;
  const percentage =
    processing && totalSeconds > 0
      ? Math.min(100, Math.max(0, 100 - (secondsLeft / totalSeconds) * 100))
      : 0;

  return (
    <Modal show={isOpen} onHide={onClose}>
      <CloseButtonPanel
        tabs={[{ icon: SUNNYSIDE.icons.fish, name: "Fish Market" }]}
        onClose={onClose}
        container={OuterPanel}
      >
        <SplitScreenView
          panel={
            <CraftingRequirements
              gameState={state}
              details={{
                item: selected,
              }}
              hideDescription
              requirements={{
                resources: requirements,
                timeSeconds: totalSeconds,
              }}
              actionView={
                <>
                  <div className="flex flex-col gap-1">
                    <Button
                      disabled={lessIngredients() || isQueueFull}
                      className="text-xxs sm:text-sm whitespace-nowrap"
                      onClick={() => onProcess(selected)}
                    >
                      {processing ? t("recipes.addToQueue") : "Process"}
                    </Button>
                    <Button
                      disabled={ready.length === 0}
                      className="text-xxs sm:text-sm whitespace-nowrap"
                      onClick={onCollect}
                    >
                      {t("collect")}
                    </Button>
                    {isQueueFull && (
                      <p className="text-xxs text-center">
                        {t("error.noAvailableSlots")}
                      </p>
                    )}
                  </div>
                </>
              }
            />
          }
          content={
            <div className="flex flex-col w-full">
              {processing && (
                <div className="flex flex-col mb-2 w-full">
                  <Label
                    className="mr-3 ml-2 mb-1"
                    icon={SUNNYSIDE.icons.stopwatch}
                    type="default"
                  >
                    {t("in.progress")}
                  </Label>
                  <div className="flex items-center gap-2">
                    <Box image={ITEM_DETAILS[processing.name].image} />
                    <div className="flex-1">
                      <ResizableBar percentage={percentage} type="progress" />
                      <span className="text-xxs sm:text-xs">
                        {secondsToString(Math.max(secondsLeft, 0), {
                          length: "medium",
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              )}
              <div className="flex items-center justify-between w-full">
                <Label type="default">{t("processedFoods")}</Label>
              </div>
              <div className="flex flex-wrap justify-center sm:justify-start mt-1">
                {PROCESSED_ITEMS.map((item) => (
                  <Box
                    key={item}
                    image={ITEM_DETAILS[item].image}
                    isSelected={item === selected}
                    onClick={() => setSelected(item)}
                    count={
                      new Decimal(
                        ready.filter(
                          (readyItem) => readyItem.name === item,
                        ).length,
                      )
                    }
                  />
                ))}
              </div>
            </div>
          }
        />
      </CloseButtonPanel>
    </Modal>
  );
};
