import React, { useState } from "react";
import { Button } from "components/ui/Button";
import { Equipped } from "features/game/types/bumpkin";
import { ITEM_DETAILS } from "features/game/types/images";
import { CloseButtonPanel } from "../../../../../game/components/CloseablePanel";

import token from "assets/icons/token_2.png";
import { UNLOCKABLES } from "../../ui/DetailView";

interface Props {
  onClose: () => void;
  bumpkinParts?: Partial<Equipped>;
}

type Pages = 1 | 2;

export const Tutorial: React.FC<Props> = ({ onClose, bumpkinParts }) => {
  const [pageNumber, setPageNumber] = useState<Pages>(1);

  const PageOne = () => {
    return (
      <>
        <div className="space-y-3 text-sm px-1 mb-3">
          <div>
            This is where you can buy seeds. Once you plant and harvest those
            seeds you can come back here to sell them for our in game currency,
            <img
              src={token}
              className="h-4 inline mx-1"
              style={{ imageRendering: "pixelated" }}
            />
            SFL.
          </div>
          <div>
            You will need SFL to buy many things throughout Sunflower Isles.
          </div>
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
            {`Don't sell everything though! Those crops can also be used to cook
    food which is needed to level up your Bumpkin.`}
          </p>
          <p className="mb-2">
            To learn more about cooking we will need to visit the Fire Pit.
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
      title="Welcome to the Market"
      bumpkinParts={bumpkinParts}
    >
      <div className="flex flex-wrap justify-center mb-3 space-x-2">
        {UNLOCKABLES["Market"].slice(0, 5).map((name) => (
          <img
            key={name}
            src={ITEM_DETAILS[name].image}
            className="h-5 md:h-6"
          />
        ))}
      </div>
      {pageNumber === 1 && PageOne()}
      {pageNumber === 2 && PageTwo()}
    </CloseButtonPanel>
  );
};
