import classNames from "classnames";
import { Button } from "components/ui/Button";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import React from "react";
import token from "assets/icons/flower_token.webp";
import { Decimal } from "decimal.js-light";
import { NPCIcon } from "features/island/bumpkin/components/NPC";
import { interpretTokenUri } from "lib/utils/tokenUriBuilder";
import { TradeableDisplay } from "../lib/tradeables";
import { formatNumber } from "lib/utils/formatNumber";
import { Checkbox } from "components/ui/Checkbox";

export type TableItem = {
  id: string;
  price: number;
  usd?: number;
  quantity: number;
  createdBy: {
    id: number;
    username: string;
    bumpkinUri: string;
  };
};

interface RowProps {
  item: TableItem;
  index: number;
  farmId: number;
  balance: Decimal;
  tableType: "listings" | "offers";
  inventoryCount: number;
  details: TradeableDisplay;
  isResource: boolean;
  isBulkBuy?: boolean;
  isSelected: boolean;
  onClick?: (id: string) => void;
  onBulkListingSelect?: (id: string, checked: boolean) => void;
}

export const TableRow: React.FC<RowProps> = ({
  item,
  index,
  farmId,
  balance,
  tableType,
  inventoryCount,
  onClick,
  details,
  isResource,
  isBulkBuy,
  isSelected,
  onBulkListingSelect,
}) => {
  const { t } = useAppTranslation();
  const { id, createdBy, quantity, price } = item;

  return (
    <div
      className={classNames(
        "flex items-center relative transition-all text-xs sm:text-sm",
        {
          "bg-[#ead4aa]": index % 2 === 0,
        },
      )}
      style={{
        borderBottom: "1px solid #b96f50",
        borderTop: index === 0 ? "1px solid #b96f50" : "",
      }}
    >
      <div className="p-1.5 truncate flex sm:w-1/3 items-center">
        <div className="flex items-center">
          <div className="relative w-6 sm:w-8 h-8 flex items-center">
            <NPCIcon
              width={24}
              parts={interpretTokenUri(createdBy.bumpkinUri).equipped}
            />
          </div>
          <p className="hidden sm:block truncate py-1">{createdBy.username}</p>
        </div>
      </div>
      <div
        className={classNames("p-1.5 truncate flex items-center", {
          "flex-1": !isResource,
          "w-1/4 sm:flex-1": isResource,
        })}
      >
        <div className="flex items-center justify-start space-x-1">
          <img
            src={details.image}
            className="h-6 w-6 sm:h-8 sm:w-8 object-contain mr-1 sm:mr-4"
          />
          <p className="py-0.5 text-xxs sm:text-sm">
            {`${isResource ? quantity : details.name}`}
          </p>
        </div>
      </div>
      <div
        className={classNames("p-1.5 truncate flex items-center", {
          "flex-2": !isResource,
          "flex-1": isResource,
        })}
      >
        <div className="flex flex-col items-center">
          <div className="flex items-center justify-start space-x-1">
            <img src={token} className="h-6" />
            <div>
              <span className="text-xxs sm:text-sm">{`${formatNumber(price, { decimalPlaces: 4 })} FLOWER`}</span>
              {!isResource && (
                <p className="text-xxs">
                  {`$${new Decimal(item.usd ?? 0).mul(price).toFixed(2)} USD`}
                </p>
              )}
              {isResource && (
                <div className="text-[16px] sm:text-xxs w-full">
                  {t("bumpkinTrade.price/unit", {
                    price: formatNumber(price / Number(quantity), {
                      decimalPlaces: 4,
                    }),
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {onClick && !isBulkBuy && (
        <div className="p-1 text-center w-[65px] sm:min-w-[94px]">
          <Button
            disabled={
              createdBy.id === farmId ||
              (tableType === "listings" && balance.lt(price)) ||
              (tableType === "offers" && inventoryCount < quantity)
            }
            className="w-full h-8 rounded-none"
            onClick={() => onClick(id)}
          >
            <p className="text-xxs sm:text-sm">
              {t(tableType === "listings" ? "buy" : "accept")}
            </p>
          </Button>
        </div>
      )}
      {isBulkBuy && (
        <div className="p-1 flex items-center justify-end w-[65px] mr-2">
          {createdBy.id !== farmId && (
            <Checkbox
              checked={isSelected}
              onChange={(checked) => onBulkListingSelect?.(id, checked)}
            />
          )}
        </div>
      )}
    </div>
  );
};
