import { SUNNYSIDE } from "assets/sunnyside";
import classNames from "classnames";
import { Label } from "components/ui/Label";
import { ModalOverlay } from "components/ui/ModalOverlay";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { getTimeLeft, secondsToString } from "lib/utils/time";
import React, { useState, useEffect } from "react";
import { getCurrentChapter, CHAPTERS } from "features/game/types/chapters";
import {
  MEGASTORE,
  ChapterStoreCollectible,
  ChapterStoreItem,
  ChapterStoreTier,
  ChapterStoreWearable,
} from "features/game/types/megastore";

import { ItemsList } from "./chapterstore_components/ItemsList";
import { ItemDetail } from "./chapterstore_components/ItemDetail";
import { ITEM_IDS } from "features/game/types/bumpkin";
import { ITEM_DETAILS } from "features/game/types/images";
import { getImageUrl } from "lib/utils/getImageURLS";
import { BuffLabel } from "features/game/types";
import { BUMPKIN_ITEM_BUFF_LABELS } from "features/game/types/bumpkinItemBuffs";
import { COLLECTIBLE_BUFF_LABELS } from "features/game/types/collectibleItemBuffs";
import { FACTION_SHOP_KEYS } from "features/game/types/factionShop";
import { OPEN_SEA_COLLECTIBLES, OPEN_SEA_WEARABLES } from "metadata/metadata";
import { GameState } from "features/game/types/game";

// type guard for WearablesItem | CollectiblesItem
export const isWearablesItem = (
  item: ChapterStoreItem | null,
): item is ChapterStoreWearable => {
  return (item as ChapterStoreWearable).wearable in ITEM_IDS;
};
// type guard for Keys
export const isKeys = (
  item: ChapterStoreItem | null,
): item is ChapterStoreCollectible => {
  return (item as ChapterStoreCollectible).collectible in FACTION_SHOP_KEYS;
};

export const getItemImage = (item: ChapterStoreItem | null): string => {
  if (!item) return "";

  if (isWearablesItem(item)) {
    return getImageUrl(ITEM_IDS[item.wearable]);
  }

  return ITEM_DETAILS[item.collectible].image;
};

export const getItemBuffLabel = (
  item: ChapterStoreItem | null,
  state: GameState,
): BuffLabel[] | undefined => {
  if (!item) return;

  if (isWearablesItem(item)) {
    return BUMPKIN_ITEM_BUFF_LABELS[item.wearable];
  }

  return COLLECTIBLE_BUFF_LABELS(state)[item.collectible];
};
export const getItemDescription = (item: ChapterStoreItem | null): string => {
  if (!item) return "";

  if (isWearablesItem(item)) {
    return OPEN_SEA_WEARABLES[item.wearable].description;
  }

  return OPEN_SEA_COLLECTIBLES[item.collectible].description;
};

export const ChapterStore: React.FC<{
  readonly?: boolean;
  state: GameState;
}> = ({ readonly, state }) => {
  const [selectedItem, setSelectedItem] = useState<ChapterStoreItem | null>(
    null,
  );
  const [selectedTier, setSelectedTier] = useState<ChapterStoreTier>();
  const [isVisible, setIsVisible] = useState(false);
  const createdAt = Date.now();

  useEffect(() => {
    if (selectedItem && !isVisible) {
      setIsVisible(true);
    }
  }, [selectedItem, isVisible]);

  const handleClickItem = (item: ChapterStoreItem, tier: ChapterStoreTier) => {
    setSelectedItem(item);
    setSelectedTier(tier);
  };
  const getTotalSecondsAvailable = () => {
    const { startDate, endDate } = CHAPTERS[getCurrentChapter()];

    return (endDate.getTime() - startDate.getTime()) / 1000;
  };

  const timeRemaining = getTimeLeft(
    CHAPTERS[getCurrentChapter()].startDate.getTime(),
    getTotalSecondsAvailable(),
  );
  const { t } = useAppTranslation();

  const currentChapter = getCurrentChapter(new Date(createdAt));

  // Basic-Epic
  const basicAllItems = MEGASTORE[currentChapter].basic.items;
  const rareAllItems = MEGASTORE[currentChapter].rare.items;
  const epicAllItems = MEGASTORE[currentChapter].epic.items;
  const megaItems = MEGASTORE[currentChapter].mega.items;

  return (
    <>
      <ModalOverlay
        show={!!selectedItem}
        onBackdropClick={() => setSelectedItem(null)}
      >
        <ItemDetail
          isVisible={isVisible}
          item={selectedItem}
          tier={selectedTier}
          image={getItemImage(selectedItem)}
          buff={getItemBuffLabel(selectedItem, state)}
          isWearable={selectedItem ? isWearablesItem(selectedItem) : false}
          onClose={() => {
            setSelectedItem(null);
            setSelectedTier("basic"); // Reset tier on close
          }}
          readonly={readonly}
        />
      </ModalOverlay>

      <div className="flex justify-between px-2 flex-wrap pb-1">
        <Label type="default" className="mb-1">
          {"Stella"}
        </Label>
        <Label icon={SUNNYSIDE.icons.stopwatch} type="danger" className="mb-1">
          {t("megaStore.timeRemaining", {
            timeRemaining: secondsToString(timeRemaining, {
              length: "medium",
              removeTrailingZeros: true,
            }),
          })}
        </Label>
      </div>
      <div
        className={classNames("flex flex-col p-2 pt-1", {
          ["max-h-[300px] overflow-y-auto scrollable "]: !readonly,
        })}
      >
        <span className="text-xs pb-1">
          {readonly ? t("megaStore.visit") : t("megaStore.msg1")}
        </span>
        <ItemsList
          tier="basic"
          items={basicAllItems}
          onItemClick={handleClickItem}
        />
        <ItemsList
          itemsLabel={"Rare Items"}
          tier="rare"
          items={rareAllItems}
          onItemClick={handleClickItem}
        />
        <ItemsList
          itemsLabel={"Epic Items"}
          tier="epic"
          items={epicAllItems}
          onItemClick={handleClickItem}
        />
        <ItemsList
          itemsLabel={"Mega Items"}
          tier="mega"
          items={megaItems}
          onItemClick={handleClickItem}
        />
      </div>
    </>
  );
};
