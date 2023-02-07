import React from "react";
import { getKeys } from "features/game/types/craftables";
import { Bumpkin } from "features/game/types/game";
import { AchievementBadge } from "features/bumpkins/components/AchievementBadge";

export const AchievementBadges: React.FC<{
  achievements?: Bumpkin["achievements"];
}> = ({ achievements = {} }) => {
  const badges = getKeys(achievements).map((name) => {
    return <AchievementBadge key={name} achievement={name} />;
  });

  if (badges.length === 0) {
    return null;
  }

  return <div className="flex flex-wrap items-center">{badges}</div>;
};
