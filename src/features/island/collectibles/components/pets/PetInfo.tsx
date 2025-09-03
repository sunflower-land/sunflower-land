import { SUNNYSIDE } from "assets/sunnyside";
import { Label } from "components/ui/Label";
import { ResizableBar } from "components/ui/ProgressBar";
import { getObjectEntries } from "features/game/expansion/lib/utils";
import { ITEM_DETAILS } from "features/game/types/images";
import {
  getExperienceToNextLevel,
  Pet,
  PET_CATEGORIES,
  PetName,
} from "features/game/types/pets";
import levelUp from "assets/icons/level_up.png";
import xpIcon from "assets/icons/xp.png";
import React from "react";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

interface Props {
  petName: PetName;
  petData: Pet;
}

export const PetInfo: React.FC<Props> = ({ petName, petData }) => {
  const { t } = useAppTranslation();
  const { level, percentage, currentProgress, experienceBetweenLevels } =
    getExperienceToNextLevel(petData.experience);

  const petImage = ITEM_DETAILS[petName].image;

  // Find pet type and categories
  const petTypeEntry = getObjectEntries(PET_CATEGORIES).find(
    ([, petCategory]) => petCategory.pets.includes(petName),
  );
  const petType = petTypeEntry?.[0];
  const petCategory = petTypeEntry?.[1];
  return (
    <div className="flex flex-col gap-4 p-2">
      {/* Pet Header */}
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <img
          src={petImage}
          alt={petName}
          className="w-24 h-24 object-contain"
        />
        <div className="flex-1">
          <Label type="default" className="text-lg mb-2">
            {petName}
          </Label>

          {/* Pet Type and Categories */}
          {petType && petCategory && (
            <div className="flex flex-wrap gap-2 mb-3">
              <Label type="info" className="text-xs">
                {petType}
              </Label>
              <Label type="formula" className="text-xs">
                {petCategory.primaryCategory}
              </Label>
              {petCategory.secondaryCategory && (
                <Label type="vibrant" className="text-xs">
                  {petCategory.secondaryCategory}
                </Label>
              )}
            </div>
          )}

          {/* Level and Experience */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <img src={levelUp} className="w-4 h-4" />
              <span className="text-sm">{t("pets.level", { level })}</span>
            </div>
            <div className="flex flex-row gap-2 items-center">
              <img src={xpIcon} className="w-5" />
              <ResizableBar
                percentage={percentage}
                type="progress"
                outerDimensions={{ width: 30, height: 7 }}
              />
              <div className="flex items-center gap-1 text-sm">
                <span>
                  {t("pets.xp", {
                    currentProgress,
                    experienceBetweenLevels: experienceBetweenLevels,
                  })}
                </span>
              </div>
            </div>
          </div>

          {/* Energy */}
          <div className="flex items-center gap-2 mt-2">
            <img src={SUNNYSIDE.icons.lightning} className="w-5 h-5" />
            <span className="text-sm">
              {t("pets.energy", { energy: petData.energy })}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
