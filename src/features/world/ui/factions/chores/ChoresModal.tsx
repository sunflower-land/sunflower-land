import React, { useContext } from "react";

import { NPCName, NPC_WEARABLES } from "lib/npcs";
import { Chores } from "./Chores";
import { useActor, useSelector } from "@xstate/react";
import { Context } from "features/game/GameProvider";
import { MachineState } from "features/game/lib/gameMachine";
import { OuterPanel } from "components/ui/Panel";

interface Props {
  onClose: () => void;
  npc: NPCName;
}

const _chores = (state: MachineState) => state.context.state.kingdomChores;

export const ChoresModal: React.FC<Props> = ({ onClose, npc }) => {
  const { gameService } = useContext(Context);
  const [
    {
      context: { state },
    },
  ] = useActor(gameService);

  const chores = useSelector(gameService, _chores);

  return (
    <OuterPanel bumpkinParts={NPC_WEARABLES[npc]}>
      <Chores chores={chores} onClose={onClose} />
    </OuterPanel>
  );
};
