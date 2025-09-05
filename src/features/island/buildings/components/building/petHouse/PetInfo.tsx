import xpIcon from "assets/icons/xp.png";
import { SUNNYSIDE } from "assets/sunnyside";
import { Label } from "components/ui/Label";
import { InnerPanel, OuterPanel } from "components/ui/Panel";
import { Bar } from "components/ui/ProgressBar";
import {
  getExperienceToNextLevel,
  isPetNapping,
  isPetNeglected,
  Pet,
  PetName,
} from "features/game/types/pets";
import { PET_STATE_IMAGES } from "features/island/collectibles/components/pets/Pet";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import React from "react";

type Props = {
  petName: PetName;
  pet: Pet;
  children: React.ReactNode;
};

export const PetInfo: React.FC<Props> = ({ children, petName, pet }) => {
  const { t } = useAppTranslation();
  const { level, percentage, currentProgress, experienceBetweenLevels } =
    getExperienceToNextLevel(pet.experience);

  const isNeglected = isPetNeglected(pet);
  const isNapping = isPetNapping(pet);

  const petImage =
    PET_STATE_IMAGES[petName][isNeglected || isNapping ? "asleep" : "happy"];

  return (
    <OuterPanel className="flex flex-row sm:flex-col p-3 gap-2 relative overflow-hidden">
      <div className="flex flex-col sm:flex-row items-center w-1/2 sm:w-full">
        <img
          src={petImage}
          alt={petName}
          className="w-12 sm:w-16 h-12 sm:h-16 object-contain"
        />
        <div className="flex flex-col gap-1 w-full sm:ml-2">
          <Label type={"default"}>{petName}</Label>
          <InnerPanel className="flex flex-col text-xs gap-1 w-full mt-1">
            <p>{`${t("pets.level", { level })}`}</p>
            <Bar percentage={percentage} type={"progress"} />
            <div className="flex flex-row items-center gap-1">
              <img src={xpIcon} className="w-4" />
              <p className="text-xxs">
                {`${currentProgress} / ${experienceBetweenLevels}`}
              </p>
            </div>
            <div className="flex flex-row items-center gap-1">
              <div className="w-4">
                <img src={SUNNYSIDE.icons.lightning} className="w-3" />
              </div>
              <p className="text-xxs">{`${pet.energy}`}</p>
            </div>
          </InnerPanel>
        </div>
      </div>
      {children}
    </OuterPanel>
  );
};
