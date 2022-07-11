import React from "react";

import { InventoryItemName } from "features/game/types/game";
import { ITEM_DETAILS } from "features/game/types/images";
import { Button } from "components/ui/Button";

interface ConfirmingCancelProps {
  onConfirm: () => void;
  onBack: () => void;
  listingId: number;
  resourceName: InventoryItemName;
  resourceAmount: number;
}

export const Cancelling: React.FC<ConfirmingCancelProps> = ({
  onConfirm,
  onBack,
  listingId,
  resourceName,
  resourceAmount,
}) => (
  <div className="flex flex-col items-center">
    <span>{`Cancel Listing ID #${listingId}`}</span>
    <img src={ITEM_DETAILS[resourceName].image} className="w-16" />
    <span className="text-lg py-2">{`${resourceAmount} ${resourceName}`}</span>

    <Button onClick={onConfirm}>Cancel Trade</Button>
    <Button onClick={onBack}>Back</Button>
  </div>
);
