import React from "react";

import token from "assets/icons/token_2.png";
import goblin from "assets/npcs/goblin_head.png";

import { Button } from "components/ui/Button";
import { ITEM_DETAILS } from "features/game/types/images";

import { Draft } from "../lib/sellingMachine";

interface ConfirmProps {
  tax: number;
  draft: Draft;
  onBack: () => void;
  onConfirm: () => void;
}

export const Confirming: React.FC<ConfirmProps> = ({
  tax,
  draft,
  onBack,
  onConfirm,
}) => {
  const resource = ITEM_DETAILS[draft.resourceName];

  // Round to 2 decimal places
  const buyerPays = Math.round((draft.sfl + draft.sfl * tax) * 100) / 100;
  const goblinFee = Math.round(draft.sfl * tax * 100) / 100;
  const sellerReceives = Math.round(draft.sfl * 100) / 100;

  return (
    <div className="flex flex-col items-center">
      <div className="flex flex-col items-center p-2">
        <img src={resource.image} className="w-12" />
        <span className="text-lg pt-2">{`${draft.resourceAmount} ${draft.resourceName}`}</span>
      </div>
      <div className="p-2 w-full">
        <div className="flex items-center">
          <span className="text-xs sm:text-sm whitespace-nowrap w-1/2">
            Buyer Pays
          </span>
          <div className="flex items-center w-1/2">
            <img src={token} className="w-6" />
            <span className="py-2 pl-2 whitespace-nowrap">{`${buyerPays} SFL`}</span>
          </div>
        </div>
        <div className="flex items-center">
          <span className="text-xs sm:text-sm whitespace-nowrap w-1/2">
            Goblin Fee
          </span>
          <div className="flex items-center w-1/2">
            <img src={goblin} className="w-6" />
            <span className="py-2 pl-2 whitespace-nowrap">{`${goblinFee} SFL`}</span>
          </div>
        </div>
        <div className="flex items-center">
          <span className="text-xs sm:text-sm whitespace-nowrap w-1/2">
            You Receive
          </span>
          <div className="flex items-center w-1/2">
            <img src={token} className="w-6" />
            <span className="py-2 pl-2 whitespace-nowrap">{`${sellerReceives} SFL`}</span>
          </div>
        </div>
      </div>
      <div className="flex space-x-2 w-full">
        <Button onClick={onBack}>Back</Button>
        <Button onClick={onConfirm}>Confirm</Button>
      </div>
    </div>
  );
};
