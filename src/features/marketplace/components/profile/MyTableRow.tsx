import React from "react";
import { getTradeableDisplay } from "features/marketplace/lib/tradeables";
import { Button } from "components/ui/Button";
import classNames from "classnames";
import Decimal from "decimal.js-light";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { CollectionName } from "features/game/types/marketplace";

import sflIcon from "assets/icons/sfl.webp";

type MyTableRowProps = {
  index: number;
  id: string;
  itemId: number;
  pageItemId: string;
  itemName: string;
  quantity: number;
  price: number;
  collection: CollectionName;
  unitPrice: number;
  usdPrice: number;
  isFulfilled: boolean;
  isResource: boolean;
  onCancel: (id: string) => void;
  onClaim: (id: string) => void;
  onRowClick: () => void;
};

export const MyTableRow: React.FC<MyTableRowProps> = ({
  id,
  index,
  itemId,
  collection,
  quantity,
  price,
  pageItemId,
  unitPrice,
  usdPrice,
  isResource,
  isFulfilled,
  onCancel,
  onRowClick,
  onClaim,
}) => {
  const { t } = useAppTranslation();
  const details = getTradeableDisplay({
    id: itemId,
    type: collection,
  });

  return (
    <div
      className={classNames(
        "relative bg-[#ead4aa] transition-all flex items-center",
        {
          "hover:shadow-md hover:scale-[100.5%] cursor-pointer":
            Number(pageItemId) !== itemId,
        },
      )}
      style={{
        borderBottom: "1px solid #b96f50",
        borderTop: index === 0 ? "1px solid #b96f50" : "",
      }}
      onClick={onRowClick}
    >
      <div className="p-1.5 flex w-1/3 items-center">
        <div className="flex items-center">
          <img
            src={details.image}
            className="h-6 w-6 sm:h-8 sm:w-8 object-contain mr-3 sm:mr-4"
          />
          <p className="py-0.5 text-xxs sm:text-sm">
            {isResource ? quantity : details.name}
          </p>
        </div>
      </div>
      <div className="p-1.5 truncate flex flex-1 items-center">
        <div className="flex flex-col items-start justify-center">
          <div className="flex items-center justify-start space-x-1">
            <img src={sflIcon} className="h-6" />
            <div>
              <span className="sm:text-sm">{`${price.toFixed(2)} SFL`}</span>
              {!isResource && (
                <p className="text-xxs">
                  {`$${new Decimal(usdPrice).mul(price).toFixed(2)} USD`}
                </p>
              )}
              {isResource && (
                <div className="text-xxs w-full">
                  {t("bumpkinTrade.price/unit", {
                    price: unitPrice.toFixed(4),
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="p-1 text-center w-[65px] sm:min-w-[94px]">
        <Button
          variant="secondary"
          className="w-full h-8 rounded-none"
          onClick={(e) => {
            e.stopPropagation();
            if (isFulfilled) {
              onClaim(id);
            } else {
              onCancel(id);
            }
          }}
        >
          <p className="text-xxs sm:text-sm">
            {isFulfilled ? t("claim") : t("cancel")}
          </p>
        </Button>
      </div>
    </div>
  );
};
