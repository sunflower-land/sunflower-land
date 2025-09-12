import xpIcon from "assets/icons/xp.png";
import powerupIcon from "assets/icons/level_up.png";
import { SUNNYSIDE } from "assets/sunnyside";
import { Button } from "components/ui/Button";
import { Label, LabelType } from "components/ui/Label";
import { InnerPanel } from "components/ui/Panel";
import Decimal from "decimal.js-light";
import {
  getPetEnergy,
  getPetExperience,
  getPetFoodRequests,
} from "features/game/events/pets/feedPet";
import { Context } from "features/game/GameProvider";
import { CookableName } from "features/game/types/consumables";
import { Inventory } from "features/game/types/game";
import { ITEM_DETAILS } from "features/game/types/images";
import {
  PET_RESOURCES,
  Pet,
  PetName,
  PetResourceName,
  getPetFetches,
  getPetLevel,
  getPetRequestXP,
  isPetNapping,
  isPetNeglected,
} from "features/game/types/pets";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { shortenCount } from "lib/utils/formatNumber";
import React, { useContext, useMemo, useState } from "react";
import { PetInfo } from "./PetInfo";
import { useSelector } from "@xstate/react";
import { isTemporaryCollectibleActive } from "features/game/lib/collectibleBuilt";

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

export const PetCard: React.FC<Props> = ({
  petName,
  pet,
  isBulkFeed,
  selectedFeed,
  setSelectedFeed,
  inventory,
}) => {
  const { gameService } = useContext(Context);
  const state = useSelector(gameService, (state) => state.context.state);
  const isHoundShrineActive = isTemporaryCollectibleActive({
    name: "Hound Shrine",
    game: state,
  });
  const [hoveredFood, setHoveredFood] = useState<CookableName | null>(null);
  const [hoveredFetch, setHoveredFetch] = useState<PetResourceName | null>(
    null,
  );
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

  const handlePetPet = (petName: PetName) => {
    gameService.send("pet.pet", { pet: petName });
  };

  const handleFetchPet = (petName: PetName, fetch: PetResourceName) => {
    gameService.send("pet.fetched", { pet: petName, fetch });
  };

  const handleFoodHover = (food: CookableName, event: React.MouseEvent) => {
    setHoveredFood(food);
    setTooltipPosition(calculateTooltipPosition(event.currentTarget));
  };

  const handleFetchHover = (
    fetch: PetResourceName,
    event: React.MouseEvent,
  ) => {
    setHoveredFetch(fetch);
    setTooltipPosition(calculateTooltipPosition(event.currentTarget));
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

      const isFoodLocked = !getPetFoodRequests(pet).includes(food);

      const isDisabled = !canFeed || alreadyFed || isFoodLocked;
      const baseFoodXP = getPetRequestXP(food);
      const foodXP = getPetExperience({
        basePetXP: baseFoodXP,
        game: state,
      });
      const foodEnergy = getPetEnergy({
        petData: pet,
        basePetEnergy: baseFoodXP,
      });

      return {
        food,
        foodImage,
        canFeed,
        foodCount,
        alreadyFed,
        isSelected,
        isDisabled,
        foodXP,
        foodEnergy,
        isFoodLocked,
      };
    });
  }, [pet, inventory, isBulkFeed, selectedFeed, state, petName]);
  const fetchData = getPetFetches(petName);
  const { level } = getPetLevel(pet.experience);

  const fetchItems = useMemo(() => {
    return fetchData.fetches.map((fetch) => {
      const hasRequiredLevel = level >= fetch.level;
      const fetchImage = ITEM_DETAILS[fetch.name].image;
      const energyRequired = PET_RESOURCES[fetch.name].energy;
      const hasEnoughEnergy = pet.energy >= energyRequired;
      const isDisabled = !hasRequiredLevel || !hasEnoughEnergy;
      return {
        fetch,
        isDisabled,
        fetchImage,
        energyRequired,
        hasRequiredLevel,
        hasEnoughEnergy,
      };
    });
  }, [fetchData.fetches, level, pet.energy]);

  return (
    <PetInfo petName={petName} pet={pet}>
      <PetCardContent
        pet={pet}
        foodItems={foodItems}
        handleFoodHover={handleFoodHover}
        setHoveredFood={setHoveredFood}
        handleRemoveFromSelection={handleRemoveFromSelection}
        handleFeedPet={handleFeedPet}
        hoveredFood={hoveredFood}
        handleNeglectPet={handleNeglectPet}
        handlePetPet={handlePetPet}
        tooltipPosition={tooltipPosition}
        handleFetchPet={handleFetchPet}
        fetchItems={fetchItems}
        handleFetchHover={handleFetchHover}
        setHoveredFetch={setHoveredFetch}
        hoveredFetch={hoveredFetch}
        isHoundShrineActive={isHoundShrineActive}
      />
    </PetInfo>
  );
};

// Shared tooltip calculation to keep identical behavior for hover tooltips
const calculateTooltipPosition = (
  target: Element,
): { x: number; y: number } => {
  const rect = target.getBoundingClientRect();
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

  return { x, y };
};

// Generic grid item to render food/fetch tiles with identical styling
const GridItem: React.FC<{
  keyName: string;
  imageSrc: string;
  disabled: boolean;
  onClick?: () => void;
  onMouseEnter: (e: React.MouseEvent) => void;
  onMouseLeave: () => void;
  count?: Decimal;
  showConfirm?: boolean;
  bottomLabels?: {
    labelType: LabelType;
    icon: string;
    value: number;
    secondaryIcon?: string;
  }[];
  isHovered: boolean;
}> = ({
  keyName,
  imageSrc,
  disabled,
  onClick,
  onMouseEnter,
  onMouseLeave,
  count,
  showConfirm,
  bottomLabels,
  isHovered,
}) => {
  return (
    <div className="flex flex-col items-center space-x-2 w-16">
      <div className="relative">
        <div onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
          <Button
            disabled={disabled}
            onClick={onClick}
            className={`w-12 h-12 p-1`}
          >
            <img
              src={imageSrc}
              alt={keyName}
              className="w-[85%] h-[85%] object-contain"
            />
          </Button>
        </div>
        {showConfirm && (
          <img
            src={SUNNYSIDE.icons.confirm}
            className="absolute top-[-0.25rem] right-[-0.25rem] w-5 h-5"
          />
        )}
        {count && count.greaterThan(0) && (
          <Label
            type="default"
            className="absolute top-[-0.75rem] left-[-0.75rem]"
          >
            {isHovered ? count.toString() : shortenCount(count)}
          </Label>
        )}
      </div>
      <div className="flex flex-col gap-1">
        {bottomLabels &&
          bottomLabels.map((label) => (
            <Label
              key={label.value}
              type={label.labelType}
              icon={label.icon}
              secondaryIcon={label.secondaryIcon}
            >
              {label.value}
            </Label>
          ))}
      </div>
    </div>
  );
};

// Shared tooltip overlay renderer
const TooltipOverlay: React.FC<{
  itemName: CookableName | PetResourceName | null;
  position: { x: number; y: number };
}> = ({ itemName, position }) => {
  if (!itemName) return null;
  return (
    <div
      className="fixed pointer-events-none z-50"
      style={{
        left: position.x,
        top: position.y,
        transform: "translateX(-50%)",
      }}
    >
      <InnerPanel className="whitespace-nowrap max-w-[200px]">
        <div className="flex items-center gap-2 p-1">
          <img
            src={ITEM_DETAILS[itemName].image}
            alt={itemName}
            className="w-6 h-6 object-contain flex-shrink-0"
          />
          <span className="text-xs capitalize break-words">{itemName}</span>
        </div>
      </InnerPanel>
    </div>
  );
};

export const PetCardContent: React.FC<{
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
    foodEnergy: number;
    isFoodLocked: boolean;
  }[];
  fetchItems: {
    fetch: {
      name: PetResourceName;
      level: number;
    };
    isDisabled: boolean;
    fetchImage: string;
    energyRequired: number;
    hasRequiredLevel: boolean;
    hasEnoughEnergy: boolean;
  }[];
  handleFoodHover: (food: CookableName, event: React.MouseEvent) => void;
  handleFetchHover: (fetch: PetResourceName, event: React.MouseEvent) => void;
  setHoveredFood: (food: CookableName | null) => void;
  setHoveredFetch: (fetch: PetResourceName | null) => void;
  handleRemoveFromSelection: (food: CookableName) => void;
  handleFeedPet: (food: CookableName) => void;
  hoveredFood: CookableName | null;
  hoveredFetch: PetResourceName | null;
  handleNeglectPet: (petName: PetName) => void;
  handlePetPet: (petName: PetName) => void;
  tooltipPosition: { x: number; y: number };
  handleFetchPet: (petName: PetName, fetch: PetResourceName) => void;
  isHoundShrineActive: boolean;
}> = ({
  pet,
  foodItems,
  fetchItems,
  handleFoodHover,
  setHoveredFood,
  handleRemoveFromSelection,
  handleFeedPet,
  hoveredFood,
  hoveredFetch,
  handleNeglectPet,
  handlePetPet,
  tooltipPosition,
  handleFetchPet,
  handleFetchHover,
  setHoveredFetch,
  isHoundShrineActive,
}) => {
  const { t } = useAppTranslation();

  if (isPetNapping(pet)) {
    return (
      <div className="flex flex-col gap-1 w-3/4 sm:w-auto">
        <Label type={"warning"}>{t("pets.napping")}</Label>
        <p className="text-xs p-1">
          {t("pets.nappingDescription", { pet: pet.name })}
        </p>
        <Label type="success" secondaryIcon={xpIcon}>{`+10`}</Label>
        <Button onClick={() => handlePetPet(pet.name)}>
          {t("pets.petPet", { pet: pet.name })}
        </Button>
      </div>
    );
  }

  if (isPetNeglected(pet)) {
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
    <div className="flex flex-col gap-2 w-2/3 sm:w-auto">
      <div className="flex flex-col gap-4">
        <Label type={"default"}>{`Food Requests`}</Label>
        <div className="flex flex-wrap gap-1 ml-2">
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
              foodEnergy,
              isFoodLocked,
            }) => (
              <GridItem
                key={food}
                keyName={food}
                imageSrc={
                  isFoodLocked ? SUNNYSIDE.icons.expression_confused : foodImage
                }
                disabled={isDisabled}
                onClick={
                  isDisabled
                    ? undefined
                    : isSelected
                      ? () => handleRemoveFromSelection(food)
                      : () => handleFeedPet(food)
                }
                onMouseEnter={(e) =>
                  isFoodLocked ? undefined : handleFoodHover(food, e)
                }
                onMouseLeave={() =>
                  isFoodLocked ? undefined : setHoveredFood(null)
                }
                count={isFoodLocked ? undefined : foodCount}
                showConfirm={alreadyFed || isSelected}
                bottomLabels={
                  isFoodLocked
                    ? [
                        {
                          labelType: "formula",
                          icon: SUNNYSIDE.icons.lock,
                          value: foodXP,
                        },
                      ]
                    : [
                        {
                          labelType: "info",
                          icon: xpIcon,
                          value: foodXP,
                          secondaryIcon: isHoundShrineActive
                            ? powerupIcon
                            : undefined,
                        },
                        {
                          labelType: "success",
                          icon: SUNNYSIDE.icons.lightning,
                          value: foodEnergy,
                        },
                      ]
                }
                isHovered={hoveredFood === food}
              />
            ),
          )}
        </div>
        {/* Food Tooltip Overlay */}
        <TooltipOverlay itemName={hoveredFood} position={tooltipPosition} />
      </div>

      <div className="flex flex-col gap-4">
        <Label type={"default"}>{`Fetches`}</Label>
        <div className="flex flex-wrap gap-1 ml-2">
          {fetchItems.map(
            ({
              fetch,
              isDisabled,
              fetchImage,
              energyRequired,
              hasRequiredLevel,
              hasEnoughEnergy,
            }) => (
              <GridItem
                key={fetch.name}
                keyName={fetch.name}
                imageSrc={fetchImage}
                disabled={isDisabled}
                onClick={() => handleFetchPet(pet.name, fetch.name)}
                onMouseEnter={(e) => handleFetchHover(fetch.name, e)}
                onMouseLeave={() => setHoveredFetch(null)}
                showConfirm={false}
                bottomLabels={[
                  {
                    labelType: !hasRequiredLevel
                      ? "formula"
                      : !hasEnoughEnergy
                        ? "danger"
                        : "default",
                    icon: hasRequiredLevel
                      ? SUNNYSIDE.icons.lightning
                      : SUNNYSIDE.icons.lock,
                    value: energyRequired,
                  },
                ]}
                isHovered={hoveredFetch === fetch.name}
              />
            ),
          )}
        </div>
        {/* Fetch Tooltip Overlay */}
        <TooltipOverlay itemName={hoveredFetch} position={tooltipPosition} />
      </div>
    </div>
  );
};
