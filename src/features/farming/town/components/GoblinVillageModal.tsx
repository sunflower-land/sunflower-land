import React from "react";
import alert from "assets/icons/expression_alerted.png";
import { Panel } from "components/ui/Panel";
import { Button } from "components/ui/Button";
import goblinFence from "assets/land/goblin_fence.png";

export const GoblinVillageModal: React.FC<{ onClose: () => void }> = ({
  onClose,
}: {
  onClose: () => void;
}) => {
  const goToGoblinTown = () => {
    window.location.href = `${window.location.pathname}#/goblins`;
  };

  return (
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
        <p className="mb-4 text-sm">
          If you transact with a greedy goblin be careful. They will steal any
          SFL, resources & crops that are not synced to the blockchain.
        </p>
        <p className="mb-2 text-sm">
          If you have any un-synced items it is recommended you{" "}
          <span className="underline">sync on chain</span> before entering.
        </p>
      </div>
      <div className="flex items-center border-2 rounded-md border-black p-2 mb-2 bg-error">
        <img src={alert} alt="alert" className="mr-2 w-6" />
        <span className="text-xs">
          You may lose SFL or resources from your farm if they have not been
          synced to the blockchain
        </span>
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
  );
};
