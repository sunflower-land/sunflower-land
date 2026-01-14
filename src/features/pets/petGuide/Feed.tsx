import { SUNNYSIDE } from "assets/sunnyside";
import { Label } from "components/ui/Label";
import { InnerPanel } from "components/ui/Panel";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { NoticeboardItems } from "features/world/ui/kingdom/KingdomNoticeboard";
import React from "react";

export const Feed: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  return (
    <InnerPanel className="relative overflow-y-auto max-h-[350px] scrollable">
      <div className="flex items-center gap-2">
        <img
          src={SUNNYSIDE.icons.arrow_left}
          onClick={onBack}
          style={{
            width: `${PIXEL_SCALE * 11}px`,
            cursor: "pointer",
          }}
        />
        <Label type="default">{`Feed`}</Label>
      </div>
      <NoticeboardItems
        items={[
          {
            text: "Common pets start with 2 requests (easy + medium) and unlock a 3rd (hard) at level 10. NFT pets start with 3 requests, unlock a 4th at level 30, and a 5th at level 200.",
            icon: SUNNYSIDE.icons.expression_confused,
          },
          {
            text: "Base rewards are 20/100/300 XP and Energy for easy/medium/hard meals. Serve tougher dishes before big fetch runs to maximize energy gain.",
            icon: SUNNYSIDE.icons.lightning,
          },
          {
            text: "A gem reroll reshuffles the menu. The first reset costs 40 Gems and each repeat multiplies the price by 1.5 (40 → 60 → 90 ...), resetting at 00:00 UTC.",
            icon: SUNNYSIDE.icons.stopwatch,
          },
          {
            text: "Daily requests auto-refresh at 00:00 UTC, so line up your cooking queues before midnight to avoid wasting partially completed lists.",
            icon: SUNNYSIDE.icons.timer,
          },
        ]}
      />
    </InnerPanel>
  );
};
