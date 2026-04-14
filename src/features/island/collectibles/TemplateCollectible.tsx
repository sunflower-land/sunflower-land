import React from "react";

import { CollectibleName } from "features/game/types/craftables";
import { setImageWidth } from "lib/images";
import { ITEM_DETAILS } from "features/game/types/images";
import { SFTDetailPopover } from "components/ui/SFTDetailPopover";

interface Props {
  name: CollectibleName;
}

export const TemplateCollectible: React.FC<Props> = ({ name }) => {
  return (
    <SFTDetailPopover name={name}>
      <img
        src={ITEM_DETAILS[name].image}
        className="absolute left-1/2 transform -translate-x-1/2 "
        alt={name}
        style={{
          maxWidth: "none",
          bottom: 0,
        }}
        onLoad={(e) => {
          setImageWidth(e.currentTarget);
        }}
      />
    </SFTDetailPopover>
  );
};
