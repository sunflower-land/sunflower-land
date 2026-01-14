import { SUNNYSIDE } from "assets/sunnyside";
import { InnerPanel } from "components/ui/Panel";
import React from "react";
import { NoticeboardItems } from "features/world/ui/kingdom/KingdomNoticeboard";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { Label } from "components/ui/Label";

export const NFTTraits: React.FC<{ onBack: () => void }> = ({ onBack }) => {
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
        <Label type="default">{`NFT Pet Traits`}</Label>
      </div>
      <p className="text-xs px-2 my-1">
        {`NFT pets have unique traits that provide gameplay bonuses. Check your pet's traits in the pet management screen.`}
      </p>
      <NoticeboardItems
        items={[
          {
            text: "Aura (Energy Multiplier): No Aura 1×, Common 1.5×, Rare 2×, Mythic 3× energy gained per feed.",
            icon: SUNNYSIDE.icons.lightning,
          },
          {
            text: "Bib (XP Bonus): Baby Bib +0, Collar +5, Gold Necklace +10 XP per feed.",
            icon: SUNNYSIDE.icons.xpIcon,
          },
          {
            text: "Cosmetic Traits: Fur (various colors) and Accessories (Crown, Halo, Glasses, Bows, etc.) are purely cosmetic.",
            icon: SUNNYSIDE.icons.wardrobe,
          },
          {
            text: "NFT Pet Types: Dragon, Ram, Phoenix, Griffin, Warthog, Wolf, Bear. Each has 3 categories (primary, secondary, tertiary).",
            icon: SUNNYSIDE.icons.happy,
          },
          {
            text: "NFT pets unlock Moonfur at Lv 12 and tertiary category resource at Lv 25.",
            icon: SUNNYSIDE.icons.treasure,
          },
        ]}
      />
    </InnerPanel>
  );
};
