import { OuterPanel } from "components/ui/Panel";
import React from "react";

import { ITEM_DETAILS } from "features/game/types/images";
import Decimal from "decimal.js-light";
import classNames from "classnames";
import { secondsToString } from "lib/utils/time";
import leftArrow from "assets/icons/arrow_left.png";

import token from "assets/icons/token_2.png";
import timer from "assets/icons/timer.png";
import lock from "assets/skills/lock.png";
import { Button } from "components/ui/Button";
import { BuildingName, BUILDINGS } from "features/game/types/buildings";
import { GameState } from "features/game/types/game";
import { getBumpkinLevel } from "features/game/lib/level";

interface Props {
  state: GameState;
  building: BuildingName;
  onBack: () => void;
  onBuild: (buildingName: BuildingName) => void;
}

export const DetailView: React.FC<Props> = ({
  state,
  building,
  onBack,
  onBuild,
}) => {
  const { bumpkin, inventory } = state;
  const buildingLevels = BUILDINGS()[building].unlocksAtLevels;

  const cantBuild = (building: BuildingName) => {
    const missingIngredients = BUILDINGS()[building].ingredients.some(
      (ingredient) => {
        const inventoryAmount =
          inventory[ingredient.item]?.toDecimalPlaces(1) || 0;
        const requiredAmount = ingredient.amount?.toDecimalPlaces(1);

        return new Decimal(inventoryAmount).lessThan(requiredAmount);
      }
    );

    const missingBalance = BUILDINGS()[building].sfl > state.balance;

    return missingIngredients && missingBalance;
  };

  const bumpkinLevel = getBumpkinLevel(bumpkin?.experience ?? 0);

  //Holds how many desired buildings (e.g. water wells) does the user currently has.
  const buildingsUserHas = inventory[building]?.toNumber() ?? 0;
  // What level of the desired building (e.g. water wells) has the user already unlocked.
  // If this is undefined then that means the user has not unlocked any level of the building.
  const unlockedLevel = buildingLevels.find((level) => bumpkinLevel >= level);
  // Whats the next level of the desired building (e.g. water wells), user is yet to unlock.
  // If this is undefined then that means the user has unlocked all the levels of the building.
  const nextLockedLevel = buildingLevels.find((level) => level > bumpkinLevel);
  // true, if the user has user has unlocked all the levels and completed all the buildings.
  const allBuildingsBuilt =
    !nextLockedLevel && buildingsUserHas === buildingLevels.length;

  /**
   * @function showBuildButton This function will return true if the user has not completed all the buildings
   *                            for the unlocked level. E.g. if the user has unlocked 2 levels of the building then
   *                            he would need to construct 2 buildings on the farm to reach to the next level. If he
   *                            has not constructed 2 buildings then we need to show him the build button, if yes then
   *                            we need to show him the 'Level X required' label.
   * @param unlockedLevel The level of the building which the user has already unlocked.
   * @returns Boolean
   */
  const showBuildButton = (unlockedLevel: number): boolean => {
    // Array index starts from zero which is why we are adding 1 to get the required number of buildings against a level.
    const buildingsRequired = buildingLevels.indexOf(unlockedLevel) + 1;
    return buildingsUserHas < buildingsRequired;
  };

  return (
    <div className="flex">
      <OuterPanel className="flex-1 min-w-[42%] flex flex-col justify-between items-center">
        <div className="flex flex-col justify-center items-center p-2 relative w-full">
          <img
            src={leftArrow}
            className="self-start w-5 cursor-pointer top-3 right-96"
            alt="back"
            onClick={onBack}
          />
          <span className="text-shadow mb-3 text-center sm:text-lg">
            {building}
          </span>
          <img
            src={ITEM_DETAILS[building].image}
            className="h-16 img-highlight mt-1 mb-2"
          />
          <span className="text-shadow text-center mt-2 sm:text-sm">
            {ITEM_DETAILS[building].description}
          </span>

          <div className="border-t border-white w-full mt-2 pt-1 mb-2 text-center">
            {BUILDINGS()[building].ingredients.map((ingredient, index) => {
              const item = ITEM_DETAILS[ingredient.item];
              const inventoryAmount =
                inventory[ingredient.item]?.toDecimalPlaces(1) || 0;
              const requiredAmount = ingredient.amount?.toDecimalPlaces(1);

              const insufficientIngredients = new Decimal(
                inventoryAmount
              ).lessThan(requiredAmount);

              return (
                <div
                  className="flex justify-center flex-wrap items-end"
                  key={index}
                >
                  <img src={item.image} className="h-5 me-2" />
                  {insufficientIngredients ? (
                    <>
                      <span className="text-xs text-shadow text-center mt-2 text-red-500">
                        {`${inventoryAmount}`}
                      </span>
                      <span className="text-xs text-shadow text-center mt-2 text-red-500">
                        {`/${requiredAmount}`}
                      </span>
                    </>
                  ) : (
                    <span className="text-xs text-shadow text-center mt-2">
                      {`${requiredAmount}`}
                    </span>
                  )}
                </div>
              );
            })}
            {!!BUILDINGS()[building].sfl.toNumber() && (
              <div className="flex justify-center items-end">
                <img src={token} className="h-5 mr-1" />
                <span
                  className={classNames(
                    "text-xs text-shadow text-center mt-2 ",
                    {
                      "text-red-500": state.balance.lessThan(
                        BUILDINGS()[building].sfl
                      ),
                    }
                  )}
                >
                  {BUILDINGS()[building].sfl.toNumber()}
                </span>
              </div>
            )}
            <div className="flex justify-center items-end">
              <img src={timer} className="h-5 mr-1" />
              <span
                className={classNames("text-xs text-shadow text-center mt-2 ")}
              >
                {secondsToString(BUILDINGS()[building].constructionSeconds)}
              </span>
            </div>
          </div>
          {/**
           * Do not show anything: if all the levels have been locked AND all the buildings have been completed AND there is no bumpkin.
           * Show build button: If a level has been unlocked AND the user has not completed all the buildings required against that unlocked level.
           * Show label: When the user has not unlocked any level OR when the user has unlocked a level but has completed all the buildings against that level.
           */}
          {!allBuildingsBuilt && bumpkin && (
            <>
              {unlockedLevel && showBuildButton(unlockedLevel) ? (
                <Button
                  onClick={() => onBuild(building)}
                  disabled={cantBuild(building)}
                >
                  Build
                </Button>
              ) : (
                <div className="flex items-center">
                  <span
                    className="bg-error border text-xxs p-1 rounded-md"
                    style={{ lineHeight: "10px" }}
                  >
                    Lvl {nextLockedLevel} Required
                  </span>

                  <img src={lock} className="h-4 ml-1" />
                </div>
              )}
            </>
          )}
        </div>
      </OuterPanel>
    </div>
  );
};
