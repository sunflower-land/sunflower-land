import React from "react";
import { Panel } from "components/ui/Panel";
import { Button } from "components/ui/Button";
import goblinFence from "assets/land/goblin_fence.png";
import { Modal } from "react-bootstrap";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const GoblinVillageModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const goToGoblinTown = () => {
    window.location.href = `${window.location.pathname}#/goblins`;
  };

  return (
    <Modal centered show={isOpen} onHide={onClose}>
      <Panel>
        <div className="p-2">
          <div className="flex flex-col items-center mb-3">
            <h1 className="text-lg mb-2 text-center">
              Do you want to visit Goblin Village?
            </h1>
            <img src={goblinFence} alt="goblin fence" className="w-48" />
          </div>

          <p className="mb-4 text-sm block">
            Goblin Village offers rare items and{" "}
            <span className="underline">on-chain</span> gameplay.
          </p>
          <p className="mb-2 text-sm">
            Goblins will only accept items that are on the Blockchain. Items
            that are not synced will be hidden.
          </p>
        </div>

        <div className="flex">
          <Button className="mr-1" onClick={onClose}>
            Close
          </Button>
          <Button className="ml-1" onClick={goToGoblinTown}>
            Continue
          </Button>
        </div>
      </Panel>
    </Modal>
  );
};
