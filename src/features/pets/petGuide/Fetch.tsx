import { InnerPanel } from "components/ui/Panel";
import { SUNNYSIDE } from "assets/sunnyside";
import React from "react";
import { NoticeboardItems } from "features/world/ui/kingdom/KingdomNoticeboard";
import { ITEM_DETAILS } from "features/game/types/images";

export const Fetch: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  return (
    <InnerPanel className="relative">
      <img
        src={SUNNYSIDE.icons.arrow_left}
        onClick={onBack}
        className="cursor-pointer w-6 h-6 absolute top-3 left-1"
      />
      <h2 className="text-center text-lg mb-1">{`Fetch`}</h2>
      <p className="text-xs text-center px-2 mb-2">
        {`Spend stored energy to send pets on resource runs. Each unlock tier lines up with your pet's category spread and level milestones.`}
      </p>
      <NoticeboardItems
        items={[
          {
            text: "See Levels & Perks for the full fetch unlock timeline by level.",
            icon: SUNNYSIDE.icons.expression_confused,
          },
          {
            text: "Acorns (100 energy) are used for shrine recipes. Category resources (200 energy) match your pet's category spread.",
            icon: ITEM_DETAILS.Acorn.image,
          },
          {
            text: "Fossil Shells (300 energy) open to reveal random resources: 1-3 Acorns (common), 1-2 category resources, or Moonfur (rare).",
            icon: ITEM_DETAILS["Fossil Shell"].image,
          },
          {
            text: "NFT exclusive: Moonfur costs 1,000 energy. Tertiary category resource costs 200 energy.",
            icon: ITEM_DETAILS.Moonfur.image,
          },
        ]}
      />
    </InnerPanel>
  );
};
