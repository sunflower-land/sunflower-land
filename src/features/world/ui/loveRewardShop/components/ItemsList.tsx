import React, { useContext } from "react";
import { getItemImage, getItemBuffLabel } from "../FloatingIslandShop";
import { Label } from "components/ui/Label";
import { pixelDarkBorderStyle } from "features/game/lib/style";
import { SquareIcon } from "components/ui/SquareIcon";
import { PIXEL_SCALE } from "features/game/lib/constants";

import lightning from "assets/icons/lightning.png";

import { ITEM_DETAILS } from "features/game/types/images";
import { Context } from "features/game/GameProvider";
import { useSelector } from "@xstate/react";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

import { MachineState } from "features/game/lib/gameMachine";
import {
  FloatingShopItem,
  FloatingShopItemName,
} from "features/game/types/floatingIsland";
import { isFloatingShopCollectible } from "features/game/events/landExpansion/buyFloatingShopItem";
import { getKeys } from "features/game/types/decorations";
import { GameState } from "features/game/types/game";
import { SUNNYSIDE } from "assets/sunnyside";

interface Props {
  itemsLabel?: string;
  type?: "wearables" | "collectibles" | "keys";
  items: FloatingShopItem[];
  onItemClick: (item: FloatingShopItem) => void;
}

const _state = (state: MachineState) => state.context.state;
const _inventory = (state: MachineState) => state.context.state.inventory;
const _wardrobe = (state: MachineState) => state.context.state.wardrobe;

export function isAlreadyBought({
  name,
  game,
}: {
  name?: FloatingShopItemName;
  game: GameState;
}) {
  if (!name) return false;
  const todayKey = new Date().toISOString().split("T")[0];
  const boughtAt = game.floatingIsland.boughtAt?.[name];

  if (!boughtAt) return false;

  const boughtAtKey = new Date(boughtAt).toISOString().split("T")[0];
  return boughtAtKey === todayKey;
}

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
    .sort(
      (a, b) =>
        Number(a.cost.items["Love Charm"] ?? 0) -
        Number(b.cost.items["Love Charm"] ?? 0),
    );
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

            const balanceOfItem = isFloatingShopCollectible(item)
              ? Number(inventory[item.name] ?? 0)
              : Number(wardrobe[item.name] ?? 0);

            return (
              <div
                id={`love-reward-item-${item?.name}`}
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

                    {isAlreadyBought({ name: item.name, game: state }) && (
                      <img
                        src={SUNNYSIDE.icons.confirm}
                        className="w-6 absolute top-0 right-0"
                      />
                    )}

                    {/* Price */}
                    <div className="absolute px-4 bottom-3 -left-4 object-contain">
                      {getKeys(item.cost.items).map((name) => (
                        <Label
                          icon={ITEM_DETAILS[name].image}
                          type="warning"
                          key={name}
                          className={
                            "text-xxs absolute center text-center p-1 "
                          }
                          style={{
                            width: `calc(100% + ${PIXEL_SCALE * 10}px)`,
                            height: "24px",
                          }}
                        >
                          {item.cost.items[name]}
                        </Label>
                      ))}
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
