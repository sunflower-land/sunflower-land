import { MarketplaceTrends } from "features/game/types/marketplace";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import React from "react";
import { getTradeableDisplay } from "../lib/tradeables";
import classNames from "classnames";
import sflIcon from "assets/icons/sfl.webp";
import Decimal from "decimal.js-light";
import { Loading } from "features/auth/components";
import { NPCIcon } from "features/island/bumpkin/components/NPC";
import { interpretTokenUri } from "lib/utils/tokenUriBuilder";
import { useNavigate } from "react-router-dom";

export const TopTrades: React.FC<{
  trends?: MarketplaceTrends;
}> = ({ trends }) => {
  const { t } = useAppTranslation();
  const navigate = useNavigate();
  if (!trends) {
    return <Loading />;
  }

  return (
    <div className="w-full text-xs  border-collapse  ">
      <div>
        {trends.topTrades.map((item, index) => {
          const quantity = item.quantity;
          const price = item.sfl;

          const details = getTradeableDisplay({
            type: item.collection,
            id: item.itemId,
          });

          return (
            <div
              key={index}
              className={classNames("flex items-center relative p-1.5 ", {
                "bg-[#ead4aa]": index % 2 === 0,
              })}
              style={{
                borderBottom: "1px solid #b96f50",
                borderTop: index === 0 ? "1px solid #b96f50" : "",
              }}
            >
              <div className="flex flex-wrap items-center flex-1">
                <div className="mr-2  text-left  flex items-center sm:w-1/2 w-full">
                  <div className="h-8 w-8 mr-2">
                    <img src={details.image} className="h-full object-fit" />
                  </div>
                  <p className="text-sm">{`${details.name}`}</p>
                </div>

                <div
                  className="flex items-center flex-1 sm:w-1/2 w-full cursor-pointer"
                  onClick={() => {
                    navigate(`/marketplace/profile/${item.buyer.id}`);
                  }}
                >
                  <div className="relative w-8 h-8 flex items-center justify-center mr-2">
                    <NPCIcon
                      width={20}
                      parts={interpretTokenUri(item.buyer.bumpkinUri).equipped}
                    />
                  </div>
                  <p className="text-xs sm:text-sm flex-1 truncate">
                    {item.buyer.username}
                  </p>
                </div>
              </div>

              <div className="p-1.5 text-right relative flex items-center justify-end w-32">
                <img src={sflIcon} className="h-5 mr-1" />
                <p className="text-sm">{new Decimal(price).toFixed(2)}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
