import React from "react";
import alert from "assets/icons/expression_alerted.png";
import { Panel } from "components/ui/Panel";
import { Button } from "components/ui/Button";

export const GoblinVillageModal: React.FC = () => {
  const goToGoblinTown = () => {
    window.location.href = `${window.location.pathname}#/goblins`;
  };

  return (
    <Panel>
      <h1 className="text-xl text-center">
        Do you want to visit Goblin Village?
      </h1>

      <p className="text-sm pt-4">
        Goblin Village offers rare items and{" "}
        <span className="underline">on-chain</span> gameplay.
      </p>
      <p className="text-sm pt-4 pb-2">
        Any transaction in Goblin land will reset your farming session to your
        previous checkpoint.
      </p>

      <div className="flex items-center border-2 rounded-md border-black p-2 mt-2 mb-2 bg-[#e43b44]">
        <img src={alert} alt="alert" className="mr-2 w-5 h-5/6" />
        <span className="text-xs">
          You may lose SFL & resources from your farm that have not been synced
          to the Blockchain
        </span>
      </div>
      <Button onClick={goToGoblinTown}>Continue</Button>
    </Panel>
  );
};
