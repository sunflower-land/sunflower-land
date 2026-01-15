import React, { useContext, useState } from "react";
import { useSelector } from "@xstate/react";

import { Modal } from "components/ui/Modal";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { OuterPanel, Panel } from "components/ui/Panel";
import { SplitScreenView } from "components/ui/SplitScreenView";
import { CraftingRequirements } from "components/ui/layouts/CraftingRequirements";
import { Box } from "components/ui/Box";
import { Button } from "components/ui/Button";
import vipIcon from "assets/icons/vip.webp";

import { Context } from "features/game/GameProvider";
import { BuildingProduct, InventoryItemName } from "features/game/types/game";
import {
  FISH_PROCESSING_TIME_SECONDS,
  getFishProcessingRequirements,
  isProcessedFood,
} from "features/game/types/fishProcessing";
import { ProcessedFood } from "features/game/types/processedFood";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { hasVipAccess } from "features/game/lib/vipAccess";
import { MAX_FISH_PROCESSING_SLOTS } from "features/game/events/landExpansion/processResource";
import { ITEM_DETAILS } from "features/game/types/images";
import { SUNNYSIDE } from "assets/sunnyside";
import { InProgressInfo } from "../InProgressInfo";
import { Queue } from "../Queue";
import { Label } from "components/ui/Label";
import process from "assets/icons/process.webp";
import { NPC_WEARABLES } from "lib/npcs";
import { MachineState } from "features/game/lib/gameMachine";
import { ModalOverlay } from "components/ui/ModalOverlay";
import { ModalContext } from "features/game/components/modal/ModalProvider";
import { getKeys } from "features/game/lib/crafting";

interface Props {
  isOpen: boolean;
  buildingId: string;
  onClose: () => void;
  onProcess: (item: ProcessedFood) => void;
  onCollect: () => void;
  onInstantProcess: (gems: number) => void;
  processing?: BuildingProduct;
  queue: BuildingProduct[];
  ready: BuildingProduct[];
}

const PROCESSED_ITEMS: ProcessedFood[] = getKeys(FISH_PROCESSING_TIME_SECONDS);

const _isVIP = (state: MachineState) =>
  hasVipAccess({ game: state.context.state });
const _state = (state: MachineState) => state.context.state;

export const FishMarketModal: React.FC<Props> = ({
  buildingId,
  isOpen,
  onClose,
  onProcess,
  onCollect,
  onInstantProcess,
  processing,
  queue,
  ready,
}) => {
  const { t } = useAppTranslation();
  const { gameService } = useContext(Context);
  const { openModal } = useContext(ModalContext);
  const isVIP = useSelector(gameService, _isVIP);
  const state = useSelector(gameService, _state);

  const season = state.season.season;
  const inventory = state.inventory;

  const [selected, setSelected] = useState<ProcessedFood>(PROCESSED_ITEMS[0]);
  const [showQueueInformation, setShowQueueInformation] = useState(false);

  const requirements = getFishProcessingRequirements({
    item: selected,
    season,
  });

  const lessIngredients = () => {
    return Object.entries(requirements).some(([name, amount]) =>
      amount.greaterThan(inventory[name as InventoryItemName] ?? 0),
    );
  };

  const handleAddToQueue = () => {
    if (!isVIP) {
      setShowQueueInformation(true);
      return;
    }

    if (!isProcessedFood(selected)) return;

    onProcess(selected);
  };

  const availableSlots = isVIP ? MAX_FISH_PROCESSING_SLOTS : 1;

  const totalQueued = ready.length + queue.length + (processing ? 1 : 0);
  const isQueueFull = totalQueued >= availableSlots;

  const totalSeconds = isProcessedFood(selected)
    ? FISH_PROCESSING_TIME_SECONDS[selected]
    : 0;

  return (
    <Modal show={isOpen} onHide={onClose}>
      <CloseButtonPanel
        tabs={[
          { id: "fishMarket", icon: SUNNYSIDE.icons.fish, name: "Fish Market" },
        ]}
        bumpkinParts={NPC_WEARABLES.neville}
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
              showSeason={isProcessedFood(selected)}
              hideDescription
              requirements={{
                resources: requirements,
                timeSeconds: totalSeconds,
              }}
              actionView={
                <div className="flex flex-col gap-1">
                  {isProcessedFood(selected) && (
                    <Button
                      disabled={lessIngredients() || isQueueFull}
                      className="text-xxs sm:text-sm whitespace-nowrap"
                      onClick={
                        processing
                          ? handleAddToQueue
                          : () => onProcess(selected)
                      }
                    >
                      {processing ? t("recipes.addToQueue") : "Process"}
                    </Button>
                  )}
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
              }
            />
          }
          content={
            <div className="flex flex-col w-full">
              {processing && (
                <InProgressInfo
                  product={processing}
                  onClose={onClose}
                  onInstantReady={onInstantProcess}
                  state={state}
                />
              )}
              {processing && isVIP && (
                <Queue
                  buildingName="Fish Market"
                  buildingId={buildingId as string}
                  product={processing}
                  queue={queue}
                  readyProducts={ready}
                  onClose={onClose}
                />
              )}
              <div className="flex flex-col gap-2">
                <div>
                  <Label type="default" icon={process} className="ml-1">
                    {t("processedResources")}
                  </Label>
                  <div className="flex flex-wrap sm:justify-start mt-1">
                    {PROCESSED_ITEMS.map((item) => (
                      <Box
                        key={item}
                        image={ITEM_DETAILS[item].image}
                        isSelected={item === selected}
                        onClick={() => setSelected(item)}
                        count={inventory[item]}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          }
        />
      </CloseButtonPanel>
      <ModalOverlay
        show={showQueueInformation}
        onBackdropClick={() => setShowQueueInformation(false)}
      >
        <Panel>
          <div className="p-2 text-sm">
            <p className="mb-1.5">{t("recipes.vipCookingQueue")}</p>
          </div>
          <div className="flex space-x-1 justify-end">
            <Button onClick={() => setShowQueueInformation(false)}>
              {t("close")}
            </Button>
            <Button
              className="relative"
              onClick={() => {
                onClose();
                openModal("BUY_BANNER");
              }}
            >
              <img
                src={vipIcon}
                alt="VIP"
                className="absolute w-6 sm:w-4 -top-[1px] -right-[2px]"
              />
              <span>{t("upgrade")}</span>
            </Button>
          </div>
        </Panel>
      </ModalOverlay>
    </Modal>
  );
};
