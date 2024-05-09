/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { useContext, useEffect, useState } from "react";
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
import { Button } from "components/ui/Button";
import classNames from "classnames";
import { getRelativeTime } from "lib/utils/time";
import useUiRefresher from "lib/utils/hooks/useUiRefresher";

import sflIcon from "assets/icons/sfl.webp";
import lock from "assets/skills/lock.png";
import increase_arrow from "assets/icons/increase_arrow.png";
import decrease_arrow from "assets/icons/decrease_arrow.png";
import { Box } from "components/ui/Box";
import { MAX_SESSION_SFL } from "features/game/lib/processEvent";

import { hasVipAccess } from "features/game/lib/vipAccess";
import { VIPAccess } from "features/game/components/VipAccess";
import { ModalContext } from "features/game/components/modal/ModalProvider";

export const MARKET_BUNDLES: Record<TradeableName, number> = {
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

const LastUpdated: React.FC<{ cachedAt: number }> = ({ cachedAt }) => {
  const { t } = useAppTranslation();

  useUiRefresher();
  return (
    <span className="text-xs">{`${t("last.updated")} ${getRelativeTime(
      cachedAt
    )}`}</span>
  );
};

const getPriceMovement = (current: number, yesterday: number) => {
  if (current >= yesterday * 0.95 && current <= yesterday * 1.05) return "same";
  return current > yesterday ? "up" : "down";
};

export const SalesPanel: React.FC<{
  marketPrices:
    | {
        prices: MarketPrices;
        cachedAt: number;
      }
    | undefined;
  loadingNewPrices: boolean;
}> = ({ marketPrices, loadingNewPrices }) => {
  const { t } = useAppTranslation();
  const { gameService } = useContext(Context);

  const { openModal } = useContext(ModalContext);

  const [warning, setWarning] = useState<"pendingTransaction" | "hoarding">();
  const [showPulse, setShowPulse] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [selected, setSelected] = useState<TradeableName>("Apple");

  const [
    {
      context: { state },
    },
  ] = useActor(gameService);

  useEffect(() => {
    if (loadingNewPrices) {
      setShowPulse(true);
    } else {
      setTimeout(() => setShowPulse(false), 1000);
    }
  }, [loadingNewPrices]);

  const onSell = (item: TradeableName, price: number) => {
    const isHoarding = checkHoard(item, price);

    if (isHoarding) {
      setWarning("hoarding");
      return;
    }

    // Open Confirmation modal
    setConfirm(true);
    setSelected(item);
  };

  const confirmSell = (pricePerUnit: number) => {
    setConfirm(false);

    gameService.send({
      type: "SELL_MARKET_RESOURCE",
      item: selected,
      pricePerUnit: pricePerUnit,
    });
  };

  const checkHoard = (item: TradeableName, price: number) => {
    const auctionSFL = state.auctioneer.bid?.sfl ?? new Decimal(0);

    const progress = state.balance
      .add(auctionSFL)
      .add(MARKET_BUNDLES[item] * price)
      .sub(state.previousBalance ?? new Decimal(0));

    return progress.gt(MAX_SESSION_SFL);
  };

  const hasVIP =
    Date.now() < new Date("2024-05-01T00:00:00Z").getTime() ||
    hasVipAccess(state.inventory);

  const unitPrice = marketPrices?.prices?.currentPrices?.[selected] || "0.0000";
  const bundlePrice = (MARKET_BUNDLES[selected] * Number(unitPrice))?.toFixed(
    4
  );
  const canSell =
    state.inventory[selected]?.gte(MARKET_BUNDLES[selected]) &&
    !(Number(unitPrice) === 0);

  const hasPrices = !!marketPrices;

  if (warning === "hoarding") {
    return (
      <>
        <div className="p-1 flex flex-col items-center">
          <img src={lock} className="w-1/5 mb-2" />
          <p className="text-sm mb-1 text-center">
            {t("goblinTrade.hoarding")}
          </p>
          <p className="text-xs mb-1 text-center">
            {t("playerTrade.Progress")}
          </p>
        </div>
        <Button onClick={() => setWarning(undefined)}>{t("back")}</Button>
      </>
    );
  }

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

  if (gameService.state.matches("sellMarketResource")) {
    return <Loading text="Selling" />;
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
                <span className="text-sm mr-1">
                  {state.inventory?.[selected]?.toFixed(0, 1) ?? 0}
                </span>
              </div>
            </div>

            <div className="flex justify-between pl-3 pr-1 pt-2">
              <Label type="default" icon={SUNNYSIDE.icons.basket}>
                {t("goblinTrade.bulk")}
              </Label>
              <Label type="default" icon={sflIcon}>
                {t("goblinTrade.conversion")}
              </Label>
            </div>
            <div className="flex justify-between items-center px-2 pt-1">
              <span
                className={classNames("text-xs", { "text-red-500": !canSell })}
              >{`${MARKET_BUNDLES[selected]}`}</span>
              <span className="text-[12px]">
                {t("bumpkinTrade.price/unit", {
                  price: Number(unitPrice).toFixed(4),
                })}
              </span>
            </div>
          </div>
          <span className="pt-3 text-xs px-1 pb-2">
            {`${t("sell")} ${MARKET_BUNDLES[selected]} ${selected} ${t(
              "for"
            )} ${bundlePrice} ${"SFL"}?`}
          </span>
        </div>
        <div className="flex space-x-1">
          <Button onClick={() => setConfirm(false)}>{t("back")}</Button>
          <Button
            onClick={() =>
              hasPrices &&
              confirmSell(marketPrices.prices.currentPrices[selected])
            }
            disabled={!canSell}
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
              {hasVIP && (
                <Label type="default" icon={SUNNYSIDE.icons.basket}>
                  {t("goblinTrade.select")}
                </Label>
              )}
              <VIPAccess
                isVIP={hasVIP}
                onUpgrade={() => openModal("BUY_BANNER")}
              />
              {marketPrices && (
                <div
                  className={classNames(
                    "flex items-center justify-start sm:justify-end w-64",
                    { "opacity-75": !hasVIP }
                  )}
                >
                  <LastUpdated cachedAt={marketPrices.cachedAt ?? 0} />
                </div>
              )}
            </div>

            <div className="flex flex-wrap mt-2">
              {getKeys(MARKET_BUNDLES).map((name) => {
                const priceMovement = getPriceMovement(
                  marketPrices?.prices?.currentPrices?.[name] ?? 0,
                  marketPrices?.prices?.yesterdayPrices?.[name] ?? 0
                );

                return (
                  <div
                    key={name}
                    className="w-1/3 sm:w-1/4 md:w-1/5 lg:w-1/6 pr-1 pb-1"
                  >
                    <OuterPanel
                      className={classNames(
                        "w-full relative flex flex-col items-center justify-center",
                        {
                          "cursor-not-allowed opacity-75":
                            !hasVIP || !hasPrices,
                          "cursor-pointer hover:bg-brown-200":
                            hasVIP && hasPrices,
                        }
                      )}
                      onClick={
                        hasPrices && hasVIP
                          ? () => {
                              onSell(
                                name,
                                marketPrices.prices.currentPrices[name]
                              );
                            }
                          : undefined
                      }
                    >
                      <span className="text-xs mt-1">{name}</span>
                      <img
                        src={ITEM_DETAILS[name].image}
                        className="h-10 my-1"
                      />
                      <span className={"text-xxs md:text-xs mb-7"}>
                        {/* \u{d7} is &times; in unicode */}
                        {`\u{d7}${MARKET_BUNDLES[name]}`}
                      </span>
                      <Label
                        type="warning"
                        className="absolute -bottom-2 text-center mt-1 p-1"
                        style={{ width: "calc(100% + 10px)" }}
                      >
                        <span
                          className={classNames("text-[12px]", {
                            pulse: showPulse,
                          })}
                        >
                          {t("bumpkinTrade.price/unit", {
                            price:
                              marketPrices?.prices?.currentPrices?.[
                                name
                              ]?.toFixed(4) || "0.0000",
                          })}
                        </span>
                        {priceMovement === "up" && (
                          <img
                            src={increase_arrow}
                            className="w-6 absolute -right-1 -top-6"
                          />
                        )}
                        {priceMovement === "down" && (
                          <img
                            src={decrease_arrow}
                            className="w-6 absolute -right-1 -top-6"
                          />
                        )}
                      </Label>
                    </OuterPanel>
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
