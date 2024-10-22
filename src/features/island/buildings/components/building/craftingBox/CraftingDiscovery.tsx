import { useSelector } from "@xstate/react";
import { Modal } from "components/ui/Modal";
import { InnerPanel } from "components/ui/Panel";
import { Context } from "features/game/GameProvider";
import { MachineState } from "features/game/lib/gameMachine";
import { useContext } from "react";

const _craftingBoxAcknowledgements = (state: MachineState) =>
  state.context.state.craftingBox.acknowledgements;

export const CraftingDiscovery: React.FC = () => {
  const { gameService } = useContext(Context);

  const acknowledgements = useSelector(
    gameService,
    _craftingBoxAcknowledgements,
  );

  const hasAcknowledgements = !Object.values(acknowledgements).every(Boolean);

  console.log(hasAcknowledgements, acknowledgements);
  return (
    <Modal show={hasAcknowledgements}>
      <InnerPanel>
        <div>CraftingDiscovery</div>
        <div>{JSON.stringify(acknowledgements)}</div>
      </InnerPanel>
    </Modal>
  );
};
