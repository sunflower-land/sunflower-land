import React from "react";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { AnimalFeedBuff, AnimalFeedBuffName } from "features/game/types/game";
import { SUNNYSIDE } from "assets/sunnyside";
import powerup from "assets/icons/level_up.png";

type Props = {
  feedBuff: AnimalFeedBuff | undefined;
};

const BUFF_ICON: Record<AnimalFeedBuffName, string> = {
  "Salt Lick": powerup,
  "Honey Treat": SUNNYSIDE.icons.lightning,
};

export const AnimalFeedBuffBadge: React.FC<Props> = ({ feedBuff }) => {
  if (!feedBuff) return null;

  return (
    <img
      src={BUFF_ICON[feedBuff.name]}
      className="absolute pointer-events-none z-[1]"
      style={{
        width: `${PIXEL_SCALE * 7}px`,
        bottom: 0,
        right: 0,
      }}
      alt={feedBuff.name}
    />
  );
};
