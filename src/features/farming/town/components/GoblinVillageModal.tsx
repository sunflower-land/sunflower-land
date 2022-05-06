import React from "react";
import alert from "assets/icons/expression_alerted.png";
import { Panel } from "components/ui/Panel";
import { Button } from "components/ui/Button";

export const GoblinVillageModal: React.FC = () => {
  const goToGoblinTown = () => {
    window.location.href = "/#/goblins";
  };

  return (
    <Panel>
      <h1 className="text-lg mb-4 text-center">
        Do you want to visit Goblin Village?
      </h1>

      <p className="mb-4 block">
        Goblin Village offers rare items and{" "}
        <span className="underline">on-chain</span> gameplay.
      </p>
      <p className="mb-4">
        Any transaction in Goblin Village will reset your farming session to
        your previous checkpoint.
      </p>
      <p className="mb-4">
        If you have any un-synced items it is recommended you{" "}
        <span className="underline">sync on chain</span> before entering.
      </p>

      <div className="flex items-center border-2 rounded-md border-black p-2 mb-2 bg-error">
        <img src={alert} alt="alert" className="mr-2 w-10" />
        <span className="text-xxs">
          You may lose SFL or resources from your farm if they have not been
          synced to the blockchain
        </span>
      </div>
      <Button onClick={goToGoblinTown}>{`Let's go`}</Button>
    </Panel>
  );
};
