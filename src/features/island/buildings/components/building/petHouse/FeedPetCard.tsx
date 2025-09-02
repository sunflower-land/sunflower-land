import { SUNNYSIDE } from "assets/sunnyside";
import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";
import { Context } from "features/game/GameProvider";
import { CookableName } from "features/game/types/consumables";
import { ITEM_DETAILS } from "features/game/types/images";
import { Pet, PetName, getPetRequestXP } from "features/game/types/pets";
import { shortenCount } from "lib/utils/formatNumber";
import React, { useContext, useState } from "react";
import { PetInfo } from "./PetInfo";
import { IngredientsPopover } from "components/ui/IngredientsPopover";
import { Inventory } from "features/game/types/game";
import Decimal from "decimal.js-light";

interface Props {
  petName: PetName;
  pet: Pet;
  isBulkFeed: boolean;
  selectedFeed: { pet: PetName | number; food: CookableName; petData: Pet }[];
  setSelectedFeed: (
    feed: { pet: PetName | number; food: CookableName; petData: Pet }[],
  ) => void;
  inventory: Inventory;
}

export const getAdjustedFoodCount = (
  foodName: CookableName,
  inventory: Inventory,
  isBulkFeed?: boolean,
  selectedFeed?: { pet: PetName | number; food: CookableName; petData: Pet }[],
) => {
  const baseFoodCount = inventory[foodName] ?? new Decimal(0);

  if (!isBulkFeed || !selectedFeed) {
    return baseFoodCount;
  }

  // Calculate how many of this food are selected in bulk feed mode
  const selectedCount = selectedFeed.filter(
    (item) => item.food === foodName,
  ).length;

  // Return adjusted food count for bulk feed mode
  return baseFoodCount.minus(selectedCount);
};

export const hasFoodInInventory = (
  foodName: CookableName,
  inventory: Inventory,
  isBulkFeed?: boolean,
  selectedFeed?: { pet: PetName | number; food: CookableName; petData: Pet }[],
) => {
  const adjustedCount = getAdjustedFoodCount(
    foodName,
    inventory,
    isBulkFeed,
    selectedFeed,
  );
  return adjustedCount.greaterThan(0);
};

export const isFoodAlreadyFed = (pet: Pet, food: CookableName) => {
  const today = new Date().toISOString().split("T")[0];
  const lastFedDate = pet.requests.fedAt
    ? new Date(pet.requests.fedAt).toISOString().split("T")[0]
    : null;

  if (lastFedDate !== today) return false;

  return pet.requests.foodFed?.includes(food) || false;
};

export const FeedPetCard: React.FC<Props> = ({
  petName,
  pet,
  isBulkFeed,
  selectedFeed,
  setSelectedFeed,
  inventory,
}) => {
  const { gameService } = useContext(Context);

  const [hoveredFood, setHoveredFood] = useState<CookableName | null>(null);

  const handleFeedPet = (food: CookableName) => {
    if (isBulkFeed) {
      setSelectedFeed([...selectedFeed, { pet: petName, food, petData: pet }]);
    } else {
      gameService.send("pet.fed", {
        pet: petName,
        food,
      });
    }
  };

  return (
    <PetInfo petName={petName} pet={pet}>
      <div className="flex flex-col gap-4">
        <Label type={"default"}>{`Food Requests`}</Label>
        <div className="flex space-x-2">
          {pet.requests.food.length === 0 && <p>{`No food requests`}</p>}
          {pet.requests.food.map((food) => {
            const foodImage = ITEM_DETAILS[food].image;
            const canFeed = hasFoodInInventory(
              food,
              inventory,
              isBulkFeed,
              selectedFeed,
            );
            const foodCount = getAdjustedFoodCount(
              food,
              inventory,
              isBulkFeed,
              selectedFeed,
            );

            const alreadyFed = isFoodAlreadyFed(pet, food);
            const isSelected = selectedFeed.some(
              (item) => item.pet === petName && item.food === food,
            );

            const isDisabled = !canFeed || alreadyFed;

            const foodXP = getPetRequestXP(food);

            return (
              <div key={food} className="flex flex-col items-center space-x-2">
                <div className="relative">
                  <div
                    onMouseEnter={() => setHoveredFood(food)}
                    onMouseLeave={() => setHoveredFood(null)}
                  >
                    <Button
                      disabled={isDisabled}
                      onClick={
                        isDisabled
                          ? undefined
                          : isSelected
                            ? () =>
                                setSelectedFeed([
                                  ...selectedFeed.filter((item) => {
                                    // Remove the item from the selectedFeed
                                    return (
                                      item.pet !== petName || item.food !== food
                                    );
                                  }),
                                ])
                            : () => handleFeedPet(food)
                      }
                      className={`w-12 h-12 p-1`}
                    >
                      <img
                        src={foodImage}
                        alt={food}
                        className="w-[85%] h-[85%] object-contain"
                      />
                    </Button>
                  </div>
                  {(alreadyFed || isSelected) && (
                    <img
                      src={SUNNYSIDE.icons.confirm}
                      className="absolute top-[-0.25rem] right-[-0.25rem] w-5 h-5"
                    />
                  )}
                  {foodCount && foodCount.greaterThan(0) && (
                    <Label
                      type="default"
                      className="absolute top-[-0.75rem] left-[-0.75rem]"
                    >
                      {hoveredFood === food
                        ? foodCount.toString()
                        : shortenCount(foodCount)}
                    </Label>
                  )}
                  <IngredientsPopover
                    show={hoveredFood === food}
                    ingredients={[food]}
                    onClick={() => setHoveredFood(null)}
                  />
                </div>
                <Label type="vibrant" icon={SUNNYSIDE.icons.lightning}>
                  {foodXP}
                </Label>
              </div>
            );
          })}
        </div>
      </div>
    </PetInfo>
  );
};
