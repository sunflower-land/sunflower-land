import React from "react";
import { PIXEL_SCALE } from "features/game/lib/constants";
import type { AnimalMud } from "features/game/types/game";
import { ITEM_DETAILS } from "features/game/types/images";
import { isMuddy } from "features/game/lib/animals";

type Props = {
  mud: AnimalMud | undefined;
};

/**
 * Bottom-left counterpart to AnimalFeedBuffBadge (bottom-right): Mud is its own
 * slot, so a muddy Pig can carry a treat badge at the same time.
 */
export const AnimalMudBadge: React.FC<Props> = ({ mud }) => {
  if (!isMuddy({ mud })) return null;

  return (
    <img
      // TODO(Chapter 16 art): Mud's placeholder icon.
      src={ITEM_DETAILS.Mud.image}
      className="absolute pointer-events-none z-[1]"
      style={{
        width: `${PIXEL_SCALE * 7}px`,
        bottom: 0,
        left: 0,
      }}
      alt="Mud"
    />
  );
};
