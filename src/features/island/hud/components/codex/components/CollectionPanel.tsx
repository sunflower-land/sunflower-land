import React from "react";
import { SimpleBox } from "../SimpleBox";
import { Label } from "components/ui/Label";
import { ITEM_DETAILS } from "features/game/types/images";
import type { GameState, InventoryItemName } from "features/game/types/game";
import { InnerPanel } from "components/ui/Panel";
import type { BumpkinItem } from "features/game/types/bumpkin";
import { isCollectible } from "features/game/events/landExpansion/garbageSold";
import { getWearableImage } from "features/game/lib/getWearableImage";
import { ResizableBar } from "components/ui/ProgressBar";
import { PIXEL_SCALE } from "features/game/lib/constants";
import {
  ChapterCollectionItemPopover,
  type CollectionSource,
} from "./ChapterCollectionItemDetail";
import { BUMPKIN_ITEM_BUFF_LABELS } from "features/game/types/bumpkinItemBuffs";
import { COLLECTIBLE_BUFF_LABELS } from "features/game/types/collectibleItemBuffs";

type Props = {
  title: string;
  icon?: string;
  collection: CollectionSource;
  collectibles: InventoryItemName[];
  wearables: BumpkinItem[];
  state: GameState;
  onClose: () => void;
};

export const CollectionPanel: React.FC<Props> = ({
  title,
  icon,
  collection,
  collectibles,
  wearables,
  state,
  onClose,
}) => {
  const { inventory, wardrobe } = state;

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
    <InnerPanel className="flex flex-col mb-3">
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-1">
          {icon && (
            <img
              src={icon}
              className="h-8"
              alt={title}
              style={{ imageRendering: "pixelated" }}
            />
          )}
          <div>
            <Label type="default" className="capitalize">
              {title}
            </Label>
          </div>
        </div>
        <div
          className="flex items-center justify-between mb-2"
          style={{ paddingLeft: `${PIXEL_SCALE * 2}px` }}
        >
          <div className="flex items-center gap-1">
            <ResizableBar
              percentage={totalItems > 0 ? (ownedItems / totalItems) * 100 : 0}
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

              const buff = COLLECTIBLE_BUFF_LABELS[itemName];
              const showBoostIcon = !!(buff && buff(state).length > 0);

              return (
                <ChapterCollectionItemPopover
                  key={item}
                  itemName={itemName}
                  type="collectible"
                  collection={collection}
                  state={state}
                  onClose={onClose}
                >
                  <SimpleBox
                    silhouette={!hasItem}
                    inventoryCount={hasItem ? count : undefined}
                    image={ITEM_DETAILS[itemName]?.image}
                    showBoostIcon={showBoostIcon}
                  />
                </ChapterCollectionItemPopover>
              );
            })}
            {wearables.map((item) => {
              const itemName = item as BumpkinItem;
              const count = wardrobe[itemName] ?? 0;
              const hasItem = count > 0;
              const image = isCollectible(itemName)
                ? ITEM_DETAILS[itemName]?.image
                : getWearableImage(itemName);
              const buff = BUMPKIN_ITEM_BUFF_LABELS[itemName];
              const showBoostIcon = !!(buff && buff.length > 0);

              return (
                <ChapterCollectionItemPopover
                  key={item}
                  itemName={itemName}
                  type="wearable"
                  collection={collection}
                  state={state}
                  onClose={onClose}
                >
                  <SimpleBox
                    silhouette={!hasItem}
                    inventoryCount={hasItem ? count : undefined}
                    image={image}
                    showBoostIcon={showBoostIcon}
                  />
                </ChapterCollectionItemPopover>
              );
            })}
          </div>
        </div>
      )}
    </InnerPanel>
  );
};
