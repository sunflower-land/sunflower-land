import React, { useState } from "react";

import { SUNNYSIDE } from "assets/sunnyside";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { PanelTabs } from "features/game/components/CloseablePanel";
import { NPC_WEARABLES } from "lib/npcs";
import { PotionHouseItems } from "./PotionHouseItems";
import { OuterPanel } from "components/ui/Panel";
import { PotionHouse } from "features/game/expansion/components/potions/PotionHouse";

interface Props {
  onClose: () => void;
}

export const PotionMaster: React.FC<Props> = ({ onClose }) => {
  type Tab = "experiment" | "rewardShop";
  const [tab, setTab] = useState<Tab>("experiment");

  const experimentTab: PanelTabs<Tab> = {
    id: "experiment",
    icon: SUNNYSIDE.decorations.pinkBottle,
    name: "Experiment",
  };

  const rewardsTab: PanelTabs<Tab> = {
    id: "rewardShop",
    icon: SUNNYSIDE.icons.heart,
    name: "Reward Shop",
  };

  return (
    <CloseButtonPanel
      bumpkinParts={NPC_WEARABLES.eins}
      tabs={[experimentTab, rewardsTab]}
      currentTab={tab}
      setCurrentTab={setTab}
      onClose={onClose}
      container={OuterPanel}
    >
      {tab === "experiment" && <PotionHouse onClose={onClose} />}
      {tab === "rewardShop" && <PotionHouseItems />}
    </CloseButtonPanel>
  );
};
