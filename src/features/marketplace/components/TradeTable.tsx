import classNames from "classnames";
import { CollectionName, Listing } from "features/game/types/marketplace";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import React from "react";
import { TradeableDisplay } from "../lib/tradeables";
import Decimal from "decimal.js-light";
import { formatNumber } from "lib/utils/formatNumber";
import sflIcon from "assets/icons/sfl.webp";
import { getKeys } from "features/game/types/decorations";
import { TRADE_LIMITS } from "features/game/actions/tradeLimits";
import { InventoryItemName } from "features/game/types/game";

type TradeTableItem = {
  price: number;
  expiresAt: string;
  createdById: number;
  icon?: string;
};

export const TradeTable: React.FC<{ items: TradeTableItem[]; id: number }> = ({
  items,
  id,
}) => {
  const { t } = useAppTranslation();
  return (
    <table className="w-full text-xs table-fixed border-collapse">
      <thead>
        <tr>
          <th style={{ border: "1px solid #b96f50" }} className="p-1.5 w-1/5">
            <p>{t("marketplace.sfl")}</p>
          </th>
          <th style={{ border: "1px solid #b96f50" }} className="p-1.5">
            <p>{t("marketplace.expiry")}</p>
          </th>
          <th style={{ border: "1px solid #b96f50" }} className="p-1.5">
            <p>{t("marketplace.from")}</p>
          </th>
        </tr>
      </thead>
      <tbody>
        {items.map(({ createdById, price, expiresAt, icon }, index) => (
          <tr
            key={index}
            className={classNames("relative", {
              "bg-[#ead4aa]": id === createdById,
            })}
          >
            <td
              style={{ border: "1px solid #b96f50" }}
              className="p-1.5 text-center"
            >
              {price}
            </td>
            <td
              style={{ border: "1px solid #b96f50" }}
              className="p-1.5 truncate text-center"
            >
              {expiresAt}
            </td>
            <td
              style={{ border: "1px solid #b96f50" }}
              className="p-1.5 truncate text-center relative"
            >
              {createdById}
              {icon && (
                <img src={icon} className="absolute right-2 top-1 h-4" />
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export const ListingTable: React.FC<{
  listings: Listing[];
  collection: CollectionName;
  details: TradeableDisplay;
}> = ({ listings, collection, details }) => {
  const { t } = useAppTranslation();
  return (
    <table className="w-full text-xs  border-collapse bg-[#ead4aa] ">
      <thead>
        <tr>
          <th className="p-1.5 w-2/5 text-left">
            <p>{t("marketplace.item")}</p>
          </th>
          <th className="p-1.5 text-left">
            <p>{t("marketplace.unitPrice")}</p>
          </th>
        </tr>
      </thead>
      <tbody>
        {listings.map((listing, index) => {
          const isResource =
            collection === "collectibles" &&
            getKeys(TRADE_LIMITS).includes(details.name as InventoryItemName);
          const quantity = 1; // TODO?
          const price = listing.sfl;

          return (
            <tr
              key={index}
              className={classNames(
                "relative bg-[#ead4aa] !py-10 transition-all",
              )}
              style={{
                borderBottom: "1px solid #b96f50",
                borderTop: index === 0 ? "1px solid #b96f50" : "",
              }}
            >
              <td className="p-1.5 text-left w-12">
                <div className="flex items-center">
                  <img src={details.image} className="h-8 mr-4" />
                  <p className="text-sm">
                    {`${isResource ? quantity + " x" : ""} ${details.name}`}
                  </p>
                </div>
              </td>
              <td className="p-1.5 text-left relative">
                <div className="flex items-center">
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
              </td>
              <td className="p-1.5 truncate flex items-center justify-end pr-2 h-full"></td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};
