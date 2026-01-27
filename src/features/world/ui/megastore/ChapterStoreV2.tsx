import { SUNNYSIDE } from "assets/sunnyside";
import classNames from "classnames";
import { Label } from "components/ui/Label";
import { ModalOverlay } from "components/ui/ModalOverlay";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { getTimeLeft, secondsToString } from "lib/utils/time";
import React, { useMemo, useState } from "react";
import {
  CHAPTERS,
  CHAPTER_STORES,
  ChapterName,
  getCurrentChapter,
  isChapterWearable,
} from "features/game/types/chapters";
import { GameState, InventoryItemName } from "features/game/types/game";
import { BumpkinItem } from "features/game/types/bumpkin";
import { ITEM_IDS } from "features/game/types/bumpkin";
import { ITEM_DETAILS } from "features/game/types/images";
import { getImageUrl } from "lib/utils/getImageURLS";
import { BuffLabel } from "features/game/types";
import { BUMPKIN_ITEM_BUFF_LABELS } from "features/game/types/bumpkinItemBuffs";
import { COLLECTIBLE_BUFF_LABELS } from "features/game/types/collectibleItemBuffs";
import { OPEN_SEA_WEARABLES } from "metadata/metadata";
import { useNow } from "lib/utils/hooks/useNow";
import { ItemListV2 } from "./chapter_store_components/ItemListV2";
import { ItemDetailsV2 } from "./chapter_store_components/ItemDetailsV2";
import { useGame } from "features/game/GameProvider";
import { InnerPanel } from "components/ui/Panel";
import { ChapterSurges } from "../tracks/ChapterSurges";

export type ChapterStoreItem = (typeof CHAPTER_STORES)[ChapterName][string];
export type ChapterStoreWearable = Extract<
  ChapterStoreItem,
  { wearable: BumpkinItem }
>;
export type ChapterStoreCollectible = Extract<
  ChapterStoreItem,
  { collectible: InventoryItemName }
>;
export type ChapterStoreEntry = { id: string; item: ChapterStoreItem };

export const isWearablesItem = (
  item: ChapterStoreItem | null,
): item is ChapterStoreWearable => {
  return !!item && isChapterWearable(item);
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

  return COLLECTIBLE_BUFF_LABELS[item.collectible]?.({
    skills: state.bumpkin.skills,
    collectibles: state.collectibles,
  });
};
export const getItemDescription = (item: ChapterStoreItem | null): string => {
  if (!item) return "";

  if (isWearablesItem(item)) {
    return OPEN_SEA_WEARABLES[item.wearable].description;
  }

  return ITEM_DETAILS[item.collectible].description;
};

export const ChapterStoreV2: React.FC<{
  readonly?: boolean;
}> = ({ readonly }) => {
  const [selectedItem, setSelectedItem] = useState<ChapterStoreEntry | null>(
    null,
  );
  const { gameState } = useGame();
  const state = gameState.context.state;
  const now = useNow({ live: true });
  const currentChapter = getCurrentChapter(now);
  const { startDate, endDate } = CHAPTERS[currentChapter];
  const totalSecondsAvailable =
    (endDate.getTime() - startDate.getTime()) / 1000;

  const timeRemaining = getTimeLeft(
    startDate.getTime(),
    totalSecondsAvailable,
    now,
  );
  const { t } = useAppTranslation();

  const chapterStore = CHAPTER_STORES[currentChapter];
  const storeItems = Object.entries(chapterStore)
    .filter(([id, item]) => {
      return item.type === "shop";
    })
    .map(([id, item]) => ({
      id,
      item,
    }));

  const buffItems = Object.entries(chapterStore)
    .filter(([id, item]) => {
      return item.type === "buff";
    })
    .map(([id, item]) => ({
      id,
      item,
    }));

  const hasSurges =
    !!state.inventory["Chapter Surge"] || !!state.chapter?.surge;

  return (
    <>
      <ModalOverlay
        show={!!selectedItem}
        onBackdropClick={() => setSelectedItem(null)}
      >
        <ItemDetailsV2
          isVisible={!!selectedItem}
          item={selectedItem?.item ?? null}
          itemId={selectedItem?.id}
          image={getItemImage(selectedItem?.item ?? null)}
          buff={getItemBuffLabel(selectedItem?.item ?? null, state)}
          isWearable={selectedItem ? isWearablesItem(selectedItem.item) : false}
          onClose={() => {
            setSelectedItem(null);
          }}
          readonly={readonly}
        />
      </ModalOverlay>

      <InnerPanel className="mb-1">
        <div className="flex justify-between px-2 flex-wrap pb-1">
          <Label type="default" className="mb-1">
            {t("chapterStore.store")}
          </Label>
          <Label
            icon={SUNNYSIDE.icons.stopwatch}
            type="danger"
            className="mb-1"
          >
            {t("megaStore.timeRemaining", {
              timeRemaining: secondsToString(timeRemaining, {
                length: "medium",
                removeTrailingZeros: true,
              }),
            })}
          </Label>
        </div>
        <div className={classNames("flex flex-col p-2 pt-1")}>
          <span className="text-xs pb-1">
            {readonly ? t("megaStore.visit") : t("megaStore.msg1")}
          </span>
          {storeItems.length > 0 ? (
            <ItemListV2
              items={storeItems}
              boughtAt={state.chapter?.boughtAt ?? {}}
              onItemClick={setSelectedItem}
              state={state}
            />
          ) : (
            <Label type="default" className="text-xxs">
              No items available.
            </Label>
          )}
        </div>
      </InnerPanel>
      {!readonly && (
        <>
          <InnerPanel>
            <div className="flex justify-between px-2 flex-wrap pb-1">
              <Label type="default" className="mb-1">
                {t("chapterStore.buffs")}
              </Label>
            </div>
            <div className={classNames("flex flex-col p-2 pt-1")}>
              {buffItems.length > 0 ? (
                <ItemListV2
                  items={buffItems}
                  boughtAt={state.chapter?.boughtAt ?? {}}
                  onItemClick={setSelectedItem}
                  state={state}
                />
              ) : (
                <Label type="default" className="text-xxs">
                  No items available.
                </Label>
              )}
            </div>

            {hasSurges && <ChapterSurges />}
          </InnerPanel>
        </>
      )}
    </>
  );
};
