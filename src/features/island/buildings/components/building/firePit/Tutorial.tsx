import React, { useState } from "react";
import { Button } from "components/ui/Button";
import { Equipped } from "features/game/types/bumpkin";
import { ITEM_DETAILS } from "features/game/types/images";
import token from "assets/icons/token_2.png";

import { CloseButtonPanel } from "../../../../../game/components/CloseablePanel";

import { UNLOCKABLES } from "../../ui/DetailView";
import { SUNNYSIDE } from "assets/sunnyside";

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
          <p>The Fire Pit allows you to cook basic food.</p>
          <p>Food is useful to:</p>
          <div className="flex items-center">
            <img src={SUNNYSIDE.icons.player} className="w-6 mr-1" />
            <p>1. Feed your Bumpkin to level up</p>
          </div>
          <div className="flex items-center">
            <img src={token} className="w-6 mr-1" />
            <p>2. Sell for bonus SFL</p>
          </div>
        </div>
        <Button onClick={onClose}>Got it</Button>
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
        {UNLOCKABLES["Fire Pit"].slice(0, 7).map((name) => (
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
