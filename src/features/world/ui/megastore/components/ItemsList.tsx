import React from "react";
import { getItemBuffLabel, getItemImage } from "../MegaStore";
import { Label } from "components/ui/Label";
import { pixelDarkBorderStyle } from "features/game/lib/style";
import { SquareIcon } from "components/ui/SquareIcon";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { formatNumber } from "lib/utils/formatNumber";
import { getSeasonalTicket } from "features/game/types/seasons";

import token from "assets/icons/token_2.png";
import { ITEM_DETAILS } from "features/game/types/images";
import {
  CollectiblesItem,
  Currency,
  InventoryItemName,
  WearablesItem,
} from "features/game/types/game";

interface Props {
  itemsLabel: string;
  items: (WearablesItem | CollectiblesItem)[];
  onItemClick: (item: WearablesItem | CollectiblesItem) => void;
}

export const ItemsList: React.FC<Props> = ({
  items,
  itemsLabel,
  onItemClick,
}) => {
  const getCurrencyIcon = (currency: Currency) => {
    if (currency === "SFL") return token;

    const currencyItem =
      currency === "Seasonal Ticket" ? getSeasonalTicket() : currency;

    return ITEM_DETAILS[currencyItem as InventoryItemName].image;
  };

  return (
    <div className="flex flex-col space-y-2">
      <div className="bg-brown-300 sticky -top-2 pb-1 z-10">
        <Label type="info">{itemsLabel}</Label>
      </div>
      <div className="flex gap-2 flex-wrap">
        {items.length === 0 ? (
          <span className="text-xxs">{`No ${itemsLabel.toLowerCase()} available.`}</span>
        ) : (
          items.map((item) => {
            const buff = getItemBuffLabel(item);

            return (
              <div
                id={`mega-store-item-${item.name}`}
                key={item.name}
                className="flex flex-col space-y-1"
              >
                <div
                  className="bg-brown-600 cursor-pointer relative"
                  style={{
                    ...pixelDarkBorderStyle,
                  }}
                  onClick={() => onItemClick(item)}
                >
                  <div className="flex justify-center items-center w-full h-full">
                    <SquareIcon icon={getItemImage(item)} width={20} />
                    {buff && (
                      <img
                        src={buff.boostTypeIcon}
                        className="absolute -left-2 -top-2 object-contain"
                        style={{
                          width: `${PIXEL_SCALE * 7}px`,
                        }}
                        alt="crop"
                      />
                    )}
                  </div>
                </div>
                {/* Price */}
                <div className="flex items-center space-x-1">
                  <SquareIcon icon={getCurrencyIcon(item.currency)} width={7} />
                  <span className="text-xxs">
                    {formatNumber(item.price.toNumber())}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
