import classNames from "classnames";
import { Panel } from "components/ui/Panel";
import { NPCName, NPC_WEARABLES } from "lib/npcs";
import React, { useContext } from "react";
import { DeliveryPanelContent } from "./DeliveryPanelContent";
import { BumpkinDelivery } from "./BumpkinDelivery";
import { Context } from "features/game/GameProvider";
import { MachineState } from "features/game/lib/gameMachine";
import { useSelector } from "@xstate/react";
import { hasFeatureAccess } from "lib/flags";

interface Props {
  npc: NPCName;
  className?: string;
  onClose: () => void;
}

const isBeta = (state: MachineState) =>
  hasFeatureAccess(state.context.state, "BUMPKIN_GIFTS");

export const DeliveryPanel: React.FC<Props> = ({ npc, className, onClose }) => {
  const { gameService } = useContext(Context);
  const beta = useSelector(gameService, isBeta);

  if (beta) {
    return <BumpkinDelivery npc={npc} onClose={onClose} />;
  }

  return (
    <Panel
      className={classNames("relative w-full", className)}
      bumpkinParts={NPC_WEARABLES[npc]}
    >
      <DeliveryPanelContent npc={npc} onClose={onClose} />
    </Panel>
  );
};
