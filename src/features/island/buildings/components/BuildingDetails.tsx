import { OuterPanel } from "components/ui/Panel";
import React, { useContext, useState } from "react";

import { getKeys } from "features/game/types/craftables";
import { ITEM_DETAILS } from "features/game/types/images";
import Decimal from "decimal.js-light";
import classNames from "classnames";
import { secondsToString } from "lib/utils/time";
import leftArrow from "assets/icons/arrow_left.png";

import token from "assets/icons/token.gif";
import timer from "assets/icons/timer.png";
import lock from "assets/skills/lock.png";
import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";
import { useActor } from "@xstate/react";
import { Context } from "features/game/GameProvider";
import { BuildingName, BUILDINGS } from "features/game/types/buildings";

export const BuildingDetails: React.FC = () => {
  const { gameService } = useContext(Context);
  const [game] = useActor(gameService);
  const [selected, setSelected] = useState<BuildingName | null>(null);

  const state = game.context.state;
  const bumpkinLevel = state.bumpkin.level;
  const inventory = game.context.state.inventory;

  const buildings = getKeys(BUILDINGS).sort((a, b) =>
    BUILDINGS[a].levelRequired > BUILDINGS[b].levelRequired ? 1 : -1
  );

  const handleClick = (buildingName: BuildingName) => {
    setSelected(buildingName);
  };

  const canBuild = (building: BuildingName) => {
    const missingIngredientes = BUILDINGS[building].ingredients.some(
      (ingredient) => {
        const inventoryAmount =
          inventory[ingredient.item]?.toDecimalPlaces(1) || 0;
        const requiredAmount = ingredient.amount?.toDecimalPlaces(1);

        return new Decimal(inventoryAmount).lessThan(requiredAmount);
      }
    );

    const missinBalance = BUILDINGS[building].sfl > state.balance;

    return missingIngredientes && missinBalance;
  };

  if (!selected) {
    return (
      <div className="w-full pr-2 pt-2.5">
        {buildings.map((buildingName, index) => (
          <div key={index} onClick={() => handleClick(buildingName)}>
            <OuterPanel className="flex relative items-center py-2 mb-1 cursor-pointer hover:bg-brown-200">
              <Label className="px-1 text-xxs absolute -top-3 -right-1">
                {state.inventory[buildingName]?.toNumber() || 0}/1
              </Label>
              <div className="w-16 justify-center flex">
                <img src={ITEM_DETAILS[buildingName].image} className="h-12" />
              </div>

              <div className="flex-1 flex flex-col justify-center">
                <span className="text-sm">{buildingName}</span>

                {bumpkinLevel < BUILDINGS[buildingName].levelRequired ? (
                  <div className="flex items-center">
                    <span
                      className="bg-error border text-xxs p-1 rounded-md"
                      style={{ lineHeight: "10px" }}
                    >
                      Lvl {BUILDINGS[buildingName].levelRequired}
                    </span>

                    <img src={lock} className="h-4 ml-1" />
                  </div>
                ) : (
                  <span className="text-xxs pr-0.5">
                    Lvl {BUILDINGS[buildingName].levelRequired}
                  </span>
                )}
              </div>
            </OuterPanel>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex">
      <OuterPanel className="flex-1 min-w-[42%] flex flex-col justify-between items-center">
        <div className="flex flex-col justify-center items-center p-2 relative w-full">
          <img
            src={leftArrow}
            className="self-start w-5 cursor-pointer top-3 right-96"
            alt="back"
            onClick={() => setSelected(null)}
          />
          <span className="text-shadow mb-3 text-center sm:text-lg">
            {selected}
          </span>
          <img
            src={ITEM_DETAILS[selected].image}
            className="h-16 img-highlight mt-1 mb-2"
          />
          <span className="text-shadow text-center mt-2 sm:text-sm">
            {ITEM_DETAILS[selected].description}
          </span>

          <div className="border-t border-white w-full mt-2 pt-1 mb-2 text-center">
            {BUILDINGS[selected].ingredients.map((ingredient, index) => {
              const item = ITEM_DETAILS[ingredient.item];
              const inventoryAmount =
                inventory[ingredient.item]?.toDecimalPlaces(1) || 0;
              const requiredAmount = ingredient.amount?.toDecimalPlaces(1);

              // Ingredient difference
              const lessIngredient = new Decimal(inventoryAmount).lessThan(
                requiredAmount
              );

              // rendering item remenants
              const renderRemenants = () => {
                if (lessIngredient) {
                  // if inventory items is less than required items
                  return (
                    <>
                      <span className="text-xs text-shadow text-center mt-2 text-red-500">
                        {`${inventoryAmount}`}
                      </span>
                      <span className="text-xs text-shadow text-center mt-2 text-red-500">
                        {`/${requiredAmount}`}
                      </span>
                    </>
                  );
                } else {
                  // if inventory items is equal to required items
                  return (
                    <span className="text-xs text-shadow text-center mt-2">
                      {`${requiredAmount}`}
                    </span>
                  );
                }
              };

              return (
                <div
                  className="flex justify-center flex-wrap items-end"
                  key={index}
                >
                  <img src={item.image} className="h-5 me-2" />
                  {renderRemenants()}
                </div>
              );
            })}
            {!!BUILDINGS[selected].sfl.toNumber() && (
              <div className="flex justify-center items-end">
                <img src={token} className="h-5 mr-1" />
                <span
                  className={classNames(
                    "text-xs text-shadow text-center mt-2 ",
                    {
                      "text-red-500": BUILDINGS[selected].sfl > state.balance,
                    }
                  )}
                >
                  {BUILDINGS[selected].sfl.toNumber()}
                </span>
              </div>
            )}
            <div className="flex justify-center items-end">
              <img src={timer} className="h-5 mr-1" />
              <span
                className={classNames("text-xs text-shadow text-center mt-2 ")}
              >
                {secondsToString(BUILDINGS[selected].constructionSeconds)}
              </span>
            </div>
          </div>

          {bumpkinLevel < BUILDINGS[selected].levelRequired ? (
            <div className="flex items-center">
              <span
                className="bg-error border text-xxs p-1 rounded-md"
                style={{ lineHeight: "10px" }}
              >
                Lvl {BUILDINGS[selected].levelRequired} Required
              </span>

              <img src={lock} className="h-4 ml-1" />
            </div>
          ) : (
            <Button disabled={canBuild(selected)}>Build</Button>
          )}
        </div>
      </OuterPanel>
    </div>
  );
};
