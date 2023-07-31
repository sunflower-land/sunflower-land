import React, { useEffect } from "react";
import { Button } from "components/ui/Button";
import { Panel } from "components/ui/Panel";
import { NPC_WEARABLES } from "lib/npcs";
import { mazeOver } from "lib/utils/sfx";

interface Props {
  timeRemaining: number;
  onClick: () => void;
}

export const LosingModalContent: React.FC<Props> = ({
  timeRemaining,
  onClick,
}) => {
  useEffect(() => {
    mazeOver.play();
  }, []);

  return (
    <Panel
      bumpkinParts={{
        ...NPC_WEARABLES.luna,
        body: "Light Brown Worried Farmer Potion",
      }}
    >
      <div className="p-1 space-y-2 mb-2 flex flex-col">
        <p>
          {`Oh no ${
            timeRemaining === 0 ? "times up" : ""
          }! My poor crows! It seems you have been outwitted by the cunning
          enemies. For now, you shall return to whence you came.`}
        </p>
        <p>
          The magical corn maze bids you farewell, brave adventurer. Until next
          time!
        </p>
      </div>
      <Button onClick={onClick}>Back to Plaza</Button>
    </Panel>
  );
};
