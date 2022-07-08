import React from "react";

import { Button } from "components/ui/Button";
import { ITEM_DETAILS } from "features/game/types/images";
import token from "assets/icons/token.gif";
import goblin from "assets/npcs/goblin_head.png";
import { Draft } from "../lib/tradingPostMachine";

interface ConfirmProps {
  tax: number;
  draft: Draft;
  onCancel: () => void;
  onConfirm: () => void;
}

export const Confirming: React.FC<ConfirmProps> = ({
  tax,
  draft,
  onCancel,
  onConfirm,
}) => {
  const resource = ITEM_DETAILS[draft.resourceName];

  // Round to 2 decimal places
  const buyerPays = Math.round((draft.sfl + draft.sfl * tax) * 100) / 100;
  const goblinFee = Math.round(draft.sfl * tax * 100) / 100;
  const sellerRecieves = Math.round(draft.sfl * 100) / 100;

  return (
    <div className="flex flex-col items-center">
      <img src={resource.image} className="w-16" />
      <span className="text-lg py-2">{`${draft.resourceAmount} ${draft.resourceName}`}</span>

      <div className="w-2/3">
        <div className="flex items-center justify-between">
          <span className="text-xs whitespace-nowrap">Buyer Pays</span>
          <div className="flex items-center">
            <img src={token} className="w-6" />
            <span className="text-base py-2 pl-2">{`${buyerPays} SFL`}</span>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs whitespace-nowrap">Goblin Fee</span>
          <div className="flex items-center">
            <img src={goblin} className="w-6" />
            <span className="text-base py-2 pl-2">{`${goblinFee} SFL`}</span>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs whitespace-nowrap">You Recieve</span>
          <div className="flex items-center">
            <img src={token} className="w-6" />
            <span className="text-base py-2 pl-2">{`${sellerRecieves} SFL`}</span>
          </div>
        </div>
      </div>
      <Button className="mt-1" onClick={onConfirm}>
        Confirm Listing
      </Button>
      <Button className="mt-1" onClick={onCancel}>
        Cancel
      </Button>
    </div>
  );
};
