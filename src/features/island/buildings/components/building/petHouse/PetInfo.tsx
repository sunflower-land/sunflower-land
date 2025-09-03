import xpIcon from "assets/icons/xp.png";
import { SUNNYSIDE } from "assets/sunnyside";
import { Label } from "components/ui/Label";
import { InnerPanel, OuterPanel } from "components/ui/Panel";
import { Bar } from "components/ui/ProgressBar";
import { ITEM_DETAILS } from "features/game/types/images";
import {
  getExperienceToNextLevel,
  Pet,
  PetName,
} from "features/game/types/pets";
import React from "react";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

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

const PetInfoComponent: React.FC<Props> = ({
  children,
  petName,
  pet,
  showChanges = false,
  beforeExperience,
  afterExperience,
  beforeEnergy,
  afterEnergy,
}) => {
  const { t } = useAppTranslation();
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
  let experienceBetweenLevelsChange = experienceBetweenLevels;

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
    experienceBetweenLevelsChange = afterLevelData.experienceBetweenLevels;
  }

  return (
    <OuterPanel className="flex flex-row sm:flex-col justify-between p-3 gap-2 relative overflow-hidden">
      {/* Pet Info */}
      <div className="flex flex-col sm:flex-row items-center space-x-3">
        <img
          src={petImage}
          alt={petName.toString()}
          className="w-12 sm:w-16 h-12 sm:h-16 object-contain"
        />
        <div className="flex flex-col gap-1">
          <Label type={"default"}>{petName}</Label>
          {!showChanges ? (
            <div className="flex flex-col text-xs gap-1 mt-1">
              <p>{`Level: ${level}`}</p>
              <Bar percentage={percentage} type={"progress"} />
              <div className="flex flex-row items-center gap-1">
                <img src={xpIcon} className="w-4" />
                <p className="text-xxs">
                  {`${currentProgress} / ${experienceBetweenLevels}`}
                </p>
              </div>
              <div className="flex flex-row items-center gap-1">
                <img src={SUNNYSIDE.icons.lightning} className="w-3" />
                <p className="text-xxs">{`${pet.energy}`}</p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-1 w-full">
              <InnerPanel className="flex flex-col text-xs gap-1">
                <p>{t("pets.level", { level })}</p>
                <div className="flex flex-row items-center gap-1">
                  <img src={xpIcon} className="w-4" />
                  <p className="text-xxs">
                    {`${beforeProgress} / ${experienceBetweenLevels}`}
                  </p>
                </div>
                <div className="flex flex-row items-center gap-1">
                  <img src={SUNNYSIDE.icons.lightning} className="w-3" />
                  <p className="text-xxs">{`${pet.energy}`}</p>
                </div>
              </InnerPanel>
              <div className="w-full flex justify-center items-center">
                <img
                  src={SUNNYSIDE.icons.arrow_down}
                  alt="Arrow Down"
                  className="w-3"
                />
              </div>
              <InnerPanel className="flex flex-col text-xs gap-1">
                <p>
                  {t("pets.level", { level: afterLevel })}{" "}
                  {levelChange > 0 ? `(+${levelChange})` : ""}
                </p>
                <div className="flex flex-row items-center gap-1">
                  <img src={xpIcon} className="w-4" />
                  <p className="text-xxs">
                    {`${afterProgress} / ${experienceBetweenLevelsChange} ${experienceChange > 0 ? `(+${experienceChange})` : ""}`}
                  </p>
                </div>
                <div className="flex flex-row items-center gap-1">
                  <img src={SUNNYSIDE.icons.lightning} className="w-3" />
                  <p className="text-xxs">{`${afterEnergy} ${energyChange > 0 ? `(+${energyChange})` : ""}`}</p>
                </div>
              </InnerPanel>
            </div>
          )}
        </div>
      </div>
      {children}
    </OuterPanel>
  );
};

export const PetInfo = React.memo(PetInfoComponent);
