import { SUNNYSIDE } from "assets/sunnyside";
import { InnerPanel } from "components/ui/Panel";
import React from "react";
import { NoticeboardItems } from "features/world/ui/kingdom/KingdomNoticeboard";
import { Label } from "components/ui/Label";
import { PIXEL_SCALE } from "features/game/lib/constants";

export const PetMaintenance: React.FC<{ onBack: () => void }> = ({
  onBack,
}) => {
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
        <Label type="default">{`Care`}</Label>
      </div>
      <NoticeboardItems
        items={[
          {
            text: "Common pets become neglected after 3 days without feeding, NFT pets after 7 days. Cheering up a neglected pet costs 500 XP and resets the timer.",
            icon: SUNNYSIDE.icons.sleeping,
          },
          {
            text: "Pets nap 2 hours after their last pat. Tap them while they snooze to earn +10 XP and wake them for the next fetch window.",
            icon: SUNNYSIDE.icons.happy,
          },
          {
            text: "NFT Pets: Only one of each NFT pet type can be active at a time. Extras must be swapped in. Inactive NFT pets can still become neglected.",
            icon: SUNNYSIDE.icons.lock,
          },
        ]}
      />
    </InnerPanel>
  );
};
