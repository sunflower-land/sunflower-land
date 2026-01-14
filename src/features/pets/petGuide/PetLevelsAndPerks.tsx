import { SUNNYSIDE } from "assets/sunnyside";
import { InnerPanel } from "components/ui/Panel";
import React, { useEffect, useState } from "react";
import { Label } from "components/ui/Label";
import { ITEM_DETAILS } from "features/game/types/images";
import { FETCHES_BY_CATEGORY, PetResourceName } from "features/game/types/pets";
import { PIXEL_SCALE } from "features/game/lib/constants";
import classNames from "classnames";

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

  const perks: {
    level: number;
    icon: string;
    text: string;
  }[] = [
    {
      level: 1,
      icon: ITEM_DETAILS.Acorn.image,
      text: "Acorn (100 energy)",
    },
    {
      level: 3,
      icon: ITEM_DETAILS[secondaryResource].image,
      text: "Primary category resource (200 energy)",
    },
    { level: 5, icon: lightning, text: "+5 fetch energy" },
    {
      level: 7,
      icon: ITEM_DETAILS[secondaryResource].image,
      text: "Secondary category resource (200 energy)",
    },
    {
      level: 12,
      icon: ITEM_DETAILS.Moonfur.image,
      text: "Moonfur (1,000 energy) (NFT only)",
    },
    {
      level: 15,
      icon: ITEM_DETAILS.Acorn.image,
      text: "+10% chance for extra fetch resource",
    },
    {
      level: 18,
      icon: ITEM_DETAILS.Acorn.image,
      text: "+1 Acorn",
    },
    {
      level: 20,
      icon: ITEM_DETAILS["Fossil Shell"].image,
      text: "Fossil Shell (300 energy)",
    },
    {
      level: 25,
      icon: ITEM_DETAILS[secondaryResource].image,
      text: "Tertiary category resource (200 energy) (NFT only)",
    },
    { level: 27, icon: xpIcon, text: "+10% XP per feed" },
    { level: 35, icon: lightning, text: "+5 fetch energy" },
    {
      level: 40,
      icon: xpIcon,
      text: "+15% XP per feed (25% total) (NFT only)",
    },
    {
      level: 50,
      icon: ITEM_DETAILS.Acorn.image,
      text: "+5% chance for extra fetch resource (15% total)",
    },
    {
      level: 60,
      icon: ITEM_DETAILS[secondaryResource].image,
      text: "+1 non-Acorn/Moonfur guaranteed (NFT only)",
    },
    { level: 75, icon: lightning, text: "+5 fetch energy" },
    {
      level: 85,
      icon: xpIcon,
      text: "+25% XP per feed (50% total) (NFT only)",
    },
    {
      level: 100,
      icon: ITEM_DETAILS.Acorn.image,
      text: "+10% chance for extra fetch resource (25% total)",
    },
    {
      level: 150,
      icon: ITEM_DETAILS.Moonfur.image,
      text: "+25% chance for extra fetch resource (50% total) (NFT only)",
    },
  ];

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
      <div className="overflow-x-auto">
        <table className="w-full text-xs table-fixed border-collapse">
          <tbody>
            {perks
              .sort((a, b) => a.level - b.level)
              .map((item, index) => (
                <tr
                  key={index}
                  className={classNames("relative", {
                    "bg-[#ead4aa]": index % 2 === 0,
                  })}
                >
                  <td
                    style={{ border: "1px solid #b96f50" }}
                    className="p-1.5 w-1/5"
                  >
                    {`Lvl ${item.level}`}
                  </td>
                  <td style={{ border: "1px solid #b96f50" }} className="p-1.5">
                    <div className="flex items-center gap-1">
                      <img src={item.icon} className="w-6 h-6 object-contain" />
                      <span>{item.text}</span>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </InnerPanel>
  );
};
