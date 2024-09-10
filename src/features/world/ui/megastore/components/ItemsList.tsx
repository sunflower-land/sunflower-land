import React, { useContext } from "react";
import { getItemBuffLabel, getItemImage } from "../MegaStore";
import { Label } from "components/ui/Label";
import { pixelDarkBorderStyle } from "features/game/lib/style";
import { SquareIcon } from "components/ui/SquareIcon";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { shortenCount } from "lib/utils/formatNumber";
import { getSeasonalTicket } from "features/game/types/seasons";

import token from "assets/icons/sfl.webp";
import lightning from "assets/icons/lightning.png";

import { ITEM_DETAILS } from "features/game/types/images";
import {
  CollectiblesItem,
  Currency,
  InventoryItemName,
  WearablesItem,
} from "features/game/types/game";
import { Context } from "features/game/GameProvider";
import { MachineState } from "features/game/lib/gameMachine";
import { useSelector } from "@xstate/react";
import { BumpkinItem } from "features/game/types/bumpkin";
import Decimal from "decimal.js-light";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

interface Props {
  itemsLabel: string;
  type: "wearables" | "collectibles" | "keys";
  items: (WearablesItem | CollectiblesItem)[];
  onItemClick: (item: WearablesItem | CollectiblesItem) => void;
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

  const getBalanceOfItem = (item: WearablesItem | CollectiblesItem): number => {
    if (type === "wearables") {
      return wardrobe[item.name as BumpkinItem] ?? 0;
    }

    return (
      inventory[item.name as InventoryItemName] ?? new Decimal(0)
    ).toNumber();
  };

  const getCurrencyIcon = (currency: Currency) => {
    if (currency === "SFL") return token;

    const currencyItem =
      currency === "Seasonal Ticket" ? getSeasonalTicket() : currency;

    return ITEM_DETAILS[currencyItem as InventoryItemName].image;
  };

  const sortedItems = items
    .slice()
    .sort((a, b) => Number(a.price.sub(b.price)));
  const { t } = useAppTranslation();

  return (
    <div className="flex flex-col space-y-2">
      <div className=" sticky -top-1 pb-1 z-10">
        <Label type="default">{itemsLabel}</Label>
      </div>
      <div className="flex gap-2 flex-wrap">
        {sortedItems.length === 0 ? (
          <span className="text-xxs">{`${itemsLabel} ${t(
            "coming.soon",
          )}.`}</span>
        ) : (
          sortedItems.map((item) => {
            const buff = getItemBuffLabel(item);
            const balanceOfItem = getBalanceOfItem(item);

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
                  <SquareIcon icon={getCurrencyIcon(item.currency)} width={7} />
                  <span className="text-xxs">{shortenCount(item.price)}</span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
