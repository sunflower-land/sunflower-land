import React, { useState } from "react";

import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { NPC_WEARABLES } from "lib/npcs";
import { SUNNYSIDE } from "assets/sunnyside";
import { CROP_LIFECYCLE } from "../plots/lib/plant";

interface Props {
  onClose: () => void;
}

export const FlowerBedModal: React.FC<Props> = ({ onClose }) => {
  const [tab, setTab] = useState(0);

  return (
    <CloseButtonPanel
      onClose={onClose}
      bumpkinParts={NPC_WEARABLES["poppy"]}
      tabs={[
        { icon: CROP_LIFECYCLE.Sunflower.seedling, name: "Plant" },
        {
          icon: SUNNYSIDE.icons.expression_confused,
          name: "Guide",
        },
      ]}
      currentTab={tab}
      setCurrentTab={setTab}
    >
      {tab === 0 && <p>hey</p>}

      {tab === 1 && <p>hi</p>}
    </CloseButtonPanel>
  );
};
