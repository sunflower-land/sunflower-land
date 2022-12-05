import React, { useState } from "react";
import { Button } from "components/ui/Button";
import { Equipped } from "features/game/types/bumpkin";
import { ITEM_DETAILS } from "features/game/types/images";
import { CloseButtonPanel } from "../../../../../../game/components/CloseablePanel";
import { UNLOCKABLES } from "../../../ui/DetailView";

interface Props {
  onClose: () => void;
  bumpkinParts?: Partial<Equipped>;
}

type Pages = 1 | 2 | 3 | 4;

export const Tutorial: React.FC<Props> = ({ onClose, bumpkinParts }) => {
  const [pageNumber, setPageNumber] = useState<Pages>(1);

  const PageOne = () => {
    return (
      <>
        <div className="space-y-3 text-sm px-1 mb-3">
          <p>Congratulations you are a natural farmer!</p>
          <p>
            You have already managed to master cooking to level up your Bumpkin.
          </p>
          <p className="mb-2">
            {`Now we're going to look at another core game loop. Resources.`}
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
            Remember when we said you could sell your crops in the market for
            SFL instead of cooking?
          </p>
          <p>Well you can use that money to buy tools from the blacksmith.</p>
          <p className="mb-2">
            These tools are vital to allow you to expand your land and find even
            more resources.
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
            To get started you will need an axe to chop down a tree for wood.
          </p>
          <p>One Axe = One Tree.</p>
          <p>
            Once you have enough wood you can craft a pickaxe to start mining
            for stone.
          </p>
          <p className="mb-2"></p>
        </div>
        <div className="flex space-x-1">
          <Button onClick={() => setPageNumber(2)}>Back</Button>
          <Button onClick={() => setPageNumber(4)}>Next</Button>
        </div>
      </>
    );
  };

  const PageFour = () => {
    return (
      <>
        <div className="space-y-3 text-sm px-1 mb-3">
          <p>
            These resources will allow you to expand your land so you can keep
            growing.
          </p>
          <p>{`For now, I've taught you everything you need to get started.`}</p>
          <p className="mb-2">Best of luck with everything!</p>
        </div>
        <div className="flex space-x-1">
          <Button onClick={() => setPageNumber(3)}>Back</Button>
          <Button onClick={onClose}>Got it</Button>
        </div>
      </>
    );
  };

  return (
    <CloseButtonPanel
      onClose={onClose}
      title="Welcome to the Workbench"
      bumpkinParts={bumpkinParts}
    >
      <div className="flex flex-wrap justify-center mb-3 space-x-2">
        {UNLOCKABLES["Workbench"].slice(0, 5).map((name) => (
          <img
            key={name}
            src={ITEM_DETAILS[name].image}
            className="h-5 md:h-6"
          />
        ))}
      </div>
      {pageNumber === 1 && PageOne()}
      {pageNumber === 2 && PageTwo()}
      {pageNumber === 3 && PageThree()}
      {pageNumber === 4 && PageFour()}
    </CloseButtonPanel>
  );
};
