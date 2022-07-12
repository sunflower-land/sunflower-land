import React from "react";

import token from "assets/icons/token.gif";
import goblin from "assets/npcs/goblin_head.png";

import { Button } from "components/ui/Button";
import { ITEM_DETAILS } from "features/game/types/images";
import { Listing } from "lib/blockchain/Trader";
import { KNOWN_ITEMS } from "features/game/types";

interface ConfirmProps {
  listing: Listing;
  onBack: () => void;
  onConfirm: () => void;
}

export const Confirming: React.FC<ConfirmProps> = ({
  listing,
  onBack,
  onConfirm,
}) => {
  const resourceName = KNOWN_ITEMS[listing.resourceId];
  const resource = ITEM_DETAILS[resourceName];

  // Round to 2 decimal places
  const buyerPays =
    Math.round((listing.sfl + listing.sfl * listing.tax) * 100) / 100;
  const goblinFee = Math.round(listing.sfl * listing.tax * 100) / 100;
  const sellerRecieves = Math.round(listing.sfl * 100) / 100;

  return (
    <div className="flex flex-col items-center">
      <img src={resource.image} className="w-16" />
      <span className="text-lg py-2">{`${listing.resourceAmount} ${resourceName}`}</span>

      <div className="w-2/3">
        <div className="flex items-center justify-between">
          <span className="text-xs whitespace-nowrap">You Pay</span>
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
          <span className="text-xs whitespace-nowrap">Seller Recieve</span>
          <div className="flex items-center">
            <img src={token} className="w-6" />
            <span className="text-base py-2 pl-2">{`${sellerRecieves} SFL`}</span>
          </div>
        </div>
      </div>
      <Button className="mt-1" onClick={onConfirm}>
        Confirm Purchase
      </Button>
      <Button className="mt-1" onClick={onBack}>
        Back
      </Button>
    </div>
  );
};
