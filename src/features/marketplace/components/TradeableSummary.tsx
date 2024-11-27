import React from "react";

import sflIcon from "assets/icons/sfl.webp";
import bg from "assets/ui/3x3_bg.png";

import { TradeableDisplay } from "../lib/tradeables";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { formatNumber } from "lib/utils/formatNumber";
import Decimal from "decimal.js-light";
import { MARKETPLACE_TAX } from "features/game/types/marketplace";

// TODO - move make offer here, signing state + submitting state

export const TradeableItemDetails: React.FC<{
  display: TradeableDisplay;
  quantity: number;
  sfl: number;
}> = ({ display, quantity, sfl }) => {
  return (
    <div className="flex">
      <div className="h-12 w-12 mr-2 relative">
        <img src={bg} className="w-full rounded" />
        <img
          src={display.image}
          className="w-1/2 absolute"
          style={{
            left: "50%",
            transform: "translate(-50%, 50%)",
            bottom: "50%",
          }}
        />
      </div>
      <div>
        <span className="text-sm">{`${quantity} x ${display.name}`}</span>
        <div className="flex items-center">
          <span className="text-sm">{`${sfl} SFL`}</span>
          <img src={sflIcon} className="h-6 ml-1" />
        </div>
      </div>
    </div>
  );
};

export const TradeableSummary: React.FC<{
  display: TradeableDisplay;
  sfl: number;
  quantity: number;
}> = ({ display, sfl, quantity }) => {
  const { t } = useAppTranslation();

  return (
    <div>
      <TradeableItemDetails display={display} quantity={quantity} sfl={sfl} />
      <div
        className="flex justify-between"
        style={{
          borderBottom: "1px solid #ead4aa",
          padding: "5px 5px 5px 2px",
        }}
      >
        <span className="text-xs"> {t("marketplace.salePrice")}</span>
        <p className="text-xs font-secondary">{`${formatNumber(sfl, {
          decimalPlaces: 2,
          showTrailingZeros: true,
        })} SFL`}</p>
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
          new Decimal(sfl).mul(MARKETPLACE_TAX),
          {
            decimalPlaces: 2,
            showTrailingZeros: true,
          },
        )} SFL`}</p>
      </div>
      <div
        className="flex justify-between"
        style={{
          padding: "5px 5px 5px 2px",
        }}
      >
        <span className="text-xs"> {t("marketplace.sellerWillReceive")}</span>
        <p className="text-xs font-secondary">{`${formatNumber(
          new Decimal(sfl).mul(1 - MARKETPLACE_TAX),
          {
            decimalPlaces: 2,
            showTrailingZeros: true,
          },
        )} SFL`}</p>
      </div>
    </div>
  );
};
