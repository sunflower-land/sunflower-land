import { OuterPanel } from "components/ui/Panel";
import React from "react";

import house from "assets/buildings/house.png";
import well from "assets/buildings/wishing_well.png";
import { Ingredient } from "features/game/types/craftables";
import { ITEM_DETAILS } from "features/game/types/images";
import { Inventory } from "components/InventoryItems";
import Decimal from "decimal.js-light";
import classNames from "classnames";
import { secondsToString } from "lib/utils/time";

import token from "assets/icons/token.gif";
import timer from "assets/icons/timer.png";
import lock from "assets/skills/lock.png";
import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";

const INGREDIENTS: Ingredient[] = [
  {
    amount: new Decimal(10),
    item: "Wood",
  },
];

const inventory: Inventory = {};

export const BuildingDetails: React.FC = () => {
  return (
    <div className="flex">
      <div className="w-2/3 pr-2 pt-2.5">
        <OuterPanel className="flex relative items-center py-2">
          <Label className="px-1 text-xxs absolute -top-3 -right-1">0/1</Label>

          <img src={house} className="h-12 mr-2" />
          <div className="flex-1 flex flex-col justify-center">
            <span className="text-sm">House</span>
            <span className="text-xxs pr-0.5">Lvl 2</span>
          </div>
        </OuterPanel>
        <OuterPanel className="flex relative mt-1 items-center">
          <Label className="px-1 text-xxs absolute -top-3 -right-1">0/1</Label>

          <img src={well} className="h-12 mr-2" />
          <div className="flex-1 flex flex-col justify-center  py-2.5">
            <span className="text-sm">Wishing Well</span>
            <div className="flex items-center">
              <span
                className="bg-error border text-xxs p-1 rounded-md"
                style={{ lineHeight: "10px" }}
              >
                Lvl 5
              </span>
              <img src={lock} className="h-4 ml-1" />
            </div>
          </div>
        </OuterPanel>
        <OuterPanel className="flex relative mt-1  items-center py-2">
          <Label className="px-1 text-xxs absolute -top-3 -right-1">0/1</Label>

          <img src={well} className="h-12 mr-2" />
          <div className="flex-1 flex flex-col justify-center">
            <span className="text-sm">Wishing Well</span>
            <div className="flex items-center">
              <span
                className="bg-error border text-xxs p-1 rounded-md"
                style={{ lineHeight: "10px" }}
              >
                Lvl 5
              </span>
              <img src={lock} className="h-4 ml-1" />
            </div>
          </div>
        </OuterPanel>
      </div>
      <OuterPanel className="flex-1 min-w-[42%] flex flex-col justify-between items-center">
        <div className="flex flex-col justify-center items-center p-2 relative w-full">
          <img src={house} className="h-16 img-highlight mt-1" />
          <span className="text-shadow text-center mt-2 sm:text-sm">
            Replenish your stamina for your Bumpkin
          </span>

          <div className="border-t border-white w-full mt-2 pt-1 mb-2 text-center">
            {INGREDIENTS.map((ingredient, index) => {
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
            <div className="flex justify-center items-end">
              <img src={token} className="h-5 mr-1" />
              <span
                className={classNames("text-xs text-shadow text-center mt-2 ", {
                  "text-red-500": true,
                })}
              >
                {`50 SFL`}
              </span>
            </div>

            <div className="flex justify-center items-end">
              <img src={timer} className="h-5 mr-1" />
              <span
                className={classNames("text-xs text-shadow text-center mt-2 ")}
              >
                {secondsToString(60)}
              </span>
            </div>
          </div>

          <Button>Build</Button>
        </div>
      </OuterPanel>
    </div>
  );
};
