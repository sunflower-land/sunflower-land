import { SUNNYSIDE } from "assets/sunnyside";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { NPC_WEARABLES } from "lib/npcs";
import React, { useContext, useState } from "react";
import { StylistWearables } from "./StylistWearables";
import {
  BASIC_WEARABLES,
  LIMITED_WEARABLES,
} from "features/game/types/stylist";
import { Merch } from "./Merch";
import { Context } from "features/game/GameProvider";
import { useActor } from "@xstate/react";

interface Props {
  onClose: () => void;
}
export const Stylist: React.FC<Props> = ({ onClose }) => {
  const { gameService } = useContext(Context);
  const [
    {
      context: { state },
    },
  ] = useActor(gameService);
  const [tab, setTab] = useState(0);

  return (
    <CloseButtonPanel
      bumpkinParts={NPC_WEARABLES.stella}
      tabs={[
        { icon: SUNNYSIDE.icons.wardrobe, name: "Wearables" },
        { icon: SUNNYSIDE.icons.timer, name: "Limited" },
        { icon: SUNNYSIDE.icons.heart, name: "Merch" },
      ]}
      onClose={onClose}
      currentTab={tab}
      setCurrentTab={setTab}
    >
      {tab === 0 && <StylistWearables wearables={BASIC_WEARABLES} />}
      {tab === 1 && <StylistWearables wearables={LIMITED_WEARABLES(state)} />}
      {tab === 2 && <Merch />}
    </CloseButtonPanel>
  );
};
