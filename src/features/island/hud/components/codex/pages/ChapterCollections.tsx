import React from "react";
import { SimpleBox } from "../SimpleBox";
import { Label } from "components/ui/Label";
import { ITEM_DETAILS } from "features/game/types/images";
import { GameState, InventoryItemName } from "features/game/types/game";
import { InnerPanel } from "components/ui/Panel";
import { ChapterBanner, CHAPTERS } from "features/game/types/chapters";
import { getKeys } from "features/game/types/craftables";
import { BumpkinItem } from "features/game/types/bumpkin";
import { CHAPTER_BANNER_IMAGES } from "features/game/types/chapters";
import { isCollectible } from "features/game/events/landExpansion/garbageSold";
import { getWearableImage } from "features/game/lib/getWearableImage";
import { CHAPTER_COLLECTIONS } from "features/game/types/collections";
import { ResizableBar } from "components/ui/ProgressBar";
import { PIXEL_SCALE } from "features/game/lib/constants";

type Props = {
  state: GameState;
};

export const ChapterCollections: React.FC<Props> = ({ state }) => {
  const { inventory, wardrobe } = state;

  return (
    <div className="flex flex-col h-full overflow-y-auto scrollable">
      <div className="space-y-2 mt-1 px-1">
        {getKeys(CHAPTER_COLLECTIONS)
          .sort((chapterA, chapterB) => {
            const chapterBStartDate = CHAPTERS[chapterB].startDate;
            const chapterAStartDate = CHAPTERS[chapterA].startDate;
            return chapterBStartDate.getTime() - chapterAStartDate.getTime();
          })
          .map((chapter) => {
            const collection = CHAPTER_COLLECTIONS[chapter];
            if (!collection) return null;

            const { collectibles, wearables } = collection;
            const banner: ChapterBanner = `${chapter} Banner`;
            const bannerImage = CHAPTER_BANNER_IMAGES[banner];

            const ownedCollectibles = collectibles.filter(
              (item) => (inventory[item]?.toNumber() ?? 0) > 0,
            ).length;
            const ownedWearables = wearables.filter(
              (item) => (wardrobe[item] ?? 0) > 0,
            ).length;

            const totalCollectibles = collectibles.length;
            const totalWearables = wearables.length;

            const totalItems = totalCollectibles + totalWearables;
            const ownedItems = ownedCollectibles + ownedWearables;

            return (
              <InnerPanel key={chapter} className="flex flex-col mb-3">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-1">
                    {bannerImage && (
                      <img
                        src={bannerImage}
                        className="h-8"
                        alt={chapter}
                        style={{ imageRendering: "pixelated" }}
                      />
                    )}
                    <div>
                      <Label type="default" className="capitalize">
                        {chapter}
                      </Label>
                    </div>
                  </div>
                  <div
                    className="flex items-center justify-between mb-2"
                    style={{ paddingLeft: `${PIXEL_SCALE * 2}px` }}
                  >
                    <div className="flex items-center gap-1">
                      <ResizableBar
                        percentage={
                          totalItems > 0 ? (ownedItems / totalItems) * 100 : 0
                        }
                        type="progress"
                        outerDimensions={{ width: 20, height: 6 }}
                      />
                      <span className="text-xxs">{`${ownedItems}/${totalItems}`}</span>
                    </div>
                  </div>
                </div>

                {totalCollectibles > 0 && (
                  <div className="flex flex-col mb-2 rounded-sm p-1">
                    <div className="grid grid-cols-5 sm:grid-cols-11">
                      {collectibles.map((item) => {
                        const itemName = item as InventoryItemName;
                        const count = inventory[itemName]?.toNumber() ?? 0;
                        const hasItem = count > 0;

                        return (
                          <SimpleBox
                            key={item}
                            silhouette={!hasItem}
                            inventoryCount={hasItem ? count : undefined}
                            image={ITEM_DETAILS[itemName]?.image}
                          />
                        );
                      })}
                      {wearables.map((item) => {
                        const itemName = item as BumpkinItem;
                        const count = wardrobe[itemName] ?? 0;
                        const hasItem = count > 0;
                        const image = isCollectible(itemName)
                          ? ITEM_DETAILS[itemName]?.image
                          : getWearableImage(itemName);

                        return (
                          <SimpleBox
                            key={item}
                            silhouette={!hasItem}
                            inventoryCount={hasItem ? count : undefined}
                            image={image}
                          />
                        );
                      })}
                    </div>
                  </div>
                )}
              </InnerPanel>
            );
          })}
      </div>
    </div>
  );
};
