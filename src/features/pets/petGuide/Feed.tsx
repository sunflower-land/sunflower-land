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
            text: "Common pets start with 2 daily meal requests while NFT pets roll 3. Unlock more requests by leveling up.",
            icon: SUNNYSIDE.icons.expression_confused,
          },
          {
            text: "Base rewards are 20/100/300 XP/Energy for easy/medium/hard meals. Energy and XP earned scales with level, so serve tougher dishes before big fetch runs.",
            icon: SUNNYSIDE.icons.lightning,
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
