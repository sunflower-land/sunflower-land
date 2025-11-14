import { SUNNYSIDE } from "assets/sunnyside";
import { InnerPanel } from "components/ui/Panel";
import React from "react";
import { NoticeboardItems } from "features/world/ui/kingdom/KingdomNoticeboard";
import { ITEM_DETAILS } from "features/game/types/images";
import powerup from "assets/icons/level_up.png";

export const Shrines: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  return (
    <InnerPanel className="relative">
      <img
        src={SUNNYSIDE.icons.arrow_left}
        onClick={onBack}
        className="cursor-pointer w-6 h-6 absolute top-3 left-1"
      />
      <h2 className="text-center text-lg mb-1">{`Shrines`}</h2>
      <NoticeboardItems
        items={[
          {
            text: "Every shrine blueprint utilises pet resources tied to its theme—double-check your fetch stockpile before crafting.",
            icon: ITEM_DETAILS.Acorn.image,
          },
          {
            text: "Shrines are temporary boosts between 7 and 14 days, depending on the shrine.",
            icon: SUNNYSIDE.icons.stopwatch,
          },
          {
            text: "Each shrine targets a production pillar (Fox = crafting, Boar = cooking, Sparrow = crops, etc.). Hover the item in the Pet Shop for precise buff details before you purchase it.",
            icon: powerup,
          },
          {
            text: "Plan a loop: feed to energize pets, fetch the shrine ingredients, craft the shrine, then ride the buffed window for FLOWER burns and Chapter goals.",
            icon: SUNNYSIDE.icons.treasure,
          },
        ]}
      />
    </InnerPanel>
  );
};
