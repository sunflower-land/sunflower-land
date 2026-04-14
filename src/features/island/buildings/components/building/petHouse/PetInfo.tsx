import { SUNNYSIDE } from "assets/sunnyside";
import classNames from "classnames";
import { Label } from "components/ui/Label";
import { InnerPanel } from "components/ui/Panel";
import { ResizableBar } from "components/ui/ProgressBar";
import {
  getPetLevel,
  getPetType,
  isPetNapping,
  isPetNeglected,
  isPetNFT,
  Pet,
  PET_CATEGORIES,
  PetNFT,
  isPetOfTypeFed,
  PetNFTType,
  PetNFTs,
} from "features/game/types/pets";
import { getPetImage } from "features/island/pets/lib/petShared";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import React from "react";

import levelUp from "assets/icons/level_up.png";
import xpIcon from "assets/icons/xp.png";
import { useNow } from "lib/utils/hooks/useNow";

interface Props {
  petData: Pet | PetNFT;
  children?: React.ReactNode;
  nftPets?: PetNFTs;
}

type UsePetAsleepProps = {
  petData: Pet | PetNFT;
  nftPets?: PetNFTs;
};

const usePetAsleep = ({ petData, nftPets }: UsePetAsleepProps) => {
  const now = useNow({ live: true });
  if (nftPets) {
    return (
      isPetNeglected(petData, now) ||
      isPetNapping(petData, now) ||
      isPetOfTypeFed({
        nftPets,
        petType: (petData as PetNFT).traits?.type as PetNFTType,
        id: (petData as PetNFT).id,
        now,
      })
    );
  }
  return isPetNeglected(petData, now) || isPetNapping(petData, now);
};

export const PetInfo: React.FC<Props> = ({ petData, children, nftPets }) => {
  const { t } = useAppTranslation();

  const isNFTPet = isPetNFT(petData);
  const petId = isNFTPet ? petData.id : petData?.name;
  const isAsleep = usePetAsleep({
    petData,
    nftPets: isNFTPet ? nftPets : undefined,
  });
  const image = getPetImage(isAsleep ? "asleep" : "happy", petId);
  const type = getPetType(petData);
  const { level, percentage, currentProgress, experienceBetweenLevels } =
    getPetLevel(petData.experience);
  const petCategory = type ? PET_CATEGORIES[type] : undefined;

  return (
    <InnerPanel className="flex flex-col sm:flex-row w-full">
      <div className="flex px-4 py-3 gap-4 w-full sm:w-[45%] items-center">
        <div className="flex flex-col justify-center w-1/4 items-center gap-2">
          <img
            src={image}
            alt={petData.name}
            className={classNames("object-contain", {
              "w-16": !isNFTPet,
              "w-24": isNFTPet,
            })}
          />
        </div>
        <div className="flex flex-col w-2/3">
          {/* Pet Type and Categories */}
          <div className="flex flex-wrap gap-1 mb-2">
            <Label type="info" className="text-xs">
              {type ?? "Unknown type"}
            </Label>
            {petCategory && (
              <>
                <Label type="chill" className="text-xs">
                  {petCategory.primary}
                </Label>
                {petCategory.secondary && (
                  <Label type="formula" className="text-xs">
                    {petCategory.secondary}
                  </Label>
                )}
                {petCategory.tertiary && (
                  <Label type="vibrant" className="text-xs">
                    {petCategory.tertiary}
                  </Label>
                )}
              </>
            )}
          </div>

          {/* Level and Experience */}
          <div className="flex flex-row gap-3 mb-2">
            <Label type="transparent" className="text-xs" icon={levelUp}>
              {`Lvl ${level}`}
            </Label>
            {/* Energy */}
            <Label
              type="transparent"
              className="text-xs"
              icon={SUNNYSIDE.icons.lightning}
            >
              {petData.energy}
            </Label>
          </div>
          <div className="flex flex-row gap-2 items-center -ml-2">
            <img src={xpIcon} className="w-5" />
            <ResizableBar
              percentage={percentage}
              type="progress"
              outerDimensions={{ width: 30, height: 7 }}
            />
            <span className="text-xs mb-1">
              {t("pets.xp", {
                currentProgress,
                experienceBetweenLevels: experienceBetweenLevels,
              })}
            </span>
          </div>
        </div>
      </div>
      <div className="w-full sm:flex-1 sm:min-w-0 flex flex-col">
        {children}
      </div>
    </InnerPanel>
  );
};
