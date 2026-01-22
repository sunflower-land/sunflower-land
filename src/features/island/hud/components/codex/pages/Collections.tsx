import React from "react";
import { SimpleBox } from "../SimpleBox";
import { Label } from "components/ui/Label";
import { ITEM_DETAILS } from "features/game/types/images";
import { SUNNYSIDE } from "assets/sunnyside";
import { GameState, InventoryItemName } from "features/game/types/game";
import { InnerPanel } from "components/ui/Panel";
import {
  CHAPTER_COLLECTIONS,
  ChapterBanner,
  CHAPTERS,
} from "features/game/types/chapters";
import { getKeys } from "features/game/types/craftables";
import { BumpkinItem } from "features/game/types/bumpkin";
import { CHAPTER_BANNER_IMAGES } from "features/game/types/chapters";
import { isCollectible } from "features/game/events/landExpansion/garbageSold";
import { getWearableImage } from "features/game/lib/getWearableImage";

type Props = {
  state: GameState;
};

export const Collections: React.FC<Props> = ({ state }) => {
  const { inventory, wardrobe } = state;

  return (
    <InnerPanel className="flex flex-col h-full overflow-y-auto scrollable">
      <div className="space-y-2 mt-1">
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

            // Calculate owned counts
            const ownedCollectibles = collectibles.filter(
              (item) => (inventory[item]?.toNumber() ?? 0) > 0,
            ).length;
            const ownedWearables = wearables.filter(
              (item) => (wardrobe[item] ?? 0) > 0,
            ).length;

            const totalCollectibles = collectibles.length;
            const totalWearables = wearables.length;
            const totalItems = totalCollectibles + totalWearables;
            const totalOwned = ownedCollectibles + ownedWearables;

            return (
              <div key={chapter} className="flex flex-col mb-3 px-1">
                <div className="flex items-center gap-2 mb-2">
                  {bannerImage && (
                    <img
                      src={bannerImage}
                      className="h-8"
                      alt={chapter}
                      style={{ imageRendering: "pixelated" }}
                    />
                  )}
                  <Label type="default" className="capitalize">
                    {chapter}
                  </Label>
                  <Label
                    type={totalOwned === totalItems ? "success" : "default"}
                    className="ml-auto"
                  >
                    {`${totalOwned}/${totalItems}`}
                  </Label>
                </div>

                {totalCollectibles > 0 && (
                  <div className="flex flex-col mb-2">
                    <Label
                      type={
                        ownedCollectibles === totalCollectibles
                          ? "success"
                          : "default"
                      }
                      className="capitalize ml-1 mb-1"
                      icon={ITEM_DETAILS["Teamwork Monument"]?.image}
                    >
                      {`Collectibles ${ownedCollectibles}/${totalCollectibles}`}
                    </Label>
                    <div className="flex flex-wrap">
                      {collectibles.map((item) => {
                        const itemName = item as InventoryItemName;
                        const count = inventory[itemName]?.toNumber() ?? 0;
                        const hasItem = count > 0;

                        return (
                          <SimpleBox
                            key={item}
                            silhouette={!hasItem}
                            onClick={() => {}}
                            inventoryCount={hasItem ? count : undefined}
                            image={ITEM_DETAILS[itemName]?.image}
                          />
                        );
                      })}
                    </div>
                  </div>
                )}

                {totalWearables > 0 && (
                  <div className="flex flex-col mb-2">
                    <Label
                      type={
                        ownedWearables === totalWearables
                          ? "success"
                          : "default"
                      }
                      className="capitalize ml-1 mb-1"
                      icon={SUNNYSIDE.icons.player}
                    >
                      {`Wearables ${ownedWearables}/${totalWearables}`}
                    </Label>
                    <div className="flex flex-wrap">
                      {wearables.map((item) => {
                        const itemName = item as BumpkinItem;
                        const count = wardrobe[itemName] ?? 0;
                        const hasItem = count > 0;
                        const getImage = () => {
                          if (isCollectible(itemName)) {
                            return ITEM_DETAILS[itemName]?.image;
                          }

                          return getWearableImage(itemName);
                        };
                        const image = getImage();

                        return (
                          <SimpleBox
                            key={item}
                            silhouette={!hasItem}
                            onClick={() => {}}
                            inventoryCount={hasItem ? count : undefined}
                            image={image}
                          />
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
      </div>
    </InnerPanel>
  );
};
