import React from "react";

import ticket from "assets/icons/ticket.png";

import { KNOWN_ITEMS } from "features/game/types";
import {
  FarmSlot,
  Listing as ListingType,
  ListingStatus,
} from "lib/blockchain/Trader";

import { Listing } from "./Listing";

interface IdleProps {
  farmId: number;
  freeListings: number;
  remainingListings: number;
  farmSlots: FarmSlot[];
  onDraft: (slotId: number) => void;
  onCancel: (listing: ListingType) => void;
}

export const Idle: React.FC<IdleProps> = ({
  farmId,
  freeListings,
  remainingListings,
  farmSlots,
  onDraft,
  onCancel,
}) => (
  <div className="p-2">
    <h2 className="text-sm mb-2">{`#${farmId} Listings`}</h2>

    <div className="flex justify-between mb-4">
      <img src={ticket} className="w-6 mr-2" />
      <p className="text-xxs sm:text-xs whitespace-nowrap">
        {`Free Trades: ${freeListings}`}
      </p>
      <p className="text-xxs sm:text-xs whitespace-nowrap">
        {`Remaining Trades: ${remainingListings}`}
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
            className="border-4 border-dashed border-brown-600 mb-3 p-3 flex items-center justify-center"
          >
            <span
              className="text-sm cursor-pointer"
              onClick={() => onDraft(farmSlot.slotId)}
            >
              + List Trade
            </span>
          </div>
        );
      }

      // if listed, return a listing UI
      const listing = farmSlot.listing;
      const listingId = listing.id;
      const resourceName = KNOWN_ITEMS[listing.resourceId];
      const resourceAmount = listing.resourceAmount;

      return (
        <Listing
          onCancel={() => onCancel(listing)}
          key={farmSlot.slotId}
          listingId={listingId}
          resourceName={resourceName}
          resourceAmount={resourceAmount}
          sfl={listing.sfl}
          tax={listing.tax}
        />
      );
    })}
  </div>
);
