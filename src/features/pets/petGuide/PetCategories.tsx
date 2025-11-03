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
        {`Twenty common pets are split across seven categories. Eggs always hatch a category you haven’t unlocked yet, so you’ll fill the full spread before seeing duplicates. Each category maps to a specific fetch resource and shrine recipe family.`}
      </p>
      <NoticeboardItems
        items={[
          {
            text: "Guardians bring back Chewed Bone. Think diligent dogs, hamsters, and the Wolf NFT variant keeping your crafting queue stocked.",
            icon: ITEM_DETAILS["Chewed Bone"].image,
          },
          {
            text: "Hunters chase Ribbons. Cats headline the commons, while Dragons and Griffins hold down the NFT roster.",
            icon: ITEM_DETAILS.Ribbon.image,
          },
          {
            text: "Voyagers discover Ruffroot. Horses earn the earliest unlock, with Penguins, Phoenixes, and Griffins extending the supply later on.",
            icon: ITEM_DETAILS.Ruffroot.image,
          },
          {
            text: "Beasts graze for Wild Grass. Bulls, Warthogs, Bears, and even your workhorse herd contribute to this bundle-heavy fiber.",
            icon: ITEM_DETAILS["Wild Grass"].image,
          },
          {
            text: "Moonkin cultivate Heart leaf. Owls are your starting point and the mystical Dragon/Phoenix pair compound the harvest.",
            icon: ITEM_DETAILS["Heart leaf"].image,
          },
          {
            text: "Snowkins mine Frost Pebble. Penguins and Rams specialize here while Bulls and Bears add backup drops.",
            icon: ITEM_DETAILS["Frost Pebble"].image,
          },
          {
            text: "Foragers gather Dewberry. Hamsters take the lead, with Owls, Warthogs, and Bears boosting long-term throughput.",
            icon: ITEM_DETAILS.Dewberry.image,
          },
        ]}
      />
    </InnerPanel>
  );
};
