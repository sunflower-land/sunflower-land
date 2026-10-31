import React, { useState } from "react";
import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";
import {
  isPetNapping,
  isPetNeglected,
  type Pet,
  type PetName,
  type PetNFT,
} from "features/game/types/pets";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { useNow } from "lib/utils/hooks/useNow";
import xpIcon from "assets/icons/xp.png";
import { ResetFoodRequests } from "features/island/pets/ResetFoodRequests";
import type { Inventory } from "features/game/types/game";

type Props = {
  petData: Pet | PetNFT;
  petName: number | PetName;
  inventory: Inventory;
  handleNeglectPet: (petName: number | PetName) => void;
  handlePetPet: (petName: number | PetName) => void;
  /** Only the Feed tab offers resetting today's food requests. */
  resetRequests?: {
    handleResetRequests: () => void;
    onAcknowledged: () => void;
  };
  children: React.ReactNode;
};

/**
 * Shared neglected / napping / reset-requests states for a pet card. Feed
 * and Fetch tabs each render their own card content as `children` once the
 * pet is in its normal interactive state.
 */
export const PetCardShell: React.FC<Props> = ({
  petData,
  petName,
  inventory,
  handleNeglectPet,
  handlePetPet,
  resetRequests,
  children,
}) => {
  const now = useNow({ live: true });
  const todayDate = new Date(now).toISOString().split("T")[0];
  const { t } = useAppTranslation();
  const [showResetRequests, setShowResetRequests] = useState(false);

  // Neglected takes precedence: cheer first, then pet
  if (isPetNeglected(petData, now)) {
    return (
      <div className="flex flex-col gap-1 w-full sm:w-auto">
        <p className="p-1">
          {t("pets.neglectPetDescription", { pet: petData.name })}
        </p>
        <Button onClick={() => handleNeglectPet(petName)} className="relative">
          <div className="absolute -top-5 -right-2">
            <Label type="danger" secondaryIcon={xpIcon}>{`-500`}</Label>
          </div>
          <p>{t("pets.cheerPet", { pet: petData.name })}</p>
        </Button>
      </div>
    );
  }

  if (isPetNapping(petData, now)) {
    return (
      <div className="flex flex-col gap-1 w-full sm:w-auto">
        <p className="p-1">
          {t("pets.nappingDescription", { pet: petData.name })}
        </p>
        <Button onClick={() => handlePetPet(petName)} className="relative">
          <div className="absolute -top-5 -right-2">
            <Label type="success" secondaryIcon={xpIcon}>{`+10`}</Label>
          </div>
          <p>{t("pets.petPet", { pet: petData.name })}</p>
        </Button>
      </div>
    );
  }

  if (showResetRequests && resetRequests) {
    return (
      <ResetFoodRequests
        petData={petData}
        inventory={inventory}
        todayDate={todayDate}
        handleResetRequests={resetRequests.handleResetRequests}
        onAcknowledged={resetRequests.onAcknowledged}
        onBack={() => setShowResetRequests(false)}
        PanelWrapper={({ children, className }) => (
          <div className={className}>{children}</div>
        )}
      />
    );
  }

  return (
    <>
      {resetRequests && (
        <div className="flex flex-row gap-1 items-center justify-end w-full">
          <p
            className="underline font-secondary text-xxs pb-1 -mt-1 mr-1 cursor-pointer hover:text-blue-500"
            onClick={() => setShowResetRequests(true)}
          >
            {t("pets.resetRequests")}
          </p>
        </div>
      )}
      {children}
    </>
  );
};
