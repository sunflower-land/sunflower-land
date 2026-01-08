import { SUNNYSIDE } from "assets/sunnyside";
import { InnerPanel } from "components/ui/Panel";
import React from "react";
import { NoticeboardItems } from "features/world/ui/kingdom/KingdomNoticeboard";
import { Label } from "components/ui/Label";

export const PetLevelsAndPerks: React.FC<{ onBack: () => void }> = ({
  onBack,
}) => {
  return (
    <InnerPanel className="relative">
      <img
        src={SUNNYSIDE.icons.arrow_left}
        onClick={onBack}
        className="cursor-pointer w-6 h-6 absolute top-3 left-1"
      />
      <h2 className="text-center text-lg mb-1">{`Levels & Perks`}</h2>

      <Label type="default" className="ml-1 mt-2">{`XP Benchmarks`}</Label>
      <NoticeboardItems
        items={[
          { text: "Lv 2 = 100 XP total" },
          { text: "Lv 3 = 300 XP total" },
          { text: "Lv 5 = 1,000 XP total" },
          { text: "Lv 10 = 4,500 XP total" },
          { text: "Lv 15 = 10,500 XP total" },
          { text: "Each level costs (level × 100) XP to reach." },
        ]}
      />

      <Label type="default" className="ml-1 mt-2">{`Max Energy`}</Label>
      <NoticeboardItems
        items={[
          { text: "Lv 5: +5 max energy" },
          { text: "Lv 35: +5 max energy" },
          { text: "Lv 75: +5 max energy" },
        ]}
      />

      <Label type="default" className="ml-1 mt-2">{`Fetch Unlocks`}</Label>
      <NoticeboardItems
        items={[
          { text: "Lv 1: Acorn (100 energy)" },
          { text: "Lv 3: Primary category resource (200 energy)" },
          { text: "Lv 7: Secondary category resource (200 energy)" },
          { text: "Lv 12: Moonfur (1,000 energy) — NFT only" },
          { text: "Lv 20: Fossil Shell (300 energy)" },
          { text: "Lv 25: Tertiary category resource (200 energy) — NFT only" },
        ]}
      />

      <Label
        type="default"
        className="ml-1 mt-2"
      >{`Fetch Yield Bonuses`}</Label>
      <NoticeboardItems
        items={[
          { text: "Lv 15: +10% chance for extra drop" },
          { text: "Lv 18: +1 Acorn guaranteed" },
          { text: "Lv 50: +5% extra drop (15% total)" },
          { text: "Lv 60: +1 non-Acorn/Moonfur guaranteed — NFT only" },
          { text: "Lv 100: +10% extra drop (25% total)" },
          { text: "Lv 150: +25% Moonfur extra drop (50% total) — NFT only" },
        ]}
      />

      <Label type="default" className="ml-1 mt-2">{`XP Boosts`}</Label>
      <NoticeboardItems
        items={[
          { text: "Lv 27: +10% XP per feed" },
          { text: "Lv 40: +15% XP per feed (25% total) — NFT only" },
          { text: "Lv 85: +25% XP per feed (50% total) — NFT only" },
        ]}
      />
    </InnerPanel>
  );
};
