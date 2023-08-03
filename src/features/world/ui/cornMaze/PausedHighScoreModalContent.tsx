import React from "react";
import { Button } from "components/ui/Button";
import { Panel } from "components/ui/Panel";
import { NPC_WEARABLES } from "lib/npcs";

interface Props {
  score: number;
  feathersEarned: number;
  claimedFeathers: number;
  onContinue: () => void;
  onEnd: () => void;
}

export const PausedHighScoreModalContent: React.FC<Props> = ({
  score,
  feathersEarned,
  claimedFeathers,
  onContinue,
  onEnd,
}) => {
  return (
    <Panel bumpkinParts={NPC_WEARABLES.luna}>
      <div className="p-1 space-y-2 mb-2 flex flex-col">
        <p>
          {`You found ${score} of my mischievous crows! That's a new high score! If you end now, I will bestow upon you ${feathersEarned} valuable crow feathers.`}
        </p>
        <p className="mb-1">Are you sure you want to end now?</p>
        <p className="text-xxs italic">{`Feathers earned this week: ${claimedFeathers}/100`}</p>
      </div>
      <div className="flex flex-col-reverse space-y-1 space-y-reverse md:flex-row md:space-y-0 md:space-x-1">
        <Button onClick={onContinue}>Keep Playing</Button>
        <Button onClick={onEnd}>Claim Crow Feathers</Button>
      </div>
    </Panel>
  );
};
