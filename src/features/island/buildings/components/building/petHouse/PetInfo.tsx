import levelUp from "assets/icons/level_up.png";
import { SUNNYSIDE } from "assets/sunnyside";
import { Label } from "components/ui/Label";
import { OuterPanel } from "components/ui/Panel";
import { Bar } from "components/ui/ProgressBar";
import { ITEM_DETAILS } from "features/game/types/images";
import {
  getExperienceToNextLevel,
  Pet,
  PetName,
} from "features/game/types/pets";
import React from "react";

type Props = {
  petName: PetName | number;
  pet: Pet;
  children: React.ReactNode;
  showChanges?: boolean;
  beforeExperience?: number;
  afterExperience?: number;
  beforeEnergy?: number;
  afterEnergy?: number;
};

export const PetInfo: React.FC<Props> = ({
  children,
  petName,
  pet,
  showChanges = false,
  beforeExperience,
  afterExperience,
  beforeEnergy,
  afterEnergy,
}) => {
  const { level, percentage, currentProgress, experienceBetweenLevels } =
    getExperienceToNextLevel(pet.experience);

  const petImage =
    typeof petName === "number" ? "" : ITEM_DETAILS[petName].image;

  const experienceChange =
    showChanges &&
    beforeExperience !== undefined &&
    afterExperience !== undefined
      ? afterExperience - beforeExperience
      : 0;
  const energyChange =
    showChanges && beforeEnergy !== undefined && afterEnergy !== undefined
      ? afterEnergy - beforeEnergy
      : 0;

  // Calculate level changes and progress
  let beforeLevel = level;
  let beforeProgress = currentProgress;
  let afterLevel = level;
  let afterProgress = currentProgress;
  let levelChange = 0;

  if (
    showChanges &&
    beforeExperience !== undefined &&
    afterExperience !== undefined
  ) {
    const beforeLevelData = getExperienceToNextLevel(beforeExperience);
    const afterLevelData = getExperienceToNextLevel(afterExperience);

    beforeLevel = beforeLevelData.level;
    beforeProgress = beforeLevelData.currentProgress;
    afterLevel = afterLevelData.level;
    afterProgress = afterLevelData.currentProgress;
    levelChange = afterLevel - beforeLevel;
  }

  return (
    <OuterPanel className="flex flex-row sm:flex-col justify-around p-3 gap-2 relative overflow-hidden">
      {/* Pet Info */}
      <div className="flex flex-col sm:flex-row items-center space-x-3">
        <img
          src={petImage}
          alt={petName.toString()}
          className="w-12 sm:w-16 h-12 sm:h-16 object-contain"
        />
        <div className="flex-1">
          <Label type={"default"}>{petName}</Label>
          <div className="flex flex-col text-xs gap-1 mt-1">
            <p>
              {showChanges && levelChange > 0
                ? `Level: ${beforeLevel} → ${afterLevel}`
                : `Level: ${level}`}
            </p>
            <Bar percentage={percentage} type={"progress"} />
            <div className="flex flex-row items-center gap-1">
              <img src={levelUp} className="w-3 h-4" />
              <p className="text-xxs">
                {showChanges &&
                beforeExperience !== undefined &&
                afterExperience !== undefined
                  ? `${beforeProgress} → ${afterProgress} / ${experienceBetweenLevels} ${experienceChange > 0 ? `(+${experienceChange})` : ""}`
                  : `${currentProgress} / ${experienceBetweenLevels}`}
              </p>
            </div>
            <div className="flex flex-row items-center gap-1">
              <img src={SUNNYSIDE.icons.lightning} className="w-3 h-4" />
              <p className="text-xxs">
                {showChanges &&
                beforeEnergy !== undefined &&
                afterEnergy !== undefined
                  ? `${beforeEnergy} → ${afterEnergy} ${energyChange > 0 ? `(+${energyChange})` : ""}`
                  : `${pet.energy}`}
              </p>
            </div>
          </div>
        </div>
      </div>
      {children}
    </OuterPanel>
  );
};
