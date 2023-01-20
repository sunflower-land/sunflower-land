import React, { useContext, useEffect, useState } from "react";
import Decimal from "decimal.js-light";
import { useNavigate } from "react-router-dom";

import { wallet } from "lib/blockchain/wallet";
import { FarmSlot, ListingStatus, getFarmSlots } from "lib/blockchain/Trader";
import * as AuthProvider from "features/auth/lib/Provider";
import { KNOWN_ITEMS } from "features/game/types";
import { Listing } from "features/goblins/trader/buying/components/Listing";
import { Button } from "components/ui/Button";
import { useActor } from "@xstate/react";

interface Props {
  accountId: number;
}

export const BumpkinTrade: React.FC<Props> = ({ accountId }) => {
  const [listings, setListings] = useState<FarmSlot[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const { authService } = useContext(AuthProvider.Context);
  const [authState] = useActor(authService);

  const navigate = useNavigate();

  console.log({ accountId });
  useEffect(() => {
    const load = async () => {
      const items = await getFarmSlots(
        wallet.web3Provider,
        wallet.myAccount,
        accountId
      );

      setListings(items);
      setIsLoading(false);
    };

    load();
  }, []);

  if (isLoading) {
    return <span className="loading my-2 ml-2">Loading</span>;
  }

  if (listings.length === 0) {
    return (
      <p className="text-sm text-center my-2">
        This Bumpkin has nothing to trade.
      </p>
    );
  }

  return (
    <>
      {listings?.map((farmSlot) => {
        // if empty return dashed
        if (
          farmSlot.listing === undefined ||
          farmSlot.listing?.status != ListingStatus.LISTED
        ) {
          return (
            <div
              key={farmSlot.slotId}
              className="border-4 border-dashed border-brown-600 p-3 flex items-center justify-center mb-3"
            >
              <span className="text-sm">Empty</span>
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
            key={farmSlot.slotId}
            listingId={listingId}
            resourceName={resourceName}
            resourceAmount={resourceAmount}
            sfl={listing.sfl}
            tax={listing.tax}
            balance={new Decimal(0)}
          />
        );
      })}
      <Button
        onClick={() => navigate(`/retreat?viewListingsForLand=${accountId}`)}
      >
        Visit Trader
      </Button>
    </>
  );
};
