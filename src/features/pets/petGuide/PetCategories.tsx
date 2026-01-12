import { SUNNYSIDE } from "assets/sunnyside";
import { InnerPanel } from "components/ui/Panel";
import React from "react";
import { NoticeboardItems } from "features/world/ui/kingdom/KingdomNoticeboard";
import { ITEM_DETAILS } from "features/game/types/images";

export const PetCategories: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  return (
    <InnerPanel className="relative">
      <img
        src={SUNNYSIDE.icons.arrow_left}
        onClick={onBack}
        className="cursor-pointer w-6 h-6 absolute top-3 left-1"
      />
      <h2 className="text-center text-lg mb-1">{`Pet Categories`}</h2>
      <p className="text-xs text-center px-2 mb-2">
        {`Pets are split across seven categories. Each category maps to a specific fetch resource. Common pets have 2 categories, NFT pets have 3.`}
      </p>
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
