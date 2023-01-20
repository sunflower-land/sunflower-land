import React from "react";
import { getKeys } from "features/game/types/craftables";
import { Bumpkin } from "features/game/types/game";
import { ITEM_DETAILS } from "features/game/types/images";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { setImageWidth } from "lib/images";

export const AchievementBadges: React.FC<{
  achievements?: Bumpkin["achievements"];
}> = ({ achievements = {} }) => {
  if (!achievements) {
    return null;
  }

  const badges = getKeys(achievements)
    .map((name) => {
      if ((achievements[name] ?? 0) >= 1) {
        return (
          <img
            key={name}
            src={ITEM_DETAILS[name].image}
            alt={name}
            style={{
              opacity: 0,
              marginRight: `${PIXEL_SCALE * 2}px`,
              marginBottom: `${PIXEL_SCALE * 2}px`,
            }}
            onLoad={(e) => setImageWidth(e.currentTarget)}
          />
        );
      }

      return null;
    })
    .filter(Boolean);

  if (badges.length === 0) {
    return null;
  }

  return <div className="flex flex-wrap items-center">{badges}</div>;
};
