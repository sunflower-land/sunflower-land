import React, { useState } from "react";
import { Button } from "components/ui/Button";
import { Equipped } from "features/game/types/bumpkin";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";

import land from "assets/land/islands/island.webp";

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
          <p className="mb-2">
            The boat will take you between islands where you can discover new
            lands and exciting adventures.
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
            Many lands are far away and will require an experienced Bumpkin
            before you can visit them.
          </p>
          <p className="mb-2">
            Your adventure begins now, how far you explore ... that is on you.
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
      title="Sunflower Isles Travel"
      bumpkinParts={bumpkinParts}
    >
      <div className="w-full mb-3 flex justify-center">
        <img src={land} className="h-9 md:h-10" />
      </div>
      {pageNumber === 1 && PageOne()}
      {pageNumber === 2 && PageTwo()}
    </CloseButtonPanel>
  );
};
