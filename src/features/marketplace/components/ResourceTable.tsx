import classNames from "classnames";
import { Button } from "components/ui/Button";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import React from "react";
import token from "assets/icons/sfl.webp";
import { Decimal } from "decimal.js-light";
import { ITEM_DETAILS } from "features/game/types/images";
import { InventoryItemName } from "features/game/types/game";
import { NPC } from "features/island/bumpkin/components/NPC";
import { interpretTokenUri } from "lib/utils/tokenUriBuilder";

type TableItem = {
  id: string;
  price: number;
  pricePerUnit: number;
  quantity: number;
  createdBy: {
    id: number;
    username: string;
    bumpkinUri: string;
  };
};

export const ResourceTable: React.FC<{
  itemName: InventoryItemName;
  items: TableItem[];
  id: number;
  balance: Decimal;
  tableType: "listings" | "offers";
  inventoryCount: number;
  onClick: (id: string) => void;
}> = ({
  items,
  id: farmId,
  balance,
  tableType,
  inventoryCount,
  onClick,
  itemName,
}) => {
  const { t } = useAppTranslation();

  return (
    <div className="max-h-[200px] scrollable overflow-y-auto relative">
      {items.map(({ id, createdBy, quantity, price, pricePerUnit }, index) => (
        <div
          key={id}
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
              <div className="relative w-8 h-8 flex items-center">
                <NPC
                  width={20}
                  parts={interpretTokenUri(createdBy.bumpkinUri).equipped}
                />
              </div>
              <p className="hidden sm:block truncate py-1">
                {createdBy.username}
              </p>
            </div>
          </div>
          <div className="p-1.5 truncate flex flex-1 items-center">
            <div className="flex items-center justify-start w-16 space-x-1">
              <img src={ITEM_DETAILS[itemName].image} className="h-4" />
              <span>{quantity}</span>
            </div>
          </div>
          <div className="p-1.5 truncate flex flex-1 items-center">
            <div className="flex flex-col items-center">
              <div className="flex justify-start w-16 mx-auto space-x-1">
                <img src={token} className="h-5" />
                <span>{price}</span>
              </div>
              <span className="text-xxs ml-1.5">
                {t("bumpkinTrade.price/unit", {
                  price: pricePerUnit.toFixed(4),
                })}
              </span>
            </div>
          </div>

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
        </div>
      ))}
    </div>
  );
};
