import { SUNNYSIDE } from "assets/sunnyside";
import { InnerPanel } from "components/ui/Panel";
import React from "react";
import { NoticeboardItems } from "features/world/ui/kingdom/KingdomNoticeboard";
import { ITEM_DETAILS } from "features/game/types/images";

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
            text: "Every shrine blueprint needs 15 Acorns plus 10 of two pet resources tied to its theme—double-check your fetch stockpile before crafting.",
            icon: ITEM_DETAILS.Acorn.image,
          },
          {
            text: "Shrines are temporary boosts. Most last 7 days, the Obsidian Shrine runs 14 days, the Trading Shrine sticks around for 30, and the Legendary Shrine is a 24-hour burst.",
            icon: SUNNYSIDE.icons.stopwatch,
          },
          {
            text: "Each shrine targets a production pillar (Fox = crafting, Boar = cooking, Sparrow = crops, etc.). Hover the item in the Pet Shop for precise buff details before you place it.",
            icon: SUNNYSIDE.icons.powerup,
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
