import xpIcon from "assets/icons/xp.png";
import { SUNNYSIDE } from "assets/sunnyside";
import { Box } from "components/ui/Box";
import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";
import { InnerPanel } from "components/ui/Panel";
import { SplitScreenView } from "components/ui/SplitScreenView";
import { Loading } from "features/auth/components/Loading";
import {
  FOOD_TO_DIFFICULTY,
  getPetEnergy,
  getPetExperience,
  getPetFoodRequests,
} from "features/game/events/pets/feedPet";
import { CookableName } from "features/game/types/consumables";
import { GameState, Inventory } from "features/game/types/game";
import { ITEM_DETAILS } from "features/game/types/images";
import {
  getPetLevel,
  getPetRequestXP,
  isPetNFT,
  Pet,
  PetName,
  PetNFT,
} from "features/game/types/pets";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import React, { useState } from "react";
import { ResetFoodRequests } from "./ResetFoodRequests";
import { getPetImage } from "./lib/petShared";

export const PetFeed: React.FC<{
  petId: PetName | number;
  petData: Pet | PetNFT;
  handleFeed: (food: CookableName) => void;
  handleResetRequests: (petId: PetName | number) => void;
  isRevealingState: boolean;
  isRevealedState: boolean;
  onAcknowledged: () => void;
  state: GameState;
}> = ({
  petId,
  petData,
  handleFeed,
  handleResetRequests,
  isRevealingState,
  isRevealedState,
  onAcknowledged,
  state,
}) => {
  const { t } = useAppTranslation();
  const [selectedFood, setSelectedFood] = useState<CookableName | null>(
    petData.requests.food[0] ?? null,
  );

  // States for reset Requests
  const [showResetRequests, setShowResetRequests] = useState(false);
  const [isRevealing, setIsRevealing] = useState(false);
  const [isPicking, setIsPicking] = useState(false);
  const resetRequests = async () => {
    setIsPicking(true);
    await new Promise((resolve) => setTimeout(resolve, 5000));
    handleResetRequests(petId);
    setIsRevealing(true);
    setIsPicking(false);
  };
  const lastFedAt = petData.requests.fedAt;

  const todayDate = new Date(Date.now()).toISOString().split("T")[0];
  const lastFedAtDate = new Date(lastFedAt ?? 0).toISOString().split("T")[0];
  const isToday = lastFedAtDate === todayDate;
  const { level: petLevel } = getPetLevel(petData.experience);
  const foodRequests = getPetFoodRequests(petData, petLevel);

  if (petData.requests.food.length === 0) {
    return (
      <InnerPanel>
        <Loading text={t("pets.loadingFoodRequests")} />
      </InnerPanel>
    );
  }

  if (showResetRequests) {
    return (
      <ResetFoodRequests
        petData={petData}
        inventory={state.inventory}
        todayDate={todayDate}
        resetRequests={resetRequests}
        setShowResetRequests={setShowResetRequests}
        isRevealedState={isRevealedState}
        isRevealing={isRevealing}
        onAcknowledged={onAcknowledged}
        setIsRevealing={setIsRevealing}
        isPicking={isPicking}
        isRevealingState={isRevealingState}
      />
    );
  }

  return (
    <SplitScreenView
      panel={
        <PetFeedPanel
          petData={petData}
          petId={petId}
          selectedFood={selectedFood}
          handleFeed={handleFeed}
          petLevel={petLevel}
          isToday={isToday}
          setShowResetRequests={setShowResetRequests}
          foodRequests={foodRequests}
          state={state}
        />
      }
      content={
        <PetFeedContent
          petData={petData}
          selectedFood={selectedFood}
          setSelectedFood={setSelectedFood}
          inventory={state.inventory}
          isToday={isToday}
          foodRequests={foodRequests}
        />
      }
    />
  );
};

const PetFeedPanel: React.FC<{
  petData: Pet | PetNFT;
  petId: PetName | number;
  selectedFood: CookableName | null;
  handleFeed: (food: CookableName) => void;
  isToday: boolean;
  setShowResetRequests: (showResetRequests: boolean) => void;
  state: GameState;
  petLevel: number;
  foodRequests: CookableName[];
}> = ({
  petData,
  petId,
  selectedFood,
  petLevel,
  handleFeed,
  isToday,
  setShowResetRequests,
  state,
  foodRequests,
}) => {
  const { t } = useAppTranslation();
  const petImage = getPetImage("happy", petId);

  if (!selectedFood) {
    return (
      <div className="flex flex-row-reverse sm:flex-col gap-2 justify-between w-full">
        <div className="flex flex-col items-center gap-2">
          <Label type="default" className="text-xs">
            {petData.name}
          </Label>
          <img
            src={petImage}
            alt={petData.name}
            className="w-12 h-12 object-contain"
          />
        </div>
        <div className="flex flex-row gap-2 items-center w-full">
          <span className="text-xs w-full text-center">
            {t("pets.noFoodSelected")}
          </span>
        </div>
      </div>
    );
  }

  const baseFoodXp = getPetRequestXP(selectedFood);
  const foodXp = getPetExperience({
    basePetXP: baseFoodXp,
    game: state,
    petLevel,
    isPetNFT: isPetNFT(petData),
  });
  const petEnergy = getPetEnergy({
    petLevel,
    basePetEnergy: baseFoodXp,
  });
  const isFoodLocked = !foodRequests.includes(selectedFood);
  const isDisabled =
    (isToday && petData.requests.foodFed?.includes(selectedFood)) ||
    !state.inventory[selectedFood] ||
    state.inventory[selectedFood].lessThan(1) ||
    isFoodLocked;

  const getPetUnlockLevel = (
    petData: Pet | PetNFT,
    petLevel: number,
    foodRequest: CookableName,
  ): number => {
    const difficulty = FOOD_TO_DIFFICULTY.get(foodRequest);
    if (isPetNFT(petData)) {
      if (petLevel < 30 && difficulty === "medium") {
        return 30;
      }
      if (petLevel < 200 && difficulty === "hard") {
        return 200;
      }
      return 200;
    }
    if (petLevel < 10 && difficulty === "hard") {
      return 10;
    }
    return 200;
  };

  const petUnlockLevel = getPetUnlockLevel(petData, petLevel, selectedFood);

  return (
    <div className="flex flex-col items-center gap-1">
      {/* Pet Image and Name */}
      <div className="flex flex-row-reverse sm:flex-col gap-2 justify-between w-full pt-1">
        <div className="flex flex-col items-center gap-2">
          <Label type="default" className="text-xs">
            {petData.name}
          </Label>
          <img
            src={petImage}
            alt={petData.name}
            className="w-12 h-12 object-contain"
          />
        </div>

        <div className="flex flex-row gap-2 items-center justify-center w-full">
          <img
            src={
              isFoodLocked
                ? SUNNYSIDE.icons.expression_confused
                : ITEM_DETAILS[selectedFood].image
            }
            alt={selectedFood}
            className={"w-5"}
          />
          <span className="text-xs">
            {!isFoodLocked ? selectedFood : "Food Locked"}
          </span>
        </div>
      </div>

      <div className="flex flex-row sm:flex-col gap-2 justify-between w-full p-1">
        <div className="flex flex-row gap-1 justify-center items-center">
          <img src={xpIcon} className="w-4" />
          <span className="text-xs">{t("pets.plusFoodXp", { foodXp })}</span>
        </div>
        <div className="flex flex-row gap-1 justify-center items-center">
          <img src={SUNNYSIDE.icons.lightning} className="w-3" />
          <span className="text-xs">
            {t("pets.plusFoodEnergy", { energy: petEnergy })}
          </span>
        </div>
      </div>

      {/* Labels for today's feed and insufficient food */}
      <div className="mb-1">
        {isFoodLocked ? (
          <div className="flex w-full items-start justify-center">
            <Label type="danger" className="text-xs">
              {t("pets.foodLocked", { level: petUnlockLevel })}
            </Label>
          </div>
        ) : isToday && petData.requests.foodFed?.includes(selectedFood) ? (
          <div className="flex w-full items-start justify-center">
            <Label
              type="success"
              className="text-xs"
              icon={SUNNYSIDE.icons.confirm}
            >
              {t("pets.foodFedToday")}
            </Label>
          </div>
        ) : !state.inventory[selectedFood] ||
          state.inventory[selectedFood].lessThan(1) ? (
          <div className="flex w-full items-start justify-center">
            <Label type="danger" className="text-xs">
              {t("pets.insufficientFood")}
            </Label>
          </div>
        ) : null}
      </div>

      <div className="flex flex-row sm:flex-col gap-1 w-full">
        <Button disabled={isDisabled} onClick={() => handleFeed(selectedFood)}>
          {t("pets.feedPet", { pet: petData.name })}
        </Button>
      </div>

      <p
        className="underline font-secondary text-xxs pb-1 -mt-1 cursor-pointer hover:text-blue-500"
        onClick={() => setShowResetRequests(true)}
      >
        {t("pets.resetRequests")}
      </p>
    </div>
  );
};

const PetFeedContent: React.FC<{
  petData: Pet | PetNFT;
  inventory: Inventory;
  selectedFood: CookableName | null;
  setSelectedFood: (selectedFood: CookableName) => void;
  isToday: boolean;
  foodRequests: CookableName[];
}> = ({
  petData,
  selectedFood,
  setSelectedFood,
  inventory,
  isToday,
  foodRequests,
}) => {
  const { t } = useAppTranslation();
  const allFoods = [...petData.requests.food];

  return (
    <div className="flex flex-col gap-1 pt-0.5">
      <Label type="default">
        {t("pets.requestsToday", { pet: petData.name })}
      </Label>
      <div className="flex flex-row flex-wrap gap-1">
        {allFoods
          .sort((a, b) => {
            const aIsRequested = foodRequests.includes(a);
            const bIsRequested = foodRequests.includes(b);

            // If both are requested or both are not requested, maintain original order
            if (aIsRequested === bIsRequested) {
              return 0;
            }

            // Requested foods (available) come first
            return aIsRequested ? -1 : 1;
          })
          .map((food) => {
            const isRequested = foodRequests.includes(food);
            const isComplete =
              isRequested &&
              isToday &&
              petData.requests.foodFed?.includes(food);
            const isUpcoming = !isRequested;
            return (
              <Box
                key={food}
                image={
                  isUpcoming
                    ? SUNNYSIDE.icons.expression_confused
                    : ITEM_DETAILS[food].image
                }
                isSelected={selectedFood === food}
                onClick={() => setSelectedFood(food)}
                count={isUpcoming ? undefined : inventory[food]}
                showOverlay={isComplete || isUpcoming}
                secondaryImage={
                  isComplete
                    ? SUNNYSIDE.icons.confirm
                    : isUpcoming
                      ? SUNNYSIDE.icons.lock
                      : undefined
                }
              />
            );
          })}
      </div>
    </div>
  );
};
