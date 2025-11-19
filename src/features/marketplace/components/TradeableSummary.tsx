import React from "react";

import sflIcon from "assets/icons/flower_token.webp";
import bg from "assets/ui/3x3_bg.png";

import { TradeableDisplay } from "../lib/tradeables";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { formatNumber } from "lib/utils/formatNumber";
import Decimal from "decimal.js-light";
import { ITEM_DETAILS } from "features/game/types/images";
import { TRADE_LIMITS } from "features/game/actions/tradeLimits";

// TODO - move make offer here, signing state + submitting state

export const TradeableItemDetails: React.FC<{
  display: TradeableDisplay;
  quantity: number;
  sfl: number;
  estTradePoints?: number;
}> = ({ display, quantity, sfl, estTradePoints }) => {
  const isResource = display.name in TRADE_LIMITS;
  const isBud = display.name.includes("Bud");

  return (
    <div className="flex">
      <div className="h-12 w-12 mr-2 relative">
        {isBud ? (
          <img src={display.image} className="w-full rounded" />
        ) : (
          <>
            <img src={bg} className="w-full rounded" />
            <img
              src={display.image}
              className="h-1/2 absolute"
              style={{
                left: "50%",
                transform: "translate(-50%, 50%)",
                bottom: "50%",
              }}
            />
          </>
        )}
      </div>
      <div>
        <span className="text-sm">{`${quantity} x ${display.name}`}</span>
        <div className="flex items-center">
          <span className="text-sm">{`${formatNumber(sfl, {
            decimalPlaces: 4,
            showTrailingZeros: true,
          })} FLOWER`}</span>
          <img src={sflIcon} className="h-6 ml-1" />
        </div>
        {estTradePoints && !isResource && (
          <div className="flex items-center">
            <span className="text-sm">
              {`${formatNumber(estTradePoints, {
                decimalPlaces: 2,
              })} Trade Points`}
            </span>
            <img src={ITEM_DETAILS["Trade Point"].image} className="h-4 ml-1" />
          </div>
        )}
      </div>
    </div>
  );
};

export const TradeableSummary: React.FC<{
  display: TradeableDisplay;
  sfl: number;
  tax: Decimal;
  quantity: number;
  estTradePoints?: number;
}> = ({ display, sfl, tax, quantity, estTradePoints }) => {
  const { t } = useAppTranslation();

  const isResource = display.name in TRADE_LIMITS;

  return (
    <div>
      <TradeableItemDetails display={display} quantity={quantity} sfl={sfl} />
      {isResource && (
        <div
          className="flex justify-between"
          style={{
            borderBottom: "1px solid #ead4aa",
            padding: "5px 5px 5px 2px",
          }}
        >
          <span className="text-xs">{t("marketplace.label.pricePerUnit")}</span>
          <p className="text-xs font-secondary">{`${formatNumber(
            sfl / quantity,
            {
              decimalPlaces: 4,
              showTrailingZeros: true,
            },
          )} FLOWER`}</p>
        </div>
      )}
      <div
        className="flex justify-between"
        style={{
          borderBottom: "1px solid #ead4aa",
          padding: "5px 5px 5px 2px",
        }}
      >
        <span className="text-xs"> {t("marketplace.salePrice")}</span>
        <p className="text-xs font-secondary">{`${formatNumber(sfl, {
          decimalPlaces: 4,
          showTrailingZeros: true,
        })} FLOWER`}</p>
      </div>

      <div
        className="flex justify-between"
        style={{
          borderBottom: "1px solid #ead4aa",
          padding: "5px 5px 5px 2px",
        }}
      >
        <span className="text-xs"> {t("bumpkinTrade.tradingFee")}</span>
        <p className="text-xs font-secondary">{`${formatNumber(
          new Decimal(tax),
          {
            decimalPlaces: 4,
            showTrailingZeros: true,
          },
        )} FLOWER`}</p>
      </div>
      <div
        className="flex justify-between"
        style={{
          borderBottom:
            !!estTradePoints && !isResource ? "1px solid #ead4aa" : "none",
          padding: "5px 5px 5px 2px",
        }}
      >
        <span className="text-xs"> {t("bumpkinTrade.youWillReceive")}</span>
        <p className="text-xs font-secondary">{`${formatNumber(
          new Decimal(sfl).minus(tax),
          {
            decimalPlaces: 4,
            showTrailingZeros: true,
          },
        )} FLOWER`}</p>
      </div>
      {!!estTradePoints && !isResource && (
        <div
          className="flex justify-between"
          style={{
            padding: "5px 5px 5px 2px",
          }}
        >
          <span className="text-xs">{`Trade Points earned`}</span>
          <div className="flex flex-row">
            <p className="text-xs font-secondary mr-1">{`${formatNumber(
              new Decimal(estTradePoints),
              {
                decimalPlaces: 2,
              },
            )}`}</p>
            <img src={ITEM_DETAILS["Trade Point"].image} />
          </div>
        </div>
      )}
    </div>
  );
};
