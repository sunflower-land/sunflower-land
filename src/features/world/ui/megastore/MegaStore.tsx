import React, { useContext } from "react";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { ITEM_IDS } from "features/game/types/bumpkin";
import { BUMPKIN_ITEM_BUFF_LABELS } from "features/game/types/bumpkinItemBuffs";
import { ITEM_DETAILS } from "features/game/types/images";
import { NPC_WEARABLES } from "lib/npcs";

import { COLLECTIBLE_BUFF_LABELS } from "features/game/types/collectibleItemBuffs";
import { BuffLabel } from "features/game/types";
import {
  WearablesItem,
  CollectiblesItem,
  GameState,
} from "features/game/types/game";

import shopIcon from "assets/icons/shop.png";
import { getImageUrl } from "lib/utils/getImageURLS";
import { MachineState } from "features/game/lib/gameMachine";
import { SeasonalStore } from "./SeasonalStore";
import { Context } from "features/game/GameProvider";
import { useSelector } from "@xstate/react";
import {
  getCurrentSeason,
  getSeasonalTicket,
} from "features/game/types/seasons";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

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

  return COLLECTIBLE_BUFF_LABELS({
    skills: state.bumpkin.skills,
    collectibles: state.collectibles,
  })[item.name];
};

const _state = (state: MachineState) => state.context.state;

export const MegaStore: React.FC<Props> = ({ onClose }) => {
  const { gameService } = useContext(Context);
  const state = useSelector(gameService, _state);

  const icon = ITEM_DETAILS[getSeasonalTicket()].image ?? shopIcon;
  const { t } = useAppTranslation();

  // If no season is found, use "Chapter"
  let chapter: string;
  try {
    chapter = getCurrentSeason();
  } catch {
    chapter = "Chapter";
  }

  // Update logic after release
  return (
    <CloseButtonPanel
      bumpkinParts={NPC_WEARABLES.stella}
      tabs={[{ icon, name: t("chapterStore.title", { chapter }) }]}
      onClose={onClose}
    >
      <SeasonalStore state={state} />
    </CloseButtonPanel>
  );
};
