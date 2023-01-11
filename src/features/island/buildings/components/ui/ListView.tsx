import React from "react";

import lock from "assets/skills/lock.png";
import heart from "assets/icons/level_up.png";

import { ITEM_DETAILS } from "features/game/types/images";
import { getKeys } from "features/game/types/craftables";
import { OuterPanel } from "components/ui/Panel";
import { BuildingName, BUILDINGS } from "features/game/types/buildings";
import { GameState } from "features/game/types/game";
import { getBumpkinLevel } from "features/game/lib/level";
import Decimal from "decimal.js-light";
import { Label } from "components/ui/Label";

const CONTENT_HEIGHT = 380;

export const ListView: React.FC<{
  state: GameState;
  onClick: (name: BuildingName) => void;
}> = ({ state, onClick }) => {
  const { bumpkin, inventory } = state;

  const buildings = getKeys(BUILDINGS()).sort((a, b) =>
    BUILDINGS()[a].unlocksAtLevels[0] > BUILDINGS()[b].unlocksAtLevels[0]
      ? 1
      : -1
  );

  return (
    <div
      style={{ maxHeight: CONTENT_HEIGHT }}
      className="w-full pr-1 pt-2.5 overflow-y-auto scrollable"
    >
      {buildings.map((buildingName, index) => {
        // The unlock at levels for the building
        const buildingUnlockLevels = BUILDINGS()[buildingName].unlocksAtLevels;
        const bumpkinLevel = getBumpkinLevel(bumpkin?.experience ?? 0);
        // Holds how many desired placed buildings (e.g. water wells)
        const buildingsPlaced = new Decimal(
          state.buildings[buildingName]?.length || 0
        );
        // Holds how many allowed buildings the user can place on the island at the current level.
        const allowedBuildings = buildingUnlockLevels.filter(
          (level) => bumpkinLevel >= level
        ).length;
        // Whats the next level of the desired building (e.g. water wells), user is yet to unlock.
        // If this is undefined then that means the user has unlocked all the levels of the building.
        const nextLockedLevel = buildingUnlockLevels.find(
          (level) => level > bumpkinLevel
        );
        const buildingLimitReached =
          buildingsPlaced.greaterThanOrEqualTo(allowedBuildings);
        // true, if the user has unlocked all the levels and completed all the buildings.
        const allBuildingsBuilt =
          !nextLockedLevel &&
          buildingsPlaced.greaterThanOrEqualTo(allowedBuildings);

        const unplaced = inventory[buildingName]?.minus(buildingsPlaced);

        return (
          <div key={index} onClick={() => onClick(buildingName)}>
            <OuterPanel className="flex relative items-center py-2 mb-1 cursor-pointer hover:bg-brown-200">
              {unplaced?.gt(0) && (
                <Label
                  type="default"
                  className="px-1 text-xxs absolute -top-3 -right-1"
                >
                  {unplaced.toNumber()}
                </Label>
              )}
              <div className="w-16 justify-center flex mr-2">
                <img src={ITEM_DETAILS[buildingName].image} className="h-12" />
              </div>

              <div className="flex-1 flex flex-col justify-center">
                <span className="text-sm mb-1">{buildingName}</span>

                {allBuildingsBuilt && (
                  <div className="flex items-center">
                    <span
                      className="bg-blue-600 border text-xxs p-1 rounded-md"
                      style={{ lineHeight: "10px" }}
                    >
                      Building limit reached
                    </span>
                  </div>
                )}
                {!nextLockedLevel ||
                  (buildingLimitReached && (
                    <div className="flex items-center">
                      <img src={heart} className="h-4 mr-1" />
                      <span
                        className="bg-error border text-xxs p-1 rounded-md"
                        style={{ lineHeight: "10px" }}
                      >
                        Lvl {nextLockedLevel}
                      </span>

                      <img src={lock} className="h-4 ml-1" />
                    </div>
                  ))}
              </div>
            </OuterPanel>
          </div>
        );
      })}
    </div>
  );
};
