import { SUNNYSIDE } from "assets/sunnyside";
import { InnerPanel } from "components/ui/Panel";
import React from "react";
import { NoticeboardItems } from "features/world/ui/kingdom/KingdomNoticeboard";
import { ITEM_DETAILS } from "features/game/types/images";
import powerup from "assets/icons/level_up.png";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { Label } from "components/ui/Label";

export const Shrines: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  return (
    <InnerPanel className="relative">
      <div className="flex items-center gap-2">
        <img
          src={SUNNYSIDE.icons.arrow_left}
          onClick={onBack}
          style={{
            width: `${PIXEL_SCALE * 11}px`,
            cursor: "pointer",
          }}
        />
        <Label type="default">{`Shrines`}</Label>
      </div>
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
