import React from "react";

import {
  CollectibleName,
  FLAGS,
  getKeys,
} from "features/game/types/craftables";
import { ITEM_DETAILS } from "features/game/types/images";
import { GRID_WIDTH_PX } from "features/game/lib/constants";
import { Flag } from "features/game/types/flags";

interface Props {
  flagName: CollectibleName;
}

const FlagsImages: React.FC<Props> = ({ flagName }) => {
  return (
    <img
      style={{
        width: `${GRID_WIDTH_PX * 1.2}px`,
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
  {} as Record<Flag, React.FC>
);
