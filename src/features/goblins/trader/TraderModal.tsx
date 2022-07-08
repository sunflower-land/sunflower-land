import React, { useContext } from "react";
import { useActor } from "@xstate/react";

import { Context } from "features/game/GoblinProvider";
import { Cancel, Draft, MachineInterpreter } from "./lib/tradingPostMachine";
import { Drafting } from "./components/Drafting";
import { Confirming } from "./components/Confirming";
import { ConfirmingCancel } from "./components/ConfirmingCancel";
import { Modal } from "react-bootstrap";
import { Panel } from "components/ui/Panel";
import { Idle } from "./components/Idle";

const TAX = 0.1;

interface TraderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TraderModal: React.FC<TraderModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { goblinService } = useContext(Context);
  const [goblinState] = useActor(goblinService);

  const child = goblinState.children.tradingPost as MachineInterpreter;

  const [machine, send] = useActor(child);

  const {
    farmSlots,
    draft,
    cancel: cancelledListing,
    slotId,
    remainingListings,
    freeListings,
    itemLimits,
  } = machine.context;

  const list = (draft: Draft) => {
    child.send("LIST", { draft });
  };

  const post = () => {
    child.send("POST");
  };

  const handleClose = () => {
    child.send("CLOSING");
    onClose();
  };

  return (
    <Modal centered show={isOpen} onHide={handleClose}>
      <Panel>
        {machine.matches("loading") && <span className="loading">Loading</span>}

        {machine.matches("drafting") && (
          <Drafting
            slotId={slotId}
            itemLimits={itemLimits}
            inventory={goblinState.context.state.inventory}
            onCancel={() => send("CANCEL")}
            onList={list}
          />
        )}

        {machine.matches("confirming") && (
          <Confirming
            tax={TAX}
            draft={draft}
            onCancel={() => send("CANCEL")}
            onConfirm={post}
          />
        )}

        {machine.matches("posting") && <span className="loading">Posting</span>}

        {machine.matches("error") && <div>Error</div>}

        {machine.matches("confirmingCancel") && (
          <ConfirmingCancel
            onBack={() => send("BACK")}
            onConfirm={() => send("CONFIRM")}
            listingId={cancelledListing.listingId}
            resourceName={cancelledListing.resourceName}
            resourceAmount={cancelledListing.resourceAmount}
          />
        )}

        {machine.matches("cancelling") && (
          <span className="loading">Cancelling</span>
        )}

        {machine.matches("updateSession") && (
          <span className="loading">Processing</span>
        )}

        {machine.matches("idle") && (
          <Idle
            freeListings={freeListings}
            remainingListings={remainingListings}
            farmSlots={farmSlots ?? []}
            onList={(slotId: number) => child.send("DRAFT", { slotId })}
            onCancel={(cancel: Cancel) =>
              child.send("CANCEL_LISTING", { cancel })
            }
            onClose={handleClose}
          />
        )}
      </Panel>
    </Modal>
  );
};
