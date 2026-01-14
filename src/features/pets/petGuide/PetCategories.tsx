import { InnerPanel } from "components/ui/Panel";
import React from "react";
import { NoticeboardItems } from "features/world/ui/kingdom/KingdomNoticeboard";
import { ITEM_DETAILS } from "features/game/types/images";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { Label } from "components/ui/Label";
import { SUNNYSIDE } from "assets/sunnyside";

export const PetCategories: React.FC<{ onBack: () => void }> = ({ onBack }) => {
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
      <NoticeboardItems
        items={[
          {
            text: "Guardians fetch Chewed Bone.",
            icon: ITEM_DETAILS["Chewed Bone"].image,
          },
          {
            text: "Hunters chase Ribbons.",
            icon: ITEM_DETAILS.Ribbon.image,
          },
          {
            text: "Voyagers uncover Ruffroot.",
            icon: ITEM_DETAILS.Ruffroot.image,
          },
          {
            text: "Beasts graze Wild Grass.",
            icon: ITEM_DETAILS["Wild Grass"].image,
          },
          {
            text: "Moonkin harvest Heart leaf.",
            icon: ITEM_DETAILS["Heart leaf"].image,
          },
          {
            text: "Snowkins mine Frost Pebble.",
            icon: ITEM_DETAILS["Frost Pebble"].image,
          },
          {
            text: "Foragers gather Dewberry.",
            icon: ITEM_DETAILS.Dewberry.image,
          },
        ]}
      />
    </InnerPanel>
  );
};
