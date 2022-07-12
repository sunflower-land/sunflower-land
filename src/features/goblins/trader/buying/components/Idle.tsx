import React from "react";

import { Button } from "components/ui/Button";
import {
  FarmSlot,
  ListingStatus,
  Listing as ListingType,
} from "lib/blockchain/Trader";
import { KNOWN_ITEMS } from "features/game/types";
import { Listing } from "./Listing";

type FormEvent = Element & {
  farmId: {
    value: string;
  };
};

interface IdleProps {
  visitingFarmId?: number;
  vistingFarmSlots: FarmSlot[];
  onVisit: (farmId: number) => void;
  onPurchase: (listing: ListingType) => void;
}

export const Idle: React.FC<IdleProps> = ({
  visitingFarmId,
  vistingFarmSlots,
  onVisit,
  onPurchase,
}) => {
  const visit = (event: React.SyntheticEvent) => {
    event.preventDefault();

    const _farmId = parseInt((event.target as FormEvent).farmId.value);

    if (isNaN(_farmId) || _farmId <= 0) return;

    onVisit(_farmId);
  };

  return (
    <div className="p-2">
      {visitingFarmId && (
        <h2 className="text-sm mb-2">{`#${visitingFarmId} Listings`}</h2>
      )}
      {visitingFarmId &&
        vistingFarmSlots?.map((farmSlot) => {
          // if empty return dashed
          if (
            farmSlot.listing === undefined ||
            farmSlot.listing?.status != ListingStatus.LISTED
          ) {
            return (
              <div
                key={farmSlot.slotId}
                className="border-4 border-dashed border-brown-600 mb-2 h-12 flex items-center justify-center"
              >
                <span className="text-xs">Empty</span>
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
              onPurchase={() => onPurchase(listing)}
              key={farmSlot.slotId}
              listingId={listingId}
              resourceName={resourceName}
              resourceAmount={resourceAmount}
              sfl={listing.sfl}
              tax={listing.tax}
            />
          );
        })}

      <form onSubmit={visit} className="flex items-center justify-between">
        <span className="text-shadow text-sm whitespace-nowrap">
          {"Visit Farm ID: "}
        </span>
        <input
          type="number"
          name="farmId"
          className="text-shadow shadow-inner shadow-black bg-brown-200 w-36 p-2 m-2 text-center "
        />
        <Button className="overflow-hidden ml-1 text-sm" type="submit">
          Visit
        </Button>
      </form>
    </div>
  );
};
