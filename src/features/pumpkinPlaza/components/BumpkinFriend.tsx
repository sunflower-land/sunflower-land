import React, { useContext, useState } from "react";

import { SUNNYSIDE } from "assets/sunnyside";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { Bumpkin } from "features/game/types/game";
import { BumpkinStats } from "./BumpkinStats";
import { BumpkinTrade } from "./BumpkinTrade";
import { BumpkinModerate } from "./BumpkinModerate";
import { useActor } from "@xstate/react";

import * as AuthProvider from "features/auth/lib/Provider";

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
  const { authService } = useContext(AuthProvider.Context);
  const authState = useActor(authService)[0];

  const tabs = [
    {
      icon: SUNNYSIDE.icons.player,
      name: "Player",
    },
    {
      icon: SUNNYSIDE.icons.treasure,
      name: "Shop",
    },
  ];

  if (authState.context.user.token?.userAccess.admin) {
    tabs.push({
      icon: SUNNYSIDE.icons.death,
      name: "Mod",
    });
  }

  return (
    <CloseButtonPanel
      currentTab={tab}
      setCurrentTab={setTab}
      tabs={tabs}
      bumpkinParts={bumpkin.equipped}
      onClose={onClose}
    >
      {tab === 0 && <BumpkinStats bumpkin={bumpkin} />}
      {tab === 1 && <BumpkinTrade accountId={accountId} />}
      {tab === 2 && <BumpkinModerate accountId={accountId} />}
    </CloseButtonPanel>
  );
};
