import React, { SyntheticEvent, useState } from "react";

import { ITEM_DETAILS } from "features/game/types/images";
import { SUNNYSIDE } from "assets/sunnyside";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { Tools } from "./Tools";
import { IslandBlacksmithItems } from "features/helios/components/blacksmith/component/IslandBlacksmithItems";
import { Buildings } from "features/island/hud/components/buildings/Buildings";
import { NPC_WEARABLES } from "lib/npcs";

interface Props {
  onClose: (e?: SyntheticEvent) => void;
}

export const WorkbenchModal: React.FC<Props> = ({ onClose }) => {
  const [tab, setTab] = useState(0);

  return (
    <CloseButtonPanel
      onClose={onClose}
      bumpkinParts={NPC_WEARABLES.blacksmith}
      tabs={[
        { icon: ITEM_DETAILS.Pickaxe.image, name: "Tools" },
        { icon: SUNNYSIDE.icons.hammer, name: "Craft" },
        { icon: SUNNYSIDE.icons.hammer, name: "Build" },
      ]}
      currentTab={tab}
      setCurrentTab={setTab}
    >
      {tab === 0 && <Tools onClose={onClose} />}
      {tab === 1 && <IslandBlacksmithItems />}
      {tab === 2 && <Buildings onClose={onClose} />}
    </CloseButtonPanel>
  );
};
