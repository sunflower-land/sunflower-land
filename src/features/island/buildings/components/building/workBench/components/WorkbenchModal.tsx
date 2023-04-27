import React, { SyntheticEvent, useContext, useState } from "react";

import { ITEM_DETAILS } from "features/game/types/images";

import lightning from "assets/icons/lightning.png";

import { Equipped } from "features/game/types/bumpkin";
import { SUNNYSIDE } from "assets/sunnyside";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { NPC_WEARABLES } from "lib/npcs";
import { Tools } from "./Tools";
import { Equipment } from "features/island/hud/components/equipment/Equipment";
import { Buildings } from "features/island/hud/components/buildings/Buildings";
import { Context } from "features/game/GameProvider";
import { useSelector } from "@xstate/react";
import { MachineState } from "features/game/lib/gameMachine";

interface Props {
  isOpen: boolean;
  onClose: (e?: SyntheticEvent) => void;
}

const inventory = (state: MachineState) => state.context.state.inventory;

export const WorkbenchModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [tab, setTab] = useState(0);

  const { gameService } = useContext(Context);

  const gameInventory = useSelector(gameService, inventory, (prev, next) => {
    return !!prev["Beta Pass"]?.eq(next["Beta Pass"] ?? 0);
  });

  const bumpkinParts: Partial<Equipped> = NPC_WEARABLES.blacksmith;

  return (
    <CloseButtonPanel
      bumpkinParts={bumpkinParts}
      onClose={onClose}
      tabs={[
        { icon: ITEM_DETAILS.Pickaxe.image, name: "Tools" },
        { icon: lightning, name: "Special" },
        { icon: SUNNYSIDE.icons.hammer, name: "Build" },
      ]}
      currentTab={tab}
      setCurrentTab={setTab}
    >
      {tab === 0 && <Tools onClose={onClose} />}
      {tab === 1 && <Equipment onClose={onClose} />}
      {tab === 2 && <Buildings onClose={onClose} />}
    </CloseButtonPanel>
  );
};
