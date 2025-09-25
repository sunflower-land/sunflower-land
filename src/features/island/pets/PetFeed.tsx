import xpIcon from "assets/icons/xp.png";
import { SUNNYSIDE } from "assets/sunnyside";
import { Box } from "components/ui/Box";
import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";
import { InnerPanel } from "components/ui/Panel";
import { SplitScreenView } from "components/ui/SplitScreenView";
import { Loading } from "features/auth/components/Loading";
import {
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
  const [showConfirm, setShowConfirm] = useState(false);

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
          petId={petId}
          petData={petData}
          selectedFood={selectedFood}
          handleFeed={handleFeed}
          petLevel={petLevel}
          showConfirm={showConfirm}
          setShowConfirm={setShowConfirm}
          isToday={isToday}
          setShowResetRequests={setShowResetRequests}
          state={state}
        />
      }
      content={
        <PetFeedContent
          petData={petData}
          petLevel={petLevel}
          selectedFood={selectedFood}
          setSelectedFood={setSelectedFood}
          inventory={state.inventory}
          setShowConfirm={setShowConfirm}
          isToday={isToday}
        />
      }
    />
  );
};

const PetFeedPanel: React.FC<{
  petId: PetName | number;
  petData: Pet | PetNFT;
  selectedFood: CookableName | null;
  handleFeed: (food: CookableName) => void;
  showConfirm: boolean;
  setShowConfirm: (showConfirm: boolean) => void;
  isToday: boolean;
  setShowResetRequests: (showResetRequests: boolean) => void;
  state: GameState;
  petLevel: number;
}> = ({
  petId,
  petData,
  selectedFood,
  petLevel,
  handleFeed,
  showConfirm,
  setShowConfirm,
  isToday,
  setShowResetRequests,
  state,
}) => {
  const { t } = useAppTranslation();
  const petImage = getPetImage(petId, "happy", petData);

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
  });
  const petEnergy = getPetEnergy({
    petLevel,
    basePetEnergy: baseFoodXp,
  });
  const isFoodLocked = !getPetFoodRequests(petData, petLevel).includes(
    selectedFood,
  );
  const isDisabled =
    (isToday && petData.requests.foodFed?.includes(selectedFood)) ||
    !state.inventory[selectedFood] ||
    state.inventory[selectedFood].lessThan(1) ||
    isFoodLocked;
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

        <div className="flex flex-row gap-2 items-start justify-center w-full">
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
              {t("pets.foodLocked")}
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
        <Button
          disabled={isDisabled}
          onClick={() => {
            setShowConfirm(!showConfirm);
            if (showConfirm) handleFeed(selectedFood);
          }}
        >
          {showConfirm
            ? t("confirm")
            : t("pets.feedPet", { pet: petData.name })}
        </Button>
        {showConfirm && (
          <Button onClick={() => setShowConfirm(false)}>{t("cancel")}</Button>
        )}
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
  setShowConfirm: (showConfirm: boolean) => void;
  isToday: boolean;
  petLevel: number;
}> = ({
  petData,
  petLevel,
  selectedFood,
  setSelectedFood,
  inventory,
  setShowConfirm,
  isToday,
}) => {
  const { t } = useAppTranslation();
  const foodRequests = getPetFoodRequests(petData, petLevel);
  const allFoods = petData.requests.food;

  return (
    <div className="flex flex-col gap-1 pt-0.5">
      <Label type="default">
        {t("pets.requestsToday", { pet: petData.name })}
      </Label>
      <div className="flex flex-row gap-1">
        {allFoods.map((food) => {
          const isRequested = foodRequests.includes(food);
          const isComplete =
            isRequested && isToday && petData.requests.foodFed?.includes(food);
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
              onClick={() => {
                setSelectedFood(food);
                setShowConfirm(false);
              }}
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
