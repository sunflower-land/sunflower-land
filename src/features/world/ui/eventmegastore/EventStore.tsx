import classNames from "classnames";
import { Label } from "components/ui/Label";
import { ModalOverlay } from "components/ui/ModalOverlay";
import React, { useState } from "react";
import {
  HOLIDAY_EVENT_ITEMS,
  EventStoreCollectible,
  EventStoreItem,
  EventStoreTier,
  EventStoreWearable,
} from "features/game/types/holidayEventShop";

import { ItemsList } from "./eventmegastore_components/ItemsList";
import { ItemDetail } from "./eventmegastore_components/ItemDetail";
import { ITEM_IDS } from "features/game/types/bumpkin";
import { ITEM_DETAILS } from "features/game/types/images";
import { getImageUrl } from "lib/utils/getImageURLS";
import { BuffLabel } from "features/game/types";
import { BUMPKIN_ITEM_BUFF_LABELS } from "features/game/types/bumpkinItemBuffs";
import { COLLECTIBLE_BUFF_LABELS } from "features/game/types/collectibleItemBuffs";
import { FACTION_SHOP_KEYS } from "features/game/types/factionShop";
import { OPEN_SEA_WEARABLES } from "metadata/metadata";
import { GameState } from "features/game/types/game";
interface Props {
  onClose?: () => void;
  readonly?: boolean;
  state?: GameState;
}
// type guard for WearablesItem | CollectiblesItem
export const isWearablesItem = (
  item: EventStoreItem | null,
): item is EventStoreWearable => {
  return (item as EventStoreWearable).wearable in ITEM_IDS;
};
// type guard for Keys
export const isKeys = (
  item: EventStoreItem | null,
): item is EventStoreCollectible => {
  return (item as EventStoreCollectible).collectible in FACTION_SHOP_KEYS;
};

export const getItemImage = (item: EventStoreItem | null): string => {
  if (!item) return "";

  if (isWearablesItem(item)) {
    return getImageUrl(ITEM_IDS[item.wearable]);
  }

  return ITEM_DETAILS[item.collectible].image;
};

export const getItemBuffLabel = (
  item: EventStoreItem | null,
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
export const getItemDescription = (item: EventStoreItem | null): string => {
  if (!item) return "";

  if (isWearablesItem(item)) {
    return OPEN_SEA_WEARABLES[item.wearable].description;
  }

  return ITEM_DETAILS[item.collectible].description;
};

export const EventStore: React.FC<Props> = ({ readonly, state }) => {
  const [selectedItem, setSelectedItem] = useState<EventStoreItem | null>(null);
  const [selectedTier, setSelectedTier] = useState<EventStoreTier>();
  const handleClickItem = (item: EventStoreItem, tier: EventStoreTier) => {
    setSelectedItem(item);
    setSelectedTier(tier);
  };

  const EVENTMEGASTORE = HOLIDAY_EVENT_ITEMS;

  // Basic-Epic
  const basicAllItems = EVENTMEGASTORE.basic.items;
  const rareAllItems = EVENTMEGASTORE.rare.items;
  const epicAllItems = EVENTMEGASTORE.epic.items;
  const megaItems = EVENTMEGASTORE.mega.items;

  return (
    <>
      <ModalOverlay
        show={!!selectedItem}
        onBackdropClick={() => setSelectedItem(null)}
      >
        <ItemDetail
          isVisible={!!selectedItem}
          item={selectedItem}
          tier={selectedTier}
          image={getItemImage(selectedItem)}
          buff={getItemBuffLabel(selectedItem, state!)}
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
          {"Event Store"}
        </Label>
      </div>
      <div
        className={classNames("flex flex-col p-2 pt-1", {
          ["max-h-[300px] overflow-y-auto scrollable "]: !readonly,
        })}
      >
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
