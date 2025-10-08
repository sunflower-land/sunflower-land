import React from "react";
import { NumberInput } from "components/ui/NumberInput";

import token from "assets/icons/flower_token.webp";
import Decimal from "decimal.js-light";
import { ITEM_DETAILS } from "features/game/types/images";
import { InventoryItemName } from "features/game/types/game";

type Props = {
  resource: InventoryItemName;
  totalResources: number;
  totalPrice: number;
  maxLimit: number;
  minAmountToBuy: number;
  onMinAmountChange: (value: number) => void;
};

export const BulkBuyInterface: React.FC<Props> = ({
  resource,
  totalResources,
  totalPrice,
  maxLimit,
  minAmountToBuy,
  onMinAmountChange,
}) => {
  const atLimit = minAmountToBuy > maxLimit || minAmountToBuy < 0;

  return (
    <div className="mt-0.5 gap-1">
      <p className="text-xs mb-2 p-1">
        {`You can enter a min amount of resources or select individual listings.`}
      </p>
      <div className="flex gap-1 border border-brown-100">
        <div className="flex flex-col w-1/2 border-r border-brown-100">
          <div className="flex flex-col gap-1 p-1">
            <p className="text-xs ml-1">{`Want to buy:`}</p>
            <div className="flex items-center gap-1">
              <NumberInput
                value={new Decimal(minAmountToBuy)}
                maxDecimalPlaces={0}
                isOutOfRange={atLimit}
                onValueChange={(value) => {
                  onMinAmountChange(value.toNumber());
                }}
                className="w-[120px]"
              />
            </div>
          </div>
          <div className="pl-2 text-[16px] -mt-1.5">{`Limit: ${maxLimit}`}</div>
        </div>
        <div className="flex flex-grow-1 flex-col w-1/2 justify-evenly p-1 text-xs sm:text-sm">
          <div className="flex justify-between">
            <div className="flex gap-1">
              <span>Total</span>
              <img
                src={ITEM_DETAILS[resource].image}
                alt="token"
                className="w-4 mt-0.5"
              />{" "}
            </div>
            <div>
              <span>{totalResources}</span>
            </div>
          </div>
          <div className="flex justify-between">
            <div className="flex gap-1">
              <span>Total</span>
              <img src={token} alt="token" className="w-4 mt-0.5" />{" "}
            </div>
            <div className="flex items-center gap-1">
              <span>{totalPrice}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
