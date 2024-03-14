import React from "react";

import ticket from "assets/icons/ticket.png";
import { KNOWN_ITEMS } from "features/game/types";
import {
  FarmSlot,
  Listing as ListingType,
  ListingStatus,
} from "lib/blockchain/Trader";

import { Listing } from "./Listing";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

interface IdleProps {
  farmId: number;
  freeListings: number;
  remainingListings: number;
  farmSlots: FarmSlot[];
  onCancel: (listing: ListingType) => void;
}

export const Idle: React.FC<IdleProps> = ({
  farmId,
  freeListings,
  remainingListings,
  farmSlots,
  onCancel,
}) => {
  const { t } = useAppTranslation();
  return (
    <div className="p-2">
      <div className="flex flex-col sm:flex-row mb-4 justify-between items-center w-full">
        <div className="flex items-center mb-1">
          <img src={ticket} className="w-6 mr-2" />
          <p className="text-xxs sm:text-xs whitespace-nowrap">
            {t("free.trade")}
            {":"} {freeListings}
          </p>
        </div>
        <p className="text-xxs sm:text-xs w-auto px-2 py-1 bg-blue-600 text-shadow border rounded-md whitespace-nowrap">
          {t("remaining.trades")}
          {":"} {remainingListings}
        </p>
      </div>
      <h2 className="text-sm mb-2">{`Land #${farmId} Listings`}</h2>

      <div className="space-y-3">
        {farmSlots?.map((farmSlot) => {
          // if empty return dashed
          if (
            !farmSlot.listing ||
            farmSlot.listing?.status !== ListingStatus.LISTED
          ) {
            return <></>;
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
    </div>
  );
};
