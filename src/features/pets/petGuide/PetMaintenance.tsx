import { SUNNYSIDE } from "assets/sunnyside";
import { InnerPanel } from "components/ui/Panel";
import React from "react";
import { NoticeboardItems } from "features/world/ui/kingdom/KingdomNoticeboard";

export const PetMaintenance: React.FC<{ onBack: () => void }> = ({
  onBack,
}) => {
  return (
    <InnerPanel className="relative">
      <img
        src={SUNNYSIDE.icons.arrow_left}
        onClick={onBack}
        className="cursor-pointer w-6 h-6 absolute top-3 left-1"
      />
      <h2 className="text-center text-lg mb-1">{`Care & Maintenance`}</h2>
      <NoticeboardItems
        items={[
          {
            text: "Keep every companion fed: common pets become neglected after 3 days, while NFT pets give you a 7-day grace period before they refuse to work.",
            icon: SUNNYSIDE.icons.sleeping,
          },
          {
            text: "Pets nap roughly two hours after their last pat. Tap them while they snooze to earn 10 bonus XP and wake them for the next fetch window.",
            icon: SUNNYSIDE.icons.happy,
          },
          {
            text: "NFT Pets management has a limit—only one of each NFT pet type can be active at a time. Extras will not be available until you swap them in. Take note that they can still get neglected if you don't feed them.",
            icon: SUNNYSIDE.icons.lock,
          },
        ]}
      />
    </InnerPanel>
  );
};
