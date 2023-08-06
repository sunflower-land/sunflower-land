import React, { useState } from "react";

import { BumpkinLevel } from "features/bumpkins/components/BumpkinModal";
import { Bumpkin } from "features/game/types/game";
import levelIcon from "assets/icons/level_up.png";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { getBumpkinLevel } from "features/game/lib/level";
import { Achievements } from "features/bumpkins/components/Achievements";
import { Skills } from "features/bumpkins/components/Skills";
import { InnerPanel } from "components/ui/Panel";
import { SkillBadges } from "features/bumpkins/components/SkillBadges";
import { AchievementBadges } from "features/bumpkins/components/AchievementBadges";

interface Props {
  bumpkin: Bumpkin;
}

export const BumpkinStats: React.FC<Props> = ({ bumpkin }) => {
  const [view, setView] = useState<"home" | "achievements" | "skills">("home");

  if (view === "achievements") {
    return (
      <Achievements
        readonly
        onBack={() => setView("home")}
        onClose={console.log}
      />
    );
  }

  if (view === "skills") {
    return (
      <Skills readonly onBack={() => setView("home")} onClose={console.log} />
    );
  }

  return (
    <>
      <div className="flex items-center ml-1 mt-2 mb-4">
        <img
          src={levelIcon}
          style={{
            width: `${PIXEL_SCALE * 10}px`,
            marginRight: `${PIXEL_SCALE * 4}px`,
          }}
        />
        <div>
          <p className="text-base">
            Level {getBumpkinLevel(bumpkin.experience)}
          </p>
          {/* Progress bar */}
          <BumpkinLevel experience={bumpkin.experience} />
        </div>
      </div>
      <div className="mb-2 cursor-pointer" onClick={() => setView("skills")}>
        <InnerPanel className="relative mt-1 px-2 py-1">
          <div className="flex items-center mb-1 justify-between">
            <div className="flex items-center">
              <span className="text-xs">Skills</span>
            </div>
            <span className="text-xxs underline">View all</span>
          </div>
          <SkillBadges inventory={{}} bumpkin={bumpkin as Bumpkin} />
        </InnerPanel>
      </div>
      <div
        className="mb-2 cursor-pointer"
        onClick={() => setView("achievements")}
      >
        <InnerPanel className="relative mt-1 px-2 py-1">
          <div className="flex items-center mb-1 justify-between">
            <div className="flex items-center">
              <span className="text-xs">Achievements</span>
            </div>
            <span className="text-xxs underline">View all</span>
          </div>
          <AchievementBadges achievements={bumpkin?.achievements} />
        </InnerPanel>
      </div>
    </>
  );
};
