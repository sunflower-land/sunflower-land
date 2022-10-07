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
  const buildingLevels = BUILDINGS[building].unlocksAtLevels;

  const cantBuild = (building: BuildingName) => {
    const missingIngredients = BUILDINGS[building].ingredients.some(
      (ingredient) => {
        const inventoryAmount =
          inventory[ingredient.item]?.toDecimalPlaces(1) || 0;
        const requiredAmount = ingredient.amount?.toDecimalPlaces(1);

        return new Decimal(inventoryAmount).lessThan(requiredAmount);
      }
    );

    const missingBalance = BUILDINGS[building].sfl > state.balance;

    return missingIngredients && missingBalance;
  };

  const bumpkinLevel = getBumpkinLevel(bumpkin?.experience ?? 0);
  const showNextRequiredLevel = (nextLockedLevel: number): boolean => {
    const nextLockedLevelIndex = buildingLevels.indexOf(nextLockedLevel);
    const buildingsUserHas = inventory[building]?.toNumber() ?? 0;
    return buildingsUserHas >= nextLockedLevelIndex;
  };
  const nextLockedLevel =
    buildingLevels.find((level) => level > bumpkinLevel) ?? buildingLevels[0];

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
            {BUILDINGS[building].ingredients.map((ingredient, index) => {
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
            {!!BUILDINGS[building].sfl.toNumber() && (
              <div className="flex justify-center items-end">
                <img src={token} className="h-5 mr-1" />
                <span
                  className={classNames(
                    "text-xs text-shadow text-center mt-2 ",
                    {
                      "text-red-500": state.balance.lessThan(
                        BUILDINGS[building].sfl
                      ),
                    }
                  )}
                >
                  {BUILDINGS[building].sfl.toNumber()}
                </span>
              </div>
            )}
            <div className="flex justify-center items-end">
              <img src={timer} className="h-5 mr-1" />
              <span
                className={classNames("text-xs text-shadow text-center mt-2 ")}
              >
                {secondsToString(BUILDINGS[building].constructionSeconds)}
              </span>
            </div>
          </div>

          {!bumpkin || showNextRequiredLevel(nextLockedLevel) ? (
            <div className="flex items-center">
              <span
                className="bg-error border text-xxs p-1 rounded-md"
                style={{ lineHeight: "10px" }}
              >
                Lvl {nextLockedLevel} Required
              </span>

              <img src={lock} className="h-4 ml-1" />
            </div>
          ) : (
            <Button
              onClick={() => onBuild(building)}
              disabled={cantBuild(building)}
            >
              Build
            </Button>
          )}
        </div>
      </OuterPanel>
    </div>
  );
};
