import { Label } from "components/ui/Label";
import { InnerPanel } from "components/ui/Panel";
import React from "react";
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

  if (!history) {
    return null;
  }

  const prices = getPriceHistory({
    history: history.history,
    from: new Date(Date.now() - 1000 * 60 * 60 * 24 * 31).getTime(), // 31 days ago
  });

  let oneDayChange = 0;
  let sevenDayChange = 0;

  if (prices[0].low !== 0) {
    oneDayChange = ((price - prices[0].low) / prices[0].low) * 100;
  }

  if (prices[6].low !== 0) {
    sevenDayChange = ((price - prices[6].low) / prices[6].low) * 100;
  }

  return (
    <div className="flex flex-wrap mb-1">
      <div className="w-1/2 md:w-1/3 pr-1 hidden md:block">
        <InnerPanel>
          <div className="flex justify-between">
            <Label type="info">{t("marketplace.oneDayChange")}</Label>
            {oneDayChange !== 0 && (
              <Label
                type="transparent"
                icon={oneDayChange > 0 ? increaseArrow : decreaseArrow}
              >
                {`${oneDayChange.toFixed(2)}%`}
              </Label>
            )}
          </div>
          <p className="text-sm p-1">
            {(price - prices[0].low).toFixed(2)} {`SFL`}
          </p>
        </InnerPanel>
      </div>
      <div className="w-1/2 md:w-1/3 pr-1">
        <InnerPanel>
          <div className="flex justify-between">
            <Label type="info">{t("marketplace.sevenDayChange")}</Label>
            {sevenDayChange !== 0 && (
              <Label
                type="transparent"
                icon={sevenDayChange > 0 ? increaseArrow : decreaseArrow}
              >
                {`${sevenDayChange.toFixed(2)}%`}
              </Label>
            )}
          </div>
          <p className="text-sm p-1">
            {(price - prices[6].low).toFixed(2)} {`SFL`}
          </p>
        </InnerPanel>
      </div>
      <div className="w-1/2 md:w-1/3">
        <InnerPanel>
          <div className="flex justify-between">
            <div>
              <Label type="info">{t("marketplace.sales")}</Label>
              <p className="text-sm p-1">{history.history.totalSales}</p>
            </div>
          </div>
        </InnerPanel>
      </div>
    </div>
  );
};
