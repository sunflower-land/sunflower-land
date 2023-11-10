import React, { SyntheticEvent, useState } from "react";

import { ITEM_DETAILS } from "features/game/types/images";
import { Equipped } from "features/game/types/bumpkin";
import { SUNNYSIDE } from "assets/sunnyside";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { NPC_WEARABLES } from "lib/npcs";
import { Tools } from "./Tools";
import { Buildings } from "features/island/hud/components/buildings/Buildings";
import { IslandBlacksmithItems } from "features/helios/components/blacksmith/component/IslandBlacksmithItems";

interface Props {
  onClose: (e?: SyntheticEvent) => void;
}

export const WorkbenchModal: React.FC<Props> = ({ onClose }) => {
  const [tab, setTab] = useState(0);

  const bumpkinParts: Partial<Equipped> = NPC_WEARABLES.blacksmith;

  return (
    <CloseButtonPanel
      bumpkinParts={bumpkinParts}
      onClose={onClose}
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
