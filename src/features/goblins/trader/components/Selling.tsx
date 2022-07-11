import { Button } from "components/ui/Button";
import { KNOWN_ITEMS } from "features/game/types";
import { FarmSlot, ListingStatus } from "lib/blockchain/Trader";
import React from "react";
import { Cancel } from "../lib/tradingPostMachine";
import { Listing } from "./Listing";

interface SellingProps {
  freeListings: number;
  remainingListings: number;
  farmSlots: FarmSlot[];
  onList: (slotId: number) => void;
  onCancel: (cancel: Cancel) => void;
  onClose: () => void;
}

export const Selling: React.FC<SellingProps> = ({
  freeListings,
  remainingListings,
  farmSlots,
  onList,
  onCancel,
  onClose,
}) => (
  <div className="p-2">
    <div className="flex justify-between mb-4">
      <p className="text-xxs sm:text-xs whitespace-nowrap">
        {`Free Trades: ${freeListings}`}
      </p>
      <p className="text-xxs sm:text-xs whitespace-nowrap">
        Remaining Trades: {remainingListings}
      </p>
    </div>

    {farmSlots?.map((farmSlot) => {
      // if empty return dashed
      if (
        !farmSlot.listing ||
        farmSlot.listing?.status !== ListingStatus.LISTED
      ) {
        return (
          <div
            key={farmSlot.slotId}
            className="border-4 border-dashed border-brown-600 mb-2 h-12 flex items-center justify-center"
          >
            <span className="text-sm" onClick={() => onList(farmSlot.slotId)}>
              + List Trade
            </span>
          </div>
        );
      }

      const listingId = farmSlot.listing.id;
      const resourceName = KNOWN_ITEMS[farmSlot.listing.resourceId];
      const resourceAmount = farmSlot.listing.resourceAmount;
      // if listed, return a listing UI
      return (
        <Listing
          onCancel={() =>
            onCancel({
              listingId: listingId,
              resourceName: resourceName,
              resourceAmount: resourceAmount,
            })
          }
          key={farmSlot.slotId}
          listingId={listingId}
          resourceName={resourceName}
          resourceAmount={resourceAmount}
          sfl={farmSlot.listing.sfl}
          tax={farmSlot.listing.tax}
        />
      );
    })}

    <Button className="mr-1" onClick={onClose}>
      Close
    </Button>
  </div>
);
