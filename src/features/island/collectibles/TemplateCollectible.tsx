import React from "react";

import { PIXEL_SCALE } from "features/game/lib/constants";
import { CollectibleName } from "features/game/types/craftables";
import { setImageWidth } from "lib/images";
import { ITEM_DETAILS } from "features/game/types/images";

interface Props {
  name: CollectibleName;
}

export const TemplateCollectible: React.FC<Props> = ({ name }) => {
  return (
    <img
      src={ITEM_DETAILS[name].image}
      className="absolute left-1/2 transform -translate-x-1/2 pointer-events-none"
      alt={name}
      style={{
        maxWidth: "none",
        bottom: `${PIXEL_SCALE * 2}px`,
      }}
      onLoad={(e) => {
        setImageWidth(e.currentTarget);
      }}
    />
  );
};
