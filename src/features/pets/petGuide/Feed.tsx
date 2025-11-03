import { SUNNYSIDE } from "assets/sunnyside";
import { InnerPanel } from "components/ui/Panel";
import { NoticeboardItems } from "features/world/ui/kingdom/KingdomNoticeboard";
import React from "react";

export const Feed: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  return (
    <InnerPanel className="relative">
      <img
        src={SUNNYSIDE.icons.arrow_left}
        onClick={onBack}
        className="cursor-pointer w-6 h-6 absolute top-3 left-1"
      />
      <h2 className="text-center text-lg mb-1">{`Feed`}</h2>
      <NoticeboardItems
        items={[
          {
            text: "Common pets roll 3 daily meal requests while NFT pets roll 5. Hard dishes only appear once a common pet hits level 10, and NFT companions unlock medium at level 30 and hard at level 200.",
            icon: SUNNYSIDE.icons.expression_confused,
          },
          {
            text: "Base rewards are 20/100/300 XP for easy/medium/hard meals. Energy earned scales with level (+5 at levels 5, 35, and 75) and NFT auras multiply it (1.5×/2×/3×), so serve tougher dishes before big fetch runs.",
            icon: SUNNYSIDE.icons.lightning,
          },
          {
            text: "Feeding any requested dish refreshes the neglect timer—missing 3 days sidelines common pets, while NFT pets have a 7-day window before they sulk.",
            icon: SUNNYSIDE.icons.sleeping,
          },
          {
            text: "A gem reroll reshuffles the menu. The first reset costs 40 Gems and each repeat multiplies the price by 1.5 (40 → 60 → 90 ...), resetting at 00:00 UTC.",
            icon: SUNNYSIDE.icons.stopwatch,
          },
          {
            text: "Daily requests auto-refresh at the same UTC rollover, so line up your cooking queues before midnight to avoid wasting partially completed lists.",
            icon: SUNNYSIDE.icons.timer,
          },
        ]}
      />
    </InnerPanel>
  );
};
