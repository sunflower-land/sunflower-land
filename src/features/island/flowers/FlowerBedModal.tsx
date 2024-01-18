import React, { useState } from "react";

import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { NPC_WEARABLES } from "lib/npcs";
import { SUNNYSIDE } from "assets/sunnyside";
import { FlowerBedGuide } from "./FlowerBedGuide";
import { FlowerBedContent } from "./FlowerBedContent";

interface Props {
  id: string;
  onClose: () => void;
}

export const FlowerBedModal: React.FC<Props> = ({ onClose, id }) => {
  const [tab, setTab] = useState(0);

  return (
    <CloseButtonPanel
      onClose={onClose}
      bumpkinParts={NPC_WEARABLES["poppy"]}
      tabs={[
        { icon: SUNNYSIDE.icons.seedling, name: "Plant" },
        {
          icon: SUNNYSIDE.icons.expression_confused,
          name: "Guide",
        },
      ]}
      currentTab={tab}
      setCurrentTab={setTab}
    >
      {tab === 0 && <FlowerBedContent id={id} onClose={onClose} />}

      {tab === 1 && <FlowerBedGuide onClose={() => setTab(0)} />}
    </CloseButtonPanel>
  );
};
