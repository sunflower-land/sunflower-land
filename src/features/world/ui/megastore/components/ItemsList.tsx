import React from "react";
import {
  CURRENCY_ICONS,
  CollectiblesItem,
  WearablesItem,
  getItemBuffLabel,
  getItemImage,
} from "../MegaStore";
import { Label } from "components/ui/Label";
import { pixelDarkBorderStyle } from "features/game/lib/style";
import { SquareIcon } from "components/ui/SquareIcon";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { formatNumber } from "lib/utils/formatNumber";

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
  return (
    <div className="flex flex-col space-y-2">
      <Label type="info">{itemsLabel}</Label>
      <div className="flex gap-2 flex-wrap">
        {items.map((item) => {
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
                      className="absolute -right-2 -top-2 object-contain"
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
                <SquareIcon
                  icon={CURRENCY_ICONS[item.currency] as string}
                  width={7}
                />
                <span className="text-xxs">
                  {formatNumber(item.price.toNumber())}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
