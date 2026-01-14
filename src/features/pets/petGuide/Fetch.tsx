import { InnerPanel } from "components/ui/Panel";
import { SUNNYSIDE } from "assets/sunnyside";
import React, { useEffect, useState } from "react";
import { NoticeboardItems } from "features/world/ui/kingdom/KingdomNoticeboard";
import { ITEM_DETAILS } from "features/game/types/images";
import { Label } from "components/ui/Label";
import { PIXEL_SCALE } from "features/game/lib/constants";
import classNames from "classnames";
import { FETCHES_BY_CATEGORY, PetResourceName } from "features/game/types/pets";

export const Fetch: React.FC<{ onBack: () => void }> = ({ onBack }) => {
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
  const categories: {
    name: string;
    fetchResource: string;
    icon: string;
  }[] = [
    {
      name: "Guardians",
      fetchResource: "Chewed Bone",
      icon: ITEM_DETAILS["Chewed Bone"].image,
    },
    {
      name: "Hunters",
      fetchResource: "Ribbon",
      icon: ITEM_DETAILS.Ribbon.image,
    },
    {
      name: "Voyagers",
      fetchResource: "Ruffroot",
      icon: ITEM_DETAILS.Ruffroot.image,
    },
    {
      name: "Beasts",
      fetchResource: "Wild Grass",
      icon: ITEM_DETAILS["Wild Grass"].image,
    },
    {
      name: "Moonkin",
      fetchResource: "Heart leaf",
      icon: ITEM_DETAILS["Heart leaf"].image,
    },
    {
      name: "Snowkins",
      fetchResource: "Frost Pebble",
      icon: ITEM_DETAILS["Frost Pebble"].image,
    },
    {
      name: "Foragers",
      fetchResource: "Dewberry",
      icon: ITEM_DETAILS.Dewberry.image,
    },
  ];

  return (
    <InnerPanel className="relative overflow-y-auto max-h-[350px] scrollable gap-2">
      <div className="flex items-center gap-2">
        <img
          src={SUNNYSIDE.icons.arrow_left}
          onClick={onBack}
          style={{
            width: `${PIXEL_SCALE * 11}px`,
            cursor: "pointer",
          }}
        />
        <Label type="default">{`Fetch`}</Label>
      </div>
      <p className="text-xs px-2 mt-1 mb-2">
        {`Spend stored energy to send pets on resource runs. Each unlock tier lines up with your pet's category spread and level milestones.`}
      </p>
      <NoticeboardItems
        items={[
          {
            text: "See Level Perks for the full fetch unlock timeline by level.",
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
          {
            text: "Pets are split across seven categories. Each category maps to a specific fetch resource. Common pets have 2 categories, NFT pets have 3.",
            icon: ITEM_DETAILS[secondaryResource].image,
          },
        ]}
      />
      <div className="overflow-x-auto mt-2">
        <table className="w-full text-xs table-fixed border-collapse">
          <tbody>
            {categories.map((category, index) => (
              <tr
                key={index}
                className={classNames("relative", {
                  "bg-[#ead4aa]": index % 2 === 0,
                })}
              >
                <td
                  style={{ border: "1px solid #b96f50" }}
                  className="p-1.5 w-1/3"
                >
                  {category.name}
                </td>
                <td style={{ border: "1px solid #b96f50" }} className="p-1.5">
                  <div className="flex items-center gap-1">
                    <img
                      src={category.icon}
                      className="w-6 h-6 object-contain"
                    />
                    <span>{category.fetchResource}</span>
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
