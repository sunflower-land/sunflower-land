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
            text: "Every shrine blueprint uses pet resources—double-check your fetch stockpile before crafting. Shrines can be renewed once expired.",
            icon: ITEM_DETAILS.Acorn.image,
          },
          {
            text: "Durations vary: Most shrines last 7 days. Legendary Shrine lasts 1 day. Obsidian Shrine lasts 14 days. Trading Shrine lasts 30 days.",
            icon: SUNNYSIDE.icons.stopwatch,
          },
          {
            text: "Hound Shrine grants +100 XP per feed (7 days). Pet Bowls (from Blacksmith) give +10 XP per feed permanently.",
            icon: SUNNYSIDE.icons.heart,
          },
          {
            text: "Each shrine targets a production pillar (Fox = crafting, Boar = cooking, Sparrow = crops, Collie = barn animals, etc.). Check the Pet Shop for buff details.",
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
