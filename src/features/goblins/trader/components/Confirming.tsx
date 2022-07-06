import React from "react";

import { Button } from "components/ui/Button";
import { ITEM_DETAILS } from "features/game/types/images";
import token from "assets/icons/token.gif";
import goblin from "assets/npcs/goblin_head.png";
import { Draft } from "../lib/tradingPostMachine";
import { KNOWN_ITEMS } from "features/game/types";

interface ConfirmProps {
  draft: Draft;
  onCancel: () => void;
  onConfirm: () => void;
}

export const Confirming: React.FC<ConfirmProps> = ({
  draft,
  onCancel,
  onConfirm,
}) => {
  const resource = ITEM_DETAILS[draft.resourceName];
  // TODO Fetch fee from on chain
  const goblinFee = 5;

  return (
    <div className="flex flex-col items-center">
      <img src={resource.image} className="w-16" />
      <span className="text-lg py-2">{`${draft.resourceAmount} ${draft.resourceName}`}</span>

      <div className="w-2/3">
        <div className="flex items-center">
          <span className="text-xs w-44">Buyer Pays</span>
          <img src={token} className="w-6" />
          <span className="text-base py-2 pl-2">{`${
            draft.sfl + goblinFee
          } SFL`}</span>
        </div>
        <div className="flex items-center">
          <span className="text-xs w-44">You Recieve</span>
          <img src={token} className="w-6" />
          <span className="text-base py-2 pl-2">{`${draft.sfl} SFL`}</span>
        </div>
        <div className="flex items-center">
          <span className="text-xs w-44">Goblin Fee</span>
          <img src={goblin} className="w-6" />
          <span className="text-base py-2 pl-2">{`${goblinFee} SFL`}</span>
        </div>
      </div>
      <Button className="mt-1" onClick={onCancel}>
        Cancel
      </Button>
      <Button className="mt-1" onClick={onConfirm}>
        Confirm Listing
      </Button>
    </div>
  );
};
