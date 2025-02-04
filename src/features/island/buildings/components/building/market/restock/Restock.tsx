import { Button } from "components/ui/Button";
import { Modal } from "components/ui/Modal";
import {
  RestockItems,
  RestockNPC,
} from "features/game/events/landExpansion/npcRestock";
import {
  nextShipmentAt,
  canRestockShipment,
} from "features/game/events/landExpansion/shipmentRestocked";
import { Context } from "features/game/GameProvider";
import { ITEM_DETAILS } from "features/game/types/images";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { useCountdown } from "lib/utils/hooks/useCountdown";
import React, { useContext, useState } from "react";

import stockIcon from "assets/icons/stock.webp";
import { TimerDisplay } from "features/retreat/components/auctioneer/AuctionDetails";
import { NPC_WEARABLES } from "lib/npcs";
import { FullRestockModal } from "./FullRestockModal";
import { NPCRestockModal } from "./NPCRestockModal";
import { Label } from "components/ui/Label";
import { getKeys } from "features/game/types/decorations";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { NPCIcon } from "features/island/bumpkin/components/NPC";
import { ShipmentRestockModal } from "./ShipmentRestockModal";
import { CROP_LIFECYCLE } from "features/island/plots/lib/plant";
import { SUNNYSIDE } from "assets/sunnyside";
import { capitalize } from "lodash";
import { MachineState } from "features/game/lib/gameMachine";
import { useSelector } from "@xstate/react";

const _state = (state: MachineState) => state.context.state;

export const Restock: React.FC<{ npc: RestockNPC }> = ({ npc }) => {
  const { t } = useAppTranslation();
  const { gameService } = useContext(Context);
  const state = useSelector(gameService, _state);

  const [showConfirm, setShowConfirm] = useState(false);

  const shipmentAt = useCountdown(nextShipmentAt());

  const { ...shipmentTime } = shipmentAt;
  const shipmentIsReady = canRestockShipment({ game: state });

  const showShipment = shipmentIsReady;

  const hideConfirmModal = () => setShowConfirm(false);
  const showConfirmModal = () => setShowConfirm(true);

  return (
    <>
      {!shipmentIsReady && (
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
          {showShipment ? (
            <img src={stockIcon} className="h-5 absolute right-1 top-1" />
          ) : (
            <img
              src={ITEM_DETAILS["Gem"].image}
              className="h-5 absolute right-1 top-1"
            />
          )}
        </div>
      </Button>
      <Modal show={showConfirm} onHide={hideConfirmModal}>
        <CloseButtonPanel
          className="sm:w-4/5 m-auto"
          onClose={hideConfirmModal}
        >
          <RestockSelectionModal npc={npc} showShipment={showShipment} />
        </CloseButtonPanel>
      </Modal>
    </>
  );
};

const _island = (state: MachineState) => state.context.state.island.type;

const RestockSelectionModal: React.FC<{
  npc: RestockNPC;
  showShipment: boolean;
}> = ({ npc, showShipment }) => {
  const { gameService } = useContext(Context);
  const island = useSelector(gameService, _island);
  const { t } = useAppTranslation();

  const [showConfirm, setShowConfirm] = useState(false);
  const [showEnhancedConfirm, setShowEnhancedConfirm] = useState(false);
  const [showShipmentConfirm, setShowShipmentConfirm] = useState(false);
  const { shopName, gemPrice, categoryLabel } = RestockItems[npc];
  const { labelText, icon } = categoryLabel;
  const shipmentAt = useCountdown(nextShipmentAt());

  const { ...shipmentTime } = shipmentAt;

  return (
    <>
      {!showEnhancedConfirm && !showConfirm && !showShipmentConfirm && (
        <>
          <div className="flex flex-col mx-2 mt-1 items-start">
            <Label type="default" className="mb-2" icon={stockIcon}>
              {t("restock")}
            </Label>
            <p className="mb-1">
              {t("restock.outOfStock", { npc: capitalize(npc) })}
            </p>
          </div>
          <Button
            className="relative mt-1 justify-between"
            onClick={() => setShowShipmentConfirm(true)}
            disabled={!showShipment}
          >
            <p className="capitalize text-left p-1 mb-1">
              {t("restock.dailyShipment")}
            </p>
            <div className="flex w-full mb-1">
              <div className="pb-1 mr-2 w-11">
                <div className="absolute left-0">
                  <NPCIcon parts={NPC_WEARABLES.betty} />
                </div>
                <div className="absolute left-3">
                  <NPCIcon parts={NPC_WEARABLES.blacksmith} />
                </div>
                <div className="absolute left-6">
                  <NPCIcon parts={NPC_WEARABLES.jafar} />
                </div>
              </div>
              <div className="flex flex-row flex-wrap ml-7 mb-0.5">
                <Label
                  type="default"
                  icon={CROP_LIFECYCLE[island].Sunflower.seed}
                  className="mt-1 ml-1 capitalize"
                >
                  {t("basic.seeds")}
                </Label>
                <Label
                  type="default"
                  icon={CROP_LIFECYCLE[island].Carrot.seed}
                  className="mt-1 ml-1 capitalize"
                >
                  {t("medium.seeds")}
                </Label>
                <Label
                  type="default"
                  icon={SUNNYSIDE.tools.axe}
                  className="mt-1 ml-1 capitalize"
                >
                  {t("tools")}
                </Label>
                <Label
                  type="default"
                  icon={SUNNYSIDE.tools.sand_shovel}
                  className="mt-1 ml-1 capitalize"
                >
                  {`Sand Shovel`}
                </Label>
              </div>
              <Label type="success" className="absolute right-0 top-0 w-20 h-8">
                <p className="mr-4">{t("free")}</p>
                <img src={stockIcon} className="h-5 absolute right-1 top-0" />
              </Label>
            </div>
            {showShipment ? (
              <div className="text-xs text-left">
                {t("restock.shipmentArrived")}
              </div>
            ) : (
              <div className="px-1 text-xs flex flex-wrap mt-2">
                <span className="mr-2">{t("gems.nextFreeShipment")}</span>
                <TimerDisplay time={shipmentTime} />
                <img src={stockIcon} className="h-5 ml-1" />
              </div>
            )}
          </Button>
          <Button
            onClick={() => setShowEnhancedConfirm(true)}
            className="flex justify-between relative"
          >
            <p className="capitalize p-1 mb-1">
              {t("restock.shop", { shopName })}
            </p>
            <div className="flex w-full mb-1">
              <div className="pb-1 mr-2 w-11 relative">
                <NPCIcon parts={NPC_WEARABLES[npc]} />
              </div>
              <div className="flex flex-col ml-3 mt-2">
                <Label type="default" icon={icon} className="ml-1 capitalize">
                  {labelText}
                </Label>
              </div>
            </div>
            <Label type="warning" className="absolute right-0 top-0 w-20 h-8">
              <p className="mr-4">{gemPrice}</p>
              <img
                src={ITEM_DETAILS["Gem"].image}
                className="h-5 absolute right-1 top-0"
              />
            </Label>
          </Button>
          <Button
            className="relative mt-1 justify-between"
            onClick={() => setShowConfirm(true)}
          >
            <p className="capitalize p-1 mb-1 text-left">{t("restock.full")}</p>
            <div className="flex w-full mb-1">
              <div className="pb-1 mr-2 w-11">
                <div className="absolute left-0">
                  <NPCIcon parts={NPC_WEARABLES.betty} />
                </div>
                <div className="absolute left-3">
                  <NPCIcon parts={NPC_WEARABLES.blacksmith} />
                </div>
                <div className="absolute left-6">
                  <NPCIcon parts={NPC_WEARABLES.jafar} />
                </div>
              </div>
              <div className="flex flex-row flex-wrap ml-3 mb-0.5">
                {getKeys(RestockItems).map((npc) => {
                  const { labelText, icon } = RestockItems[npc].categoryLabel;
                  return (
                    <Label
                      key={npc}
                      type="default"
                      icon={icon}
                      className="mt-1 ml-1 capitalize"
                    >
                      {labelText}
                    </Label>
                  );
                })}
              </div>
              <Label type="warning" className="absolute right-0 top-0 w-20 h-8">
                <p className="mr-4">{20}</p>
                <img
                  src={ITEM_DETAILS["Gem"].image}
                  className="h-5 absolute right-1 top-0"
                />
              </Label>
            </div>
          </Button>
        </>
      )}
      {showEnhancedConfirm && (
        <NPCRestockModal
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
      {showShipmentConfirm && (
        <ShipmentRestockModal onClose={() => setShowShipmentConfirm(false)} />
      )}
    </>
  );
};
