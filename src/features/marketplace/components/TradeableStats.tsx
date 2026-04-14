import { Label } from "components/ui/Label";
import { InnerPanel } from "components/ui/Panel";
import React from "react";
import increaseArrow from "assets/icons/increase_arrow.png";
import decreaseArrow from "assets/icons/decrease_arrow.png";
import {
  getPriceHistory,
  PriceHistory,
  SaleHistory,
} from "features/game/types/marketplace";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { formatNumber } from "lib/utils/formatNumber";
import { useNow } from "lib/utils/hooks/useNow";

interface Props {
  marketPrice: number;
  history?: SaleHistory;
}

export const TradeableStats: React.FC<Props> = ({ history, marketPrice }) => {
  const { t } = useAppTranslation();
  const loading = !history;
  const now = useNow();

  const prices: PriceHistory = history
    ? getPriceHistory({
        history: history.history,
        from: new Date(now - 1000 * 60 * 60 * 24 * 31).getTime(), // 31 days ago
        price: marketPrice,
      })
    : {
        dates: [],
        oneDayChange: 0,
        sevenDayChange: 0,
        oneDayPriceChange: 0,
        sevenDayPriceChange: 0,
        oneDayPrice: 0,
        sevenDayPrice: 0,
      };

  return (
    <div className="flex w-full gap-0.5 flex-col justify-evenly sm:gap-0 sm:flex-row sm:flex-wrap sm:mb-1">
      <div className="w-full sm:w-1/3 sm:pr-1">
        <InnerPanel>
          <div className="flex justify-between">
            <Label type="info" className="whitespace-nowrap">
              <span className="text-xxs sm:text-xs">
                {t("marketplace.oneDayChange")}
              </span>
            </Label>
            {!loading && prices.oneDayChange !== 0 && (
              <Label
                type="transparent"
                className="whitespace-nowrap"
                icon={prices.oneDayChange > 0 ? increaseArrow : decreaseArrow}
              >
                <span className="text-xxs sm:text-xs">{`${formatNumber(prices.oneDayChange)}%`}</span>
              </Label>
            )}
          </div>
          <p className="text-xxs pl-0.5 sm:text-xs sm:p-1">
            {loading ? (
              <span className="loading-fade-pulse">{`${formatNumber(0, { decimalPlaces: 4 })} FLOWER`}</span>
            ) : (
              `${formatNumber(prices.oneDayPrice, { decimalPlaces: 4 })} FLOWER > ${formatNumber(marketPrice, { decimalPlaces: 4 })} FLOWER`
            )}
          </p>
        </InnerPanel>
      </div>
      <div className="w-full sm:w-1/3 sm:pr-1">
        <InnerPanel>
          <div className="flex justify-between">
            <Label type="info" className="whitespace-nowrap">
              <span className="text-xxs sm:text-xs">
                {t("marketplace.sevenDayChange")}
              </span>
            </Label>
            {!loading && prices.sevenDayChange !== 0 && (
              <Label
                type="transparent"
                className="whitespace-nowrap"
                icon={prices.sevenDayChange > 0 ? increaseArrow : decreaseArrow}
              >
                <span className="text-xxs sm:text-xs">{`${formatNumber(prices.sevenDayChange)}%`}</span>
              </Label>
            )}
          </div>
          <p className="text-xxs pl-0.5 sm:text-xs sm:p-1">
            {loading ? (
              <span className="loading-fade-pulse">{`${formatNumber(0, { decimalPlaces: 4 })} FLOWER`}</span>
            ) : (
              `${formatNumber(prices.sevenDayPrice, { decimalPlaces: 4 })} FLOWER > ${formatNumber(marketPrice, { decimalPlaces: 4 })} FLOWER`
            )}
          </p>
        </InnerPanel>
      </div>
      <div className="w-full md:w-1/3">
        <InnerPanel>
          <div className="flex justify-between">
            <div>
              <Label type="info" className="whitespace-nowrap">
                <span className="text-xxs sm:text-xs">
                  {t("marketplace.sales")}
                </span>
              </Label>
              <p className="text-xxs pl-0.5 sm:text-xs sm:p-1">
                {loading ? (
                  <span className="loading-fade-pulse">{`0`}</span>
                ) : (
                  history?.history.totalSales
                )}
              </p>
            </div>
          </div>
        </InnerPanel>
      </div>
    </div>
  );
};
