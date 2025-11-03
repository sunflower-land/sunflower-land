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
            text: "Energy is a shared pool for feeding and fetching. High-difficulty meals restore more energy, so top up before sending pets on expensive resource runs.",
            icon: SUNNYSIDE.icons.lightning,
          },
          {
            text: "NFT management follows the proposal’s cap—only one of each NFT pet type can be active at a time (seven total). Extras wait in the kennel until you swap them in.",
            icon: SUNNYSIDE.icons.lock,
          },
        ]}
      />
    </InnerPanel>
  );
};
