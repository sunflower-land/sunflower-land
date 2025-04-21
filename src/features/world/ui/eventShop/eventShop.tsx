import { ModalOverlay } from "components/ui/ModalOverlay";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import React, { useState, useEffect, useContext } from "react";

import { ItemsList } from "./components/ItemList";
import { ItemDetail } from "./components/ItemDetail";
import { ITEM_IDS } from "features/game/types/bumpkin";
import { ITEM_DETAILS } from "features/game/types/images";
import { getImageUrl } from "lib/utils/getImageURLS";
import { BuffLabel } from "features/game/types";
import { BUMPKIN_ITEM_BUFF_LABELS } from "features/game/types/bumpkinItemBuffs";
import { COLLECTIBLE_BUFF_LABELS } from "features/game/types/collectibleItemBuffs";
import { OPEN_SEA_WEARABLES } from "metadata/metadata";
import { GameState } from "features/game/types/game";
import {
  MINIGAME_SHOP_ITEMS,
  EventShopItem,
  EventShopWearable,
} from "features/game/types/minigameShop";
import { useActor } from "@xstate/react";
import { Context } from "features/game/GameProvider";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import shopIcon from "assets/icons/shop.png";

interface Props {
  onClose: () => void;
}

// type guard for WearablesItem | CollectiblesItem
export const isWearablesItem = (
  item: EventShopItem | null,
): item is EventShopWearable => {
  return (item as EventShopWearable)?.name in ITEM_IDS;
};

export const getItemImage = (item: EventShopItem | null): string => {
  if (!item) return "";

  if (isWearablesItem(item)) {
    return getImageUrl(ITEM_IDS[item.name]);
  }

  return ITEM_DETAILS[item.name].image;
};

export const getItemBuffLabel = (
  item: EventShopItem | null,
  state: GameState,
): BuffLabel[] | undefined => {
  if (!item) return;

  if (isWearablesItem(item)) {
    return BUMPKIN_ITEM_BUFF_LABELS[item.name];
  }

  return COLLECTIBLE_BUFF_LABELS(state)[item.name];
};
export const getItemDescription = (item: EventShopItem | null): string => {
  if (!item) return "";

  if (isWearablesItem(item)) {
    return OPEN_SEA_WEARABLES[item.name].description;
  }

  return ITEM_DETAILS[item.name].description;
};

export const EventShop: React.FC<Props> = ({ onClose }) => {
  const { gameService } = useContext(Context);
  const [
    {
      context: { state },
    },
  ] = useActor(gameService);
  const { t } = useAppTranslation();

  const [selectedItem, setSelectedItem] = useState<EventShopItem | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (selectedItem && !isVisible) {
      setIsVisible(true);
    }
  }, [selectedItem, isVisible]);

  const handleClickItem = (item: EventShopItem) => {
    setSelectedItem(item);
  };

  const wearables = Object.values(MINIGAME_SHOP_ITEMS).filter(
    (item) => item.type === "wearable",
  );

  const collectibles = Object.values(MINIGAME_SHOP_ITEMS).filter(
    (item) => item.type === "collectible",
  );

  const limited = Object.values(MINIGAME_SHOP_ITEMS).filter(
    (item) => item.type === "limited",
  );

  const shop = state.minigames.games["easter-eggstravaganza"]?.shop ?? {
    wearables: {},
    items: {},
  };

  return (
    <CloseButtonPanel
      tabs={[{ icon: shopIcon, name: t("event.shop.title") }]}
      onClose={onClose}
    >
      <div className="relative h-[450px] w-full">
        <div className="flex flex-col p-2 pt-1 space-y-3 overflow-y-auto scrollable max-h-[450px]">
          <span className="text-xs">{t("event.shop.welcome")}</span>
          {/* Limited Items */}
          <ItemsList
            itemsLabel="Limited"
            type="limited"
            items={limited}
            onItemClick={handleClickItem}
          />
          {/* Wearables */}
          <ItemsList
            itemsLabel="Wearables"
            type="wearables"
            items={wearables}
            onItemClick={handleClickItem}
          />
          {/* Collectibles */}
          <ItemsList
            itemsLabel="Collectibles"
            type="collectibles"
            items={collectibles}
            onItemClick={handleClickItem}
          />
        </div>

        <ModalOverlay
          show={!!selectedItem}
          onBackdropClick={() => setSelectedItem(null)}
        >
          <ItemDetail
            isVisible={isVisible}
            item={selectedItem}
            image={getItemImage(selectedItem)}
            buff={getItemBuffLabel(selectedItem, state)}
            isWearable={selectedItem ? isWearablesItem(selectedItem) : false}
            onClose={() => setSelectedItem(null)}
          />
        </ModalOverlay>
      </div>
    </CloseButtonPanel>
  );
};
