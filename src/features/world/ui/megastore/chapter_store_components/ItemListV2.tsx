import React from "react";
import classNames from "classnames";
import { Label } from "components/ui/Label";
import { SquareIcon } from "components/ui/SquareIcon";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { pixelDarkBorderStyle } from "features/game/lib/style";
import { ITEM_DETAILS } from "features/game/types/images";
import { GameState, InventoryItemName } from "features/game/types/game";
import token from "assets/icons/flower_token.webp";
import lightning from "assets/icons/lightning.png";
import {
  ChapterStoreEntry,
  ChapterStoreItem,
  ChapterStoreWearable,
  getItemImage,
  isWearablesItem,
} from "../ChapterStoreV2";
import { BuffLabel } from "features/game/types";
import { BUMPKIN_ITEM_BUFF_LABELS } from "features/game/types/bumpkinItemBuffs";
import { COLLECTIBLE_BUFF_LABELS } from "features/game/types/collectibleItemBuffs";
import { isChapterWearable } from "features/game/types/chapters";
import { getKeys } from "features/game/lib/crafting";
import { shortenCount } from "lib/utils/formatNumber";
import { SFLDiscount } from "features/game/lib/SFLDiscount";
import Decimal from "decimal.js-light";
import { SUNNYSIDE } from "assets/sunnyside";

interface Props {
  state: GameState;
  items: ChapterStoreEntry[];
  boughtAt: Partial<Record<string, number>>;
  onItemClick: (entry: ChapterStoreEntry) => void;
}

type CostDisplay = {
  icon: string;
  amount: number;
};

export const getItemBuffLabel = (
  item: ChapterStoreItem | null,
  state: GameState,
): BuffLabel[] | undefined => {
  if (!item) return;

  if (isChapterWearable(item)) {
    return BUMPKIN_ITEM_BUFF_LABELS[item.wearable];
  }

  return COLLECTIBLE_BUFF_LABELS[item.collectible]?.({
    skills: state.bumpkin.skills,
    collectibles: state.collectibles,
  });
};

const getCurrencyIcon = (item: ChapterStoreItem) => {
  console.log({ item });
  if (!!item.cost.sfl) return token;

  const items = getKeys(item.cost.items ?? {});

  if (items.length === 0) return null;

  const currencyItem = items[0];

  return ITEM_DETAILS[currencyItem as InventoryItemName].image;
};

const getCurrency = ({
  state,
  item,
}: {
  state: GameState;
  item: ChapterStoreItem;
}) => {
  if (!!item.cost.sfl)
    return shortenCount(SFLDiscount(state, new Decimal(item.cost.sfl ?? 0)));

  const items = getKeys(item.cost.items ?? {});

  if (items.length === 0) return null;

  return Object.values(item.cost.items ?? {})[0];
};

export const ItemListV2: React.FC<Props> = ({
  items,
  boughtAt,
  onItemClick,
  state,
}) => {
  return (
    <div className="flex gap-2 flex-wrap">
      {items.map((entry) => {
        const buff = getItemBuffLabel(entry.item, state);
        const isBought = state.chapter?.boughtAt[entry.id];

        return (
          <div
            id={`chapter-store-item-${entry.id}`}
            key={entry.id}
            className="flex flex-col space-y-1"
          >
            <div
              className="bg-brown-600 cursor-pointer relative"
              style={{
                ...pixelDarkBorderStyle,
              }}
              onClick={() => onItemClick(entry)}
            >
              <div className="flex justify-center items-center w-full h-full z-20">
                <SquareIcon icon={getItemImage(entry.item)} width={20} />
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

                {isBought && (
                  <img
                    src={SUNNYSIDE.icons.confirm}
                    className="absolute -right-2 -top-3"
                    style={{
                      width: `${PIXEL_SCALE * 9}px`,
                    }}
                    alt="crop"
                  />
                )}

                {/* Price */}
                <div className="absolute px-4 bottom-3 -left-4 object-contain">
                  <Label
                    icon={getCurrencyIcon(entry.item)}
                    type="warning"
                    className={"text-xxs absolute center text-center p-1 "}
                    style={{
                      width: `calc(100% + ${PIXEL_SCALE * 10}px)`,
                      height: "24px",
                    }}
                  >
                    {getCurrency({ state, item: entry.item })}
                  </Label>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
