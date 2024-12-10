import {
  getPriceHistory,
  MarketplaceTrends,
} from "features/game/types/marketplace";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import React, { useContext } from "react";
import { getTradeableDisplay } from "../lib/tradeables";
import classNames from "classnames";
import { useLocation, useNavigate } from "react-router";
import sflIcon from "assets/icons/sfl.webp";
import increaseIcon from "assets/icons/increase_arrow.png";
import decreaseIcon from "assets/icons/decrease_arrow.png";
import Decimal from "decimal.js-light";
import { Loading } from "features/auth/components";
import { Context } from "features/game/GameProvider";

export const TrendingTrades: React.FC<{
  trends?: MarketplaceTrends;
}> = ({ trends }) => {
  const { t } = useAppTranslation();
  const isWorldRoute = useLocation().pathname.includes("/world");

  const { gameService } = useContext(Context);
  const usd = gameService.getSnapshot().context.prices.sfl?.usd ?? 0.0;

  const navigate = useNavigate();

  if (!trends) {
    return <Loading />;
  }

  return (
    <table className="w-full text-xs border-collapse bg-[#ead4aa] ">
      <thead>
        <tr>
          <th className="p-1.5 text-left">
            <p>{t("marketplace.item")}</p>
          </th>
          <th className="p-1.5 text-left">
            <p>{t("marketplace.unitPrice")}</p>
          </th>
          <th className="p-1.5 text-left">
            <p>{t("marketplace.7dChange")}</p>
          </th>
        </tr>
      </thead>
      <tbody>
        {trends.items.map((item, index) => {
          const itemId = item.id;
          const details = getTradeableDisplay({
            id: itemId,
            type: item.collection,
          });

          const prices = getPriceHistory({
            history: item.history,
            from: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).getTime(),
          });

          return (
            <tr
              key={index}
              className={classNames(
                "relative cursor-pointer bg-[#ead4aa] !py-10 hover:shadow-md hover:scale-[100.5%] transition-all",
                {},
              )}
              style={{
                borderBottom: "1px solid #b96f50",
                borderTop: index === 0 ? "1px solid #b96f50" : "",
              }}
              onClick={() =>
                navigate(
                  `${isWorldRoute ? "/world" : ""}/marketplace/${details.type}/${itemId}`,
                )
              }
            >
              <td className="p-1.5 text-left">
                <div className="flex items-center">
                  <img
                    src={details.image}
                    className="h-8 mr-4 w-8 object-contain"
                  />
                  <p className="text-sm">{details.name}</p>
                </div>
              </td>
              <td className="p-1.5 text-left relative">
                <div className="flex items-center">
                  <img src={sflIcon} className="h-5 mr-1" />
                  <div>
                    <p className="text-sm">
                      {new Decimal(prices.dates[0].low).toFixed(2)}
                    </p>
                    <p className="text-xxs">
                      {`$${new Decimal(usd).mul(prices.dates[0].low).toFixed(2)}`}
                    </p>
                  </div>
                </div>
              </td>
              <td className="p-1.5 text-right relative">
                <div className="flex items-center">
                  <img
                    src={
                      prices.sevenDayChange > 0 ? increaseIcon : decreaseIcon
                    }
                    className="h-5 mr-1"
                  />
                  <p className="text-sm">{`${prices.sevenDayChange.toFixed(2)}%`}</p>
                </div>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};
