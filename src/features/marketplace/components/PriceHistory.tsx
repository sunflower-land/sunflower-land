import React from "react";
import sflIcon from "assets/icons/flower_token.webp";
import { InnerPanel } from "components/ui/Panel";
import { Label } from "components/ui/Label";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { SaleHistory as ISaleHistory } from "features/game/types/marketplace";
import { Loading } from "features/auth/components";
import classNames from "classnames";
import { NPCIcon } from "features/island/bumpkin/components/NPC";
import { interpretTokenUri } from "lib/utils/tokenUriBuilder";
import { getRelativeTime } from "lib/utils/time";
import { useNavigate } from "react-router";
import { getTradeableDisplay } from "../lib/tradeables";
import { INITIAL_FARM } from "features/game/lib/constants";
import { SUNNYSIDE } from "assets/sunnyside";

export const SaleHistory: React.FC<{ history?: ISaleHistory }> = ({
  history,
}) => {
  const { t } = useAppTranslation();
  return (
    <InnerPanel>
      <Label type="default" className="m-1">
        {t("marketplace.saleHistory")}
      </Label>
      <div className="p-2">
        {history ? <Sales sales={history.sales ?? []} /> : <Loading />}
      </div>
    </InnerPanel>
  );
};

export const Sales: React.FC<{ sales: ISaleHistory["sales"] }> = ({
  sales,
}) => {
  const { t } = useAppTranslation();

  const navigate = useNavigate();

  if (sales.length === 0) {
    return <p className="mb-2 ml-1">{t("marketplace.noSales")}</p>;
  }

  return (
    <>
      <table className="table-auto w-full text-xs border-collapse">
        <tbody>
          {sales.map(
            (
              {
                sfl,
                quantity,
                collection,
                itemId,
                fulfilledAt,
                fulfilledBy,
                initiatedBy,
                source,
              },
              index,
            ) => {
              const details = getTradeableDisplay({
                id: itemId,
                type: collection,
                state: INITIAL_FARM,
              });

              const [seller, buyer] =
                source === "listing"
                  ? [initiatedBy, fulfilledBy]
                  : [fulfilledBy, initiatedBy];

              return (
                <tr
                  key={index}
                  className={classNames("relative cursor-pointer", {
                    "bg-[#ead4aa]": index % 2 === 0,
                  })}
                  onClick={() => {
                    navigate(`/marketplace/profile/${buyer.id}`);
                  }}
                >
                  <td className="p-1.5 sm:w-1/3 truncate text-center relative">
                    <div className="flex items-center">
                      <div className="relative w-10 h-6">
                        <div className="absolute -top-1">
                          <NPCIcon
                            width={24}
                            parts={
                              interpretTokenUri(seller.bumpkinUri).equipped
                            }
                          />
                        </div>

                        <div className="absolute left-3.5">
                          <NPCIcon
                            width={24}
                            parts={interpretTokenUri(buyer.bumpkinUri).equipped}
                          />
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-1 flex-wrap">
                          <span className="text-xxs">{seller.username}</span>
                          <span className="text-xxs">
                            {`(${source === "listing" ? t("marketplace.sold") : t("marketplace.accepted")})`}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="flex items-center gap-1 flex-wrap">
                            <span className="text-xxs">{buyer.username}</span>
                            <span className="text-xxs">
                              {`(${source === "listing" ? t("marketplace.bought") : t("marketplace.offered")})`}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="p-1.5 hidden sm:table-cell min-w-[70px]">
                    <div className="flex items-center mb-1">
                      <img src={details.image} className="w-4 mr-1" />
                      {quantity > 1 && (
                        <p className="text-xs sm:text-sm mr-1.5">{`${quantity} x `}</p>
                      )}
                      <p className="text-xs sm:text-sm truncate">
                        {details.translatedName ?? details.name}
                      </p>
                    </div>
                  </td>
                  <td className="p-1.5 hidden sm:table-cell">
                    <div className="flex items-center">
                      <img src={sflIcon} className="w-4 mr-1" />
                      <p className="text-xs sm:text-sm">{`${sfl}`}</p>
                    </div>
                  </td>
                  <td className="p-1.5 text-xs   hidden sm:table-cell">
                    <div className="flex items-center justify-end">
                      <p className="text-xs truncate">
                        {getRelativeTime(fulfilledAt)}
                      </p>
                    </div>
                  </td>
                  <td className="p-1.5 table-cell sm:hidden">
                    <div className="flex items-center mb-1">
                      <img src={details.image} className="w-4 mr-1" />
                      {quantity > 1 && (
                        <p className="text-xs sm:text-sm mr-1.5">{`${quantity} x `}</p>
                      )}
                      <p className="text-xs sm:text-sm">{details.name}</p>
                    </div>
                    <div className="flex items-center mb-1">
                      <img src={sflIcon} className="w-4 mr-1" />
                      <p className="text-xs sm:text-sm">{`${sfl} FLOWER`}</p>
                    </div>
                    <div className="flex items-center">
                      <img
                        src={SUNNYSIDE.icons.stopwatch}
                        className="w-4 mr-1"
                      />
                      <p className="text-xs sm:text-sm">
                        {getRelativeTime(fulfilledAt)}
                      </p>
                    </div>
                  </td>
                </tr>
              );
            },
          )}
        </tbody>
      </table>
    </>
  );
};
