import React, { useContext } from "react";

import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { NPCName, NPC_WEARABLES } from "lib/npcs";
import { Chores } from "./Chores";
import { useActor, useSelector } from "@xstate/react";
import { Context } from "features/game/GameProvider";
import { KingdomChores } from "features/game/types/game";
import { MachineState } from "features/game/lib/gameMachine";

interface Props {
  onClose: () => void;
  npc: NPCName;
}

const CHORES: KingdomChores = {
  week: 1,
  chores: {
    1: {
      activity: "Sunflower Harvested",
      description: "Plant 5 sunflowers",
      resource: "Sunflower",
      createdAt: 1632492000000,
      requirement: 5,
      bumpkinId: 1,
      startCount: 0,
      marks: 1,
      active: true,
    },
    2: {
      activity: "Potato Harvested",
      description: "Harvest 5 potatoes",
      createdAt: 1632492000000,
      resource: "Potato",
      requirement: 5,
      bumpkinId: 1,
      startCount: 0,
      marks: 1,
      active: true,
    },
    3: {
      activity: "Tree Chopped",
      description: "Chop 5 wood",
      createdAt: 1632492000000,
      resource: "Axe",
      requirement: 5,
      bumpkinId: 2,
      startCount: 0,
      marks: 2,
      active: true,
    },
    4: {
      activity: "Kale Harvested",
      description: "Plant 5 kale",
      resource: "Kale",
      createdAt: 1632492000000,
      requirement: 5,
      bumpkinId: 1,
      startCount: 0,
      marks: 1,
    },
    5: {
      activity: "Corn Harvested",
      description: "Harvest 5 Corne",
      createdAt: 1632492000000,
      resource: "Corn",
      requirement: 3,
      bumpkinId: 1,
      startCount: 0,
      marks: 1,
    },
    6: {
      activity: "Stone Mined",
      description: "Mine 3 stone",
      createdAt: 1632492000000,
      resource: "Pickaxe",
      requirement: 3,
      bumpkinId: 2,
      startCount: 0,
      marks: 2,
    },
  },
  choresCompleted: 0,
  choresSkipped: 0,
  weeklyChoresCompleted: 0,
  weeklyChoresSkipped: 0,
  weeklyChores: 6,
};

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
    <CloseButtonPanel onClose={onClose} bumpkinParts={NPC_WEARABLES[npc]}>
      <Chores chores={chores} onClose={onClose} />
    </CloseButtonPanel>
  );
};
