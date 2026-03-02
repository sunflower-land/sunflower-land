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
import { INITIAL_STOCK, StockableName } from "features/game/lib/constants";
import {
  RestockItems,
  RestockNPC,
} from "features/game/events/landExpansion/npcRestock";
import { capitalize } from "lodash";

interface RestockModalProps {
  onClose: () => void;
  shipmentTime?: {
    hours: number;
    minutes: number;
    seconds: number;
  };
  npc: RestockNPC;
}

export const NPCRestockModal: React.FC<RestockModalProps> = ({
  onClose,
  shipmentTime,
  npc,
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

    gameService.send({ type: "npc.restocked", npc });

    gameAnalytics.trackSink({
      currency: "Gem",
      amount: gemPrice,
      item: "Stock",
      type: "Fee",
    });

    if (showAnimations) confetti();
    onClose();
  };

  const { labelText, icon } = categoryLabel;

  const restockItems = Object.entries(INITIAL_STOCK(state)).filter(
    (item) => item[0] in restockItem,
  );

  return (
    <>
      <div className="flex flex-col mx-2 mt-1 items-start">
        <Label type="default" className="mb-2 capitalize" icon={stockIcon}>
          {t("restock.shop", { shopName })}
        </Label>
        <p className="mb-1">
          {t("gems.buyReplenish.enhanced", {
            shopName: capitalize(shopName),
            gemPrice,
          })}
        </p>
        <div className="mb-2 text-xs">{t("restock.restocktoAmount")}</div>
      </div>
      <div className="mt-1 h-40 overflow-y-auto overflow-x-hidden scrollable pl-1">
        {restockItems.length > 0 && (
          <>
            <Label icon={icon} type="default" className="ml-2 mb-1 capitalize">
              {labelText}
            </Label>
            <div className="flex flex-wrap mb-2">
              {restockItems.map(([item, amount]) => (
                <Box
                  key={item}
                  count={amount}
                  image={ITEM_DETAILS[item as StockableName].image}
                />
              ))}
            </div>
          </>
        )}
      </div>
      <p className="text-xs p-1 pb-1.5 italic">{t("gems.restockToMaxStock")}</p>
      {shipmentTime && (
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
