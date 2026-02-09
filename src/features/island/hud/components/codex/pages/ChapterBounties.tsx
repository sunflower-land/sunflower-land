import { AnimalBounties } from "features/barn/components/AnimalBounties";
import { MegaBountyBoardContent } from "features/world/ui/flowerShop/MegaBountyBoard";
import React from "react";

export const ChapterBounties: React.FC = () => {
  return (
    <div className="scrollable overflow-y-auto pr-0.5 h-full">
      <MegaBountyBoardContent />
      <AnimalBounties
        type={["Cow", "Sheep", "Chicken"]}
        onExchanging={() => {}}
        reward="tickets"
      />
    </div>
  );
};
