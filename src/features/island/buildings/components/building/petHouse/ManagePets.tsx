import { useSelector } from "@xstate/react";
import xpIcon from "assets/icons/xp.png";
import { SUNNYSIDE } from "assets/sunnyside";
import { Box } from "components/ui/Box";
import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";
import { ModalOverlay } from "components/ui/ModalOverlay";
import { InnerPanel, OuterPanel, Panel } from "components/ui/Panel";
import Decimal from "decimal.js-light";
import {
  getPetEnergy,
  getPetExperience,
  getPetFoodRequests,
} from "features/game/events/pets/feedPet";
import { Context } from "features/game/GameProvider";
import { getKeys } from "features/game/lib/crafting";
import { CookableName } from "features/game/types/consumables";
import { ITEM_DETAILS } from "features/game/types/images";
import {
  PET_CATEGORIES,
  Pet,
  PetNFT,
  PetName,
  PetType,
  getPetLevel,
  getPetRequestXP,
  getPetType,
  isPetNapping,
  isPetNeglected,
} from "features/game/types/pets";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import React, { useContext, useState } from "react";
import { PetCard, isFoodAlreadyFed } from "./PetCard";
import { getPetImage } from "features/island/pets/lib/petShared";
import { useNow } from "lib/utils/hooks/useNow";

type Props = {
  activePets: [PetName | number, Pet | PetNFT | undefined][];
};

export const ManagePets: React.FC<Props> = ({ activePets }) => {
  const { t } = useAppTranslation();
  const now = useNow({ live: true });
  const [isBulkFeed, setIsBulkFeed] = useState(false);
  const { gameService } = useContext(Context);
  const [selectedFeed, setSelectedFeed] = useState<
    {
      petId: PetName | number;
      food: CookableName;
    }[]
  >([]);
  const [showOverview, setShowOverview] = useState(false);

  const inventory = useSelector(
    gameService,
    (state) => state.context.state.inventory,
  );
  const state = useSelector(gameService, (state) => state.context.state);

  const handleConfirmFeed = () => {
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
  };
  const handleBulkFeed = () => {
    if (!isBulkFeed) {
      setIsBulkFeed(true);
      const newSelectedFeed: {
        petId: PetName | number;
        food: CookableName;
      }[] = [];

      // Create a map to track how much of each food we've allocated
      const foodAllocation: Partial<Record<CookableName, number>> = {};

      // First pass: collect all food requests and count available inventory
      const foodRequests: Array<{
        petId: PetName | number;
        food: CookableName;
      }> = [];
      activePets.forEach(([petId, pet]) => {
        if (pet) {
          if (isPetNeglected(pet, now) || isPetNapping(pet, now)) {
            return;
          }
          const { level: petLevel } = getPetLevel(pet.experience);
          const requests = getPetFoodRequests(pet, petLevel);
          requests.forEach((food) => {
            const isAlreadyFed = isFoodAlreadyFed(pet, food);
            if (!isAlreadyFed) {
              foodRequests.push({ petId, food });
              if (!foodAllocation[food]) {
                foodAllocation[food] = 0;
              }
            }
          });
        }
      });

      // Second pass: select food items based on available inventory
      foodRequests.forEach(({ petId, food }) => {
        const availableFood = inventory[food] ?? new Decimal(0);
        const currentAllocation = foodAllocation[food] || 0;

        // Only select if we have enough food available
        if (availableFood.greaterThan(currentAllocation)) {
          newSelectedFeed.push({ petId, food });
          foodAllocation[food] = currentAllocation + 1;
        }
      });

      setSelectedFeed(newSelectedFeed);
    } else {
      handleConfirmFeed();
    }
  };

  const handleBulkPet = () => {
    nappingPets.forEach(([petName, pet]) => {
      if (pet) {
        gameService.send("pet.pet", { petId: petName });
      }
    });
  };

  const mappedPets = selectedFeed.reduce<
    {
      petId: PetName | number;
      food: CookableName[];
    }[]
  >((acc, { petId, food }) => {
    const existingPet = acc.find((p) => p.petId === petId);
    if (existingPet) {
      existingPet.food.push(food);
    } else {
      acc.push({ petId, food: [food] });
    }
    return acc;
  }, []);

  const handleCancel = () => {
    setSelectedFeed([]);
    setIsBulkFeed(false);
  };

  // Pet type order map (static data - React Compiler will optimize)
  const petTypeOrder = getKeys(PET_CATEGORIES).reduce(
    (acc, petType, index) => {
      acc[petType] = index;
      return acc;
    },
    {} as Record<PetType, number>,
  );

  const activePetsSortedByType = [...activePets].sort(([, petA], [, petB]) => {
    if (!petA || !petB) return 0;

    if (isPetNapping(petA, now) && !isPetNapping(petB, now)) return -1;
    if (!isPetNapping(petA, now) && isPetNapping(petB, now)) return 1;

    if (isPetNeglected(petA, now) && !isPetNeglected(petB, now)) return -1;
    if (!isPetNeglected(petA, now) && isPetNeglected(petB, now)) return 1;

    // Find the pet types for both pets
    const petTypeA = getPetType(petA);
    const petTypeB = getPetType(petB);

    if (!petTypeA || !petTypeB) return 0;

    // Sort by pet type order first
    const typeComparison = petTypeOrder[petTypeA] - petTypeOrder[petTypeB];
    if (typeComparison !== 0) return typeComparison;

    // If same type, sort by experience (highest first)
    return petB.experience - petA.experience;
  });

  const nappingPets = activePets.filter(([, pet]) => isPetNapping(pet, now));

  const areSomePetsNapping = nappingPets.length > 0;

  const areAllPetsNapping = nappingPets.length === activePets.length;

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
        <div className="flex flex-col sm:flex-row gap-1 w-1/2 sm:w-auto items-end">
          {areSomePetsNapping && !isBulkFeed && (
            <Button className="w-40" onClick={handleBulkPet}>
              {`Pet All`}
            </Button>
          )}
          <div className="flex flex-row gap-1">
            {!areAllPetsNapping && (
              <Button
                className="w-40"
                disabled={isBulkFeed && selectedFeed.length === 0}
                onClick={handleBulkFeed}
              >
                {isBulkFeed ? t("pets.confirmFeed") : t("pets.bulkFeed")}
              </Button>
            )}
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
        </div>
      </InnerPanel>
      <InnerPanel className="max-h-[500px] overflow-y-auto scrollable">
        {activePets.length === 0 ? (
          <p className="p-4 text-center text-gray-500">{t("pets.noPets")}</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mr-1">
            {activePetsSortedByType.map(([petName, pet]) => {
              if (!pet) return null;

              return (
                <PetCard
                  key={petName}
                  petId={petName}
                  petData={pet}
                  isBulkFeed={isBulkFeed}
                  selectedFeed={selectedFeed}
                  setSelectedFeed={setSelectedFeed}
                  inventory={inventory}
                />
              );
            })}
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
              {mappedPets.map((pet) => {
                const { petId, food } = pet;
                const petData = activePets.find(
                  ([petName]) => petName === petId,
                )?.[1];
                if (!petData) {
                  return null;
                }
                const { level: petLevel } = getPetLevel(petData.experience);

                // Calculate total XP and energy from all selected foods
                const totalXP = food.reduce(
                  (sum, foodItem) =>
                    sum +
                    getPetExperience({
                      basePetXP: getPetRequestXP(foodItem),
                      game: state,
                      petLevel,
                      petData,
                    }),
                  0,
                );
                const totalEnergy = food.reduce(
                  (sum, foodItem) =>
                    sum +
                    getPetEnergy({
                      game: state,
                      petLevel,
                      basePetEnergy: getPetRequestXP(foodItem),
                      petData,
                      createdAt: Date.now(),
                    }),
                  0,
                );
                const beforeExperience = petData.experience;
                const afterExperience = beforeExperience + totalXP;
                const beforeEnergy = petData.energy;
                const afterEnergy = beforeEnergy + totalEnergy;

                const petImage = getPetImage("happy", petId);

                const { level, currentProgress, experienceBetweenLevels } =
                  getPetLevel(petData.experience);

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
                  const beforeLevelData = getPetLevel(beforeExperience);
                  const afterLevelData = getPetLevel(afterExperience);

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
                    key={petId}
                    className="flex flex-row sm:flex-col p-3 gap-2 relative"
                  >
                    <div className="flex flex-col items-start sm:items-center w-3/5 sm:w-full gap-2">
                      <div className="flex flex-col sm:flex-row-reverse items-center gap-1 mb-1">
                        <img
                          src={petImage}
                          alt={petData.name}
                          className="w-12 sm:w-16 h-12 sm:h-16 object-contain"
                        />
                        <Label type={"default"}>{petData.name}</Label>
                      </div>
                      {/* Mobile */}
                      <SelectedFoodComponent device="mobile" foods={food} />
                    </div>
                    <div className="flex flex-row sm:flex-col-reverse gap-2 w-2/5 sm:w-full">
                      {/* Desktop */}
                      <SelectedFoodComponent device="desktop" foods={food} />
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

// Component needs to be in different div depending on screen size
// Unified component to avoid code duplication
const SelectedFoodComponent: React.FC<{
  device: "desktop" | "mobile";
  foods: CookableName[];
}> = ({ device, foods }) => {
  const { t } = useAppTranslation();
  return (
    <div
      className={`flex-col gap-1 sm:w-full ${device === "mobile" ? "block sm:hidden" : "hidden sm:block"}`}
    >
      <Label type="default">{t("pets.foodSelected")}</Label>
      <div className="flex flex-row flex-wrap sm:flex-nowrap w-full sm:w-auto">
        {foods.map((food) => (
          <Box key={food} image={ITEM_DETAILS[food].image} />
        ))}
      </div>
    </div>
  );
};
