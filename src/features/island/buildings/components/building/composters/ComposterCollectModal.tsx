import React, { useContext } from "react";

import { Modal } from "react-bootstrap";
import { Button } from "components/ui/Button";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { Context } from "features/game/GameProvider";
import { useActor, useInterpret } from "@xstate/react";
import {
  ComposterName,
  composterDetails,
} from "features/game/types/composters";
import { PlacedItem } from "features/game/types/game";
import {
  CompostingContext,
  MachineInterpreter,
  composterMachine,
} from "features/island/buildings/lib/composterMachine";

interface Props {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  composterName: ComposterName;
  composterId: string;
  composter: PlacedItem;
}

export const ComposterCollectModal: React.FC<Props> = ({
  showModal,
  setShowModal,
  composterName,
  composterId,
  composter,
}) => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);
  const state = gameState.context.state;

  const composterMachineContext: CompostingContext = {
    gameService,
    readyAt: composter && composter.producing?.readyAt,
  };

  const composterService = useInterpret(composterMachine, {
    context: composterMachineContext,
  }) as unknown as MachineInterpreter;

  const handleCollect = () => {
    composterService?.send({
      type: "COLLECT",
      event: "compost.collected",
      buildingId: composterId,
      building: composterName,
    });

    setShowModal(false);
  };
  return (
    <Modal show={showModal} centered onHide={() => setShowModal(false)}>
      <CloseButtonPanel
        bumpkinParts={state.bumpkin?.equipped}
        onClose={() => setShowModal(false)}
      >
        <span className="text-xs">
          {`Whoa! Your composter has brewed up 10x ${composter.producing?.name} and
          guess what? You've also discovered a ${composterDetails[composterName].bait} for fishing! Ready to collect
          your goodies?`}
        </span>
        <Button
          className="text-xxs sm:text-sm mt-1 whitespace-nowrap"
          onClick={handleCollect}
        >
          Collect
        </Button>
      </CloseButtonPanel>
    </Modal>
  );
};
