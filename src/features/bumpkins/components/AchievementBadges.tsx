import React from "react";
import { getKeys } from "features/game/types/craftables";
import { Bumpkin } from "features/game/types/game";
import { ITEM_DETAILS } from "features/game/types/images";

export const AchievementBadges: React.FC<{
  achievements?: Bumpkin["achievements"];
}> = ({ achievements = {} }) => {
  const badges = getKeys(achievements).map((name) => {
    return (
      <img
        key={name}
        src={ITEM_DETAILS[name].image}
        alt={name}
        className="h-6 mr-2 mb-2 md:mb-0"
      />
    );
  });

  if (badges.length === 0) {
    return <span className="text-xs text-shadow">No achievements</span>;
  }

  return <div className="flex flex-wrap">{badges}</div>;
};
