import React, { useState } from "react";
import { getPetRequestXP, Pet, PetName } from "features/game/types/pets";
import { SplitScreenView } from "components/ui/SplitScreenView";
import { Box } from "components/ui/Box";
import { ITEM_DETAILS } from "features/game/types/images";
import { CookableName } from "features/game/types/consumables";
import { Label } from "components/ui/Label";
import { Button } from "components/ui/Button";
import { Inventory } from "features/game/types/game";
import { SUNNYSIDE } from "assets/sunnyside";
import { InnerPanel } from "components/ui/Panel";
import xpIcon from "assets/icons/xp.png";
import { Loading } from "features/auth/components/Loading";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { ResetFoodRequests } from "./ResetFoodRequests";

interface Props {
  petName: PetName;
  petData: Pet;
  inventory: Inventory;
}

export const PetFeed: React.FC<
  Props & {
    handleFeed: (food: CookableName) => void;
    handleResetRequests: (petName: PetName) => void;
    isRevealingState: boolean;
    isRevealedState: boolean;
    onAcknowledged: () => void;
  }
> = ({
  petName,
  petData,
  handleFeed,
  inventory,
  handleResetRequests,
  isRevealingState,
  isRevealedState,
  onAcknowledged,
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
    handleResetRequests(petName);
    setIsRevealing(true);
    setIsPicking(false);
  };
  const lastFedAt = petData.requests.fedAt;

  const todayDate = new Date(Date.now()).toISOString().split("T")[0];
  const lastFedAtDate = new Date(lastFedAt ?? 0).toISOString().split("T")[0];
  const isToday = lastFedAtDate === todayDate;

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
        petName={petName}
        petData={petData}
        inventory={inventory}
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
          petName={petName}
          petData={petData}
          selectedFood={selectedFood}
          handleFeed={handleFeed}
          inventory={inventory}
          showConfirm={showConfirm}
          setShowConfirm={setShowConfirm}
          isToday={isToday}
          setShowResetRequests={setShowResetRequests}
        />
      }
      content={
        <PetFeedContent
          petName={petName}
          petData={petData}
          selectedFood={selectedFood}
          setSelectedFood={setSelectedFood}
          inventory={inventory}
          setShowConfirm={setShowConfirm}
          isToday={isToday}
        />
      }
    />
  );
};

const PetFeedPanel: React.FC<
  Props & {
    selectedFood: CookableName | null;
    handleFeed: (food: CookableName) => void;
    showConfirm: boolean;
    setShowConfirm: (showConfirm: boolean) => void;
    isToday: boolean;
    setShowResetRequests: (showResetRequests: boolean) => void;
  }
> = ({
  petName,
  petData,
  selectedFood,
  handleFeed,
  inventory,
  showConfirm,
  setShowConfirm,
  isToday,
  setShowResetRequests,
}) => {
  const { t } = useAppTranslation();
  const petImage = ITEM_DETAILS[petName].image;

  if (!selectedFood) {
    return (
      <div className="flex flex-row-reverse sm:flex-col gap-2 justify-between w-full">
        <div className="flex flex-col items-center gap-2">
          <img
            src={petImage}
            alt={petName}
            className="w-12 h-12 object-contain"
          />
          <Label type="default" className="text-xs">
            {petName}
          </Label>
        </div>
        <div className="flex flex-row gap-2 items-center w-full">
          <span className="text-xs w-full text-center">
            {t("pets.noFoodSelected")}
          </span>
        </div>
      </div>
    );
  }

  const isDisabled =
    (isToday && petData.requests.foodFed?.includes(selectedFood)) ||
    !inventory[selectedFood] ||
    inventory[selectedFood].lessThan(1);

  const foodXp = getPetRequestXP(selectedFood);

  return (
    <div className="flex flex-col items-center gap-1">
      {/* Pet Image and Name */}
      <div className="flex flex-row-reverse sm:flex-col gap-2 justify-between w-full">
        <div className="flex flex-col items-center gap-2">
          <img
            src={petImage}
            alt={petName}
            className="w-12 h-12 object-contain"
          />
          <Label type="default" className="text-xs">
            {petName}
          </Label>
        </div>

        <div className="flex flex-row gap-2 items-center w-full">
          <img
            src={ITEM_DETAILS[selectedFood].image}
            alt={selectedFood ?? ""}
            className="w-8"
          />
          <span className="text-xs">{selectedFood}</span>
        </div>
      </div>

      <div className="flex flex-row sm:flex-col gap-2 justify-between w-full p-1">
        <div className="flex flex-row gap-2 items-center">
          <img src={xpIcon} className="w-4" />
          <span className="text-xs">{t("pets.plusFoodXp", { foodXp })}</span>
        </div>
        <div className="flex flex-row gap-2 items-center">
          <div className="w-4">
            <img src={SUNNYSIDE.icons.lightning} className="w-3" />
          </div>
          <span className="text-xs">
            {t("pets.plusFoodEnergy", { foodXp })}
          </span>
        </div>
      </div>

      {/* Labels for today's feed and insufficient food */}
      {isToday && petData.requests.foodFed?.includes(selectedFood) ? (
        <div className="flex w-full items-start">
          <Label type="danger" className="text-xs">
            {t("pets.foodFedToday")}
          </Label>
        </div>
      ) : !inventory[selectedFood] || inventory[selectedFood].lessThan(1) ? (
        <div className="flex w-full items-start">
          <Label type="danger" className="text-xs">
            {t("pets.insufficientFood")}
          </Label>
        </div>
      ) : null}
      <div className="flex flex-row sm:flex-col gap-1 w-full">
        <Button
          disabled={isDisabled}
          onClick={() => {
            setShowConfirm(!showConfirm);
            if (showConfirm) handleFeed(selectedFood);
          }}
        >
          {showConfirm ? t("confirm") : t("pets.feedPet", { pet: petName })}
        </Button>
        {showConfirm && (
          <Button onClick={() => setShowConfirm(false)}>{t("cancel")}</Button>
        )}
      </div>
      <p
        className="underline font-secondary text-xxs pb-1 pt-0.5 cursor-pointer hover:text-blue-500"
        onClick={() => setShowResetRequests(true)}
      >
        {t("pets.resetRequests")}
      </p>
    </div>
  );
};

const PetFeedContent: React.FC<
  Props & {
    selectedFood: CookableName | null;
    setSelectedFood: (selectedFood: CookableName) => void;
    setShowConfirm: (showConfirm: boolean) => void;
    isToday: boolean;
  }
> = ({
  petName,
  petData,
  selectedFood,
  setSelectedFood,
  inventory,
  setShowConfirm,
  isToday,
}) => {
  const { t } = useAppTranslation();
  return (
    <div className="flex flex-col gap-2">
      <Label type="default">{t("pets.requestsToday", { pet: petName })}</Label>
      <div className="flex flex-row gap-2">
        {petData.requests.food.map((food) => {
          const isComplete =
            isToday && petData.requests.foodFed?.includes(food);
          return (
            <Box
              key={food}
              image={ITEM_DETAILS[food].image}
              isSelected={selectedFood === food}
              onClick={() => {
                setSelectedFood(food);
                setShowConfirm(false);
              }}
              count={inventory[food]}
              showOverlay={isComplete}
              secondaryImage={isComplete ? SUNNYSIDE.icons.confirm : undefined}
            />
          );
        })}
      </div>
    </div>
  );
};
