import React, { useState } from "react";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { ITEM_IDS } from "features/game/types/bumpkin";
import { BUMPKIN_ITEM_BUFF_LABELS } from "features/game/types/bumpkinItemBuffs";
import { ITEM_DETAILS } from "features/game/types/images";

import { COLLECTIBLE_BUFF_LABELS } from "features/game/types/collectibleItemBuffs";
import { BuffLabel } from "features/game/types";
import {
  WearablesItem,
  CollectiblesItem,
  GameState,
} from "features/game/types/game";

import shopIcon from "assets/icons/shop.png";
import { getImageUrl } from "lib/utils/getImageURLS";
import { EventStore } from "./EventStore";
import { useGameState } from "features/game/hooks";

interface Props {
  onClose: () => void;
}

// type guard for WearablesItem | CollectiblesItem
export const isWearablesItem = (
  item: WearablesItem | CollectiblesItem,
): item is WearablesItem => {
  return (item as WearablesItem).name in ITEM_IDS;
};

export const getItemImage = (
  item: WearablesItem | CollectiblesItem | null,
): string => {
  if (!item) return "";

  if (isWearablesItem(item)) {
    return getImageUrl(ITEM_IDS[item.name]);
  }

  return ITEM_DETAILS[item.name].image;
};

export const getItemBuffLabel = (
  item: WearablesItem | CollectiblesItem | null,
  state: GameState,
): BuffLabel[] | undefined => {
  if (!item) return;

  if (isWearablesItem(item)) {
    return BUMPKIN_ITEM_BUFF_LABELS[item.name];
  }

  return COLLECTIBLE_BUFF_LABELS[item.name]?.({
    skills: state.bumpkin.skills,
    collectibles: state.collectibles,
  });
};

export const EventMegaStore: React.FC<Props> = ({ onClose }) => {
  const [tab, setTab] = useState(0);
  const state = useGameState();

  // Update logic after release
  return (
    <CloseButtonPanel
      tabs={[{ icon: shopIcon, name: "Event Store" }]}
      onClose={onClose}
      currentTab={tab}
      setCurrentTab={setTab}
    >
      {tab === 0 && <EventStore state={state} />}
    </CloseButtonPanel>
  );
};
