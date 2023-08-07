import React from "react";
import { Button } from "components/ui/Button";
import { Panel } from "components/ui/Panel";
import { NPC_WEARABLES } from "lib/npcs";

interface Props {
  score: number;
  highestScore: number;
  totalLostCrows: number;
  onContinue: () => void;
  onEnd: () => void;
}

export const PausedLowScoreModalContent: React.FC<Props> = ({
  score,
  highestScore,
  totalLostCrows,
  onContinue,
  onEnd,
}) => {
  const Content = () => {
    // Haven't found any crows -> Save progress and leave or keep playing
    if (score === 0) {
      return (
        <>
          <div className="p-1 space-y-2 mb-2 flex flex-col">
            <p>{`Oh no! You haven't found any crows! You need to find more than that if you want more feathers from me!`}</p>
            <p>
              You can return to the Plaza now and come back later if you like?
            </p>
          </div>
          <div className="flex flex-col-reverse space-y-1 space-y-reverse md:flex-row md:space-y-0 md:space-x-1">
            <Button onClick={onEnd}>Return to Plaza</Button>
            <Button onClick={onContinue}>Keep Playing</Button>
          </div>
        </>
      );
    }

    // Found all crows (will only be in this modal if they have already claimed all feathers for the week) -> Save progress and leave
    if (score === totalLostCrows) {
      return (
        <>
          <div className="p-1 space-y-2 mb-2 flex flex-col">
            <p>
              Nice one! You found all my crows! You have already claimed all the
              feathers available for this week.
            </p>
            <p>Your attempt will be saved though!</p>
          </div>
          <div className="flex flex-col-reverse space-y-1 space-y-reverse md:flex-row md:space-y-0 md:space-x-1">
            <Button onClick={onEnd}>Return to Plaza</Button>
          </div>
        </>
      );
    }

    if (highestScore === totalLostCrows) {
      return (
        <>
          <div className="p-1 space-y-2 mb-2 flex flex-col">
            <p>{`You have already claimed all the feathers available for this week so there are no more to earn. You can keep going and try to beat your time though!`}</p>
            <p>
              Or you can return to the Plaza now and come back later if you
              like?
            </p>
          </div>
          <div className="flex flex-col-reverse space-y-1 space-y-reverse md:flex-row md:space-y-0 md:space-x-1">
            <Button onClick={onEnd}>Return to Plaza</Button>
            <Button onClick={onContinue}>Keep Playing</Button>
          </div>
        </>
      );
    }

    // Found some crows but not more than their highest score -> Save progress and leave or keep playing
    return (
      <>
        <div className="p-1 space-y-2 mb-2 flex flex-col">
          <p>{`Oh no! Last time you found ${highestScore} crows! You need to find more than that if you want more feathers from me!`}</p>
          <p>
            You can return to the Plaza now and come back later if you like?
          </p>
        </div>
        <div className="flex flex-col-reverse space-y-1 space-y-reverse md:flex-row md:space-y-0 md:space-x-1">
          <Button onClick={onEnd}>Return to Plaza</Button>
          <Button onClick={onContinue}>Keep Playing</Button>
        </div>
      </>
    );
  };

  return (
    <Panel
      bumpkinParts={{
        ...NPC_WEARABLES.luna,
        body: "Light Brown Worried Farmer Potion",
      }}
    >
      {Content()}
    </Panel>
  );
};
