import { SUNNYSIDE } from "assets/sunnyside";
import { InnerPanel } from "components/ui/Panel";
import shopIcon from "assets/icons/shop.png";
import React from "react";
import { ITEM_DETAILS } from "features/game/types/images";
import { ChestRewardsList } from "components/ui/ChestRewardsList";

export const PetEgg: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  return (
    <InnerPanel className="relative">
      <img
        src={SUNNYSIDE.icons.arrow_left}
        onClick={onBack}
        className="cursor-pointer w-6 h-6 absolute top-3 left-1"
      />
      <h2 className="text-center text-lg">{`Pet Egg`}</h2>

      <ChestRewardsList
        type="Pet Egg"
        chestDescription={[
          {
            text: "To obtain a pet egg, you can buy it at the Pet Shop or the Love Island Shop",
            icon: shopIcon,
          },
          {
            text: "You can only buy the pet egg once from each shop",
            icon: SUNNYSIDE.icons.expression_alerted,
          },
          {
            text: "You can also buy 1 pet egg from the Megastore every chapter.",
            icon: SUNNYSIDE.icons.expression_alerted,
          },
          {
            text: "Once Pet Egg is bought, it will hatch into one of the 21 available pets",
            icon: ITEM_DETAILS.Barkley.image,
          },
        ]}
      />
    </InnerPanel>
  );
};
