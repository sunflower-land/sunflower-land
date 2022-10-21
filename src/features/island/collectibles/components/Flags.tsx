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
    <div
      className="absolute"
      style={{
        width: `${PIXEL_SCALE * 11}px`,
        right: `${PIXEL_SCALE * 2.5}px`,
      }}
    >
      <img
        style={{
          width: `${PIXEL_SCALE * 11}px`,
        }}
        src={ITEM_DETAILS[flagName].image}
        alt={flagName}
      />
    </div>
  );
};

export const flags = getKeys(FLAGS).reduce(
  (previous, flagName) => ({
    ...previous,
    [flagName]: () => <FlagsImages flagName={flagName} />,
  }),
  {} as Record<Flag, React.FC>
);
