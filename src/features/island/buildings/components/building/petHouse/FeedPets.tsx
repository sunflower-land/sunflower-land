import { Label } from "components/ui/Label";
import {
  Pet,
  PetName,
  getPetRequestXP,
  PET_CATEGORIES,
  PetType,
  getExperienceToNextLevel,
} from "features/game/types/pets";
import React, { useContext, useState, useMemo, useCallback } from "react";
import { FeedPetCard, isFoodAlreadyFed } from "./FeedPetCard";
import { Button } from "components/ui/Button";
import { CookableName } from "features/game/types/consumables";
import { Context } from "features/game/GameProvider";
import { InnerPanel, OuterPanel, Panel } from "components/ui/Panel";
import { useSelector } from "@xstate/react";
import Decimal from "decimal.js-light";
import { ModalOverlay } from "components/ui/ModalOverlay";
import { Box } from "components/ui/Box";
import { ITEM_DETAILS } from "features/game/types/images";
import { SUNNYSIDE } from "assets/sunnyside";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { getKeys } from "features/game/lib/crafting";
import { getObjectEntries } from "features/game/expansion/lib/utils";
import xpIcon from "assets/icons/xp.png";

type Props = {
  activePets: [PetName, Pet | undefined][];
};

const FeedPetComponent: React.FC<Props> = ({ activePets }) => {
  const { t } = useAppTranslation();
  const [isBulkFeed, setIsBulkFeed] = useState(false);
  const { gameService } = useContext(Context);
  const [selectedFeed, setSelectedFeed] = useState<
    {
      pet: PetName | number;
      food: CookableName;
    }[]
  >([]);
  const [showOverview, setShowOverview] = useState(false);

  const inventory = useSelector(
    gameService,
    (state) => state.context.state.inventory,
  );

  // Memoize the confirm feed handler to prevent unnecessary re-renders
  const handleConfirmFeed = useCallback(() => {
    if (showOverview) {
      // Event to handle Bulk Feed
      gameService.send("pets.bulkFeed", {
        pets: selectedFeed,
      });
      setSelectedFeed([]);
      setIsBulkFeed(false);
      setShowOverview(false);
    } else {
      setShowOverview(true);
    }
  }, [showOverview, selectedFeed, gameService]);

  // Memoize the bulk feed handler
  const handleBulkFeed = useCallback(() => {
    if (!isBulkFeed) {
      setIsBulkFeed(true);
      const newSelectedFeed: {
        pet: PetName | number;
        food: CookableName;
      }[] = [];

      // Create a map to track how much of each food we've allocated
      const foodAllocation: Partial<Record<CookableName, number>> = {};

      // First pass: collect all food requests and count available inventory
      const foodRequests: Array<{
        petName: PetName | number;
        food: CookableName;
      }> = [];
      activePets.forEach(([petName, pet]) => {
        if (pet) {
          pet.requests.food.forEach((food) => {
            const isAlreadyFed = isFoodAlreadyFed(pet, food);
            if (!isAlreadyFed) {
              foodRequests.push({ petName, food });
              if (!foodAllocation[food]) {
                foodAllocation[food] = 0;
              }
            }
          });
        }
      });

      // Second pass: select food items based on available inventory
      foodRequests.forEach(({ petName, food }) => {
        const availableFood = inventory[food] ?? new Decimal(0);
        const currentAllocation = foodAllocation[food] || 0;

        // Only select if we have enough food available
        if (availableFood.greaterThan(currentAllocation)) {
          newSelectedFeed.push({ pet: petName, food });
          foodAllocation[food] = currentAllocation + 1;
        }
      });

      setSelectedFeed(newSelectedFeed);
    } else {
      handleConfirmFeed();
    }
  }, [isBulkFeed, activePets, inventory, handleConfirmFeed]);

  // Memoize the mapped pets calculation
  const mappedPets = useMemo(() => {
    return selectedFeed.reduce<
      {
        pet: PetName | number;
        food: CookableName[];
      }[]
    >((acc, { pet, food }) => {
      const existingPet = acc.find((p) => p.pet === pet);
      if (existingPet) {
        existingPet.food.push(food);
      } else {
        acc.push({ pet, food: [food] });
      }
      return acc;
    }, []);
  }, [selectedFeed]);

  // Memoize the cancel handler
  const handleCancel = useCallback(() => {
    setSelectedFeed([]);
    setIsBulkFeed(false);
  }, []);

  const activePetsSortedByType = useMemo(() => {
    // Create a map of pet types to their order in PET_CATEGORIES
    const petTypeOrder = getKeys(PET_CATEGORIES).reduce(
      (acc, petType, index) => {
        acc[petType] = index;
        return acc;
      },
      {} as Record<PetType, number>,
    );

    return [...activePets].sort(([, petA], [, petB]) => {
      if (!petA || !petB) return 0;

      // Find the pet types for both pets
      const petTypeA = getObjectEntries(PET_CATEGORIES).find(([, category]) =>
        category.pets.includes(petA.name as PetName),
      )?.[0];
      const petTypeB = getObjectEntries(PET_CATEGORIES).find(([, category]) =>
        category.pets.includes(petB.name as PetName),
      )?.[0];

      if (!petTypeA || !petTypeB) return 0;

      // Sort by pet type order first
      const typeComparison = petTypeOrder[petTypeA] - petTypeOrder[petTypeB];
      if (typeComparison !== 0) return typeComparison;

      // If same type, sort by experience (highest first)
      return petB.experience - petA.experience;
    });
  }, [activePets]);

  return (
    <>
      <InnerPanel className="flex flex-row justify-between mb-1 p-1 gap-1">
        <div className="flex flex-col sm:flex-row items-center gap-1">
          <Label type={isBulkFeed ? "vibrant" : "formula"}>
            {isBulkFeed
              ? t("pets.bulkFeedMode")
              : t("pets.yourPets", { count: activePets.length })}
          </Label>
          {isBulkFeed && (
            <Label type={"warning"}>
              {t("pets.feedSelected", { count: selectedFeed.length })}
            </Label>
          )}
        </div>
        <div className="flex flex-row gap-2">
          <Button
            className="w-40"
            disabled={isBulkFeed && selectedFeed.length === 0}
            onClick={handleBulkFeed}
          >
            {isBulkFeed ? t("pets.confirmFeed") : t("pets.bulkFeed")}
          </Button>
          {isBulkFeed && (
            <Button className="w-auto" onClick={handleCancel}>
              <img
                src={SUNNYSIDE.icons.cancel}
                alt="Cancel"
                className="h-6 object-contain"
              />
            </Button>
          )}
        </div>
      </InnerPanel>
      <InnerPanel className="max-h-[500px] overflow-y-auto scrollable">
        {activePets.length === 0 ? (
          <p className="p-4 text-center text-gray-500">{t("pets.noPets")}</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mr-1">
            {activePetsSortedByType.map(
              ([petName, pet]) =>
                pet && (
                  <FeedPetCard
                    key={petName}
                    petName={petName}
                    pet={pet}
                    isBulkFeed={isBulkFeed}
                    selectedFeed={selectedFeed}
                    setSelectedFeed={setSelectedFeed}
                    inventory={inventory}
                  />
                ),
            )}
          </div>
        )}
      </InnerPanel>
      <ModalOverlay
        show={showOverview}
        onBackdropClick={() => {
          setShowOverview(false);
        }}
      >
        <Panel>
          <div className="flex flex-col gap-2 p-2">
            <Label type="default">{t("pets.confirmFeedPets")}</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 max-h-[400px] overflow-y-auto scrollable">
              {mappedPets.map(({ pet, food }) => {
                const petData = activePets.find(
                  ([petName]) => petName === pet,
                )?.[1];
                if (!petData) {
                  return null;
                }

                // Calculate total XP and energy from all selected foods
                const totalXP = food.reduce(
                  (sum, foodItem) => sum + getPetRequestXP(foodItem),
                  0,
                );
                const beforeExperience = petData.experience;
                const afterExperience = beforeExperience + totalXP;
                const beforeEnergy = petData.energy;
                const afterEnergy = beforeEnergy + totalXP;

                const petImage =
                  typeof pet === "number" ? "" : ITEM_DETAILS[pet].image;

                const { level, currentProgress, experienceBetweenLevels } =
                  getExperienceToNextLevel(petData.experience);

                const experienceChange =
                  beforeExperience !== undefined &&
                  afterExperience !== undefined
                    ? afterExperience - beforeExperience
                    : 0;
                const energyChange =
                  beforeEnergy !== undefined && afterEnergy !== undefined
                    ? afterEnergy - beforeEnergy
                    : 0;

                // Calculate level changes and progress
                let beforeLevel = level;
                let beforeProgress = currentProgress;
                let afterLevel = level;
                let afterProgress = currentProgress;
                let levelChange = 0;
                let experienceBetweenLevelsChange = experienceBetweenLevels;

                if (
                  beforeExperience !== undefined &&
                  afterExperience !== undefined
                ) {
                  const beforeLevelData =
                    getExperienceToNextLevel(beforeExperience);
                  const afterLevelData =
                    getExperienceToNextLevel(afterExperience);

                  beforeLevel = beforeLevelData.level;
                  beforeProgress = beforeLevelData.currentProgress;
                  afterLevel = afterLevelData.level;
                  afterProgress = afterLevelData.currentProgress;
                  levelChange = afterLevel - beforeLevel;
                  experienceBetweenLevelsChange =
                    afterLevelData.experienceBetweenLevels;
                }

                return (
                  <OuterPanel
                    key={pet}
                    className="flex flex-row sm:flex-col p-3 gap-2 relative overflow-hidden"
                  >
                    <div className="flex flex-col items-center w-1/2 sm:w-full">
                      <div className="flex flex-col sm:flex-row-reverse items-center gap-1 mb-1">
                        <img
                          src={petImage}
                          alt={pet.toString()}
                          className="w-12 sm:w-16 h-12 sm:h-16 object-contain"
                        />
                        <Label type={"default"}>{pet}</Label>
                      </div>
                      <div className="flex flex-col gap-1 w-full">
                        <InnerPanel className="flex flex-col text-xs gap-1">
                          <p>{t("pets.level", { level })}</p>
                          <div className="flex flex-row items-center gap-1">
                            <img src={xpIcon} className="w-4" />
                            <p className="text-xxs">
                              {`${beforeProgress} / ${experienceBetweenLevels}`}
                            </p>
                          </div>
                          <div className="flex flex-row items-center gap-1">
                            <div className="w-4">
                              <img
                                src={SUNNYSIDE.icons.lightning}
                                className="w-3"
                              />
                            </div>
                            <p className="text-xxs">{`${petData.energy}`}</p>
                          </div>
                        </InnerPanel>
                        <div className="w-full flex justify-center items-center">
                          <img
                            src={SUNNYSIDE.icons.arrow_down}
                            alt="Arrow Down"
                            className="w-3"
                          />
                        </div>
                        <InnerPanel className="flex flex-col text-xs gap-1">
                          <p>
                            {t("pets.level", { level: afterLevel })}{" "}
                            {levelChange > 0 ? `(+${levelChange})` : ""}
                          </p>
                          <div className="flex flex-row items-center gap-1">
                            <img src={xpIcon} className="w-4" />
                            <p className="text-xxs">
                              {`${afterProgress} / ${experienceBetweenLevelsChange} ${experienceChange > 0 ? `(+${experienceChange})` : ""}`}
                            </p>
                          </div>
                          <div className="flex flex-row items-center gap-1">
                            <div className="w-4">
                              <img
                                src={SUNNYSIDE.icons.lightning}
                                className="w-3"
                              />
                            </div>
                            <p className="text-xxs">{`${afterEnergy} ${energyChange > 0 ? `(+${energyChange})` : ""}`}</p>
                          </div>
                        </InnerPanel>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label type="default">{t("pets.foodSelected")}</Label>
                      <div className="flex flex-row gap-2">
                        {food.map((food) => (
                          <Box key={food} image={ITEM_DETAILS[food].image} />
                        ))}
                      </div>
                    </div>
                  </OuterPanel>
                );
              })}
            </div>
            <Button onClick={handleConfirmFeed}>{t("pets.confirmFeed")}</Button>
          </div>
        </Panel>
      </ModalOverlay>
    </>
  );
};

export const FeedPet = React.memo(FeedPetComponent);
