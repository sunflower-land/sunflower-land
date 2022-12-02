import React, { useState } from "react";
import { Button } from "components/ui/Button";
import { Equipped } from "features/game/types/bumpkin";
import { ITEM_DETAILS } from "features/game/types/images";
import { CloseButtonPanel } from "../../../../../game/components/CloseablePanel";

import hammer from "assets/icons/hammer.png";
import { UNLOCKABLES } from "../../ui/DetailView";

interface Props {
  onClose: () => void;
  bumpkinParts?: Partial<Equipped>;
}

type Pages = 1 | 2 | 3 | 4 | 5;

export const Tutorial: React.FC<Props> = ({ onClose, bumpkinParts }) => {
  const [pageNumber, setPageNumber] = useState<Pages>(1);

  const PageOne = () => {
    return (
      <>
        <div className="space-y-3 text-sm px-1 mb-3">
          <p>This is the first of many building that enable cooking.</p>
          <p>
            As you progress you will be able to cook more exotic food but for
            now, lets start with the basics.
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
          <p>When you harvest crops, you can use them to cook food.</p>
          <p>
            This food can then be given to your Bumpkin so they can gain
            Experience.
          </p>
          <p className="mb-2">
            Experience unlocks more in game features like better food, new
            buildings and even more land.
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
            When you click on a recipe it will tell you what ingredients you
            need to start cooking, then simply click on the dish and wait for
            the timer.
          </p>
          <p className="mb-2">
            {`When it's ready you can click back on this building to add the food to
            your inventory.`}
          </p>
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
            I warn you though, Bumpkins are very hungry creatures and will
            always want more food.
          </p>
          <p className="mb-2">
            Finding the balance between selling crops or using them to cook is
            what will make you an expert farmer.
          </p>
        </div>
        <div className="flex space-x-1">
          <Button onClick={() => setPageNumber(3)}>Back</Button>
          <Button onClick={() => setPageNumber(5)}>Next</Button>
        </div>
      </>
    );
  };

  const PageFive = () => {
    return (
      <>
        <div className="space-y-3 text-sm px-1 mb-3">
          <div className="mb-2">
            Once you are comfortable with cooking and have a few levels in your
            Bumpkin click on the button with the
            <img
              src={hammer}
              className="h-4 inline mx-1"
              style={{ imageRendering: "pixelated" }}
            />
            icon to look at new buildings.
          </div>
        </div>
        <div className="flex space-x-1">
          <Button onClick={() => setPageNumber(4)}>Back</Button>
          <Button onClick={onClose}>Got it</Button>
        </div>
      </>
    );
  };

  return (
    <CloseButtonPanel
      onClose={onClose}
      title="Welcome to the Fire Pit"
      bumpkinParts={bumpkinParts}
    >
      <div className="flex flex-wrap justify-center mb-3 space-x-2">
        {UNLOCKABLES["Fire Pit"].slice(0, 5).map((name) => (
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
      {pageNumber === 5 && PageFive()}
    </CloseButtonPanel>
  );
};
