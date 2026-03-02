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
import { TREASURE_TOOLS, WORKBENCH_TOOLS } from "features/game/types/tools";
import { SEEDS } from "features/game/types/seeds";
import { CROP_LIFECYCLE } from "features/island/plots/lib/plant";

interface RestockModalProps {
  onClose: () => void;
  shipmentTime?: {
    hours: number;
    minutes: number;
    seconds: number;
  };
}

export const FullRestockModal: React.FC<RestockModalProps> = ({
  onClose,
  shipmentTime,
}) => {
  const { t } = useAppTranslation();
  const { openModal } = useContext(ModalContext);

  const { gameService, showAnimations } = useContext(Context);
  const [
    {
      context: { state },
    },
  ] = useActor(gameService);

  const canRestock = state.inventory["Gem"]?.gte(20);

  const handleRestock = () => {
    if (!canRestock) {
      openModal("BUY_GEMS");
      return;
    }

    gameService.send({ type: "shops.restocked" });

    gameAnalytics.trackSink({
      currency: "Gem",
      amount: 20,
      item: "Stock",
      type: "Fee",
    });

    if (showAnimations) confetti();
    onClose();
  };

  const restockTools = Object.entries(INITIAL_STOCK(state)).filter(
    (item) => item[0] in { ...WORKBENCH_TOOLS, ...TREASURE_TOOLS },
  );

  const restockSeeds = Object.entries(INITIAL_STOCK(state)).filter(
    (item) => item[0] in SEEDS,
  );

  return (
    <>
      <div className="flex flex-col mx-2 mt-1 items-start">
        <Label type="default" className="mb-2" icon={stockIcon}>
          {t("restock")}
        </Label>
        <p className="mb-1">{t("gems.buyReplenish")}</p>
        <div className="mb-2 text-xs">{t("restock.restocktoAmount")}</div>
      </div>
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
              count={amount}
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
              count={amount}
              image={ITEM_DETAILS[item as StockableName].image}
            />
          ))}
        </div>
      </div>
      <p className="text-xs p-1 pb-1.5 italic">{t("gems.restockToMaxStock")}</p>{" "}
      {shipmentTime && (
        <div className="px-1 text-xs flex flex-wrap mb-2">
          <span className="mr-2">{t("gems.nextFreeShipment")}</span>
          <TimerDisplay time={shipmentTime} />
        </div>
      )}
      <div className="flex justify-content-around mt-2 space-x-1">
        <Button onClick={onClose}>{t("cancel")}</Button>
        <Button className="relative" onClick={handleRestock}>
          {`${t("restock")} 20`}
          <img
            src={ITEM_DETAILS["Gem"].image}
            className="h-5 absolute right-1 top-1"
          />
        </Button>
      </div>
    </>
  );
};
