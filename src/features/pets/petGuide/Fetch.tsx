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
            text: "Level 1 fetches always return 1x Acorn (100 energy). Bank a stash before chasing shrine recipes.",
            icon: ITEM_DETAILS.Acorn.image,
          },
          {
            text: "Level 3 unlocks your pet's primary category resource (Chewed Bone, Ribbon, Ruffroot, etc). If the pet has a secondary category, level 7 adds that resource too. Both cost 200 energy per run.",
            icon: SUNNYSIDE.icons.treasure,
          },
          {
            text: "All pets unlock Fossil Shell missions at level 20 (300 energy). These rare drops feed high-tier shrine recipes and late-game crafting.",
            icon: ITEM_DETAILS["Fossil Shell"].image,
          },
          {
            text: "NFT companions gain exclusive tiers: Moonfur becomes available at level 12 (1,000 energy) and a tertiary category resource unlocks at level 25.",
            icon: ITEM_DETAILS.Moonfur.image,
          },
          {
            text: "Fetch yields improve with level—extra rolls kick in at levels 15, 50, and 100, while Moonfur gets a bonus 50% double-drop chance once an NFT pet reaches level 150.",
            icon: SUNNYSIDE.icons.powerup,
          },
        ]}
      />
    </InnerPanel>
  );
};
