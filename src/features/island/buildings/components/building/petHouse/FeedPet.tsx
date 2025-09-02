import { Label } from "components/ui/Label";
import { Pet, PetName, getPetRequestXP } from "features/game/types/pets";
import React, { useContext, useState } from "react";
import { FeedPetCard, isFoodAlreadyFed } from "./FeedPetCard";
import { Button } from "components/ui/Button";
import { CookableName } from "features/game/types/consumables";
import { Context } from "features/game/GameProvider";
import { InnerPanel, Panel } from "components/ui/Panel";
import { useSelector } from "@xstate/react";
import Decimal from "decimal.js-light";
import { ModalOverlay } from "components/ui/ModalOverlay";
import { PetInfo } from "./PetInfo";
import { Box } from "components/ui/Box";
import { ITEM_DETAILS } from "features/game/types/images";
import { SUNNYSIDE } from "assets/sunnyside";
type Props = {
  activePets: [PetName, Pet | undefined][];
};

export const FeedPet: React.FC<Props> = ({ activePets }) => {
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
  };
  const mappedPets = selectedFeed.reduce<
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

  return (
    <>
      <InnerPanel className="flex flex-row justify-between mb-1 p-1 gap-1">
        <div className="flex flex-col md:flex-row items-center gap-1">
          <Label type={isBulkFeed ? "vibrant" : "formula"}>
            {isBulkFeed ? `Bulk Feed Mode` : `Your Pets (${activePets.length})`}
          </Label>
          {isBulkFeed && (
            <Label type={"warning"}>
              {`Feed Selected: ${selectedFeed.length}`}
            </Label>
          )}
        </div>
        <div className="flex flex-row gap-2">
          <Button
            className="w-40"
            disabled={isBulkFeed && selectedFeed.length === 0}
            onClick={handleBulkFeed}
          >
            {isBulkFeed ? `Confirm Feed` : `Bulk Feed`}
          </Button>
          {isBulkFeed && (
            <Button
              className="w-auto"
              onClick={() => {
                setSelectedFeed([]);
                setIsBulkFeed(false);
              }}
            >
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
          <p className="p-4 text-center text-gray-500">
            {`You don't have any pets yet. Visit the Pet Shop to get your first pet!`}
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mr-1">
            {activePets.map(
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
            <Label type="default">{`Are you sure you want to feed your pets?`}</Label>
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

                return (
                  <PetInfo
                    key={pet}
                    petName={pet}
                    pet={petData}
                    showChanges
                    beforeExperience={beforeExperience}
                    afterExperience={afterExperience}
                    beforeEnergy={beforeEnergy}
                    afterEnergy={afterEnergy}
                  >
                    <div className="flex flex-col gap-2">
                      <Label type="default">{`Food Selected`}</Label>
                      <div className="flex flex-row gap-2">
                        {food.map((food) => (
                          <Box key={food} image={ITEM_DETAILS[food].image} />
                        ))}
                      </div>
                    </div>
                  </PetInfo>
                );
              })}
            </div>
            <Button onClick={handleConfirmFeed}>{`Confirm Feed`}</Button>
          </div>
        </Panel>
      </ModalOverlay>
    </>
  );
};
