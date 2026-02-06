import {
  getPetLevel,
  getPetRequestXP,
  isPetNapping,
  isPetNeglected,
  Pet,
  PetName,
  PetNFT,
} from "features/game/types/pets";
import React, { useState } from "react";
import {
  getPetExperience,
  getPetEnergy,
  getPetFoodRequests,
  getRequiredFeedAmount,
} from "features/game/events/pets/feedPet";
import { FoodButtonPanel } from "./FoodButtonPanel";
import { GameState, Inventory } from "features/game/types/game";
import { Label } from "components/ui/Label";
import { CookableName } from "features/game/types/consumables";
import { useNow } from "lib/utils/hooks/useNow";
import { Button } from "components/ui/Button";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import xpIcon from "assets/icons/xp.png";
import Decimal from "decimal.js-light";
import { ResetFoodRequests } from "features/island/pets/ResetFoodRequests";

interface Props {
  petData: Pet | PetNFT;
  petName: number | PetName;
  state: GameState;
  display: "feeding" | "fetching";
  handleFeed: (petName: number | PetName, food: CookableName) => void;
  handleNeglectPet: (petName: number | PetName) => void;
  handlePetPet: (petName: number | PetName) => void;
  isBulkFeed?: boolean;
  selectedFeed?: { petId: PetName | number; food: CookableName }[];
  handleResetRequests: () => void;
  onAcknowledged: () => void;
}

export const getAdjustedFoodCount = (
  foodName: CookableName,
  inventory: Inventory,
  isBulkFeed?: boolean,
  selectedFeed?: { petId: PetName | number; food: CookableName }[],
  requiredFeedAmount?: number,
) => {
  const baseFoodCount = inventory[foodName] ?? new Decimal(0);

  if (!isBulkFeed || !selectedFeed) {
    return baseFoodCount;
  }

  // Paw Aura: free feeding — don't decrement displayed count when selecting food
  if (requiredFeedAmount === 0) {
    return baseFoodCount;
  }

  // Calculate how many of this food are selected in bulk feed mode
  const selectedCount = selectedFeed.filter(
    (item) => item.food === foodName,
  ).length;

  // Return adjusted food count for bulk feed mode
  return baseFoodCount.minus(selectedCount);
};

export const hasFoodInInventory = (
  foodName: CookableName,
  inventory: Inventory,
  isBulkFeed?: boolean,
  selectedFeed?: { petId: PetName | number; food: CookableName }[],
  requiredFeedAmount?: number,
) => {
  const adjustedCount = getAdjustedFoodCount(
    foodName,
    inventory,
    isBulkFeed,
    selectedFeed,
    requiredFeedAmount,
  );
  return adjustedCount.greaterThan(0);
};

export const isFoodAlreadyFed = (
  pet: Pet | PetNFT,
  food: CookableName,
  now: number,
) => {
  const today = new Date(now).toISOString().split("T")[0];
  const lastFedDate = pet.requests.fedAt
    ? new Date(pet.requests.fedAt).toISOString().split("T")[0]
    : null;

  if (lastFedDate !== today) return false;

  return pet.requests.foodFed?.includes(food) || false;
};

export const PetCard: React.FC<Props> = ({
  petData,
  petName,
  state,
  display,
  handleFeed,
  handleNeglectPet,
  handlePetPet,
  isBulkFeed,
  selectedFeed,
  handleResetRequests,
  onAcknowledged,
}) => {
  const now = useNow({ live: true });
  const todayDate = new Date(now).toISOString().split("T")[0];
  const { t } = useAppTranslation();
  const { inventory } = state;
  const [showResetRequests, setShowResetRequests] = useState(false);

  // Neglected takes precedence: cheer first, then pet
  if (isPetNeglected(petData, now)) {
    return (
      <div className="flex flex-col gap-1 w-full sm:w-auto">
        <Label type={"danger"}>{t("pets.neglectPet")}</Label>
        <p className="text-xs p-1">
          {t("pets.neglectPetDescription", { pet: petData.name })}
        </p>
        <Label type="danger" secondaryIcon={xpIcon}>{`-500`}</Label>
        <Button onClick={() => handleNeglectPet(petName)}>
          {t("pets.cheerPet", { pet: petData.name })}
        </Button>
      </div>
    );
  }

  if (isPetNapping(petData, now)) {
    return (
      <div className="flex flex-col gap-1 w-full sm:w-auto">
        <Label type={"warning"}>{t("pets.napping")}</Label>
        <p className="text-xs p-1">
          {t("pets.nappingDescription", { pet: petData.name })}
        </p>
        <Label type="success" secondaryIcon={xpIcon}>{`+10`}</Label>
        <Button onClick={() => handlePetPet(petName)}>
          {t("pets.petPet", { pet: petData.name })}
        </Button>
      </div>
    );
  }

  if (showResetRequests) {
    return (
      <ResetFoodRequests
        petData={petData}
        inventory={inventory}
        todayDate={todayDate}
        handleResetRequests={handleResetRequests}
        onAcknowledged={onAcknowledged}
        onBack={() => setShowResetRequests(false)}
        PanelWrapper={({ children, className }) => (
          <div className={className}>{children}</div>
        )}
      />
    );
  }

  return (
    <>
      {display === "feeding" && (
        <div className="flex flex-col gap-1">
          <div className="flex flex-row gap-1 items-center justify-between">
            <Label type="default">{`Today's Requests`}</Label>
            <p
              className="underline font-secondary text-xxs pb-1 -mt-1 mr-1 cursor-pointer hover:text-blue-500"
              onClick={() => setShowResetRequests(true)}
            >
              {t("pets.resetRequests")}
            </p>
          </div>
          <div className="grid grid-cols-3 gap-1">
            {petData.requests.food.map((food) => {
              const { level: petLevel } = getPetLevel(petData.experience);

              const isFoodLocked = !getPetFoodRequests(
                petData,
                petLevel,
              ).includes(food);

              const requiredFeedAmount = getRequiredFeedAmount(state);

              const canFeed =
                requiredFeedAmount === 0 ||
                hasFoodInInventory(
                  food,
                  inventory,
                  isBulkFeed,
                  selectedFeed,
                  requiredFeedAmount,
                );

              const alreadyFed = isFoodAlreadyFed(petData, food, now);

              const isDisabled = !canFeed || alreadyFed || isFoodLocked;

              const xp = getPetExperience({
                basePetXP: getPetRequestXP(food),
                game: state,
                petLevel,
                petData,
                food,
              });

              const energy = getPetEnergy({
                game: state,
                basePetEnergy: getPetRequestXP(food),
                petLevel,
                petData,
              });

              return (
                <FoodButtonPanel
                  key={food}
                  food={food}
                  xp={xp}
                  energy={energy}
                  disabled={isDisabled}
                  onClick={() => handleFeed(petName, food)}
                />
              );
            })}
          </div>
        </div>
      )}
      {display === "fetching" && <></>}
    </>
  );
};
