import React, { useState } from "react";

import { Bumpkin } from "features/game/types/game";
import levelIcon from "assets/icons/level_up.png";
import { PIXEL_SCALE } from "features/game/lib/constants";
import {
  getBumpkinLevel,
  getExperienceToNextLevel,
  isMaxLevel,
} from "features/game/lib/level";
import { Achievements } from "features/bumpkins/components/Achievements";
import { Skills } from "features/bumpkins/components/Skills";
import { OuterPanel } from "components/ui/Panel";
import { SkillBadges } from "features/bumpkins/components/SkillBadges";
import { AchievementBadges } from "features/bumpkins/components/AchievementBadges";
import { ResizableBar } from "components/ui/ProgressBar";

interface Props {
  bumpkin: Bumpkin;
}

export const BumpkinStats: React.FC<Props> = ({ bumpkin }) => {
  const [view, setView] = useState<"home" | "achievements" | "skills">("home");

  if (view === "achievements") {
    return <Achievements readonly onBack={() => setView("home")} />;
  }

  if (view === "skills") {
    return <Skills readonly onBack={() => setView("home")} />;
  }

  const experience = bumpkin?.experience ?? 0;
  const maxLevel = isMaxLevel(experience);
  const { currentExperienceProgress, experienceToNextLevel } =
    getExperienceToNextLevel(experience);

  const badgeContainer = (title: "Skills" | "Achievements") => (
    <OuterPanel
      className="cursor-pointer hover:bg-brown-200"
      onClick={() => setView(title === "Skills" ? "skills" : "achievements")}
      style={{
        paddingTop: `${PIXEL_SCALE * 2}px`,
        paddingLeft: `${PIXEL_SCALE * 2}px`,
      }}
    >
      <div className="flex items-center mb-1 justify-between">
        <div className="flex items-center">
          <span className="text-xs mx-1">{title}</span>
        </div>
      </div>
      {title === "Skills" ? (
        <SkillBadges inventory={{}} bumpkin={bumpkin as Bumpkin} />
      ) : (
        <AchievementBadges achievements={bumpkin?.achievements} />
      )}
    </OuterPanel>
  );

  return (
    <>
      <div className="flex items-center ml-1 my-2">
        <img
          src={levelIcon}
          style={{
            width: `${PIXEL_SCALE * 10}px`,
            marginRight: `${PIXEL_SCALE * 4}px`,
          }}
        />
        <div>
          <p className="text-base mb-1">
            Level {getBumpkinLevel(bumpkin.experience)}
          </p>

          {/* Progress bar and XP */}
          <div className="flex flex-col-reverse sm:flex-row">
            <ResizableBar
              percentage={
                (currentExperienceProgress / experienceToNextLevel) * 100
              }
              type={"progress"}
              outerDimensions={{ width: 48, height: 7 }}
            />
            <p className="text-xxs mb-1 sm:mb-0 sm:ml-1">
              {`${Math.floor(currentExperienceProgress)}/${
                maxLevel ? "-" : Math.floor(experienceToNextLevel)
              } XP`}
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col w-full gap-y-1">
        {badgeContainer("Skills")}
        {badgeContainer("Achievements")}
      </div>
    </>
  );
};
