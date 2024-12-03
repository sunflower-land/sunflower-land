import React from "react";
import sflIcon from "assets/icons/sfl.webp";
import { InnerPanel } from "components/ui/Panel";
import { Label } from "components/ui/Label";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { SaleHistory as ISaleHistory } from "features/game/types/marketplace";
import { Loading } from "features/auth/components";
import classNames from "classnames";
import { NPC } from "features/island/bumpkin/components/NPC";
import { interpretTokenUri } from "lib/utils/tokenUriBuilder";
import { getRelativeTime } from "lib/utils/time";
import increaseRightArrow from "assets/icons/increase_right_arrow.webp";
import decreaseLeftArrow from "assets/icons/decrease_left_arrow.webp";

export const SaleHistory: React.FC<{ history?: ISaleHistory }> = ({
  history,
}) => {
  const { t } = useAppTranslation();
  return (
    <InnerPanel>
      <Label type="default" className="mb-1">
        {t("marketplace.saleHistory")}
      </Label>
      <div className="p-1">
        {history ? <Sales sales={history.sales ?? []} /> : <Loading />}
      </div>
    </InnerPanel>
  );
};

export const Sales: React.FC<{ sales: ISaleHistory["sales"] }> = ({
  sales,
}) => {
  const { t } = useAppTranslation();
  if (sales.length === 0) {
    return <p>{t("marketplace.noSales")}</p>;
  }

  return (
    <>
      <table className="table-auto w-full text-xs border-collapse">
        <tbody>
          {sales.map(
            (
              { sfl, quantity, fulfilledAt, fulfilledBy, initiatedBy, source },
              index,
            ) => {
              const [seller, buyer] =
                source === "listing"
                  ? [initiatedBy, fulfilledBy]
                  : [fulfilledBy, initiatedBy];

              return (
                <tr
                  key={index}
                  className={classNames("relative", {
                    "bg-[#ead4aa]": index % 2 === 0,
                  })}
                >
                  <td className="p-1.5 truncate text-center relative">
                    <div className="flex items-center">
                      <div className="relative w-8 h-8">
                        <div className="absolute -top-1">
                          <NPC
                            width={20}
                            parts={
                              interpretTokenUri(seller.bumpkinUri).equipped
                            }
                          />
                        </div>

                        <div className="absolute left-3.5">
                          <NPC
                            width={20}
                            parts={interpretTokenUri(buyer.bumpkinUri).equipped}
                          />
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-1.5 truncate text-center relative">
                    <div className="flex items-center">
                      <div className="flex flex-col">
                        <div className="flex items-center gap-1">
                          <img src={increaseRightArrow} className="h-3" />
                          <p className="text-xxs">{buyer.username}</p>
                        </div>
                        <div className="flex items-center gap-1">
                          <img src={decreaseLeftArrow} className="h-3" />
                          <p className="text-xxs">{seller.username}</p>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-1.5 ">
                    <div className="flex items-center">
                      <img src={sflIcon} className="w-4 mr-1" />
                      <p className="text-xs sm:text-sm">{sfl}</p>
                    </div>
                  </td>
                  <td className="p-1.5 text-xs sm:text-sm truncate text-center">
                    {getRelativeTime(fulfilledAt)}
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
