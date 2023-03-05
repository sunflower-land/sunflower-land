import { OuterPanel } from "components/ui/Panel";
import React from "react";

import { ITEM_DETAILS } from "features/game/types/images";
import Decimal from "decimal.js-light";
import classNames from "classnames";
import { secondsToString } from "lib/utils/time";

import token from "assets/icons/token_2.png";
import lock from "assets/skills/lock.png";
import { Button } from "components/ui/Button";
import { BuildingName, BUILDINGS } from "features/game/types/buildings";
import { GameState, InventoryItemName } from "features/game/types/game";
import { getBumpkinLevel } from "features/game/lib/level";
import { COOKABLES } from "features/game/types/consumables";
import { getKeys } from "features/game/types/craftables";
import { WORKBENCH_TOOLS } from "features/game/types/tools";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { SEEDS } from "features/game/types/seeds";
import { Label } from "components/ui/Label";
import { SUNNYSIDE } from "assets/sunnyside";

export const UNLOCKABLES: Record<BuildingName, InventoryItemName[]> = {
  "Fire Pit": getKeys(COOKABLES).filter(
    (name) => COOKABLES[name].building === "Fire Pit"
  ),
  Kitchen: getKeys(COOKABLES).filter(
    (name) => COOKABLES[name].building === "Kitchen"
  ),
  Bakery: getKeys(COOKABLES).filter(
    (name) => COOKABLES[name].building === "Bakery"
  ),
  Deli: getKeys(COOKABLES).filter(
    (name) => COOKABLES[name].building === "Deli"
  ),
  "Smoothie Shack": getKeys(COOKABLES).filter(
    (name) => COOKABLES[name].building === "Smoothie Shack"
  ),
  Workbench: getKeys(WORKBENCH_TOOLS()),
  "Hen House": ["Chicken", "Egg"],
  "Water Well": [],
  Market: getKeys(SEEDS()),
  Tent: [],
};

interface Props {
  state: GameState;
  buildingName: BuildingName;
  hasUnplaced: boolean;
  onBack: () => void;
  onBuild: (buildingName: BuildingName) => void;
}

export const DetailView: React.FC<Props> = ({
  state,
  buildingName,
  hasUnplaced,
  onBack,
  onBuild,
}) => {
  const { bumpkin, inventory } = state;
  const buildingBluePrints = BUILDINGS()[buildingName];
  const buildingUnlockLevels = buildingBluePrints.map(
    ({ unlocksAtLevel }) => unlocksAtLevel
  );

  const bumpkinLevel = getBumpkinLevel(bumpkin?.experience ?? 0);

  // Holds how many desired placed buildings (e.g. water wells)
  const buildingsPlaced = new Decimal(
    state.buildings[buildingName]?.length || 0
  );
  // Total number of this building in players inventory.
  const buildingsInInventory = inventory[buildingName] || new Decimal(0);
  // true, if any of these buildings are unplaced
  const hasUnplacedBuildings = buildingsInInventory
    .minus(1)
    .greaterThanOrEqualTo(buildingsPlaced);
  // Total number of buildings allowed at the current bumpkin level.
  const allowedBuildings = buildingUnlockLevels.filter(
    (level) => bumpkinLevel >= level
  ).length;
  // Next level of building user is yet to unlock.
  // If undefined then player has unlocked all levels for this building.
  const nextLockedLevel = buildingUnlockLevels.find(
    (level) => level > bumpkinLevel
  );
  // true, if player has unlocked all the levels and all buildings are placed.
  const allBuildingsPlaced =
    !nextLockedLevel && buildingsPlaced.greaterThanOrEqualTo(allowedBuildings);

  // Index for building details
  const buildingNumber = buildingsPlaced.toNumber();

  const buildingToConstruct = buildingBluePrints[buildingNumber];

  /**
   * @function showBuildButton This function will return true if the player has not completed all the buildings
   *                            for the unlocked level. E.g. if the player has unlocked 2 levels of the building then
   *                            he would need to construct 2 buildings on the farm to reach to the next level. If he
   *                            has not constructed 2 buildings then we need to show him the build button, if yes then
   *                            we need to show him the 'Level X required' label.
   * @param unlockedLevel The level of the building which the player has already unlocked.
   * @returns Boolean
   */
  const showBuildButton = (): boolean => {
    return buildingsPlaced.lessThan(allowedBuildings);
  };

  const canBuild = () => {
    if (hasUnplacedBuildings) return true;

    const hasBalance = state.balance.greaterThanOrEqualTo(
      buildingToConstruct.sfl
    );

    if (buildingToConstruct.ingredients.length === 0) return hasBalance;

    const hasIngredients = buildingToConstruct.ingredients.every(
      (ingredient) => {
        const inventoryAmount = inventory[ingredient.item] || new Decimal(0);
        const requiredAmount = ingredient.amount;

        return new Decimal(inventoryAmount).greaterThanOrEqualTo(
          requiredAmount
        );
      }
    );

    return hasIngredients && hasBalance;
  };

  const showIngredients = () => {
    if (!buildingToConstruct.ingredients.length && !buildingToConstruct.sfl) {
      return null;
    }

    return (
      <div className="border-t border-white w-full mt-2 pt-1 mb-2 text-center">
        {buildingToConstruct.ingredients.map((ingredient, index) => {
          const item = ITEM_DETAILS[ingredient.item];
          const inventoryAmount =
            inventory[ingredient.item]?.toDecimalPlaces(1) || 0;
          const requiredAmount = ingredient.amount?.toDecimalPlaces(1);

          const insufficientIngredients = new Decimal(inventoryAmount).lessThan(
            requiredAmount
          );

          return (
            <div
              className="flex justify-center flex-wrap items-end"
              key={index}
            >
              <img src={item.image} className="h-5 me-2" />
              {insufficientIngredients ? (
                <>
                  <span className="text-xs text-center mt-2 text-red-500">
                    {`${inventoryAmount}`}
                  </span>
                  <span className="text-xs text-center mt-2 text-red-500">
                    {`/${requiredAmount}`}
                  </span>
                </>
              ) : (
                <span className="text-xs text-center mt-2">
                  {`${requiredAmount}`}
                </span>
              )}
            </div>
          );
        })}
        {!!buildingToConstruct.sfl.toNumber() && (
          <div className="flex justify-center items-end">
            <img src={token} className="h-5 mr-1" />
            <span
              className={classNames("text-xs text-center mt-2 ", {
                "text-red-500": state.balance.lessThan(buildingToConstruct.sfl),
              })}
            >
              {buildingToConstruct.sfl.toNumber()}
            </span>
          </div>
        )}
        <div className="flex justify-center items-end">
          <img src={SUNNYSIDE.icons.stopwatch} className="h-5 mr-1" />
          <span className={classNames("text-xs text-shadow text-center mt-2 ")}>
            {secondsToString(buildingToConstruct.constructionSeconds, {
              length: "medium",
              removeTrailingZeros: true,
            })}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="flex">
      <OuterPanel className="flex-1 min-w-[42%] flex flex-col justify-between items-center">
        <div className="flex flex-col justify-center items-center p-2 relative w-full">
          <img
            src={SUNNYSIDE.icons.arrow_left}
            className="absolute cursor-pointer"
            style={{
              top: `${PIXEL_SCALE * 2}px`,
              left: `${PIXEL_SCALE * 2}px`,
              width: `${PIXEL_SCALE * 11}px`,
            }}
            alt="back"
            onClick={onBack}
          />
          <span className="mb-3 text-center sm:text-lg">{buildingName}</span>
          <img
            src={ITEM_DETAILS[buildingName].image}
            className="h-16 img-highlight mt-1 mb-2"
          />
          <span className="text-center my-2 sm:text-sm">
            {ITEM_DETAILS[buildingName].description}
          </span>

          <div className="flex flex-wrap justify-center">
            {UNLOCKABLES[buildingName].map((name) => (
              <img
                key={name}
                src={ITEM_DETAILS[name].image}
                className="h-6 mr-2 mt-1"
              />
            ))}
          </div>
          {!hasUnplacedBuildings && !allBuildingsPlaced && showIngredients()}
        </div>
        {/**
         * Do not show anything: if all the buildings have been completed OR there is no bumpkin.
         * Show build button: If the user has not reach the building limit for that unlocked level.
         * Show label: When the user has not unlocked any level OR when the user has unlocked a level but has completed all the buildings for that level.
         */}
        {!allBuildingsPlaced && bumpkin && (
          <div className="mt-2 w-full">
            {showBuildButton() ? (
              <Button
                onClick={() => onBuild(buildingName)}
                disabled={!canBuild()}
              >
                {hasUnplaced ? "Place" : "Build"}
              </Button>
            ) : (
              <div className="flex items-center justify-center">
                <Label type="danger">Lvl {nextLockedLevel} Required</Label>

                <img src={lock} className="h-4 ml-1" />
              </div>
            )}
          </div>
        )}
      </OuterPanel>
    </div>
  );
};
