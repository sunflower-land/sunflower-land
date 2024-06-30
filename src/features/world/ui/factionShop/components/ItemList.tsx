import React, { useContext } from "react";
import { Label } from "components/ui/Label";
import { pixelDarkBorderStyle } from "features/game/lib/style";
import { SquareIcon } from "components/ui/SquareIcon";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { formatNumber } from "lib/utils/formatNumber";

import lightning from "assets/icons/lightning.png";

import { ITEM_DETAILS } from "features/game/types/images";
import { FactionName, InventoryItemName } from "features/game/types/game";
import { Context } from "features/game/GameProvider";
import { MachineState } from "features/game/lib/gameMachine";
import { useSelector } from "@xstate/react";
import { BumpkinItem } from "features/game/types/bumpkin";
import Decimal from "decimal.js-light";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { getItemBuffLabel, getItemImage } from "../FactionShop";
import {
  FactionShopWearable,
  FactionShopCollectible,
} from "features/game/types/factionShop";
import { capitalize } from "lib/utils/capitalize";

interface Props {
  itemsLabel: string;
  type: "wearables" | "collectibles";
  items: (FactionShopWearable | FactionShopCollectible)[];
  onItemClick: (item: FactionShopWearable | FactionShopCollectible) => void;
}

const _inventory = (state: MachineState) => state.context.state.inventory;
const _wardrobe = (state: MachineState) => state.context.state.wardrobe;

export const ItemsList: React.FC<Props> = ({
  items,
  type,
  itemsLabel,
  onItemClick,
}) => {
  const { gameService } = useContext(Context);

  const inventory = useSelector(gameService, _inventory);
  const wardrobe = useSelector(gameService, _wardrobe);

  const getBalanceOfItem = (
    item: FactionShopWearable | FactionShopCollectible
  ): number => {
    if (type === "wearables") {
      return wardrobe[item.name as BumpkinItem] ?? 0;
    }

    return (
      inventory[item.name as InventoryItemName] ?? new Decimal(0)
    ).toNumber();
  };

  const getFactionEmblemIcon = (factionName: FactionName): string => {
    const singular = capitalize(factionName.slice(0, -1));

    return ITEM_DETAILS[`${singular} Emblem` as InventoryItemName].image;
  };

  const sortedItems = items.sort((a, b) => Number(a.price.sub(b.price)));
  const { t } = useAppTranslation();

  return (
    <div className="flex flex-col space-y-2">
      <div className="bg-brown-200 sticky -top-1 pb-1 z-10">
        <Label type="default">{itemsLabel}</Label>
      </div>
      <div className="flex gap-2 flex-wrap">
        {sortedItems.length === 0 ? (
          <span className="text-xxs">{`${itemsLabel} ${t(
            "coming.soon"
          )}.`}</span>
        ) : (
          sortedItems.map((item) => {
            const buff = getItemBuffLabel(item);
            const balanceOfItem = getBalanceOfItem(item);

            return (
              <div
                id={`faction-shop-item-${item.name}`}
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
                  <div className="flex relative justify-center items-center w-full h-full">
                    <SquareIcon icon={getItemImage(item)} width={20} />
                    {buff && (
                      <img
                        src={lightning}
                        className="absolute -left-2 -top-2 object-contain"
                        style={{
                          width: `${PIXEL_SCALE * 7}px`,
                        }}
                        alt="crop"
                      />
                    )}
                    {item.faction && (
                      <img
                        src={getFactionEmblemIcon(item.faction)}
                        className="absolute -right-2 -top-2 object-contain"
                        style={{
                          width: `${PIXEL_SCALE * 7}px`,
                        }}
                        alt={`${item.faction} emblem`}
                      />
                    )}
                    {balanceOfItem > 0 && (
                      <Label
                        type="default"
                        className="px-0.5 text-xxs absolute -top-2 -right-[10px]"
                      >
                        {balanceOfItem}
                      </Label>
                    )}
                  </div>
                </div>
                {/* Price */}
                <div className="flex items-center space-x-1">
                  <SquareIcon
                    icon={
                      ITEM_DETAILS[item.currency as InventoryItemName].image
                    }
                    width={7}
                  />
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
