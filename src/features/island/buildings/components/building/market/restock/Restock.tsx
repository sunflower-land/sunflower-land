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
import { FullRestockModal } from "./FullRestockModal";
import { ShipmentRestockModal } from "./ShipmentRestockModal";
import { EnhancedRestockModal } from "./EnhancedRestockModal";
import { Label } from "components/ui/Label";

export const Restock: React.FC<{ npc: RestockNPC }> = ({ npc }) => {
  const { t } = useAppTranslation();
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);

  const [showConfirm, setShowConfirm] = useState(false);

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
      <Button className="mt-1 relative" onClick={showConfirmModal}>
        <div className="flex items-center h-4 ">
          <p>{t("restock")}</p>
          <img
            src={ITEM_DETAILS["Gem"].image}
            className="h-5 absolute right-1 top-1"
          />
        </div>
      </Button>
      <Modal show={showConfirm} onHide={hideConfirmModal}>
        <Panel className="sm:w-4/5 m-auto" bumpkinParts={NPC_WEARABLES[npc]}>
          {hasEnhancedRestockAccess ? (
            <RestockSelectionModal npc={npc} />
          ) : (
            <FullRestockModal onClose={hideConfirmModal} />
          )}
        </Panel>
      </Modal>
    </>
  );
};

const RestockSelectionModal: React.FC<{
  npc: RestockNPC;
}> = ({ npc }) => {
  const { t } = useAppTranslation();
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);

  const [showConfirm, setShowConfirm] = useState(false);
  const [showEnhancedConfirm, setShowEnhancedConfirm] = useState(false);
  const { shopName, gemPrice } = RestockItems[npc];
  const shipmentAt = useCountdown(
    nextShipmentAt({ game: gameState.context.state }),
  );

  const { ...shipmentTime } = shipmentAt;

  return (
    <>
      {!showEnhancedConfirm && !showConfirm && (
        <>
          <div className="flex flex-col p-2 items-start">
            <Label type="default" className="mb-2" icon={stockIcon}>
              {t("restock")}
            </Label>
            <span className="mb-1">{`Looks like you have ran out of stock!`}</span>
            <span>{`Please choose your restock option:`}</span>
          </div>
          <div className="flex justify-content-around space-x-1">
            <Button
              className="mt-1 relative"
              onClick={() => setShowEnhancedConfirm(true)}
            >
              <div className="flex flex-row h-auto items-center justify-between">
                <div className="flex mr-1">
                  {t("restock.category", { shopName })}
                </div>
                <div className="flex items-center mr-3">
                  <p className="mr-1">{gemPrice}</p>
                  <img src={ITEM_DETAILS["Gem"].image} className="h-5" />
                </div>
              </div>
            </Button>
            <Button
              className="mt-1 relative"
              onClick={() => setShowConfirm(true)}
            >
              <div className="flex flex-row h-auto items-center justify-between">
                <div className="flex mr-1">{t("restock.all")}</div>
                <div className="flex items-center mr-5">
                  <p className="mr-1">{`20`}</p>
                  <img src={ITEM_DETAILS["Gem"].image} className="h-5" />
                </div>
              </div>
            </Button>
          </div>
        </>
      )}
      {showEnhancedConfirm && (
        <EnhancedRestockModal
          onClose={() => setShowEnhancedConfirm(false)}
          shipmentTime={shipmentTime}
          npc={npc}
        />
      )}
      {showConfirm && (
        <FullRestockModal
          onClose={() => setShowConfirm(false)}
          shipmentTime={shipmentTime}
        />
      )}
    </>
  );
};
