import React from "react";

import {
  CollectibleName,
  FLAGS,
  getKeys,
} from "features/game/types/craftables";
import { ITEM_DETAILS } from "features/game/types/images";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { Flag } from "features/game/types/flags";

interface Props {
  flagName: CollectibleName;
}

const FlagsImages: React.FC<Props> = ({ flagName }) => {
  return (
    <img
      className="absolute"
      style={{
        width: `${PIXEL_SCALE * 11}px`,
        left: `${PIXEL_SCALE * 3}px`,
      }}
      src={ITEM_DETAILS[flagName].image}
      alt={flagName}
    />
  );
};

export const flags = getKeys(FLAGS).reduce(
  (previous, flagName) => ({
    ...previous,
    [flagName]: () => <FlagsImages flagName={flagName} />,
  }),
  {} as Record<Flag, React.FC>,
);
