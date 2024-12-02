import classNames from "classnames";
import {
  CollectionName,
  Listing,
  Offer,
} from "features/game/types/marketplace";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import React from "react";
import { TradeableDisplay } from "../lib/tradeables";
import Decimal from "decimal.js-light";
import { formatNumber } from "lib/utils/formatNumber";
import sflIcon from "assets/icons/sfl.webp";
import { getKeys } from "features/game/types/decorations";
import { TRADE_LIMITS } from "features/game/actions/tradeLimits";
import { InventoryItemName } from "features/game/types/game";
import { NPC } from "features/island/bumpkin/components/NPC";
import { interpretTokenUri } from "lib/utils/tokenUriBuilder";

type TradeTableItem = {
  price: number;
  expiresAt: string;
  createdById: number;
  icon?: string;
};

export const OfferTable: React.FC<{
  offers: Offer[];
  id: number;
  details: TradeableDisplay;
}> = ({ offers, id, details }) => {
  const { t } = useAppTranslation();

  if (!offers.length) {
    return <p className="text-sm text-left p-2">{t("marketplace.noOffers")}</p>;
  }

  return (
    <div className="w-full text-xs  border-collapse mb-3">
      <div>
        {offers.map((offer, index) => {
          const quantity = 1; // TODO?
          const price = offer.sfl;

          return (
            <div
              key={index}
              className={classNames(
                "flex items-center relative transition-all",
                {
                  "bg-[#ead4aa]": index % 2 === 0,
                },
              )}
              style={{
                borderBottom: "1px solid #b96f50",
                borderTop: index === 0 ? "1px solid #b96f50" : "",
              }}
            >
              <div className="p-1.5 mr-2 lg:mr-12 text-left w-auto flex items-center">
                <img src={details.image} className="h-8 mr-4" />
                <p className="text-sm">{details.name}</p>
              </div>
              <div className="flex-1 flex items-center justify-between">
                <div className="flex items-center flex-1 overflow-hidden">
                  <div className="relative w-8 h-8">
                    <NPC
                      width={20}
                      parts={
                        interpretTokenUri(offer.offeredBy.bumpkinUri).equipped
                      }
                    />
                  </div>
                  <p className="text-xs sm:text-sm flex-1 truncate">
                    {offer.offeredBy.username}
                  </p>
                </div>
                <div className="p-1.5 text-right relative flex items-center justify-end">
                  <img src={sflIcon} className="h-5 mr-1" />
                  <p className="text-sm">{new Decimal(price).toFixed(2)}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const ListingTable: React.FC<{
  listings: Listing[];
  collection: CollectionName;
  details: TradeableDisplay;
}> = ({ listings, collection, details }) => {
  const { t } = useAppTranslation();
  return (
    <div className="w-full text-xs  border-collapse  ">
      <div>
        {listings.map((listing, index) => {
          const isResource =
            collection === "collectibles" &&
            getKeys(TRADE_LIMITS).includes(details.name as InventoryItemName);
          const quantity = 1; // TODO?
          const price = listing.sfl;

          return (
            <div
              key={index}
              className={classNames(
                "flex items-center relative transition-all",
                {
                  "bg-[#ead4aa]": index % 2 === 0,
                },
              )}
              style={{
                borderBottom: "1px solid #b96f50",
                borderTop: index === 0 ? "1px solid #b96f50" : "",
              }}
            >
              <div className="p-1.5 mr-2 lg:mr-12 text-left w-auto flex items-center">
                <img src={details.image} className="h-8 mr-4" />
                <p className="text-sm">
                  {`${isResource ? quantity + " x" : ""} ${details.name}`}
                </p>
              </div>
              <div className="flex-1 flex items-center justify-between">
                <div className="flex items-center flex-1 overflow-hidden">
                  <div className="relative w-8 h-8">
                    <NPC
                      width={20}
                      parts={
                        interpretTokenUri(listing.listedBy.bumpkinUri).equipped
                      }
                    />
                  </div>
                  <p className="text-xs sm:text-sm flex-1 truncate">
                    {listing.listedBy.username}
                  </p>
                </div>
                <div className="p-1.5 text-right relative flex items-center justify-end">
                  <img src={sflIcon} className="h-5 mr-1" />
                  <p className="text-sm">
                    {new Decimal(
                      isResource
                        ? formatNumber(price / Number(quantity), {
                            decimalPlaces: 4,
                          })
                        : price,
                    ).toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
