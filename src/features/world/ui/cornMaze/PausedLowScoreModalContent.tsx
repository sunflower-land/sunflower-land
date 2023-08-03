import React from "react";
import { Button } from "components/ui/Button";
import { Panel } from "components/ui/Panel";
import { NPC_WEARABLES } from "lib/npcs";

interface Props {
  highestScore: number;
  onContinue: () => void;
}

export const PausedLowScoreModalContent: React.FC<Props> = ({
  highestScore,
  onContinue,
}) => {
  return (
    <Panel
      bumpkinParts={{
        ...NPC_WEARABLES.luna,
        body: "Light Brown Worried Farmer Potion",
      }}
    >
      <div className="p-1 space-y-2 mb-2 flex flex-col">
        <p>{`Oh no! Last time you found ${highestScore} crows! You need to find more than that if you want more feathers from me!`}</p>
      </div>
      <div className="flex flex-col-reverse space-y-1 space-y-reverse md:flex-row md:space-y-0 md:space-x-1">
        <Button onClick={onContinue}>Keep Playing</Button>
      </div>
    </Panel>
  );
};
