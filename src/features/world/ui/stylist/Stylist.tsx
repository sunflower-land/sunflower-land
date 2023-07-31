import { SUNNYSIDE } from "assets/sunnyside";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { NPC_WEARABLES } from "lib/npcs";
import React, { useState } from "react";
import { StylistWearables } from "./StylistWearables";
import {
  BASIC_WEARABLES,
  LIMITED_WEARABLES,
} from "features/game/types/stylist";
import { TEST_FARM } from "features/game/lib/constants";

interface Props {
  onClose: () => void;
}
export const Stylist: React.FC<Props> = ({ onClose }) => {
  const [tab, setTab] = useState(0);

  return (
    <CloseButtonPanel
      bumpkinParts={NPC_WEARABLES.stella}
      tabs={[
        { icon: SUNNYSIDE.icons.heart, name: "Wearables" },
        { icon: SUNNYSIDE.icons.timer, name: "Limited" },
      ]}
      onClose={onClose}
      currentTab={tab}
      setCurrentTab={setTab}
    >
      {tab === 0 && <StylistWearables wearables={BASIC_WEARABLES} />}
      {tab === 1 && (
        <StylistWearables wearables={LIMITED_WEARABLES(TEST_FARM)} />
      )}
    </CloseButtonPanel>
  );
};
