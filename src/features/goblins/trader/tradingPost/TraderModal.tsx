import React, { useContext, useState } from "react";
import { useActor } from "@xstate/react";
import { Modal } from "react-bootstrap";

import { Context } from "features/game/GoblinProvider";
import { Panel } from "components/ui/Panel";

import { MachineInterpreter } from "./lib/tradingPostMachine";
import { Selling } from "../selling/Selling";
import { Buying } from "../buying/Buying";
import { Tabs } from "./components/Tabs";

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

  const [isSelling, setIsSelling] = useState(true);

  const handleClose = () => {
    onClose();
    child.send("CLOSE");
  };

  const isTrading = machine.matches("trading");

  return (
    <Modal centered show={isOpen} onHide={handleClose}>
      <Panel className={isTrading ? "pt-5 relative" : ""}>
        {isTrading && (
          <Tabs isSelling setIsSelling={setIsSelling} onClose={handleClose} />
        )}

        <div className="min-h-[150px]">
          {isTrading && isSelling && <Selling />}
          {isTrading && !isSelling && <Buying />}

          {machine.matches("loading") && (
            <span className="loading">Loading</span>
          )}
          {machine.matches("updatingSession") && (
            <span className="loading">Loading</span>
          )}
          {machine.matches("error") && <div>Error</div>}
        </div>
      </Panel>
    </Modal>
  );
};
