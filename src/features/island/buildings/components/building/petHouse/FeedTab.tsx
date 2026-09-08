import { useSelector } from "@xstate/react";
import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";
import { InnerPanel } from "components/ui/Panel";
import Decimal from "decimal.js-light";
import {
  getPetFoodRequests,
  getRequiredFeedAmount,
} from "features/game/events/pets/feedPet";
import { Context } from "features/game/GameProvider";
import type { CookableName } from "features/game/types/consumables";
import {
  type Pet,
  type PetNFT,
  type PetName,
  getPetLevel,
  isPetNapping,
  isPetNeglected,
} from "features/game/types/pets";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import React, { useContext, useState } from "react";
import { FeedPetCard } from "./FeedPetCard";
import { isFoodAlreadyFed } from "./PetCard";
import { PetInfo } from "./PetInfo";
import { BulkFeedFoodBoard } from "./BulkFeedFoodBoard";
import {
  getBulkFeedExclusions,
  setBulkFeedExclusions,
} from "./bulkFeedExclusions";
import { isWearableActive } from "features/game/lib/wearables";
import * as Auth from "features/auth/lib/Provider";
import type { AuthMachineState } from "features/auth/lib/authMachine";
import { useNow } from "lib/utils/hooks/useNow";
import {
  sortActivePets,
  getPetSort,
  setPetSort,
  type PetSortOption,
} from "./sortActivePets";
import { PetSortToggle } from "./PetSortToggle";

const _authToken = (state: AuthMachineState) =>
  state.context.user.rawToken as string;

// `now` here only drives nap (2h) and neglect (daily) state, so the panel clock
// ticks every 30s instead of every second — far fewer re-renders, no visible
// difference.
const PET_STATE_REFRESH_MS = 30_000;

type Props = {
  activePets: [PetName | number, Pet | PetNFT | undefined][];
};

/**
 * Feeding — both manual (per-pet cards) and Bulk Feed — for the Pet House.
 * The Included/Excluded Foods board sits above the pet cards, always
 * visible, so preferences and feeding live in the same place (per Elias's
 * review on #7417, replacing the settings-gear pop-out).
 */
export const FeedTab: React.FC<Props> = ({ activePets }) => {
  const { t } = useAppTranslation();
  const now = useNow({ live: true, intervalMs: PET_STATE_REFRESH_MS });
  const [isBulkFeed, setIsBulkFeed] = useState(false);
  const [sort, setSortState] = useState<PetSortOption>(() => getPetSort());
  const setSort = (next: PetSortOption) => {
    setSortState(next);
    setPetSort(next);
  };
  const { gameService } = useContext(Context);
  const { authService } = useContext(Auth.Context);
  const authToken = useSelector(authService, _authToken);
  const [selectedFeed, setSelectedFeed] = useState<
    {
      petId: PetName | number;
      food: CookableName;
    }[]
  >([]);
  const [bulkFeedExclusions, setBulkFeedExclusionsState] = useState<
    CookableName[]
  >(() => getBulkFeedExclusions());

  const inventory = useSelector(
    gameService,
    (state) => state.context.state.inventory,
  );
  const state = useSelector(gameService, (state) => state.context.state);
  const isFreeFeeding = getRequiredFeedAmount(state) === 0;

  const handleToggleBulkFeedExclusion = (food: CookableName) => {
    const exclusions = bulkFeedExclusions.includes(food)
      ? bulkFeedExclusions.filter((item) => item !== food)
      : [...bulkFeedExclusions, food];

    setBulkFeedExclusionsState(exclusions);
    setBulkFeedExclusions(exclusions);
  };

  const handleConfirmFeed = (
    pets: { petId: PetName | number; food: CookableName }[] = selectedFeed,
  ) => {
    // Event to handle Bulk Feed
    const state = gameService.send("pets.bulkFeed", { pets });

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

  const collectBulkFeedSelection = () => {
    const newSelectedFeed: {
      petId: PetName | number;
      food: CookableName;
    }[] = [];

    // Create a map to track how much of each food we've allocated
    const foodAllocation: Partial<Record<CookableName, number>> = {};

    // Paw Aura makes feeding free, so food exclusions (which exist to
    // conserve inventory) don't apply — every pet gets fed.
    const requiredFeedAmount = getRequiredFeedAmount(state);
    const isFreeFeeding = requiredFeedAmount === 0;

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
          if (
            !isAlreadyFed &&
            (isFreeFeeding || !bulkFeedExclusions.includes(food))
          ) {
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

    return newSelectedFeed;
  };

  const handleBulkFeed = () => {
    if (!isBulkFeed) {
      const newSelectedFeed = collectBulkFeedSelection();

      // Paw Aura makes feeding free and ignores exclusions, so there's
      // nothing left to review — skip the confirm step and feed immediately.
      if (isFreeFeeding) {
        setSelectedFeed(newSelectedFeed);
        handleConfirmFeed(newSelectedFeed);
        return;
      }

      setIsBulkFeed(true);
      setSelectedFeed(newSelectedFeed);
    } else {
      handleConfirmFeed(selectedFeed);
    }
  };

  const handleCancel = () => {
    setSelectedFeed([]);
    setIsBulkFeed(false);
  };

  const activePetsSortedByType = sortActivePets(activePets, sort, now);

  const nappingPets = activePets.filter(([, pet]) => isPetNapping(pet, now));

  const areAllPetsNapping = nappingPets.length === activePets.length;

  // Compute whether any pets can be fed (for disabling Bulk Feed when nothing is feedable)
  const canBulkFeedAnything = (() => {
    if (areAllPetsNapping) return false;
    const foodAllocation: Partial<Record<CookableName, number>> = {};
    const foodRequests: Array<{ petId: PetName | number; food: CookableName }> =
      [];
    const requiredFeedAmount = getRequiredFeedAmount(state);
    const isFreeFeeding = requiredFeedAmount === 0;
    activePets.forEach(([petId, pet]) => {
      if (pet && !isPetNeglected(pet, now) && !isPetNapping(pet, now)) {
        const { level: petLevel } = getPetLevel(pet.experience);
        const requests = getPetFoodRequests(pet, petLevel);
        requests.forEach((food) => {
          if (
            !isFoodAlreadyFed(pet, food, now) &&
            (isFreeFeeding || !bulkFeedExclusions.includes(food))
          ) {
            foodRequests.push({ petId, food });
            if (!foodAllocation[food]) foodAllocation[food] = 0;
          }
        });
      }
    });
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
      <InnerPanel className="flex flex-col mb-1 w-full">
        <BulkFeedFoodBoard
          excludedFoods={bulkFeedExclusions}
          onToggle={handleToggleBulkFeedExclusion}
          isFreeFeeding={isFreeFeeding}
        />
      </InnerPanel>
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
          {!areAllPetsNapping && (
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
          {isBulkFeed && (
            <Button className="flex-1 min-w-0" onClick={handleCancel}>
              {t("cancel")}
            </Button>
          )}
        </div>
        {!isBulkFeed && <PetSortToggle sort={sort} onChange={setSort} />}
      </InnerPanel>
      <div className="flex flex-col gap-1">
        {activePetsSortedByType.map(([petName, pet]) => {
          if (!pet) return null;
          return (
            <PetInfo key={petName} petData={pet} nftPets={state.pets?.nfts}>
              <FeedPetCard
                petData={pet}
                petName={petName}
                state={state}
                handleFeed={handleFeed}
                handleNeglectPet={handleNeglectPet}
                handlePetPet={handlePetPet}
                isBulkFeed={isBulkFeed}
                selectedFeed={selectedFeed}
                setSelectedFeed={setSelectedFeed}
                bulkFeedExclusions={bulkFeedExclusions}
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
