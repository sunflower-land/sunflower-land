import React, { useContext } from "react";
import { Button } from "components/ui/Button";
import { ITEM_DETAILS } from "features/game/types/images";
import { Context } from "features/game/GameProvider";
import { useActor } from "@xstate/react";
import { ModalContext } from "features/game/components/modal/ModalProvider";
import stockIcon from "assets/icons/stock.webp";
import { gameAnalytics } from "lib/gameAnalytics";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { TimerDisplay } from "features/retreat/components/auctioneer/AuctionDetails";

import { Label } from "components/ui/Label";
import confetti from "canvas-confetti";
import { Box } from "components/ui/Box";
import Decimal from "decimal.js-light";
import { INITIAL_STOCK, StockableName } from "features/game/lib/constants";
import {
  RestockItems,
  RestockNPC,
} from "features/game/events/landExpansion/npcRestock";

interface RestockModalProps {
  onClose: () => void;
  shipmentTime?: {
    hours: number;
    minutes: number;
    seconds: number;
  };
  npc: RestockNPC;
  hasGemExperiment: boolean;
}

export const NPCRestockModal: React.FC<RestockModalProps> = ({
  onClose,
  shipmentTime,
  npc,
  hasGemExperiment,
}) => {
  const { t } = useAppTranslation();
  const { openModal } = useContext(ModalContext);

  const { gameService, showAnimations } = useContext(Context);
  const [
    {
      context: { state },
    },
  ] = useActor(gameService);

  const { gemPrice, shopName, restockItem, categoryLabel } = RestockItems[npc];
  const canRestock = state.inventory["Gem"]?.gte(gemPrice);

  const handleRestock = () => {
    if (!canRestock) {
      openModal("BUY_GEMS");
      return;
    }

    gameService.send("npc.restocked", {
      npc,
    });

    gameAnalytics.trackSink({
      currency: "Gem",
      amount: gemPrice,
      item: "Stock",
      type: "Fee",
    });

    if (showAnimations) confetti();
    onClose();
  };

  const getRestockAmount = (item: StockableName, amount: Decimal): Decimal => {
    const remainingStock = state.stock[item];

    // If there's no stock left
    if (!remainingStock) {
      // return total stock amount
      return amount;
    } else {
      // else return difference between total and remaining stock
      return amount.sub(remainingStock);
    }
  };

  const { labelText, icon } = categoryLabel;

  const restockItems = Object.entries(INITIAL_STOCK(state))
    .filter((item) => item[0] in restockItem)
    .filter(([item, amount]) =>
      getRestockAmount(item as StockableName, amount).gt(0),
    );

  return (
    <>
      <div className="flex flex-col p-2 items-start">
        <Label type="default" className="mb-2" icon={stockIcon}>
          {t("restock")}
        </Label>
        <p className="mb-1">
          {t("gems.buyReplenish.enhanced", {
            shopName,
            gemPrice,
          })}
        </p>
      </div>
      <div className="mt-1 h-40 overflow-y-auto overflow-x-hidden scrollable pl-1">
        <div className="mb-2 text-xs">{t("restock.itemsToRestock")}</div>
        {restockItems.length > 0 && (
          <>
            <Label icon={icon} type="default" className="ml-2 mb-1 capitalize">
              {labelText}
            </Label>
            <div className="flex flex-wrap mb-2">
              {restockItems.map(([item, amount]) => (
                <Box
                  key={item}
                  count={getRestockAmount(item as StockableName, amount)}
                  image={ITEM_DETAILS[item as StockableName].image}
                />
              ))}
            </div>
          </>
        )}
      </div>
      <p className="text-xs p-1 pb-1.5 italic">{t("gems.restockToMaxStock")}</p>
      {hasGemExperiment && shipmentTime && (
        <div className="px-1 text-xs flex flex-wrap mb-2">
          <span className="mr-2">{t("gems.nextFreeShipment")}</span>
          <TimerDisplay time={shipmentTime} />
        </div>
      )}
      <div className="flex justify-content-around mt-2 space-x-1">
        <Button onClick={onClose}>{t("cancel")}</Button>
        <Button className="relative" onClick={handleRestock}>
          <div className="flex items-center h-4 ">
            <p className="mr-1">{`${t("restock")} ${gemPrice}`}</p>
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
