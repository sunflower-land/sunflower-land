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
  petName: PetName;
  pet: Pet;
  children: React.ReactNode;
};

export const PetInfo: React.FC<Props> = ({ children, petName, pet }) => {
  const { level, percentage, currentProgress, nextLevelXP } =
    getExperienceToNextLevel(pet.experience);

  const petImage = ITEM_DETAILS[petName].image;

  return (
    <OuterPanel className="flex flex-row sm:flex-col justify-around p-3 gap-2">
      {/* Dog Info */}
      <div className="flex flex-col sm:flex-row items-center space-x-3">
        <img
          src={petImage}
          alt={petName}
          className="w-12 sm:w-16 h-12 sm:h-16 object-contain"
        />
        <div className="flex-1">
          <Label type={"default"}>{petName}</Label>
          <div className="flex flex-col text-xs gap-1 mt-1">
            <p>{`Level: ${level}`}</p>
            <Bar percentage={percentage} type={"progress"} />
            <div className="flex flex-row items-center gap-1">
              <img src={levelUp} className="w-3 h-4" />
              <p className="text-xxs">
                {`${currentProgress} / ${nextLevelXP} XP`}
              </p>
            </div>
            <div className="flex flex-row items-center gap-1">
              <img src={SUNNYSIDE.icons.lightning} className="w-3 h-4" />
              <p className="text-xxs">{`${pet.energy}`}</p>
            </div>
          </div>
        </div>
      </div>
      {children}
    </OuterPanel>
  );
};
