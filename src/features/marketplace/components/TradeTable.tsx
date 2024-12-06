import classNames from "classnames";
import {
  CollectionName,
  Listing,
  Offer,
} from "features/game/types/marketplace";
import React, { useContext } from "react";
import { TradeableDisplay } from "../lib/tradeables";
import Decimal from "decimal.js-light";
import { formatNumber } from "lib/utils/formatNumber";
import sflIcon from "assets/icons/sfl.webp";
import { getKeys } from "features/game/types/decorations";
import { TRADE_LIMITS } from "features/game/actions/tradeLimits";
import { InventoryItemName } from "features/game/types/game";
import { NPC } from "features/island/bumpkin/components/NPC";
import { interpretTokenUri } from "lib/utils/tokenUriBuilder";
import { Context } from "features/game/GameProvider";

type TradeRowProps = {
  details: TradeableDisplay;
  price: number;
  usd: number;
  user: {
    username: string;
    bumpkinUri: string;
  };
  isResource?: boolean;
  quantity?: number;
  index: number;
};

const TradeRow: React.FC<TradeRowProps> = ({
  details,
  price,
  usd,
  user,
  isResource = false,
  quantity = 1,
  index,
}) => (
  <div
    className={classNames(
      "flex items-center relative transition-all text-xs sm:text-sm",
      {
        "bg-[#ead4aa]": index % 2 === 0,
      },
    )}
    style={{
      borderBottom: "1px solid #b96f50",
      borderTop: index === 0 ? "1px solid #b96f50" : "",
    }}
  >
    <div className="p-1.5 flex w-1/3 items-center">
      <img
        src={details.image}
        className="h-6 w-6 sm:h-8 sm:w-8 mr-3 object-contain"
      />
      <p className="py-0.5 text-xxs sm:text-sm">
        {`${isResource ? quantity + " x" : ""} ${details.name}`}
      </p>
    </div>
    <div className="flex-1 flex items-center justify-between">
      <div className="flex items-center flex-1 overflow-hidden">
        <div className="relative w-8 h-8">
          <NPC width={20} parts={interpretTokenUri(user.bumpkinUri).equipped} />
        </div>
        <p className="text-xs sm:text-sm flex-1 truncate">{user.username}</p>
      </div>
      <div className="p-1.5 text-right relative flex items-center justify-end">
        <img src={sflIcon} className="h-6 mr-1" />
        <div>
          <p className="text-sm">
            {new Decimal(
              isResource
                ? formatNumber(price / quantity, {
                    decimalPlaces: 4,
                  })
                : price,
            ).toFixed(2)}
          </p>
          <p className="text-xxs">
            {`$${new Decimal(usd).mul(price).toFixed(2)}`}
          </p>
        </div>
      </div>
    </div>
  </div>
);

export const OfferTable: React.FC<{
  offers: Offer[];
  id: number;
  details: TradeableDisplay;
}> = ({ offers, id, details }) => {
  const { gameService } = useContext(Context);
  const usd = gameService.getSnapshot().context.prices.sfl?.usd ?? 0.0;

  if (offers.length === 0) return null;

  return (
    <div className="w-full text-xs border-collapse mb-2">
      <div>
        {offers.map((offer, index) => (
          <TradeRow
            key={index}
            details={details}
            price={offer.sfl}
            usd={usd}
            user={offer.offeredBy}
            index={index}
          />
        ))}
      </div>
    </div>
  );
};

export const ListingTable: React.FC<{
  listings: Listing[];
  collection: CollectionName;
  details: TradeableDisplay;
}> = ({ listings, collection, details }) => {
  const { gameService } = useContext(Context);
  const usd = gameService.getSnapshot().context.prices.sfl?.usd ?? 0.0;

  return (
    <div className="w-full text-xs border-collapse">
      <div>
        {listings.map((listing, index) => {
          const isResource =
            collection === "collectibles" &&
            getKeys(TRADE_LIMITS).includes(details.name as InventoryItemName);

          return (
            <TradeRow
              key={index}
              details={details}
              price={listing.sfl}
              usd={usd}
              user={listing.listedBy}
              isResource={isResource}
              quantity={1}
              index={index}
            />
          );
        })}
      </div>
    </div>
  );
};
