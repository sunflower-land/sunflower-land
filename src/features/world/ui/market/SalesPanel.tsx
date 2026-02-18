/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { useContext, useState } from "react";
import { useSelector } from "@xstate/react";

import { Context } from "features/game/GameProvider";
import { ITEM_DETAILS } from "features/game/types/images";
import token from "assets/icons/flower_token.webp";

import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { getKeys } from "features/game/types/craftables";
import { SUNNYSIDE } from "assets/sunnyside";
import { Label } from "components/ui/Label";
import { Loading } from "features/auth/components";
import { MarketPrices } from "features/game/actions/getMarketPrices";
import { TradeableName } from "features/game/actions/sellMarketResource";
import { Button } from "components/ui/Button";
import classNames from "classnames";
import { formatNumber } from "lib/utils/formatNumber";

import { Box } from "components/ui/Box";

import { ListingCategoryCard } from "components/ui/ListingCategoryCard";
import { hasReputation, Reputation } from "features/game/lib/reputation";
import { RequiredReputation } from "features/island/hud/components/reputation/Reputation";
import {
  isAccountTradedWithin90Days,
  MachineState,
} from "features/game/lib/gameMachine";
import { LastUpdatedAt } from "components/LastUpdatedAt";

export const MARKET_BUNDLES: Record<TradeableName, number> = {
  // Crops
  Sunflower: 2000,
  Potato: 2000,
  Pumpkin: 2000,
  Carrot: 2000,
  Cabbage: 2000,
  Soybean: 2000,
  Beetroot: 1000,
  Cauliflower: 1000,
  Parsnip: 400,
  Eggplant: 400,
  Corn: 400,
  Radish: 400,
  Wheat: 400,
  Kale: 400,
  Barley: 400,
  Olive: 100,
  Rice: 100,
  Grape: 100,
  Tomato: 300,
  Lemon: 250,
  Blueberry: 200,
  Orange: 200,
  Apple: 200,
  Banana: 200,
  Wood: 200,
  Stone: 200,
  Iron: 200,
  Gold: 100,
  Crimstone: 20,
  Honey: 100,
  Egg: 200,
  Feather: 200,
  Leather: 200,
  Milk: 200,
  Wool: 200,
  "Merino Wool": 200,
};

const getPriceMovement = (current: number, yesterday: number) => {
  if (current >= yesterday * 0.95 && current <= yesterday * 1.05) return "same";
  return current > yesterday ? "up" : "down";
};

const _state = (state: MachineState) => state.context.state;

export const SalesPanel: React.FC<{
  marketPrices: { prices: MarketPrices; cachedAt: number } | undefined;
  loadingNewPrices: boolean;
}> = ({ marketPrices, loadingNewPrices }) => {
  const { t } = useAppTranslation();
  const { gameService } = useContext(Context);

  const [warning, setWarning] = useState<"pendingTransaction">();
  const [confirm, setConfirm] = useState(false);
  const [selected, setSelected] = useState<TradeableName>("Apple");

  const state = useSelector(gameService, _state);
  const accountTradedRecently = useSelector(gameService, (s) =>
    isAccountTradedWithin90Days(s.context),
  );

  const onSell = (item: TradeableName) => {
    // Open Confirmation modal
    setConfirm(true);
    setSelected(item);
  };

  const confirmSell = (pricePerUnit: number) => {
    setConfirm(false);
    if (accountTradedRecently) return;
    gameService.send({
      type: "SELL_MARKET_RESOURCE",
      item: selected,
      pricePerUnit: pricePerUnit,
    });
  };

  const hasExchangeReputation = hasReputation({
    game: state,
    reputation: Reputation.Cropkeeper,
  });

  const unitPrice = marketPrices?.prices?.currentPrices?.[selected] ?? 0;
  const bundlePrice = MARKET_BUNDLES[selected] * unitPrice;
  const canSell =
    state.inventory[selected]?.gte(MARKET_BUNDLES[selected]) && unitPrice !== 0;

  const hasPrices = !!marketPrices;

  if (warning === "pendingTransaction") {
    return (
      <>
        <div className="p-1 flex flex-col items-center">
          <img src={SUNNYSIDE.icons.timer} className="w-1/6 mb-2" />
          <p className="text-sm mb-1 text-center">
            {t("playerTrade.transaction")}
          </p>
          <p className="text-xs mb-1 text-center">{t("playerTrade.Please")}</p>
        </div>
        <Button onClick={() => setWarning(undefined)}>{t("back")}</Button>
      </>
    );
  }

  if (gameService.getSnapshot().matches("sellMarketResource")) {
    return <Loading text={t("selling")} />;
  }

  if (confirm) {
    return (
      <div className="max-h-[400px] overflow-y-auto scrollable">
        <div className="flex flex-col divide-solid divide-y pr-1">
          <div className="pb-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <Box image={ITEM_DETAILS[selected].image} disabled />
                <span className="text-sm">{selected}</span>
              </div>
              <div className="flex flex-col items-end pr-1">
                <Label type={!canSell ? "danger" : "info"} className="my-1">
                  {t("bumpkinTrade.available")}
                </Label>
                <span className="text-sm mr-1 font-secondary text-[30px]">
                  {formatNumber(state.inventory?.[selected] ?? 0, {
                    decimalPlaces: 0,
                  })}
                </span>
              </div>
            </div>

            <div className="flex justify-between pl-3 pr-1 pt-2">
              <Label type="default" icon={SUNNYSIDE.icons.basket}>
                {t("goblinTrade.bulk")}
              </Label>
              <Label type="default" icon={token}>
                {t("goblinTrade.conversion")}
              </Label>
            </div>
            <div className="flex justify-between items-center px-1 pt-2">
              <Label type={!canSell ? "danger" : "success"}>
                {`${MARKET_BUNDLES[selected]}`}
              </Label>
              <span className="font-secondary text-[30px]">
                {t("bumpkinTrade.price/unit", {
                  price: formatNumber(unitPrice, {
                    decimalPlaces: 4,
                    showTrailingZeros: true,
                  }),
                })}
              </span>
            </div>
          </div>
          <span className="pt-3 text-xs px-1 pb-2">
            {t("bumpkinTrade.sellConfirmation", {
              quantity: MARKET_BUNDLES[selected],
              resource: selected,
              price: formatNumber(bundlePrice, {
                decimalPlaces: 4,
                showTrailingZeros: true,
              }),
            })}
          </span>
        </div>
        <div className="flex space-x-1">
          <Button onClick={() => setConfirm(false)}>{t("back")}</Button>
          <Button
            onClick={() =>
              hasPrices &&
              !accountTradedRecently &&
              confirmSell(marketPrices.prices.currentPrices[selected])
            }
            disabled={!canSell || accountTradedRecently}
          >
            {t("sell")}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-h-[400px] min-h-[400px] overflow-y-auto pr-1 divide-brown-600 scrollable">
      <div className="flex items-start justify-between mb-2">
        <div className="relative w-full">
          <div className="p-2">
            <div className="flex flex-col justify-between space-y-1 sm:flex-row sm:space-y-0">
              {hasExchangeReputation && (
                <Label type="default" icon={SUNNYSIDE.icons.basket}>
                  {t("goblinTrade.select")}
                </Label>
              )}
              {!hasExchangeReputation && (
                <div className="pt-2 pl-2">
                  <RequiredReputation reputation={Reputation.Cropkeeper} />
                </div>
              )}
              {marketPrices && (
                <div
                  className={classNames(
                    "flex items-center justify-start sm:justify-end w-64 text-xs",
                    { "opacity-75": !hasExchangeReputation },
                  )}
                >
                  <LastUpdatedAt lastUpdated={marketPrices.cachedAt} />
                </div>
              )}
            </div>

            <div className="flex flex-wrap mt-2">
              {getKeys(MARKET_BUNDLES).map((name) => {
                const priceMovement = getPriceMovement(
                  marketPrices?.prices?.currentPrices?.[name] ?? 0,
                  marketPrices?.prices?.yesterdayPrices?.[name] ?? 0,
                );

                return (
                  <div
                    key={name}
                    className="w-1/3 sm:w-1/4 md:w-1/5 lg:w-1/6 pr-1 pb-1"
                  >
                    <ListingCategoryCard
                      itemName={name}
                      pricePerUnit={marketPrices?.prices?.currentPrices?.[name]}
                      disabled={
                        !hasPrices ||
                        !hasExchangeReputation ||
                        accountTradedRecently
                      }
                      marketBundle={MARKET_BUNDLES[name]}
                      showPulse={!!loadingNewPrices}
                      priceMovement={priceMovement}
                      onClick={() => {
                        if (
                          !hasPrices ||
                          !hasExchangeReputation ||
                          accountTradedRecently
                        )
                          return;
                        onSell(name);
                      }}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
