import React from "react";

import { SUNNYSIDE } from "assets/sunnyside";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { NPC_WEARABLES } from "lib/npcs";
import { PotionHouseItems } from "./PotionHouseItems";
import { PotionHouseSell } from "./PotionHouseSell";
import token from "assets/icons/token_2.png";

interface Props {
  onClose: () => void;
}

export const PotionHouseShopItems: React.FC<Props> = ({ onClose }) => {
  const [tab, setTab] = React.useState(0);

  return (
    <CloseButtonPanel
      bumpkinParts={NPC_WEARABLES.garth}
      tabs={[
        { icon: SUNNYSIDE.icons.heart, name: "Reward Shop" },
        { icon: token, name: "Sell Exotics" },
      ]}
      currentTab={tab}
      setCurrentTab={setTab}
      onClose={onClose}
    >
      {tab === 0 && <PotionHouseItems />}
      {tab === 1 && <PotionHouseSell />}
    </CloseButtonPanel>
  );
};
