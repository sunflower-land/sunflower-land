import { SUNNYSIDE } from "assets/sunnyside";
import { InnerPanel } from "components/ui/Panel";
import React from "react";
import { NoticeboardItems } from "features/world/ui/kingdom/KingdomNoticeboard";

export const Social: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  return (
    <InnerPanel className="relative">
      <img
        src={SUNNYSIDE.icons.arrow_left}
        onClick={onBack}
        className="cursor-pointer w-6 h-6 absolute top-3 left-1"
      />
      <h2 className="text-center text-lg mb-1">{`Social Loops`}</h2>
      <NoticeboardItems
        items={[
          {
            text: "Visitors can help a pet once per day for 5 XP. Each pet caps at 50 social XP daily, so invite ten friends to max the boost.",
            icon: SUNNYSIDE.icons.playIcon,
          },
          {
            text: "Helpers also respect their own daily help limit—spread the love across multiple farms so no one hits the cap too early in the day.",
            icon: SUNNYSIDE.icons.expression_chat,
          },
          {
            text: "Keep social XP in mind when planning resets—those free points still push the main level curve and unlock higher-tier requests and fetches sooner.",
            icon: SUNNYSIDE.icons.powerup,
          },
        ]}
      />
    </InnerPanel>
  );
};
