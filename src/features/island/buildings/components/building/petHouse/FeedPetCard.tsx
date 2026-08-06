import React from "react";
import {
  getPetLevel,
  getPetRequestXP,
  type Pet,
  type PetName,
  type PetNFT,
} from "features/game/types/pets";
import {
  getPetExperience,
  getPetEnergy,
  getPetFoodRequests,
  getRequiredFeedAmount,
} from "features/game/events/pets/feedPet";
import { FoodButtonPanel } from "./FoodButtonPanel";
import type { GameState } from "features/game/types/game";
import { Label } from "components/ui/Label";
import type { CookableName } from "features/game/types/consumables";
import {
  getAdjustedFoodCount,
  hasFoodInInventory,
  isFoodAlreadyFed,
} from "./PetCard";
import { PetCardShell } from "./PetCardShell";
import { useNow } from "lib/utils/hooks/useNow";

interface Props {
  petData: Pet | PetNFT;
  petName: number | PetName;
  state: GameState;
  handleFeed: (petName: number | PetName, food: CookableName) => void;
  handleNeglectPet: (petName: number | PetName) => void;
  handlePetPet: (petName: number | PetName) => void;
  isBulkFeed?: boolean;
  selectedFeed?: { petId: PetName | number; food: CookableName }[];
  setSelectedFeed?: (
    feed: { petId: PetName | number; food: CookableName }[],
  ) => void;
  bulkFeedExclusions?: CookableName[];
  handleResetRequests: () => void;
  onAcknowledged: () => void;
}

export const FeedPetCard: React.FC<Props> = ({
  petData,
  petName,
  state,
  handleFeed,
  handleNeglectPet,
  handlePetPet,
  isBulkFeed,
  selectedFeed,
  setSelectedFeed,
  bulkFeedExclusions,
  handleResetRequests,
  onAcknowledged,
}) => {
  const { inventory } = state;
  const now = useNow({ live: true });

  return (
    <PetCardShell
      petData={petData}
      petName={petName}
      inventory={inventory}
      handleNeglectPet={handleNeglectPet}
      handlePetPet={handlePetPet}
      resetRequests={{ handleResetRequests, onAcknowledged }}
    >
      <div className="flex flex-col gap-1 w-full">
        <Label type="default">{`Today's Requests`}</Label>
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

            const isExcluded = !!bulkFeedExclusions?.includes(food);

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
                excluded={isExcluded}
                selected={isSelected}
                onClick={handleFoodClick}
              />
            );
          })}
        </div>
      </div>
    </PetCardShell>
  );
};
