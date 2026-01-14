import { SUNNYSIDE } from "assets/sunnyside";
import { InnerPanel } from "components/ui/Panel";
import React, { useEffect, useState } from "react";
import { NoticeboardItems } from "features/world/ui/kingdom/KingdomNoticeboard";
import { Label } from "components/ui/Label";
import { ITEM_DETAILS } from "features/game/types/images";
import { FETCHES_BY_CATEGORY, PetResourceName } from "features/game/types/pets";
import { PIXEL_SCALE } from "features/game/lib/constants";

export const PetLevelsAndPerks: React.FC<{ onBack: () => void }> = ({
  onBack,
}) => {
  const { arrow_left, xpIcon, lightning } = SUNNYSIDE.icons;
  const secondaryResources = Object.values(FETCHES_BY_CATEGORY);
  const [secondaryResource, setSecondaryResource] = useState<PetResourceName>(
    secondaryResources[0],
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setSecondaryResource((current) => {
        const index = secondaryResources.indexOf(current);
        const nextIndex = (index + 1) % secondaryResources.length;
        return secondaryResources[nextIndex];
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [secondaryResources]);

  return (
    <InnerPanel className="relative overflow-y-auto max-h-[350px] scrollable">
      <div className="flex items-center gap-2">
        <img
          src={arrow_left}
          onClick={onBack}
          style={{
            width: `${PIXEL_SCALE * 11}px`,
            cursor: "pointer",
          }}
        />
        <Label type="default">{`Level Perks`}</Label>
      </div>
      <p className="text-xs p-1 mb-1">{`As you level up your pet, you will unlock new perks that will help you in your journey.`}</p>
      <NoticeboardItems
        items={[
          { text: "Lv 1: Acorn (100 energy)", icon: ITEM_DETAILS.Acorn.image },
          {
            text: "Lv 3: Primary category resource (200 energy)",
            icon: ITEM_DETAILS[secondaryResource].image,
          },
          { text: "Lv 5: +5 fetch energy", icon: lightning },
          {
            text: "Lv 7: Secondary category resource (200 energy)",
            icon: ITEM_DETAILS[secondaryResource].image,
          },
          {
            text: "Lv 12: Moonfur (1,000 energy) (NFT only)",
            icon: ITEM_DETAILS.Moonfur.image,
          },
          {
            text: "Lv 15: +10% chance for extra fetch resource",
            icon: ITEM_DETAILS.Acorn.image,
          },
          { text: "Lv 18: +1 Acorn", icon: ITEM_DETAILS.Acorn.image },
          {
            text: "Lv 20: Fossil Shell (300 energy)",
            icon: ITEM_DETAILS["Fossil Shell"].image,
          },
          {
            text: "Lv 25: Tertiary category resource (200 energy) (NFT only)",
            icon: ITEM_DETAILS[secondaryResource].image,
          },
          { text: "Lv 27: +10% XP per feed", icon: xpIcon },
          { text: "Lv 35: +5 fetch energy", icon: lightning },
          {
            text: "Lv 40: +15% XP per feed (25% total) (NFT only)",
            icon: xpIcon,
          },
          {
            text: "Lv 50: +5% chance for extra fetch resource (15% total)",
            icon: ITEM_DETAILS.Acorn.image,
          },
          {
            text: "Lv 60: +1 non-Acorn/Moonfur guaranteed (NFT only)",
            icon: ITEM_DETAILS[secondaryResource].image,
          },
          { text: "Lv 75: +5 fetch energy", icon: lightning },
          {
            text: "Lv 85: +25% XP per feed (50% total) (NFT only)",
            icon: xpIcon,
          },
          {
            text: "Lv 100: +10% chance for extra fetch resource (25% total)",
            icon: ITEM_DETAILS.Acorn.image,
          },
          {
            text: "Lv 150: +25% chance for extra fetch resource (50% total) (NFT only)",
            icon: ITEM_DETAILS.Moonfur.image,
          },
        ]}
      />
    </InnerPanel>
  );
};
