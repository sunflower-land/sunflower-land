import React, { useState } from "react";
import { Button } from "components/ui/Button";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";

import hammer from "assets/icons/hammer.png";
import { Equipped } from "features/game/types/bumpkin";

interface Props {
  onClose: () => void;
}

type Pages = 1 | 2;

export const Tutorial: React.FC<Props> = ({ onClose }) => {
  const [pageNumber, setPageNumber] = useState<Pages>(1);

  const bumpkinParts: Partial<Equipped> = {
    body: "Beige Farmer Potion",
    hair: "Blacksmith Hair",
    pants: "Brown Suspenders",
    shirt: "Yellow Farmer Shirt",
    tool: "Hammer",
    background: "Farm Background",
    shoes: "Black Farmer Boots",
  };

  const PageOne = () => {
    return (
      <>
        <div className="space-y-3 text-sm px-1 mb-3">
          <p>
            This menu will show you the levels required to unlock new buildings.
          </p>
          <p className="mb-2">
            Some of these can be built multiple times once you reach a certain
            level.
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
          <p>
            Buildings are an important way to progress through the game as they
            will help you to expand and evolve.
          </p>
          <p className="mb-2">
            Lets start by leveling up our Bumpkin so we can get the Workbench to
            learn about tools.
          </p>
        </div>
        <div className="flex space-x-1">
          <Button onClick={() => setPageNumber(1)}>Back</Button>
          <Button onClick={onClose}>Got it</Button>
        </div>
      </>
    );
  };

  return (
    <CloseButtonPanel
      onClose={onClose}
      title="Welcome to Buildings"
      bumpkinParts={bumpkinParts}
    >
      <div className="w-full mb-3 flex justify-center">
        <img src={hammer} className="h-6 md:h-7" />
      </div>
      {pageNumber === 1 && PageOne()}
      {pageNumber === 2 && PageTwo()}
    </CloseButtonPanel>
  );
};
