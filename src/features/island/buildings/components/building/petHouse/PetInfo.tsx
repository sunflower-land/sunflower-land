import xpIcon from "assets/icons/xp.png";
import { SUNNYSIDE } from "assets/sunnyside";
import { Label } from "components/ui/Label";
import { InnerPanel, OuterPanel } from "components/ui/Panel";
import { Bar } from "components/ui/ProgressBar";
import {
  getPetLevel,
  isPetNapping,
  isPetNeglected,
  Pet,
  PetName,
} from "features/game/types/pets";
import { PET_STATE_IMAGES } from "features/island/collectibles/components/pets/petShared";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { shortenCount } from "lib/utils/formatNumber";
import React, { useState } from "react";

type Props = {
  petName: PetName;
  pet: Pet;
  children: React.ReactNode;
};

export const PetInfo: React.FC<Props> = ({ children, petName, pet }) => {
  const { t } = useAppTranslation();
  const { level, percentage, currentProgress, experienceBetweenLevels } =
    getPetLevel(pet.experience);
  const [onHoverXp, setOnHoverXp] = useState(false);

  const isNeglected = isPetNeglected(pet);
  const isNapping = isPetNapping(pet);

  const petImage =
    PET_STATE_IMAGES[petName][isNeglected || isNapping ? "asleep" : "happy"];

  return (
    <OuterPanel className="flex flex-row sm:flex-col p-3 gap-2 relative overflow-hidden">
      <div className="flex flex-col items-start w-1/3 sm:w-full">
        <Label type={"default"}>{petName}</Label>
        <InnerPanel className="flex flex-col sm:flex-row gap-2 sm:gap-4 items-center justify-items-center w-full mt-1">
          <img
            src={petImage}
            alt={petName}
            className="w-12 sm:w-16 h-12 sm:h-16 object-contain"
          />
          <div className="flex flex-col text-xs gap-1 sm:w-2/3 mt-1">
            <p>{`${t("pets.level", { level })}`}</p>
            <Bar percentage={percentage} type={"progress"} />
            <div
              className="flex flex-row items-center gap-1"
              onMouseEnter={() => setOnHoverXp(true)}
              onMouseLeave={() => setOnHoverXp(false)}
            >
              <img src={xpIcon} className="w-4" />
              <p className="text-xxs">
                {onHoverXp
                  ? `${currentProgress} / ${experienceBetweenLevels}`
                  : `${shortenCount(currentProgress)} / ${shortenCount(experienceBetweenLevels)}`}
              </p>
            </div>
            <div className="flex flex-row items-center gap-1">
              <div className="w-4">
                <img src={SUNNYSIDE.icons.lightning} className="w-3" />
              </div>
              <p className="text-xxs">{`${pet.energy}`}</p>
            </div>
          </div>
        </InnerPanel>
      </div>
      {children}
    </OuterPanel>
  );
};
