import React, { useContext, useState } from "react";

import { DecorationItems } from "./DecorationItems";
import { SUNNYSIDE } from "assets/sunnyside";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { NPC_WEARABLES } from "lib/npcs";
import {
  BASIC_DECORATIONS,
  SEASONAL_DECORATIONS,
} from "features/game/types/decorations";
import { Context } from "features/game/GameProvider";
import { useActor } from "@xstate/react";

interface Props {
  onClose: () => void;
}

export const DecorationShopItems: React.FC<Props> = ({ onClose }) => {
  const [tab, setTab] = useState(0);
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);

  const { state } = gameState.context;

  return (
    <CloseButtonPanel
      bumpkinParts={NPC_WEARABLES.frankie}
      tabs={[
        { icon: SUNNYSIDE.icons.heart, name: "Decorations" },
        { icon: SUNNYSIDE.icons.timer, name: "Limited" },
      ]}
      onClose={onClose}
      currentTab={tab}
      setCurrentTab={setTab}
    >
      {tab === 0 && <DecorationItems items={BASIC_DECORATIONS()} />}
      {tab === 1 && <DecorationItems items={SEASONAL_DECORATIONS(state)} />}
    </CloseButtonPanel>
  );
};
