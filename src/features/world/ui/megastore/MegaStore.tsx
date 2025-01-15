import React, { useContext, useState } from "react";
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

import lightning from "assets/icons/lightning.png";
import shopIcon from "assets/icons/shop.png";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { getImageUrl } from "lib/utils/getImageURLS";
import { MegaStoreMonthly } from "./MegaStoreMonthly";
import { MegaStoreSeasonal } from "./MegaStoreSeasonal";
import { MachineState } from "features/game/lib/gameMachine";
import { SeasonalStore } from "./SeasonalStore";
import { hasFeatureAccess } from "lib/flags";
import { Context } from "features/game/GameProvider";
import { useSelector } from "@xstate/react";

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

  return COLLECTIBLE_BUFF_LABELS(state)[item.name];
};

export const _megastore = (state: MachineState) =>
  state.context.state.megastore;
const _state = (state: MachineState) => state.context.state;

export const MegaStore: React.FC<Props> = ({ onClose }) => {
  const { gameService } = useContext(Context);
  const { t } = useAppTranslation();
  const [tab, setTab] = useState(0);
  const state = useSelector(gameService, _state);

  // Update logic after release
  if (hasFeatureAccess(state, "SEASONAL_TIERS")) {
    return (
      <CloseButtonPanel
        bumpkinParts={NPC_WEARABLES.stella}
        tabs={[{ icon: shopIcon, name: "Seasonal Store" }]}
        onClose={onClose}
        currentTab={tab}
        setCurrentTab={setTab}
      >
        {tab === 0 && <SeasonalStore state={state} />}
      </CloseButtonPanel>
    );
  }

  return (
    <CloseButtonPanel
      bumpkinParts={NPC_WEARABLES.stella}
      tabs={[
        { icon: shopIcon, name: t("monthly") },
        { icon: lightning, name: t("seasonal") },
      ]}
      onClose={onClose}
      currentTab={tab}
      setCurrentTab={setTab}
    >
      {tab === 0 && <MegaStoreMonthly />}
      {tab === 1 && <MegaStoreSeasonal />}
    </CloseButtonPanel>
  );
};
