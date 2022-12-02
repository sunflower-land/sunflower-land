import React, { useState } from "react";
import { Button } from "components/ui/Button";
import { Equipped } from "features/game/types/bumpkin";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";

import sunflower from "assets/crops/sunflower/crop.png";
import { acknowledgeTutorial, hasShownTutorial } from "lib/tutorial";
import { Modal } from "react-bootstrap";

interface Props {
  bumpkinParts?: Partial<Equipped>;
}

type Pages = 1 | 2 | 3;

export const BumpkinTutorial: React.FC<Props> = ({ bumpkinParts }) => {
  const [showTutorial, setShowTutorial] = useState<boolean>(
    !hasShownTutorial("Bumpkin")
  );
  const [pageNumber, setPageNumber] = useState<Pages>(1);

  const acknowledge = () => {
    acknowledgeTutorial("Bumpkin");
    setShowTutorial(false);
  };

  const PageOne = () => {
    return (
      <>
        <div className="space-y-3 text-sm px-1 mb-3">
          <p>{`I'll be your guide on this adventure as we start to explore new lands. `}</p>
          <p className="mb-2">
            {`It's been quite the journey to get here and right now I'm very hungry!`}
          </p>
        </div>
        <Button onClick={() => setPageNumber(2)}>Next</Button>
      </>
    );
  };

  const PageTwo = () => {
    return (
      <>
        <div className="space-y-3 text-sm px-1 mb-3">
          <p>Maybe you can make me some food before we go any further.</p>
          <p>
            First, you will need to harvest your sunflowers and head over to the
            market to sell them so you can buy more seeds.
          </p>
          <p className="mb-2">
            {`The best crops take longer to prepare but it's worth the wait.`}
          </p>
        </div>
        <div className="flex space-x-1">
          <Button onClick={() => setPageNumber(1)}>Back</Button>
          <Button onClick={() => setPageNumber(3)}>Next</Button>
        </div>
      </>
    );
  };

  const PageThree = () => {
    return (
      <>
        <div className="space-y-3 text-sm px-1 mb-3">
          <p>
            You will be busy for a while getting all the ingredients together.
          </p>
          <p className="mb-2">
            {`I'll go get some rest but you can come and find me on the land as soon as dinner is ready.`}
          </p>
        </div>
        <div className="flex space-x-1">
          <Button onClick={() => setPageNumber(1)}>Back</Button>
          <Button onClick={acknowledge}>Got it</Button>
        </div>
      </>
    );
  };

  return (
    <Modal show={showTutorial} onHide={acknowledge} centered>
      <CloseButtonPanel
        onClose={acknowledge}
        title="Welcome to Sunflower Isles"
        bumpkinParts={bumpkinParts}
      >
        <div className="w-full mb-3 flex justify-center">
          <img src={sunflower} className="h-9 md:h-10" />
        </div>
        {pageNumber === 1 && PageOne()}
        {pageNumber === 2 && PageTwo()}
        {pageNumber === 3 && PageThree()}
      </CloseButtonPanel>
    </Modal>
  );
};
