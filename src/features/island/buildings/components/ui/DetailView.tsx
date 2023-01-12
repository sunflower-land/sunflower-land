import { OuterPanel } from "components/ui/Panel";
import React from "react";
import { ITEM_DETAILS } from "features/game/types/images";
import Decimal from "decimal.js-light";
import leftArrow from "assets/icons/arrow_left.png";
import lock from "assets/skills/lock.png";
import { Button } from "components/ui/Button";
import { BuildingName, BUILDINGS } from "features/game/types/buildings";
import { GameState, InventoryItemName } from "features/game/types/game";
import { getBumpkinLevel } from "features/game/lib/level";
import { CONSUMABLES } from "features/game/types/consumables";
import { getKeys } from "features/game/types/craftables";
import { WORKBENCH_TOOLS } from "features/game/types/tools";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { SEEDS } from "features/game/types/seeds";
import { Label } from "components/ui/Label";
import { SquareIcon } from "components/ui/SquareIcon";
import { RequirementLabel } from "components/ui/RequirementLabel";

export const UNLOCKABLES: Record<BuildingName, InventoryItemName[]> = {
  "Fire Pit": getKeys(CONSUMABLES).filter(
    (name) => CONSUMABLES[name].building === "Fire Pit"
  ),
  Kitchen: getKeys(CONSUMABLES).filter(
    (name) => CONSUMABLES[name].building === "Kitchen"
  ),
  Bakery: getKeys(CONSUMABLES).filter(
    (name) => CONSUMABLES[name].building === "Bakery"
  ),
  Deli: getKeys(CONSUMABLES).filter(
    (name) => CONSUMABLES[name].building === "Deli"
  ),
  "Smoothie Shack": getKeys(CONSUMABLES).filter(
    (name) => CONSUMABLES[name].building === "Smoothie Shack"
  ),
  Workbench: getKeys(WORKBENCH_TOOLS),
  "Hen House": ["Chicken", "Egg"],
  "Water Well": [],
  Market: getKeys(SEEDS()),
  Tent: [],
};

interface Props {
  state: GameState;
  building: BuildingName;
  hasUnplaced: boolean;
  onBack: () => void;
  onBuild: (buildingName: BuildingName) => void;
}

export const DetailView: React.FC<Props> = ({
  state,
  building,
  hasUnplaced,
  onBack,
  onBuild,
}) => {
  const { bumpkin, inventory } = state;
  const sflRequirement = BUILDINGS()[building].sfl;
  const buildingLevels = BUILDINGS()[building].unlocksAtLevels;

  const canBuild = (building: BuildingName) => {
    const hasIngredients = BUILDINGS()[building].ingredients.every(
      (ingredient) => {
        const inventoryAmount = inventory[ingredient.item] || new Decimal(0);
        const requiredAmount = ingredient.amount;

        return new Decimal(inventoryAmount).greaterThanOrEqualTo(
          requiredAmount
        );
      }
    );

    const hasBalance = state.balance.greaterThanOrEqualTo(sflRequirement);

    return hasUnplacedBuildings || (hasIngredients && hasBalance);
  };

  const bumpkinLevel = getBumpkinLevel(bumpkin?.experience ?? 0);

  // Holds how many desired placed buildings (e.g. water wells)
  const buildingsPlaced = new Decimal(state.buildings[building]?.length || 0);
  // Holds how many desired buildings (e.g. water wells) does the user currently has in the inventory.
  const buildingsInInventory = inventory[building] || new Decimal(0);
  // true, if users has unplaced buildings from their inventory
  const hasUnplacedBuildings = buildingsInInventory
    .minus(1)
    .greaterThanOrEqualTo(buildingsPlaced);
  // Holds how many allowed buildings the user can place on the island at the current level.
  const allowedBuildings = buildingLevels.filter(
    (level) => bumpkinLevel >= level
  ).length;
  // Whats the next level of the desired building (e.g. water wells), user is yet to unlock.
  // If this is undefined then that means the user has unlocked all the levels of the building.
  const nextLockedLevel = buildingLevels.find((level) => level > bumpkinLevel);
  // true, if the user has user has unlocked all the levels and completed all the buildings.
  const allBuildingsBuilt =
    !nextLockedLevel && buildingsPlaced.greaterThanOrEqualTo(allowedBuildings);

  /**
   * This will return true if the user has not completed all the buildings
   * for the unlocked level. E.g. if the user has unlocked 2 levels of the building then
   * he would need to construct 2 buildings on the farm to reach to the next level. If he
   * has not constructed 2 buildings then we need to show him the build button, if yes then
   * we need to show him the 'Level X required' label.
   */
  const showBuildButton = buildingsPlaced.lessThan(allowedBuildings);

  const showIngredients = () => (
    <div className="border-t border-white w-full my-2 pt-2 flex justify-between sm:flex-col gap-x-3 gap-y-2 sm:items-center flex-wrap sm:flex-nowrap">
      {BUILDINGS()[building].ingredients.map((ingredient, index) => (
        <RequirementLabel
          key={index}
          type="item"
          item={ingredient.item}
          balance={inventory[ingredient.item] || new Decimal(0)}
          requirement={ingredient.amount || new Decimal(0)}
        />
      ))}
      {sflRequirement.greaterThan(0) && (
        <RequirementLabel
          type="sfl"
          balance={state.balance}
          requirement={sflRequirement}
        />
      )}
      <RequirementLabel
        type="time"
        waitSeconds={BUILDINGS()[building].constructionSeconds}
      />
    </div>
  );

  return (
    <div className="flex">
      <OuterPanel className="flex-1 flex flex-col justify-between items-center">
        <div className="flex flex-col justify-center items-center p-2 pb-0 relative w-full">
          <img
            src={leftArrow}
            className="absolute cursor-pointer"
            style={{
              top: `${PIXEL_SCALE * 2}px`,
              left: `${PIXEL_SCALE * 2}px`,
              width: `${PIXEL_SCALE * 11}px`,
            }}
            alt="back"
            onClick={onBack}
          />
          <span className="mb-3 text-center">{building}</span>
          <img
            src={ITEM_DETAILS[building].image}
            className="h-16 img-highlight mt-1 mb-2"
          />
          <span className="text-center my-2 text-xs">
            {ITEM_DETAILS[building].description}
          </span>

          <div className="flex flex-wrap justify-center">
            {UNLOCKABLES[building].map((name) => (
              <img
                key={name}
                src={ITEM_DETAILS[name].image}
                className="h-6 mr-2 mt-1"
              />
            ))}
          </div>
          {!hasUnplacedBuildings && showIngredients()}
          {/**
           * Do not show anything: if all the buildings have been completed OR there is no bumpkin.
           * Show build button: If the user has not reach the building limit for that unlocked level.
           * Show label: When the user has not unlocked any level OR when the user has unlocked a level but has completed all the buildings for that level.
           */}
        </div>
        {!allBuildingsBuilt && bumpkin && (
          <div className="mt-2 w-full">
            {showBuildButton ? (
              <Button
                onClick={() => onBuild(building)}
                disabled={!canBuild(building)}
              >
                {hasUnplaced ? "Place" : "Build"}
              </Button>
            ) : (
              <div className="flex items-center justify-center">
                <Label type="danger" className="mr-1">
                  Level {nextLockedLevel} Required
                </Label>
                <SquareIcon icon={lock} width={7} />
              </div>
            )}
          </div>
        )}
      </OuterPanel>
    </div>
  );
};
