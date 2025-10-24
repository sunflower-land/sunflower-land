import { Listing, Offer } from "features/game/types/marketplace";
import React, { useContext } from "react";
import { TradeableDisplay } from "../lib/tradeables";
import Decimal from "decimal.js-light";
import { Context } from "features/game/GameProvider";
import { TableRow } from "./TableRow";

export const OfferTable: React.FC<{
  offers: Offer[];
  id: number;
  details: TradeableDisplay;
  isResource: boolean;
}> = ({ offers, id, details, isResource }) => {
  const { gameService } = useContext(Context);
  const usd = gameService.getSnapshot().context.prices.sfl?.usd ?? 0.0;

  if (offers.length === 0) return null;

  return (
    <div className="w-full relative border-collapse mb-2 max-h-[200px] scrollable overflow-y-auto overflow-x-hidden">
      <div>
        {offers.map((offer, index) => {
          return (
            <TableRow
              farmId={id}
              balance={new Decimal(0)}
              tableType="offers"
              inventoryCount={0}
              key={index}
              details={details}
              item={{
                id: offer.tradeId,
                price: offer.sfl,
                usd,
                quantity: offer.quantity,
                createdBy: offer.offeredBy,
              }}
              isResource={isResource}
              index={index}
              isSelected={false}
            />
          );
        })}
      </div>
    </div>
  );
};

export const ListingTable: React.FC<{
  listings: Listing[];
  details: TradeableDisplay;
  isResource: boolean;
}> = ({ listings, details, isResource }) => {
  const { gameService } = useContext(Context);
  const usd = gameService.getSnapshot().context.prices.sfl?.usd ?? 0.0;

  return (
    <div className="w-full relative border-collapse mb-2 max-h-[200px] scrollable overflow-y-auto overflow-x-hidden">
      <div>
        {listings.map((listing, index) => {
          return (
            <TableRow
              key={index}
              farmId={142}
              balance={new Decimal(0)}
              tableType="listings"
              inventoryCount={0}
              details={details}
              item={{
                id: listing.id,
                price: listing.sfl,
                usd,
                quantity: 1,
                createdBy: listing.listedBy,
              }}
              isResource={isResource}
              index={index}
              isSelected={false}
            />
          );
        })}
      </div>
    </div>
  );
};
