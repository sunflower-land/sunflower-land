import React, { useState } from "react";

import { SUNNYSIDE } from "assets/sunnyside";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { NPC_WEARABLES } from "lib/npcs";
import { PotionHouseItems } from "./PotionHouseItems";
import { OuterPanel } from "components/ui/Panel";
import { PotionHouse } from "features/game/expansion/components/potions/PotionHouse";

interface Props {
  onClose: () => void;
}

export const PotionMaster: React.FC<Props> = ({ onClose }) => {
  const [tab, setTab] = useState(0);

  return (
    <CloseButtonPanel
      bumpkinParts={NPC_WEARABLES.eins}
      tabs={[
        { icon: SUNNYSIDE.decorations.pinkBottle, name: "Experiment" },
        { icon: SUNNYSIDE.icons.heart, name: "Reward Shop" },
      ]}
      currentTab={tab}
      setCurrentTab={setTab}
      onClose={onClose}
      container={OuterPanel}
    >
      {tab === 0 && <PotionHouse onClose={onClose} />}
      {tab === 1 && <PotionHouseItems />}
    </CloseButtonPanel>
  );
};
