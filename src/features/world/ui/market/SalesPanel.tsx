import React, { useContext, useState } from "react";
import { useActor } from "@xstate/react";

import { Context } from "features/game/GameProvider";
import { ITEM_DETAILS } from "features/game/types/images";

import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { OuterPanel } from "components/ui/Panel";
import { getKeys } from "features/game/types/craftables";
import { SUNNYSIDE } from "assets/sunnyside";
import { Label } from "components/ui/Label";
import { Loading } from "features/auth/components";
import { MarketPrices } from "features/game/actions/getMarketPrices";
import { TradeableName } from "features/game/actions/sellMarketResource";
import Decimal from "decimal.js-light";
import { MAX_SESSION_SFL } from "features/game/lib/processEvent";
import { Modal } from "components/ui/Modal";
import { Button } from "components/ui/Button";

export const MARKET_BUNDLES: Record<TradeableName, number> = {
  Sunflower: 2000,
  Potato: 2000,
  Pumpkin: 2000,
  Carrot: 2000,
  Cabbage: 2000,
  Beetroot: 1000,
  Cauliflower: 1000,
  Parsnip: 400,
  Eggplant: 400,
  Corn: 400,
  Radish: 400,
  Wheat: 400,
  Kale: 400,
  Blueberry: 200,
  Orange: 200,
  Apple: 200,
  Banana: 200,
  Wood: 200,
  Stone: 200,
  Iron: 200,
  Gold: 100,
  Egg: 200,
};

export const SalesPanel: React.FC<{
  marketPrices: MarketPrices | undefined;
}> = ({ marketPrices }) => {
  const { t } = useAppTranslation();
  const { gameService } = useContext(Context);

  const [isSearching, setIsSearching] = useState(false);
  const [warning, setWarning] = useState<"pendingTransaction" | "hoarding">();
  const [loading, setLoading] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [selected, setSelected] = useState<TradeableName>("Apple");
  const [
    {
      context: { state },
    },
  ] = useActor(gameService);
  const inventory = state.inventory;

  const onSell = (item: TradeableName) => {
    const isHoarding = checkHoard(item);

    if (isHoarding) {
      setWarning("hoarding");
      return;
    }

    // Open Confirmation modal
    setConfirm(true);
    setSelected(item);
  };

  const confirmSell = () => {
    setConfirm(false);
    setLoading(true);

    gameService.send({
      type: "SELL_MARKET_RESOURCE",
      item: selected,
    });
  };

  const checkHoard = (item: TradeableName) => {
    const auctionSFL = state.auctioneer.bid?.sfl ?? new Decimal(0);

    const progress = state.balance
      .add(auctionSFL)
      .add(MARKET_BUNDLES[item] * marketPrices![item])
      .sub(state.previousBalance ?? new Decimal(0));

    return progress.gt(MAX_SESSION_SFL);
  };

  const searchView = () => {
    if (marketPrices === undefined) {
      return <Loading />;
    }

    return (
      <div className="p-2">
        <Label type="default" icon={SUNNYSIDE.icons.basket}>
          {t("trading.select.resources")}
        </Label>

        <div className="flex flex-wrap mt-2">
          {getKeys(MARKET_BUNDLES).map((name) => (
            <div
              key={name}
              className="w-1/3 sm:w-1/4 md:w-1/5 lg:w-1/6 pr-1 pb-1"
            >
              <OuterPanel
                className="w-full relative flex flex-col items-center justify-center cursor-pointer hover:bg-brown-200"
                onClick={() => {
                  onSell(name);
                }}
              >
                <span className="text-xs mt-1">{name}</span>
                <img
                  src={ITEM_DETAILS[name].image}
                  className="h-10 mt-1 mb-8"
                />
                <Label
                  type="warning"
                  className="absolute -bottom-2 text-center mt-1 p-1"
                  style={{ width: "calc(100% + 10px)" }}
                >
                  {marketPrices[name]?.toFixed(4)}
                  {t("unit")}
                </Label>
              </OuterPanel>
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (!state.inventory["Gold Pass"]) {
    return (
      <div className="relative">
        <div className="p-1 flex flex-col items-center">
          <img
            src={ITEM_DETAILS["Gold Pass"].image}
            className="w-1/5 mx-auto my-2 img-highlight-heavy"
          />
          <p className="text-sm">{t("bumpkinTrade.goldpass.required")}</p>
          <p className="text-xs mb-2">{t("bumpkinTrade.purchase")}</p>
        </div>
      </div>
    );
  }

  const text = "Warning: You are hoarding too much!";
  return (
    <div className="max-h-[400px] min-h-[400px] overflow-y-auto pr-1 divide-brown-600 scrollable">
      <div className="flex items-start justify-between mb-2">
        {isSearching && <p className="loading">{t("searching")}</p>}
        {!isSearching && <div className="relative w-full">{searchView()}</div>}
        {warning && (
          <Modal show>
            <OuterPanel></OuterPanel>
          </Modal>
        )}
        {confirm && (
          <Modal show>
            <OuterPanel>
              <Button onClick={() => confirmSell()}>{t("confirm")}</Button>
            </OuterPanel>
          </Modal>
        )}
      </div>
    </div>
  );
};
