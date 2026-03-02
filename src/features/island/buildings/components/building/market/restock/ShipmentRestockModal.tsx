import { useActor } from "@xstate/react";
import confetti from "canvas-confetti";
import { Box } from "components/ui/Box";
import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";
import Decimal from "decimal.js-light";
import { SHIPMENT_STOCK } from "features/game/events/landExpansion/shipmentRestocked";
import { Context } from "features/game/GameProvider";
import { StockableName, INITIAL_STOCK } from "features/game/lib/constants";
import { ITEM_DETAILS } from "features/game/types/images";
import { SEEDS } from "features/game/types/seeds";
import { WORKBENCH_TOOLS, TREASURE_TOOLS } from "features/game/types/tools";
import { CROP_LIFECYCLE } from "features/island/plots/lib/plant";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import React, { useContext } from "react";
import stockIcon from "assets/icons/stock.webp";

export const ShipmentRestockModal: React.FC<{
  onClose: () => void;
}> = ({ onClose }) => {
  const { t } = useAppTranslation();

  const { gameService, showAnimations } = useContext(Context);
  const [gameState] = useActor(gameService);

  const replenish = () => {
    gameService.send({ type: "shipment.restocked" });

    if (showAnimations) confetti();
    onClose();
  };

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
    .filter((item) => item[0] in SEEDS)
    .filter(([item, amount]) => {
      const shipmentAmount = getShipmentAmount(item as StockableName, amount);
      return shipmentAmount.gt(0);
    });

  const restockIsEmpty = [...restockSeeds, ...restockTools].length <= 0;

  return (
    <>
      {restockIsEmpty ? (
        <div className="flex flex-col mx-2 mt-1 items-start">
          <Label type="danger" className="mb-2" icon={stockIcon}>
            {t("gems.noShipment")}
          </Label>
          <p className="text-sm mb-2">{t("gems.buyStock")}</p>
        </div>
      ) : (
        <div className="flex flex-col mx-2 mt-1 items-start">
          <Label type="default" className="mb-2" icon={stockIcon}>
            {t("gems.shipment.arrived")}
          </Label>
          <p className="text-sm mb-2">{t("gems.shipment.success")}</p>
          <div className="mb-2 text-xs">{t("restock.itemsToRestock")}</div>
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
          {restockTools.map(([item, amount]) => (
            <Box
              key={item}
              count={getShipmentAmount(item as StockableName, amount)}
              image={ITEM_DETAILS[item as StockableName].image}
            />
          ))}
        </div>
        {restockSeeds.length > 0 && (
          <Label
            icon={CROP_LIFECYCLE["Basic Biome"].Sunflower.seed}
            type="default"
            className="ml-2 mb-1"
          >
            {t("seeds")}
          </Label>
        )}
        <div className="flex flex-wrap mb-2">
          {restockSeeds.map(([item, amount]) => (
            <Box
              key={item}
              count={getShipmentAmount(item as StockableName, amount)}
              image={ITEM_DETAILS[item as StockableName].image}
            />
          ))}
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
};
