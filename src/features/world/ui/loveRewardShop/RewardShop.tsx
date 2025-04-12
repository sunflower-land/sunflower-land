import classNames from "classnames";
import { Label } from "components/ui/Label";
import { ModalOverlay } from "components/ui/ModalOverlay";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import React, { useState, useEffect } from "react";

import { ItemsList } from "./components/ItemsList";
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
  REWARD_SHOP_ITEMS,
  RewardShopItem,
  RewardShopWearable,
} from "features/game/types/rewardShop";

// type guard for WearablesItem | CollectiblesItem
export const isWearablesItem = (
  item: RewardShopItem | null,
): item is RewardShopWearable => {
  return (item as RewardShopWearable).name in ITEM_IDS;
};

export const getItemImage = (item: RewardShopItem | null): string => {
  if (!item) return "";

  if (isWearablesItem(item)) {
    return getImageUrl(ITEM_IDS[item.name]);
  }

  return ITEM_DETAILS[item.name].image;
};

export const getItemBuffLabel = (
  item: RewardShopItem | null,
  state: GameState,
): BuffLabel[] | undefined => {
  if (!item) return;

  if (isWearablesItem(item)) {
    return BUMPKIN_ITEM_BUFF_LABELS[item.name];
  }

  return COLLECTIBLE_BUFF_LABELS(state)[item.name];
};
export const getItemDescription = (item: RewardShopItem | null): string => {
  if (!item) return "";

  if (isWearablesItem(item)) {
    return OPEN_SEA_WEARABLES[item.name].description;
  }

  return ITEM_DETAILS[item.name].description;
};

export const RewardShop: React.FC<{
  readonly?: boolean;
  state: GameState;
}> = ({ readonly, state }) => {
  const [selectedItem, setSelectedItem] = useState<RewardShopItem | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (selectedItem && !isVisible) {
      setIsVisible(true);
    }
  }, [selectedItem, isVisible]);

  const handleClickItem = (item: RewardShopItem) => {
    setSelectedItem(item);
  };

  const { t } = useAppTranslation();

  const wearables = Object.values(REWARD_SHOP_ITEMS).filter(
    (item) => item.type === "wearable",
  );

  const collectible = Object.values(REWARD_SHOP_ITEMS).filter(
    (item) => item.type === "collectible",
  );

  return (
    <>
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
          onClose={() => {
            setSelectedItem(null);
          }}
          readonly={readonly}
        />
      </ModalOverlay>

      <div className="flex justify-between px-2 flex-wrap pb-1">
        <Label type="default" className="mb-1">
          {"Reward Shop"}
        </Label>
      </div>
      <div
        className={classNames("flex flex-col p-2 pt-1", {
          ["max-h-[300px] overflow-y-auto scrollable "]: !readonly,
        })}
      >
        <span className="text-xs pb-1">{t("rewardShop.msg1")}</span>
        <ItemsList
          itemsLabel={"Collectibles"}
          items={collectible}
          onItemClick={handleClickItem}
        />
        <ItemsList
          itemsLabel={"Wearables"}
          items={wearables}
          onItemClick={handleClickItem}
        />
      </div>
    </>
  );
};
