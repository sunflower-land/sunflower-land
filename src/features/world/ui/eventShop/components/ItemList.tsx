import React, { useContext } from "react";
import { getItemImage, getItemBuffLabel } from "../eventShop";
import { Label } from "components/ui/Label";
import { pixelDarkBorderStyle } from "features/game/lib/style";
import { SquareIcon } from "components/ui/SquareIcon";
import { PIXEL_SCALE } from "features/game/lib/constants";

import lightning from "assets/icons/lightning.png";

import { ITEM_DETAILS } from "features/game/types/images";
import { Context } from "features/game/GameProvider";
import { useSelector } from "@xstate/react";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import {
  EventShopCollectibleName,
  EventShopItem,
  EventShopWearableName,
} from "features/game/types/minigameShop";
import { MachineState } from "features/game/lib/gameMachine";

interface Props {
  itemsLabel?: string;
  type?: "wearables" | "collectibles" | "limited";
  items: EventShopItem[];
  onItemClick: (item: EventShopItem) => void;
}

const _state = (state: MachineState) => state.context.state;
const _inventory = (state: MachineState) => state.context.state.inventory;
const _wardrobe = (state: MachineState) => state.context.state.wardrobe;

export const ItemsList: React.FC<Props> = ({
  items,
  type,
  itemsLabel,
  onItemClick,
}) => {
  const { gameService } = useContext(Context);
  const state = useSelector(gameService, _state);
  const inventory = useSelector(gameService, _inventory);
  const wardrobe = useSelector(gameService, _wardrobe);

  const sortedItems = items
    .slice()
    .sort((a, b) => Number(a.cost.price) - Number(b.cost.price));
  const { t } = useAppTranslation();

  return (
    <div className="flex flex-col mb-5">
      {itemsLabel && (
        <div className="flex z-10">
          <div className="grow w-9/10 mb-1">
            {itemsLabel && <Label type="default">{itemsLabel}</Label>}
          </div>
        </div>
      )}

      <div className="flex gap-2 flex-wrap">
        {sortedItems.length === 0 ? (
          <span className="text-xxs">{`${itemsLabel} ${t(
            "coming.soon",
          )}.`}</span>
        ) : (
          sortedItems.map((item) => {
            const buff = getItemBuffLabel(item, state);

            const balanceOfItem =
              type === "collectibles"
                ? Number(inventory[item.name as EventShopCollectibleName] ?? 0)
                : Number(wardrobe[item.name as EventShopWearableName] ?? 0);

            return (
              <div
                id={`event-shop-item-${item?.name}`}
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
                  <div className="flex justify-center items-center w-full h-full z-20">
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

                    {/* Price */}
                    <div className="absolute px-4 bottom-3 -left-4 object-contain">
                      <Label
                        icon={ITEM_DETAILS["Easter Token 2025"].image}
                        type="warning"
                        className={"text-xxs absolute center text-center p-1 "}
                        style={{
                          width: `calc(100% + ${PIXEL_SCALE * 10}px)`,
                          height: "24px",
                        }}
                      >
                        {item.cost.price}
                      </Label>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
