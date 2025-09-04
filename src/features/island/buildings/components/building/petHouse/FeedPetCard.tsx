import { SUNNYSIDE } from "assets/sunnyside";
import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";
import { Context } from "features/game/GameProvider";
import { CookableName } from "features/game/types/consumables";
import { ITEM_DETAILS } from "features/game/types/images";
import { Pet, PetName, getPetRequestXP } from "features/game/types/pets";
import { shortenCount } from "lib/utils/formatNumber";
import React, { useContext, useState, useMemo } from "react";
import { PetInfo } from "./PetInfo";
import { Inventory } from "features/game/types/game";
import Decimal from "decimal.js-light";
import { InnerPanel } from "components/ui/Panel";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import xpIcon from "assets/icons/xp.png";

interface Props {
  petName: PetName;
  pet: Pet;
  isBulkFeed: boolean;
  selectedFeed: { pet: PetName; food: CookableName }[];
  setSelectedFeed: (feed: { pet: PetName; food: CookableName }[]) => void;
  inventory: Inventory;
}

export const getAdjustedFoodCount = (
  foodName: CookableName,
  inventory: Inventory,
  isBulkFeed?: boolean,
  selectedFeed?: { pet: PetName; food: CookableName }[],
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
  selectedFeed?: { pet: PetName; food: CookableName }[],
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
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  const handleFeedPet = (food: CookableName) => {
    if (isBulkFeed) {
      setSelectedFeed([...selectedFeed, { pet: petName, food }]);
    } else {
      gameService.send("pet.fed", {
        pet: petName,
        food,
      });
    }
  };

  const handleNeglectPet = (petName: PetName) => {
    gameService.send("pet.neglected", { pet: petName });
  };

  const handleFoodHover = (food: CookableName, event: React.MouseEvent) => {
    setHoveredFood(food);
    const rect = event.currentTarget.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // Estimate tooltip dimensions
    const tooltipWidth = 120;
    const tooltipHeight = 40;

    let x = rect.left + rect.width / 2;
    // Position below the button by default
    let y = rect.bottom + 10;

    // Ensure tooltip doesn't go off the left edge
    if (x - tooltipWidth / 2 < 10) {
      x = tooltipWidth / 2 + 10;
    }

    // Ensure tooltip doesn't go off the right edge
    if (x + tooltipWidth / 2 > viewportWidth - 10) {
      x = viewportWidth - tooltipWidth / 2 - 10;
    }

    // Check if there's enough space below the button
    const spaceBelow = viewportHeight - rect.bottom;
    const spaceAbove = rect.top;

    // If not enough space below, position above the button instead
    if (spaceBelow < tooltipHeight + 10) {
      y = rect.top - tooltipHeight - 10;
      // If also not enough space above, position in the middle of available space
      if (spaceAbove < tooltipHeight + 10) {
        y = Math.max(
          10,
          Math.min(viewportHeight - tooltipHeight - 10, viewportHeight / 2),
        );
      }
    }

    setTooltipPosition({ x, y });
  };

  const handleRemoveFromSelection = (food: CookableName) => {
    setSelectedFeed([
      ...selectedFeed.filter((item) => {
        // Remove the item from the selectedFeed
        return item.pet !== petName || item.food !== food;
      }),
    ]);
  };

  // Memoize the food items to avoid recreating them on every render
  const foodItems = useMemo(() => {
    return pet.requests.food.map((food) => {
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

      return {
        food,
        foodImage,
        canFeed,
        foodCount,
        alreadyFed,
        isSelected,
        isDisabled,
        foodXP,
      };
    });
  }, [inventory, isBulkFeed, selectedFeed, petName, pet]);

  return (
    <PetInfo petName={petName} pet={pet}>
      <FeedPetCardContent
        pet={pet}
        foodItems={foodItems}
        handleFoodHover={handleFoodHover}
        setHoveredFood={setHoveredFood}
        handleRemoveFromSelection={handleRemoveFromSelection}
        handleFeedPet={handleFeedPet}
        hoveredFood={hoveredFood}
        handleNeglectPet={handleNeglectPet}
        tooltipPosition={tooltipPosition}
      />
    </PetInfo>
  );
};

export const FeedPetCardContent: React.FC<{
  pet: Pet;
  foodItems: {
    food: CookableName;
    foodImage: string;
    canFeed: boolean;
    foodCount: Decimal;
    alreadyFed: boolean;
    isSelected: boolean;
    isDisabled: boolean;
    foodXP: number;
  }[];
  handleFoodHover: (food: CookableName, event: React.MouseEvent) => void;
  setHoveredFood: (food: CookableName | null) => void;
  handleRemoveFromSelection: (food: CookableName) => void;
  handleFeedPet: (food: CookableName) => void;
  hoveredFood: CookableName | null;
  handleNeglectPet: (petName: PetName) => void;
  tooltipPosition: { x: number; y: number };
}> = ({
  pet,
  foodItems,
  handleFoodHover,
  setHoveredFood,
  handleRemoveFromSelection,
  handleFeedPet,
  hoveredFood,
  handleNeglectPet,
  tooltipPosition,
}) => {
  const { t } = useAppTranslation();

  if (pet.state === "neglected") {
    return (
      <div className="flex flex-col gap-1 w-3/4 sm:w-auto">
        <Label type={"danger"}>{t("pets.neglectPet")}</Label>
        <p className="text-xs p-1">
          {t("pets.neglectPetDescription", { pet: pet.name })}
        </p>
        <Label type="danger" secondaryIcon={xpIcon}>{`-500`}</Label>
        <Button onClick={() => handleNeglectPet(pet.name)}>
          {t("pets.cheerPet", { pet: pet.name })}
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-4 w-3/4 sm:w-auto">
        <Label type={"default"}>{`Food Requests`}</Label>
        <div className="flex space-x-2 ml-2">
          {pet.requests.food.length === 0 && <p>{`No food requests`}</p>}
          {foodItems.map(
            ({
              food,
              foodImage,
              foodCount,
              alreadyFed,
              isSelected,
              isDisabled,
              foodXP,
            }) => (
              <div key={food} className="flex flex-col items-center space-x-2">
                <div className="relative">
                  <div
                    onMouseEnter={(e) => handleFoodHover(food, e)}
                    onMouseLeave={() => setHoveredFood(null)}
                  >
                    <Button
                      disabled={isDisabled}
                      onClick={
                        isDisabled
                          ? undefined
                          : isSelected
                            ? () => handleRemoveFromSelection(food)
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
                </div>
                <Label type="vibrant" icon={SUNNYSIDE.icons.lightning}>
                  {foodXP}
                </Label>
              </div>
            ),
          )}
        </div>
      </div>
      {/* Food Tooltip Overlay */}
      {hoveredFood && (
        <div
          className="fixed pointer-events-none z-50"
          style={{
            left: tooltipPosition.x,
            top: tooltipPosition.y,
            transform: "translateX(-50%)",
          }}
        >
          <InnerPanel className="whitespace-nowrap max-w-[200px]">
            <div className="flex items-center gap-2 p-1">
              <img
                src={ITEM_DETAILS[hoveredFood].image}
                alt={hoveredFood}
                className="w-6 h-6 object-contain flex-shrink-0"
              />
              <span className="text-xs capitalize break-words">
                {hoveredFood}
              </span>
            </div>
          </InnerPanel>
        </div>
      )}
    </>
  );
};
