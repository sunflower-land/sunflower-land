import { Label } from "components/ui/Label";
import { InnerPanel } from "components/ui/Panel";
import React, { useEffect, useState } from "react";
import increaseArrow from "assets/icons/increase_arrow.png";
import decreaseArrow from "assets/icons/decrease_arrow.png";
import { getPriceHistory, SaleHistory } from "features/game/types/marketplace";
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

  const prices = history
    ? getPriceHistory({
        history: history.history,
        from: new Date(Date.now() - 1000 * 60 * 60 * 24 * 31).getTime(), // 31 days ago
      })
    : [];

  let oneDayChange = 0;
  let sevenDayChange = 0;

  if (prices[0]?.low && !isNaN(prices[0].low) && prices[0].low !== 0) {
    const change = ((price - prices[0].low) / prices[0].low) * 100;
    oneDayChange = isNaN(change) ? 0 : change;
  }

  if (prices[6]?.low && !isNaN(prices[6].low) && prices[6].low !== 0) {
    const change = ((price - prices[6].low) / prices[6].low) * 100;
    sevenDayChange = isNaN(change) ? 0 : change;
  }

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
            {!loading && oneDayChange !== 0 && (
              <Label
                type="transparent"
                className="whitespace-nowrap"
                icon={oneDayChange > 0 ? increaseArrow : decreaseArrow}
              >
                <span className="text-xxs sm:text-xs">{`${oneDayChange.toFixed(2)}%`}</span>
              </Label>
            )}
          </div>
          <p className="text-xxs pl-0.5 sm:text-xs sm:p-1">
            {loading ? (
              <span className="loading-fade-pulse">{`0.00 SFL`}</span>
            ) : (
              `${(price - (prices[0]?.low ?? 0) || 0).toFixed(2)} SFL`
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
            {!loading && sevenDayChange !== 0 && (
              <Label
                type="transparent"
                className="whitespace-nowrap"
                icon={sevenDayChange > 0 ? increaseArrow : decreaseArrow}
              >
                <span className="text-xxs sm:text-xs">{`${sevenDayChange.toFixed(2)}%`}</span>
              </Label>
            )}
          </div>
          <p className="text-xxs pl-0.5 sm:text-xs sm:p-1">
            {loading ? (
              <span className="loading-fade-pulse">{`0.00 SFL`}</span>
            ) : (
              `${(price - (prices[6]?.low ?? 0) || 0).toFixed(2)} SFL`
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
