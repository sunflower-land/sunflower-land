import { InnerPanel } from "components/ui/Panel";
import React from "react";
import { ITEM_DETAILS } from "features/game/types/images";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { Label } from "components/ui/Label";
import { SUNNYSIDE } from "assets/sunnyside";
import classNames from "classnames";

export const PetCategories: React.FC<{ onBack: () => void }> = ({ onBack }) => {
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
        <Label type="default">{`Pet Categories`}</Label>
      </div>
      <p className="text-xs p-1">{`Pets are split across seven categories. Each category maps to a specific fetch resource. Common pets have 2 categories, NFT pets have 3.`}</p>
      <div className="overflow-x-auto">
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
