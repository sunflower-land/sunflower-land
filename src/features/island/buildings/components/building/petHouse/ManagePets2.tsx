import { useSelector } from "@xstate/react";
import Decimal from "decimal.js-light";
import {
  getPetFoodRequests,
  getRequiredFeedAmount,
} from "features/game/events/pets/feedPet";
import { Context } from "features/game/GameProvider";
import { getKeys } from "features/game/lib/crafting";
import { CookableName } from "features/game/types/consumables";
import {
  PET_CATEGORIES,
  Pet,
  PetNFT,
  PetName,
  PetType,
  getPetLevel,
  getPetType,
  isPetNapping,
  isPetNeglected,
} from "features/game/types/pets";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import React, { useContext, useState } from "react";
import { isFoodAlreadyFed } from "./PetCard";
import { useNow } from "lib/utils/hooks/useNow";
import { Button } from "components/ui/Button";
import { PetInfo } from "./PetInfo2";
import { PetCard } from "./PetCard2";
import { InnerPanel } from "components/ui/Panel";

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
  const [display, setDisplay] = useState<"feeding" | "fetching">("feeding");
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
      const requiredFeedAmount = getRequiredFeedAmount(state);
      foodRequests.forEach(({ petId, food }) => {
        const availableFood = inventory[food] ?? new Decimal(0);
        const currentAllocation = foodAllocation[food] || 0;

        // Skip inventory check if PawAura is active (free feeding)
        if (
          requiredFeedAmount === 0 ||
          availableFood.greaterThan(currentAllocation)
        ) {
          newSelectedFeed.push({ petId, food });
          if (requiredFeedAmount > 0) {
            foodAllocation[food] = currentAllocation + 1;
          }
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

  const handleBulkNeglect = () => {
    neglectedPets.forEach(([petName, pet]) => {
      if (pet) {
        gameService.send("pet.neglected", { petId: petName });
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
  const neglectedPets = activePets.filter(([, pet]) =>
    isPetNeglected(pet, now),
  );

  const areSomePetsNapping = nappingPets.length > 0;
  const areSomePetsNeglected = neglectedPets.length > 0;

  const areAllPetsNapping = nappingPets.length === activePets.length;

  const handleFeed = (petId: PetName | number, food: CookableName) => {
    gameService.send("pet.fed", {
      petId,
      food,
    });
  };

  const handleNeglectPet = (petId: PetName | number) => {
    gameService.send("pet.neglected", { petId });
  };

  const handlePetPet = (petId: PetName | number) => {
    gameService.send("pet.pet", { petId });
  };

  const handleResetRequests = (petId: PetName | number) => {
    gameService.send("REVEAL", {
      event: {
        type: "reset.petRequests",
        petId,
        createdAt: new Date(now),
      },
    });
  };
  return (
    <>
      <InnerPanel className="flex flex-row gap-1.5 mb-1">
        <Button
          className="h-10"
          disabled={display === "feeding"}
          onClick={() => setDisplay("feeding")}
        >
          {t("pets.feed")}
        </Button>
        <Button
          className="h-10"
          disabled={display === "fetching"}
          onClick={() => setDisplay("fetching")}
        >
          {t("pets.fetch")}
        </Button>
      </InnerPanel>
      <div className="flex flex-col gap-1">
        {activePetsSortedByType.map(([petName, pet]) => {
          if (!pet) return null;
          return (
            <PetInfo key={petName} petData={pet} nftPets={state.pets?.nfts}>
              <PetCard
                petData={pet}
                petName={petName}
                state={state}
                display={display}
                handleFeed={handleFeed}
                handleNeglectPet={handleNeglectPet}
                handlePetPet={handlePetPet}
                handleResetRequests={() => handleResetRequests(petName)}
                onAcknowledged={() => gameService.send("CONTINUE")}
              />
            </PetInfo>
          );
        })}
      </div>
    </>
  );
};
