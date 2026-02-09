import {
  getPetFetches,
  getPetLevel,
  getPetRequestXP,
  getPetType,
  isPetNapping,
  isPetNeglected,
  PET_RESOURCES,
  Pet,
  PetName,
  PetNFT,
  PetResourceName,
  isPetNFT,
} from "features/game/types/pets";
import React, { useState } from "react";
import {
  getPetExperience,
  getPetEnergy,
  getPetFoodRequests,
  getRequiredFeedAmount,
} from "features/game/events/pets/feedPet";
import { FetchButtonPanel } from "./FetchButtonPanel";
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
import { getFetchYield } from "features/game/events/pets/fetchPet";

interface Props {
  petData: Pet | PetNFT;
  petName: number | PetName;
  state: GameState;
  display: "feeding" | "fetching";
  hasViewedFetching?: boolean;
  handleFeed: (petName: number | PetName, food: CookableName) => void;
  handleFetch: (petName: number | PetName, fetch: PetResourceName) => void;
  handleNeglectPet: (petName: number | PetName) => void;
  handlePetPet: (petName: number | PetName) => void;
  isBulkFeed?: boolean;
  selectedFeed?: { petId: PetName | number; food: CookableName }[];
  setSelectedFeed?: (
    feed: { petId: PetName | number; food: CookableName }[],
  ) => void;
  handleResetRequests: () => void;
  onAcknowledged: () => void;
  farmId: number;
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
  hasViewedFetching = false,
  handleFeed,
  handleFetch,
  handleNeglectPet,
  handlePetPet,
  isBulkFeed,
  selectedFeed,
  setSelectedFeed,
  handleResetRequests,
  onAcknowledged,
  farmId,
}) => {
  const now = useNow({ live: true });
  const todayDate = new Date(now).toISOString().split("T")[0];
  const { t } = useAppTranslation();
  const { inventory } = state;
  const [showResetRequests, setShowResetRequests] = useState(false);

  const showFetchingSection = display === "fetching" || hasViewedFetching;

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
      <div
        className="flex flex-col gap-1 w-full"
        style={{ display: display === "feeding" ? "flex" : "none" }}
      >
        <div className="flex flex-row gap-1 items-center justify-between">
          <Label type="default">{`Today's Requests`}</Label>
          <p
            className="underline font-secondary text-xxs pb-1 -mt-1 mr-1 cursor-pointer hover:text-blue-500"
            onClick={() => setShowResetRequests(true)}
          >
            {t("pets.resetRequests")}
          </p>
        </div>
        <div className="grid grid-cols-3 gap-1 mt-2 w-full">
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

            const isSelected =
              isBulkFeed &&
              selectedFeed?.some(
                (item) => item.petId === petName && item.food === food,
              );

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

            const inventoryCount = getAdjustedFoodCount(
              food,
              inventory,
              isBulkFeed,
              selectedFeed,
              requiredFeedAmount,
            );

            const handleFoodClick = () => {
              if (isBulkFeed && setSelectedFeed && selectedFeed) {
                if (isSelected) {
                  setSelectedFeed(
                    selectedFeed.filter(
                      (item) => !(item.petId === petName && item.food === food),
                    ),
                  );
                } else {
                  setSelectedFeed([...selectedFeed, { petId: petName, food }]);
                }
              } else {
                handleFeed(petName, food);
              }
            };

            return (
              <FoodButtonPanel
                key={food}
                food={food}
                foodFed={alreadyFed}
                inventoryCount={inventoryCount}
                xp={xp}
                energy={energy}
                disabled={isDisabled}
                locked={isFoodLocked}
                selected={isSelected}
                onClick={handleFoodClick}
              />
            );
          })}
        </div>
      </div>
      {showFetchingSection && (
        <div
          className="flex flex-col gap-1 w-full"
          style={{ display: display === "fetching" ? "flex" : "none" }}
        >
          <Label type="default">{t("pets.fetchableResources")}</Label>
          <div className="grid grid-cols-3 gap-1 mt-2 w-full">
            {!getPetType(petData) ? (
              <p className="text-xs col-span-3 p-1">{t("pets.typeUnknown")}</p>
            ) : (
              [...getPetFetches(petData).fetches]
                .sort((a, b) => {
                  const { level } = getPetLevel(petData.experience);
                  const aUnlocked = level >= a.level;
                  const bUnlocked = level >= b.level;

                  if (aUnlocked !== bUnlocked) {
                    return aUnlocked ? -1 : 1;
                  }

                  if (aUnlocked && bUnlocked) {
                    const aEnergy = PET_RESOURCES[a.name].energy;
                    const bEnergy = PET_RESOURCES[b.name].energy;
                    if (aEnergy !== bEnergy) return aEnergy - bEnergy;
                    if (a.level !== b.level) return a.level - b.level;
                    return a.name.localeCompare(b.name);
                  }

                  if (a.level !== b.level) return a.level - b.level;
                  return a.name.localeCompare(b.name);
                })
                .map((fetch) => {
                  const { level } = getPetLevel(petData.experience);
                  const hasRequiredLevel = level >= fetch.level;
                  const energyRequired = PET_RESOURCES[fetch.name].energy;
                  const hasEnoughEnergy = petData.energy >= energyRequired;
                  const isDisabled = !hasRequiredLevel || !hasEnoughEnergy;
                  const inventoryCount =
                    inventory[fetch.name] ?? new Decimal(0);

                  const initialFetchCount =
                    state.farmActivity[`${fetch.name} Fetched`] ?? 0;

                  const { yieldAmount: fetchAmount } = getFetchYield({
                    petLevel: level,
                    fetchResource: fetch.name,
                    isPetNFT: isPetNFT(petData),
                    farmId,
                    counter: petData.fetches?.[fetch.name] ?? initialFetchCount,
                    state,
                  });

                  return (
                    <FetchButtonPanel
                      key={fetch.name}
                      fetch={fetch.name}
                      inventoryCount={inventoryCount}
                      energyRequired={energyRequired}
                      disabled={isDisabled}
                      locked={!hasRequiredLevel}
                      onClick={() => handleFetch(petName, fetch.name)}
                      fetchAmount={fetchAmount}
                    />
                  );
                })
            )}
          </div>
        </div>
      )}
    </>
  );
};
