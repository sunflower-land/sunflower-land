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
    <div className="flex flex-col items-center p2">
      <span className="mb-2">{`Cancel Listing ID #${listingId}`}</span>
      <img src={ITEM_DETAILS[resourceName].image} className="w-12" />
      <span className="text-lg py-2">{`${resourceAmount} ${resourceName}`}</span>
    </div>
    <Button onClick={onConfirm} className="mb-1">
      Cancel Trade
    </Button>
    <Button onClick={onBack}>Back</Button>
  </div>
);
