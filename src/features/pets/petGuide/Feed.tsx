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
            text: "Pets have up to 3 requests per day. (5 for NFT pets)",
            icon: SUNNYSIDE.icons.expression_confused,
          },
          {
            text: "Requests have a varying difficulty level. The amount of XP and energy gained from the requests scales with the difficulty level.",
            icon: SUNNYSIDE.icons.expression_alerted,
          },
          {
            text: "You can reset the requests for your pet at the Feed section. This will reset the requests and give you a new set of requests.",
            icon: SUNNYSIDE.icons.expression_confused,
          },
        ]}
      />
    </InnerPanel>
  );
};
