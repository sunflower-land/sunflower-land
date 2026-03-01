import React from "react";
import { NumberInput } from "components/ui/NumberInput";

import token from "assets/icons/flower_token.webp";
import Decimal from "decimal.js-light";
import { ITEM_DETAILS } from "features/game/types/images";
import { InventoryItemName } from "features/game/types/game";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { isMobile } from "mobile-device-detect";
import { formatNumber } from "lib/utils/formatNumber";

type Props = {
  resource: InventoryItemName;
  totalResources: number;
  totalPrice: number;
  maxLimit: number;
  maxAmountToBuy: number;
  onMaxAmountToBuyChange: (value: number) => void;
};

export const BulkBuyInterface: React.FC<Props> = ({
  resource,
  totalResources,
  totalPrice,
  maxLimit,
  maxAmountToBuy,
  onMaxAmountToBuyChange,
}) => {
  const { t } = useAppTranslation();
  const atLimit = maxAmountToBuy > maxLimit || maxAmountToBuy < 0;
  const averagePricePerUnit =
    totalResources > 0 ? totalPrice / totalResources : 0;

  return (
    <div className="mt-0.5 gap-1">
      <p className="text-xs mb-2 p-1">{t("marketplace.bulkBuyDescription")}</p>
      <div className="flex gap-1 border border-brown-100">
        <div className="flex flex-col w-1/2 border-r border-brown-100">
          <div className="flex flex-col gap-1 p-1">
            <p className="text-xs ml-1">
              {isMobile
                ? t("marketplace.maxAmtToBuy")
                : t("marketplace.maxToBuy")}
            </p>
            <div className="flex items-center gap-1">
              <NumberInput
                value={new Decimal(maxAmountToBuy)}
                maxDecimalPlaces={0}
                isOutOfRange={atLimit}
                onValueChange={(value) => {
                  onMaxAmountToBuyChange(value.toNumber());
                }}
                className="w-[120px]"
              />
            </div>
          </div>
          {maxLimit !== Infinity && (
            <div className="pl-2 text-[20px] -mt-1.5">
              {t("marketplace.limit", {
                maxLimit: formatNumber(maxLimit, { decimalPlaces: 0 }),
              })}
            </div>
          )}
        </div>
        <div className="flex flex-grow-1 flex-col w-1/2 justify-evenly p-1 gap-1 text-xs sm:text-sm">
          <div className="flex justify-between">
            <div className="flex gap-1">
              <span>{t("total")}</span>
              <img
                src={ITEM_DETAILS[resource].image}
                alt="token"
                className="w-4 mt-0.5"
              />
            </div>
            <div>
              <span>{totalResources}</span>
            </div>
          </div>
          <div className="flex justify-between">
            <div className="flex gap-1">
              <span>{t("total")}</span>
              <img src={token} alt="token" className="w-4 mt-0.5" />
            </div>
            <div className="flex items-center gap-1">
              <span>
                {formatNumber(Math.max(totalPrice, 0), { decimalPlaces: 4 })}
              </span>
            </div>
          </div>
          <div className="flex justify-between">
            <div className="flex gap-1">
              {`${t("marketplace.unitPrice")}: `}
            </div>
            <div>
              {formatNumber(
                isNaN(averagePricePerUnit) ? 0.00027 : averagePricePerUnit,
                { decimalPlaces: 4 },
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
