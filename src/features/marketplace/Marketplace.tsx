import { SUNNYSIDE } from "assets/sunnyside";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import React, { useState } from "react";
import shopIcon from "assets/icons/shop.png";
import giftIcon from "assets/icons/gift.png";
import { MarketplaceProfile } from "./components/MarketplaceProfile";
import { MarketplaceHome } from "./components/MarketplaceHome";
import { MarketplaceRewards } from "./components/MarketplaceRewards";

interface Props {
  onClose: () => void;
}
export const Marketplace: React.FC<Props> = ({ onClose }) => {
  const [tab, setTab] = useState(0);

  return (
    <CloseButtonPanel
      tabs={[
        {
          name: "Market",
          icon: shopIcon,
        },
        {
          name: "Profile",
          icon: SUNNYSIDE.icons.player,
        },
        {
          name: "Rewards",
          icon: giftIcon,
        },
      ]}
      currentTab={tab}
      setCurrentTab={setTab}
      onClose={onClose}
    >
      {tab === 0 && <MarketplaceHome />}
      {tab === 1 && <MarketplaceProfile />}
      {tab === 2 && <MarketplaceRewards />}
    </CloseButtonPanel>
  );
};
