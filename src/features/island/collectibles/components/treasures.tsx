import React from "react";

import { getKeys } from "features/game/types/craftables";
import { ITEM_DETAILS } from "features/game/types/images";
import { PIXEL_SCALE } from "features/game/lib/constants";
import {
  PlaceableTreasures,
  PLACEABLE_TREASURES,
} from "features/game/types/treasure";

interface Props {
  treasureName: PlaceableTreasures;
}

const TreasureImages: React.FC<Props> = ({ treasureName }) => {
  return (
    <img
      className="absolute"
      style={{
        width: `${PIXEL_SCALE * 11}px`,
        left: `${PIXEL_SCALE * 3}px`,
      }}
      src={ITEM_DETAILS[treasureName].image}
      alt={treasureName}
    />
  );
};

export const treasures = getKeys(PLACEABLE_TREASURES).reduce(
  (previous, treasureName) => ({
    ...previous,
    [treasureName]: () => <TreasureImages treasureName={treasureName} />,
  }),
  {} as Record<PlaceableTreasures, React.FC>
);
