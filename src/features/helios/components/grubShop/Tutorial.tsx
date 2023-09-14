import React from "react";
import { Button } from "components/ui/Button";
import { Equipped } from "features/game/types/bumpkin";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";

import sunflowerCake from "src/assets/food/cakes/sunflower_cake.png";

interface Props {
  onClose: () => void;
  bumpkinParts?: Partial<Equipped>;
}

export const Tutorial: React.FC<Props> = ({ onClose, bumpkinParts }) => {
  return (
    <CloseButtonPanel
      onClose={onClose}
      title="Welcome to the Grub Shop"
      bumpkinParts={bumpkinParts}
    >
      <div className="w-full mb-3 flex justify-center">
        <img src={sunflowerCake} className="h-9 md:h-10" />
      </div>
      <div className="space-y-3 text-sm px-1 mb-3">
        <p>
          Here you can take any of that delicious food you cooked and sell it
          for SFL.
        </p>
        <p className="mb-2">
          The menu changes often so make sure you check in to see what the best
          deals are.
        </p>
      </div>
      <Button onClick={onClose}>Got it</Button>
    </CloseButtonPanel>
  );
};
