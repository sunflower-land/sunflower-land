import React from "react";
import { Button } from "components/ui/Button";
import { Panel } from "components/ui/Panel";
import { NPC_WEARABLES } from "lib/npcs";

interface Props {
  feathersEarned: number;
  claimedFeathers: number;
  onClick: () => void;
}

export const WinningModalContent: React.FC<Props> = ({
  feathersEarned,
  claimedFeathers,
  onClick,
}) => {
  return (
    <Panel bumpkinParts={NPC_WEARABLES.luna}>
      <div className="p-1 space-y-2 mb-2 flex flex-col">
        <p>
          {`Ah, you've done it! You found all my mischievous crows hidden in
      the corn maze! I am absolutely delighted! `}
        </p>
        <p>
          {`I bestow upon you ${feathersEarned} valuable crow ${
            feathersEarned > 1 ? "feathers" : "feather"
          }, shimmering
          with magic to bless your future journeys.`}
        </p>
        <p className="text-xxs pb-1 italic">{`Feathers earned this week: ${claimedFeathers}/100`}</p>
      </div>
      <Button onClick={onClick}>Claim Crow Feathers</Button>
    </Panel>
  );
};
