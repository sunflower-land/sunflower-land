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
          <div>This is where you can sell crops & buy seeds.</div>
          <div>
            As your Bumpkin grows, you will be able to buy more advanced seeds.
          </div>
        </div>
        <Button onClick={onClose}>Got it</Button>
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
    </CloseButtonPanel>
  );
};
