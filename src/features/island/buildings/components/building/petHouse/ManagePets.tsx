import { useSelector } from "@xstate/react";
import { SUNNYSIDE } from "assets/sunnyside";
import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";
import { InnerPanel } from "components/ui/Panel";
import Decimal from "decimal.js-light";
import {
  FOOD_TO_DIFFICULTY,
  getPetFoodRequests,
  getRequiredFeedAmount,
} from "features/game/events/pets/feedPet";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { Context } from "features/game/GameProvider";
import { getKeys } from "lib/object";
import { CookableName } from "features/game/types/consumables";
import {
  PET_CATEGORIES,
  Pet,
  PetNFT,
  PetName,
  PetResourceName,
  PetType,
  PetRequestDifficulty,
  getPetLevel,
  getPetType,
  isPetNapping,
  isPetNeglected,
  isPetNFT,
} from "features/game/types/pets";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import React, { useContext, useId, useState } from "react";
import { isFoodAlreadyFed } from "./PetCard";
import { useNow } from "lib/utils/hooks/useNow";
import { PetInfo } from "./PetInfo";
import { PetCard } from "./PetCard";
import { isWearableActive } from "features/game/lib/wearables";
import * as Auth from "features/auth/lib/Provider";
import { AuthMachineState } from "features/auth/lib/authMachine";
import { ITEM_DETAILS } from "features/game/types/images";
import { GameState, Inventory } from "features/game/types/game";

const _authToken = (state: AuthMachineState) =>
  state.context.user.rawToken as string;

type Props = {
  activePets: [PetName | number, Pet | PetNFT | undefined][];
};

type MissingFoodRequest = {
  food: CookableName;
  difficulty?: PetRequestDifficulty;
  owned: number;
  missing: number;
  petNames: string[];
};

type PetSourceLabels = {
  common: string;
  nft: string;
};

export const getMissingFoodRequests = ({
  activePets,
  inventory,
  now,
  petSourceLabels,
  state,
}: {
  activePets: [PetName | number, Pet | PetNFT | undefined][];
  inventory: Inventory;
  now: number;
  petSourceLabels: PetSourceLabels;
  state: GameState;
}): MissingFoodRequest[] => {
  const requiredFeedAmount = getRequiredFeedAmount(state);

  if (requiredFeedAmount === 0) return [];

  const requestedFood: Partial<
    Record<CookableName, { requested: number; petNames: string[] }>
  > = {};

  activePets.forEach(([, pet]) => {
    if (!pet || isPetNeglected(pet, now) || isPetNapping(pet, now)) return;

    const { level: petLevel } = getPetLevel(pet.experience);
    const requests = getPetFoodRequests(pet, petLevel);

    requests.forEach((food) => {
      if (isFoodAlreadyFed(pet, food, now)) return;

      const requested = requestedFood[food]?.requested ?? 0;
      const owned = inventory[food]?.toNumber() ?? 0;
      const petNames = requestedFood[food]?.petNames ?? [];
      const petLabel = `${pet.name} (${
        isPetNFT(pet) ? petSourceLabels.nft : petSourceLabels.common
      })`;

      requestedFood[food] = {
        requested: requested + requiredFeedAmount,
        petNames:
          requested + requiredFeedAmount > owned
            ? [...petNames, petLabel]
            : petNames,
      };
    });
  });

  return getKeys(requestedFood)
    .map((food) => {
      const requested = requestedFood[food]?.requested ?? 0;
      const owned = inventory[food]?.toNumber() ?? 0;

      return {
        food,
        difficulty: FOOD_TO_DIFFICULTY.get(food),
        owned,
        missing: Math.max(0, requested - owned),
        petNames: requestedFood[food]?.petNames ?? [],
      };
    })
    .filter(({ missing }) => missing > 0)
    .sort((a, b) => b.missing - a.missing || a.food.localeCompare(b.food));
};

const MissingFoodsPanel: React.FC<{
  id: string;
  missingFoodRequests: MissingFoodRequest[];
  onClose: () => void;
}> = ({ id, missingFoodRequests, onClose }) => {
  const { t } = useAppTranslation();

  return (
    <InnerPanel id={id} className="flex flex-col gap-1 mb-1 p-1 w-full">
      <div className="relative flex items-center justify-center">
        <span className="text-sm sm:text-base">{t("pets.missingFoods")}</span>
        <button
          aria-label={t("close")}
          className="absolute right-0 cursor-pointer"
          onClick={onClose}
          type="button"
        >
          <img
            src={SUNNYSIDE.icons.close}
            className="block"
            style={{
              width: `${PIXEL_SCALE * 7}px`,
              height: `${PIXEL_SCALE * 7}px`,
            }}
          />
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
        {missingFoodRequests.map(
          ({ food, difficulty, missing, owned, petNames }) => (
            <div
              key={food}
              className="flex flex-col gap-1 text-xs p-1 bg-brown-200"
            >
              <div className="flex items-center justify-between gap-1">
                <div className="flex items-center gap-1 min-w-0">
                  <img
                    src={ITEM_DETAILS[food].image}
                    alt={food}
                    className="w-6 h-6 object-contain shrink-0"
                    style={{ imageRendering: "pixelated" }}
                  />
                  <span className="truncate">{food}</span>
                </div>
                <div className="flex gap-1 shrink-0">
                  <Label type="danger">
                    {t("pets.missingFoodCount", { count: missing })}
                  </Label>
                  <Label type="default">
                    {t("pets.foodOwnedCount", { count: owned })}
                  </Label>
                </div>
              </div>
              <p className="text-xxs">
                {t("pets.missingFoodPets", {
                  pets: petNames.join(", "),
                })}
              </p>
              {difficulty && (
                <p className="text-xxs capitalize">
                  {t("pets.missingFoodLevel", { level: difficulty })}
                </p>
              )}
            </div>
          ),
        )}
      </div>
    </InnerPanel>
  );
};

export const ManagePets: React.FC<Props> = ({ activePets }) => {
  const { t } = useAppTranslation();
  const missingFoodsPanelId = useId();
  const now = useNow({ live: true });
  const [isBulkFeed, setIsBulkFeed] = useState(false);
  const [showMissingFoods, setShowMissingFoods] = useState(false);
  const { gameService } = useContext(Context);
  const { authService } = useContext(Auth.Context);
  const authToken = useSelector(authService, _authToken);
  const [selectedFeed, setSelectedFeed] = useState<
    {
      petId: PetName | number;
      food: CookableName;
    }[]
  >([]);
  const [display, setDisplay] = useState<"feeding" | "fetching">("feeding");
  const [hasViewedFetching, setHasViewedFetching] = useState(false);

  const inventory = useSelector(
    gameService,
    (state) => state.context.state.inventory,
  );
  const state = useSelector(gameService, (state) => state.context.state);

  const handleConfirmFeed = () => {
    // Event to handle Bulk Feed
    const state = gameService.send("pets.bulkFeed", {
      pets: selectedFeed,
    });

    const hasVictoriaApron = isWearableActive({
      game: state.context.state,
      name: "Victoria's Apron",
    });

    if (hasVictoriaApron) {
      gameService.send("SAVE");
    }
    setSelectedFeed([]);
    setIsBulkFeed(false);
  };

  const handleBulkFeed = () => {
    if (!isBulkFeed) {
      setIsBulkFeed(true);
      setShowMissingFoods(false);
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
            const isAlreadyFed = isFoodAlreadyFed(pet, food, now);
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

  // Compute whether any pets can be fed (for disabling Bulk Feed when nothing is feedable)
  const canBulkFeedAnything = (() => {
    if (areAllPetsNapping) return false;
    const foodAllocation: Partial<Record<CookableName, number>> = {};
    const foodRequests: Array<{ petId: PetName | number; food: CookableName }> =
      [];
    activePets.forEach(([petId, pet]) => {
      if (pet && !isPetNeglected(pet, now) && !isPetNapping(pet, now)) {
        const { level: petLevel } = getPetLevel(pet.experience);
        const requests = getPetFoodRequests(pet, petLevel);
        requests.forEach((food) => {
          if (!isFoodAlreadyFed(pet, food, now)) {
            foodRequests.push({ petId, food });
            if (!foodAllocation[food]) foodAllocation[food] = 0;
          }
        });
      }
    });
    const requiredFeedAmount = getRequiredFeedAmount(state);
    return foodRequests.some(({ food }) => {
      const availableFood = inventory[food] ?? new Decimal(0);
      const currentAllocation = foodAllocation[food] || 0;
      if (
        requiredFeedAmount === 0 ||
        availableFood.greaterThan(currentAllocation)
      ) {
        if (requiredFeedAmount > 0) {
          foodAllocation[food] = currentAllocation + 1;
        }
        return true;
      }
      return false;
    });
  })();

  const missingFoodRequests = getMissingFoodRequests({
    activePets,
    inventory,
    now,
    petSourceLabels: {
      common: t("pets.source.common"),
      nft: t("pets.source.nft"),
    },
    state,
  });

  const handleFeed = (petId: PetName | number, food: CookableName) => {
    const state = gameService.send("pet.fed", { petId, food });

    const hasVictoriaApron = isWearableActive({
      game: state.context.state,
      name: "Victoria's Apron",
    });
    if (hasVictoriaApron) {
      const petData =
        typeof petId === "number"
          ? state.context.state.pets?.nfts?.[petId]
          : state.context.state.pets?.common?.[petId];
      if (petData) {
        const requests = getPetFoodRequests(
          petData,
          getPetLevel(petData.experience).level,
        );
        const fedRequests = petData.requests.foodFed;
        if (requests.every((request) => fedRequests?.includes(request))) {
          gameService.send("SAVE");
        }
      }
    }
  };

  const handleFetch = (petId: PetName | number, fetch: PetResourceName) => {
    gameService.send("pet.fetched", { petId, fetch });
  };

  const handleNeglectPet = (petId: PetName | number) => {
    gameService.send("pet.neglected", { petId });
  };

  const handlePetPet = (petId: PetName | number) => {
    gameService.send("pet.pet", { petId });
  };

  const handleResetRequests = (petId: PetName | number) => {
    gameService.send("reset.petRequests", {
      effect: { type: "reset.petRequests", petId },
      authToken,
    });
  };
  return (
    <>
      <InnerPanel className="flex flex-col justify-between mb-1 p-1 gap-1 w-full">
        <div className="flex flex-col sm:flex-row justify-between w-full gap-1">
          <div className="flex flex-col sm:flex-row items-start gap-1">
            <Label type={isBulkFeed ? "vibrant" : "formula"}>
              {isBulkFeed
                ? t("pets.bulkFeedMode")
                : t("pets.yourPets", { count: activePets.length })}
            </Label>
            {isBulkFeed && (
              <Label type="warning">
                {t("pets.feedSelected", { count: selectedFeed.length })}
              </Label>
            )}
          </div>
        </div>
        <div className="flex flex-row gap-1 w-full">
          <Button
            className="flex-1 min-w-0"
            disabled={display === "feeding" && !showMissingFoods}
            onClick={() => {
              setDisplay("feeding");
              setShowMissingFoods(false);
            }}
          >
            {t("pets.feed")}
          </Button>
          <Button
            className="flex-1 min-w-0"
            disabled={display === "fetching"}
            onClick={() => {
              setDisplay("fetching");
              setHasViewedFetching(true);
              setShowMissingFoods(false);
            }}
          >
            {t("pets.fetch")}
          </Button>
        </div>
        <div className="flex flex-row gap-1 w-full">
          {areSomePetsNeglected && !isBulkFeed && (
            <Button className="flex-1 min-w-0" onClick={handleBulkNeglect}>
              {`Cheer All`}
            </Button>
          )}
          {areSomePetsNapping && !areSomePetsNeglected && !isBulkFeed && (
            <Button className="flex-1 min-w-0" onClick={handleBulkPet}>
              {`Pet All`}
            </Button>
          )}
          {!areAllPetsNapping && display === "feeding" && (
            <Button
              className="flex-1 min-w-0"
              disabled={
                (!isBulkFeed && !canBulkFeedAnything) ||
                (isBulkFeed && selectedFeed.length === 0)
              }
              onClick={handleBulkFeed}
            >
              {isBulkFeed ? t("pets.confirmFeed") : t("pets.bulkFeed")}
            </Button>
          )}
          {!isBulkFeed && display === "feeding" && (
            <Button
              aria-controls={missingFoodsPanelId}
              aria-expanded={showMissingFoods}
              className="flex-1 min-w-0"
              disabled={showMissingFoods || missingFoodRequests.length === 0}
              onClick={() => setShowMissingFoods(!showMissingFoods)}
            >
              {t("pets.missingFoods")}
            </Button>
          )}
          {isBulkFeed && display === "feeding" && (
            <Button className="flex-1 min-w-0" onClick={handleCancel}>
              {t("cancel")}
            </Button>
          )}
        </div>
      </InnerPanel>
      {showMissingFoods && display === "feeding" && !isBulkFeed ? (
        <MissingFoodsPanel
          id={missingFoodsPanelId}
          missingFoodRequests={missingFoodRequests}
          onClose={() => setShowMissingFoods(false)}
        />
      ) : (
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
                  hasViewedFetching={hasViewedFetching}
                  handleFeed={handleFeed}
                  handleFetch={handleFetch}
                  handleNeglectPet={handleNeglectPet}
                  handlePetPet={handlePetPet}
                  isBulkFeed={isBulkFeed}
                  selectedFeed={selectedFeed}
                  setSelectedFeed={setSelectedFeed}
                  handleResetRequests={() => handleResetRequests(petName)}
                  onAcknowledged={() => gameService.send("CONTINUE")}
                />
              </PetInfo>
            );
          })}
        </div>
      )}
    </>
  );
};
