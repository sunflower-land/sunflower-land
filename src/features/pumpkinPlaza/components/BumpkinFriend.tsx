import React, { useState } from "react";

import { SUNNYSIDE } from "assets/sunnyside";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { Bumpkin } from "features/game/types/game";
import { BumpkinStats } from "./BumpkinStats";
import { BumpkinTrade } from "./BumpkinTrade";

interface Props {
  bumpkin: Bumpkin;
  accountId: number;
  onClose: () => void;
}
export const BumpkinFriend: React.FC<Props> = ({
  bumpkin,
  accountId,
  onClose,
}) => {
  const [tab, setTab] = useState(0);

  return (
    <CloseButtonPanel
      currentTab={tab}
      setCurrentTab={setTab}
      tabs={[
        {
          icon: SUNNYSIDE.icons.player,
          name: "Player",
        },
        {
          icon: SUNNYSIDE.icons.treasure,
          name: "Shop",
        },
      ]}
      bumpkinParts={bumpkin.equipped}
      onClose={onClose}
    >
      {tab === 0 && <BumpkinStats bumpkin={bumpkin} />}
      {tab === 1 && <BumpkinTrade accountId={accountId} />}
    </CloseButtonPanel>
  );
};
