import { useActor } from "@xstate/react";
import { Button } from "components/ui/Button";
import { Modal } from "components/ui/Modal";
import { Panel } from "components/ui/Panel";
import {
  RestockItems,
  RestockNPC,
} from "features/game/events/landExpansion/enhancedRestock";
import {
  nextShipmentAt,
  canRestockShipment,
} from "features/game/events/landExpansion/shipmentRestocked";
import { Context } from "features/game/GameProvider";
import { ITEM_DETAILS } from "features/game/types/images";
import { hasFeatureAccess } from "lib/flags";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { useCountdown } from "lib/utils/hooks/useCountdown";
import React, { useContext, useState } from "react";

import stockIcon from "assets/icons/stock.webp";
import { TimerDisplay } from "features/retreat/components/auctioneer/AuctionDetails";
import { NPC_WEARABLES } from "lib/npcs";
import { EnhancedRestockModal } from "./EnhancedRestockModal";
import { FullRestockModal } from "./FullRestockModal";
import { ShipmentRestockModal } from "./ShipmentRestockModal";

export const Restock: React.FC<{ npc: RestockNPC }> = ({ npc }) => {
  const { t } = useAppTranslation();
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);

  const [showConfirm, setShowConfirm] = useState(false);
  const [showEnhancedConfirm, setShowEnhancedConfirm] = useState(false);

  const hasGemExperiment = hasFeatureAccess(
    gameState.context.state,
    "GEM_BOOSTS",
  );

  const hasEnhancedRestockAccess = hasFeatureAccess(
    gameState.context.state,
    "ENHANCED_RESTOCK",
  );

  const shipmentAt = useCountdown(
    nextShipmentAt({ game: gameState.context.state }),
  );

  const { ...shipmentTime } = shipmentAt;
  const shipmentIsReady = canRestockShipment({ game: gameState.context.state });

  const showShipment = hasGemExperiment && shipmentIsReady;
  const { category, gemPrice } = RestockItems[npc];

  const hideConfirmModal = () => setShowConfirm(false);
  const showConfirmModal = () => setShowConfirm(true);

  if (showShipment) {
    return (
      <>
        <Button className="relative" onClick={showConfirmModal}>
          <div className="flex items-center h-4">
            <p>{t("restock")}</p>
            <img src={stockIcon} className="h-6 absolute right-1 top-0" />
          </div>
        </Button>
        <Modal show={showConfirm} onHide={hideConfirmModal}>
          <Panel className="sm:w-4/5 m-auto">
            <ShipmentRestockModal onClose={hideConfirmModal} />
          </Panel>
        </Modal>
      </>
    );
  }

  return (
    <>
      {hasGemExperiment && (
        <>
          <div className="flex justify-center items-center">
            <p className="text-xxs">{t("gems.nextFreeShipment")}</p>
          </div>
          <div className="flex justify-center items-center mb-2">
            <img src={stockIcon} className="h-5 mr-1" />
            <TimerDisplay time={shipmentTime} />
          </div>
        </>
      )}
      <div className="flex space-x-1 sm:space-x-0 sm:space-y-1 sm:flex-col w-full">
        {hasEnhancedRestockAccess && (
          <>
            <Button
              className="mt-1 relative"
              onClick={() => setShowEnhancedConfirm(true)}
            >
              <div className="flex flex-row h-auto items-center justify-between">
                <div className="flex mr-1">
                  {t("restock.category", { category })}
                </div>
                <div className="flex items-center mr-3">
                  <p className="mr-1">{gemPrice}</p>
                  <img src={ITEM_DETAILS["Gem"].image} className="h-5" />
                </div>
              </div>
            </Button>
            <Modal
              show={showEnhancedConfirm}
              onHide={() => setShowEnhancedConfirm(false)}
            >
              <Panel
                className="sm:w-4/5 m-auto"
                bumpkinParts={NPC_WEARABLES[npc]}
              >
                <EnhancedRestockModal
                  onClose={() => setShowEnhancedConfirm(false)}
                  npc={npc}
                />
              </Panel>
            </Modal>
          </>
        )}
        <Button className="mt-1 relative" onClick={showConfirmModal}>
          <div className="flex flex-row h-auto items-center justify-between">
            <div className="flex mr-1">{t("restock.all")}</div>
            <div className="flex items-center">
              <p className="mr-1">{`20`}</p>
              <img src={ITEM_DETAILS["Gem"].image} className="h-5" />
            </div>
          </div>
        </Button>
        <Modal show={showConfirm} onHide={hideConfirmModal}>
          <Panel className="sm:w-4/5 m-auto" bumpkinParts={NPC_WEARABLES[npc]}>
            <FullRestockModal onClose={hideConfirmModal} />
          </Panel>
        </Modal>
      </div>
    </>
  );
};
