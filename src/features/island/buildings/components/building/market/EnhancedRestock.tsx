import React, { useContext, useState } from "react";
import { Button } from "components/ui/Button";
import { ITEM_DETAILS } from "features/game/types/images";
import { Context } from "features/game/GameProvider";
import { useActor } from "@xstate/react";
import { ModalContext } from "features/game/components/modal/ModalProvider";
import stockIcon from "assets/icons/stock.webp";
import { gameAnalytics } from "lib/gameAnalytics";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { NPC_WEARABLES } from "lib/npcs";
import { BB_TO_GEM_RATIO } from "features/game/types/game";
import { hasFeatureAccess } from "lib/flags";
import { TimerDisplay } from "features/retreat/components/auctioneer/AuctionDetails";
import { useCountdown } from "lib/utils/hooks/useCountdown";
import {
  canRestockShipment,
  nextShipmentAt,
  SHIPMENT_STOCK,
} from "features/game/events/landExpansion/shipmentRestocked";
import { Label } from "components/ui/Label";
import { Modal } from "components/ui/Modal";
import { Panel } from "components/ui/Panel";
import confetti from "canvas-confetti";
import { Box } from "components/ui/Box";
import Decimal from "decimal.js-light";
import { INITIAL_STOCK, StockableName } from "features/game/lib/constants";
import { TREASURE_TOOLS, WORKBENCH_TOOLS } from "features/game/types/tools";
import { SEEDS } from "features/game/types/seeds";
import { CROP_LIFECYCLE } from "features/island/plots/lib/plant";
import {
  RestockItems,
  RestockNPC,
} from "features/game/events/landExpansion/enhancedRestock";

export const EnhancedRestock: React.FC<{ npc: RestockNPC }> = ({ npc }) => {
  const { t } = useAppTranslation();
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);

  const [showConfirm, setShowConfirm] = useState(false);

  const hasGemExperiment = hasFeatureAccess(
    gameState.context.state,
    "GEM_BOOSTS",
  );

  const shipmentAt = useCountdown(
    nextShipmentAt({ game: gameState.context.state }),
  );

  const { ...shipmentTime } = shipmentAt;
  const shipmentIsReady = canRestockShipment({ game: gameState.context.state });

  const showShipment = hasGemExperiment && shipmentIsReady;

  if (showShipment) {
    return (
      <>
        <Modal show={showConfirm} onHide={() => setShowConfirm(false)}>
          <Panel className="sm:w-4/5 m-auto">
            <ExperimentRestockModal
              onClose={() => setShowConfirm(false)}
              npc={npc}
            />
          </Panel>
        </Modal>
        <Button className="relative" onClick={() => setShowConfirm(true)}>
          <div className="flex items-center h-4 ">
            <p>{t("restock")}</p>
            <img src={stockIcon} className="h-6 absolute right-1 top-0" />
          </div>
        </Button>
      </>
    );
  }

  if (hasGemExperiment) {
    return (
      <>
        <div className="flex justify-center items-center">
          {/* <img src={stockIcon} className="h-5 mr-1" /> */}
          <p className="text-xxs">{t("gems.nextFreeShipment")}</p>
        </div>
        <div className="flex justify-center items-center">
          <img src={stockIcon} className="h-5 mr-1" />
          <TimerDisplay time={shipmentTime} />
        </div>
        <div className="my-1 flex flex-col mb-1 flex-1 items-center justify-end">
          <div className="flex items-center"></div>
        </div>
        <Button className="mt-1 relative" onClick={() => setShowConfirm(true)}>
          <div className="flex items-center h-4 ">
            <p className="mr-1">{`${t("restock")}: ${RestockItems[npc].gemPrice}`}</p>
            <img
              src={ITEM_DETAILS["Gem"].image}
              className="h-5 absolute right-1 top-1"
            />
          </div>
        </Button>

        <Modal show={showConfirm} onHide={() => setShowConfirm(false)}>
          <Panel className="sm:w-4/5 m-auto" bumpkinParts={NPC_WEARABLES.betty}>
            <ExperimentRestockModal
              onClose={() => setShowConfirm(false)}
              npc={npc}
            />
          </Panel>
        </Modal>
      </>
    );
  }

  return (
    <>
      <Button className="mt-1 relative" onClick={() => setShowConfirm(true)}>
        <div className="flex items-center h-4 ">
          <p>{t("restock")}</p>
          <img
            src={ITEM_DETAILS["Gem"].image}
            className="h-5 absolute right-1 top-1"
          />
        </div>
      </Button>

      <Modal show={showConfirm} onHide={() => setShowConfirm(false)}>
        <Panel className="sm:w-4/5 m-auto" bumpkinParts={NPC_WEARABLES.betty}>
          <RestockModal onClose={() => setShowConfirm(false)} npc={npc} />
        </Panel>
      </Modal>
    </>
  );
};

interface RestockModalProps {
  onClose: () => void;
  shipmentTime?: {
    hours: number;
    minutes: number;
    seconds: number;
  };
  npc: RestockNPC;
}

const RestockModal: React.FC<RestockModalProps> = ({
  onClose,
  shipmentTime,
  npc,
}) => {
  const { t } = useAppTranslation();
  const { openModal } = useContext(ModalContext);

  const { gameService, showAnimations } = useContext(Context);
  const [gameState] = useActor(gameService);

  const canRestock = gameState.context.state.inventory["Gem"]?.gte(20);

  const handleRestock = () => {
    if (!canRestock) {
      openModal("BUY_GEMS");
      return;
    }

    gameService.send("shops.restocked.enhanced", {
      npc,
    });

    gameAnalytics.trackSink({
      currency: "Gem",
      amount: 1 * BB_TO_GEM_RATIO,
      item: "Stock",
      type: "Fee",
    });

    if (showAnimations) confetti();
    onClose();
  };

  const getRestockAmount = (item: StockableName, amount: Decimal): Decimal => {
    const remainingStock = gameState.context.state.stock[item];

    // If there's no stock left
    if (!remainingStock) {
      // return total stock amount
      return amount;
    } else {
      // else return difference between total and remaining stock
      return amount.sub(remainingStock);
    }
  };
  const restockTools = Object.entries(INITIAL_STOCK(gameState.context.state))
    .filter((item) => {
      if (npc === "blacksmith") {
        return item[0] in WORKBENCH_TOOLS;
      }
      if (npc === "jafar") {
        return item[0] in TREASURE_TOOLS;
      }
    })
    .filter(([item, amount]) => {
      const restockAmount = getRestockAmount(item as StockableName, amount);
      return restockAmount.gt(0);
    });

  const restockSeeds = Object.entries(INITIAL_STOCK(gameState.context.state))
    .filter((item) => npc === "betty" && item[0] in SEEDS())
    .filter(([item, amount]) => {
      const restockAmount = getRestockAmount(item as StockableName, amount);
      return restockAmount.gt(0);
    });

  const getShopName = () => {
    switch (npc) {
      case "betty":
        return "market";
      case "blacksmith":
        return "workbench";
      case "jafar":
        return "treasure shop";
    }
  };

  const { gemPrice } = RestockItems[npc];

  return (
    <>
      <div className="p-1">
        <Label type="danger" className="mb-2" icon={stockIcon}>
          {t("gems.outOfstock")}
        </Label>
        {shipmentTime && (
          <div className="flex flex-wrap mb-2">
            <span className="mr-2">{t("gems.nextFreeShipment")}</span>
            <TimerDisplay time={shipmentTime} />
          </div>
        )}
        <p className="mb-1">
          {t("gems.buyReplenish.enhanced", {
            shopName: getShopName() ?? "",
            gemPrice,
          })}
        </p>
      </div>
      <div className="mt-1 h-40 overflow-y-auto overflow-x-hidden scrollable pl-1">
        {restockTools.length > 0 && (
          <>
            <Label
              icon={ITEM_DETAILS.Axe.image}
              type="default"
              className="ml-2 mb-1"
            >
              {t("tools")}
            </Label>
            <div className="flex flex-wrap mb-2">
              {restockTools.map(([item, amount]) => {
                const restockAmount = getRestockAmount(
                  item as StockableName,
                  amount,
                );
                return (
                  <Box
                    key={item}
                    count={restockAmount}
                    image={ITEM_DETAILS[item as StockableName].image}
                  />
                );
              })}
            </div>
          </>
        )}
        {restockSeeds.length > 0 && (
          <>
            <Label
              icon={CROP_LIFECYCLE.Sunflower.seed}
              type="default"
              className="ml-2 mb-1"
            >
              {t("seeds")}
            </Label>
            <div className="flex flex-wrap mb-2">
              {restockSeeds.map(([item, amount]) => {
                const restockAmount = getRestockAmount(
                  item as StockableName,
                  amount,
                );
                return (
                  <Box
                    key={item}
                    count={restockAmount}
                    image={ITEM_DETAILS[item as StockableName].image}
                  />
                );
              })}
            </div>
          </>
        )}
      </div>
      <p className="text-xs p-1 pb-1.5 italic">{t("gems.restockToMaxStock")}</p>
      <div className="flex justify-content-around mt-2 space-x-1">
        <Button onClick={onClose}>{t("cancel")}</Button>
        <Button className="relative" onClick={handleRestock}>
          <div className="flex items-center h-4 ">
            <p className="mr-1">{`${t("restock")}: ${RestockItems[npc].gemPrice}`}</p>
            <img
              src={ITEM_DETAILS["Gem"].image}
              className="h-5 absolute right-1 top-1"
            />
          </div>
        </Button>
      </div>
    </>
  );
};

const ExperimentRestockModal: React.FC<{
  onClose: () => void;
  npc: RestockNPC;
}> = ({ onClose, npc }) => {
  const { t } = useAppTranslation();

  const { gameService, showAnimations } = useContext(Context);
  const [gameState] = useActor(gameService);

  const hasGemExperiment = hasFeatureAccess(
    gameState.context.state,
    "GEM_BOOSTS",
  );
  const shipmentIsReady = canRestockShipment({ game: gameState.context.state });
  const showShipment = hasGemExperiment && shipmentIsReady;

  const replenish = () => {
    gameService.send("shipment.restocked");

    if (showAnimations) confetti();
    onClose();
  };

  const shipmentAt = useCountdown(
    nextShipmentAt({ game: gameState.context.state }),
  );

  const getShipmentAmount = (item: StockableName, amount: number): Decimal => {
    const totalStock = INITIAL_STOCK(gameState.context.state)[item];
    const remainingStock =
      gameState.context.state.stock[item] ?? new Decimal(0);
    // If shipment amount will exceed total stock
    if (remainingStock.add(amount).gt(totalStock)) {
      // return the difference between total and remaining stock
      return totalStock.sub(remainingStock);
    } else {
      // else return shipment stock
      return new Decimal(amount);
    }
  };

  const restockTools = Object.entries(SHIPMENT_STOCK)
    .filter((item) => item[0] in { ...WORKBENCH_TOOLS, ...TREASURE_TOOLS })
    .filter(([item, amount]) => {
      const shipmentAmount = getShipmentAmount(item as StockableName, amount);
      return shipmentAmount.gt(0);
    });

  const restockSeeds = Object.entries(SHIPMENT_STOCK)
    .filter((item) => item[0] in SEEDS())
    .filter(([item, amount]) => {
      const shipmentAmount = getShipmentAmount(item as StockableName, amount);
      return shipmentAmount.gt(0);
    });

  const restockIsEmpty = [...restockSeeds, ...restockTools].length <= 0;

  if (showShipment) {
    return (
      <>
        {restockIsEmpty ? (
          <div className="p-1">
            <Label type="danger" className="mb-2" icon={stockIcon}>
              {t("gems.noShipment")}
            </Label>
            <p className="text-sm mb-2">{t("gems.buyStock")}</p>
          </div>
        ) : (
          <div className="p-1">
            <Label type="default" className="mb-2" icon={stockIcon}>
              {t("gems.shipment.arrived")}
            </Label>
            <p className="text-sm mb-2">{t("gems.shipment.success")}</p>
          </div>
        )}
        <div className="mt-1 h-40 overflow-y-auto overflow-x-hidden scrollable pl-1">
          {restockTools.length > 0 && (
            <Label
              icon={ITEM_DETAILS.Axe.image}
              type="default"
              className="ml-2 mb-1"
            >
              {t("tools")}
            </Label>
          )}
          <div className="flex flex-wrap mb-2">
            {restockTools.map(([item, amount]) => {
              const shipmentAmount = getShipmentAmount(
                item as StockableName,
                amount,
              );
              return (
                <Box
                  key={item}
                  count={shipmentAmount}
                  image={ITEM_DETAILS[item as StockableName].image}
                />
              );
            })}
          </div>
          {restockSeeds.length > 0 && (
            <Label
              icon={CROP_LIFECYCLE.Sunflower.seed}
              type="default"
              className="ml-2 mb-1"
            >
              {t("seeds")}
            </Label>
          )}
          <div className="flex flex-wrap mb-2">
            {restockSeeds.map(([item, amount]) => {
              const shipmentAmount = getShipmentAmount(
                item as StockableName,
                amount,
              );
              return (
                <Box
                  key={item}
                  count={shipmentAmount}
                  image={ITEM_DETAILS[item as StockableName].image}
                />
              );
            })}
          </div>
        </div>
        {!restockIsEmpty && (
          <>
            <p className="text-xs p-1 pb-1.5 italic">
              {t("gems.restockToMaxStock")}
            </p>
            <p className="text-xs p-1 pb-1.5 italic">
              {`(${t("gems.shipment.useGems")})`}
            </p>
          </>
        )}

        <div className="flex">
          <Button className="mr-1" onClick={onClose}>
            {t("close")}
          </Button>
          <Button onClick={replenish} disabled={restockIsEmpty}>
            {t("restock")}
          </Button>
        </div>
      </>
    );
  }

  const { ...shipmentTime } = shipmentAt;

  return (
    <RestockModal shipmentTime={shipmentTime} onClose={onClose} npc={npc} />
  );
};
