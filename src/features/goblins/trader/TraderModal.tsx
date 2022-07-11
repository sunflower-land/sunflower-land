import React, { useContext } from "react";
import { useActor } from "@xstate/react";

import close from "assets/icons/close.png";
import token from "assets/icons/token.gif";

import { Context } from "features/game/GoblinProvider";
import {
  Cancel,
  Draft,
  MachineInterpreter,
  BlockchainState,
} from "./lib/tradingPostMachine";
import { Drafting } from "./components/Drafting";
import { Confirming } from "./components/Confirming";
import { ConfirmingCancel } from "./components/ConfirmingCancel";
import { Modal } from "react-bootstrap";
import { Panel } from "components/ui/Panel";
import { Selling } from "./components/Selling";
import { Tab } from "components/ui/Tab";
import { Buying } from "./components/Buying";

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

  // const buyingStates: BlockchainState["value"][] = ["buying"];
  // const sellingStates: BlockchainState["value"][] = [
  //   "selling",
  //   "drafting",
  //   "confirming",
  //   "posting",
  //   "confirmingCancel",
  //   "cancelling",
  // ];
  // const isBuying = buyingStates.some(machine.matches);
  // const isSelling = sellingStates.some(machine.matches);
  const sellingStates: BlockchainState["value"][] = [
    { selling: "cancelling" },
    { selling: "confirming" },
    { selling: "confirmingCancel" },
    { selling: "drafting" },
    { selling: "idle" },
    { selling: "posting" },
  ];
  const isSelling = sellingStates.some(machine.matches);

  return (
    <Modal centered show={isOpen} onHide={handleClose}>
      <Panel className="pt-5 relative">
        <div className="flex justify-between absolute top-1.5 left-0.5 right-0 items-center">
          <div className="flex">
            <Tab
              className="flex items-center"
              isActive={!isSelling}
              onClick={() => send("BUY")}
            >
              <img src={token} className="h-4 sm:h-5 mr-2" />
              <span className="text-xs sm:text-sm overflow-hidden text-ellipsis">
                Buy
              </span>
            </Tab>
            <Tab
              className="flex items-center"
              isActive={isSelling}
              onClick={() => send("SELL")}
            >
              <img src={token} className="h-4 sm:h-5 mr-2" />
              <span className="text-xs sm:text-sm overflow-hidden text-ellipsis">
                Sell
              </span>
            </Tab>
          </div>
          <img
            src={close}
            className="h-6 cursor-pointer mr-2 mb-1"
            onClick={handleClose}
          />
        </div>

        {machine.matches("loading") && <span className="loading">Loading</span>}

        {machine.matches({ selling: "drafting" }) && (
          <Drafting
            slotId={slotId}
            itemLimits={itemLimits}
            inventory={goblinState.context.state.inventory}
            onCancel={() => send("BACK")}
            onList={list}
          />
        )}

        {machine.matches({ selling: "confirming" }) && (
          <Confirming
            tax={TAX}
            draft={draft}
            onCancel={() => send("BACK")}
            onConfirm={post}
          />
        )}

        {machine.matches({ selling: "posting" }) && (
          <span className="loading">Posting</span>
        )}

        {machine.matches("error") && <div>Error</div>}

        {machine.matches({ selling: "confirmingCancel" }) && (
          <ConfirmingCancel
            onBack={() => send("BACK")}
            onConfirm={() => send("CONFIRM")}
            listingId={cancelledListing.listingId}
            resourceName={cancelledListing.resourceName}
            resourceAmount={cancelledListing.resourceAmount}
          />
        )}

        {machine.matches({ selling: "cancelling" }) && (
          <span className="loading">Cancelling</span>
        )}

        {machine.matches("updateSession") && (
          <span className="loading">Processing</span>
        )}

        {machine.matches("buying") && (
          <Buying
            farmId={1}
            onVisit={(farmId) => {
              console.log(farmId);
            }}
          />
        )}

        {machine.matches({ selling: "idle" }) && (
          <Selling
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
