import React, { useContext } from "react";

import { NPCName, NPC_WEARABLES } from "lib/npcs";
import { Chores } from "./Chores";
import { useSelector } from "@xstate/react";
import { Context } from "features/game/GameProvider";
import { MachineState } from "features/game/lib/gameMachine";
import { OuterPanel } from "components/ui/Panel";

interface Props {
  onClose: () => void;
  npc: NPCName;
}

const _kingdomChores = (state: MachineState) =>
  state.context.state.kingdomChores;

export const ChoresModal: React.FC<Props> = ({ onClose, npc }) => {
  const { gameService } = useContext(Context);

  const kingdomChores = useSelector(gameService, _kingdomChores);

  return (
    <OuterPanel bumpkinParts={NPC_WEARABLES[npc]}>
      <Chores kingdomChores={kingdomChores} onClose={onClose} />
    </OuterPanel>
  );
};
