import { Label } from "components/ui/Label";
import { InnerPanel } from "components/ui/Panel";
import React, { useEffect, useState } from "react";
import increaseArrow from "assets/icons/increase_arrow.png";
import decreaseArrow from "assets/icons/decrease_arrow.png";
import {
  getPriceHistory,
  PriceHistory,
  SaleHistory,
} from "features/game/types/marketplace";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

interface Props {
  price: number;
  history?: SaleHistory;
}

export const TradeableStats: React.FC<Props> = ({ history, price }) => {
  const { t } = useAppTranslation();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (history) {
      setLoading(false);
    }
  }, [history]);

  const prices: PriceHistory = history
    ? getPriceHistory({
        history: history.history,
        from: new Date(Date.now() - 1000 * 60 * 60 * 24 * 31).getTime(), // 31 days ago
        price,
      })
    : {
        dates: [],
        oneDayChange: 0,
        sevenDayChange: 0,
        thirtyDayChange: 0,
        oneDayPriceChange: 0,
        sevenDayPriceChange: 0,
        thirtyDayPriceChange: 0,
      };

  return (
    <div className="flex w-full h-full gap-0.5 flex-col justify-evenly sm:h-auto sm:gap-0 sm:flex-row sm:flex-wrap sm:mb-1">
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
                <span className="text-xxs sm:text-xs">{`${prices.oneDayChange.toFixed(2)}%`}</span>
              </Label>
            )}
          </div>
          <p className="text-xxs pl-0.5 sm:text-xs sm:p-1">
            {loading ? (
              <span className="loading-fade-pulse">{`0.00 SFL`}</span>
            ) : (
              `${prices.oneDayPriceChange.toFixed(2)} SFL`
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
                <span className="text-xxs sm:text-xs">{`${prices.sevenDayChange.toFixed(2)}%`}</span>
              </Label>
            )}
          </div>
          <p className="text-xxs pl-0.5 sm:text-xs sm:p-1">
            {loading ? (
              <span className="loading-fade-pulse">{`0.00 SFL`}</span>
            ) : (
              `${prices.sevenDayPriceChange.toFixed(2)} SFL`
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
