import React from "react";

import lock from "assets/skills/lock.png";

import { ITEM_DETAILS } from "features/game/types/images";
import { getKeys } from "features/game/types/craftables";
import { OuterPanel } from "components/ui/Panel";
import { BuildingName, BUILDINGS } from "features/game/types/buildings";
import { GameState } from "features/game/types/game";
import Decimal from "decimal.js-light";
import { Label } from "components/ui/Label";
import { SUNNYSIDE } from "assets/sunnyside";
import { hasFeatureAccess } from "lib/flags";

const CONTENT_HEIGHT = 380;

export const ListView: React.FC<{
  state: GameState;
  onClick: (name: BuildingName) => void;
}> = ({ state, onClick }) => {
  const { bumpkin, inventory } = state;

  const buildings = getKeys(BUILDINGS()).sort((a, b) =>
    BUILDINGS()[a][0].unlocksAtLevel > BUILDINGS()[b][0].unlocksAtLevel ? 1 : -1
  );

  const FILTERED_BUILDINGS = () => {
    if (hasFeatureAccess(inventory, "COMPOSTERS")) {
      return buildings;
    }
    // filter out Basic Composter, Advanced Composter and Expert Composter
    return buildings.filter((building) => {
      if (building === "Basic Composter") return false;
      if (building === "Advanced Composter") return false;
      if (building === "Expert Composter") return false;
      return true;
    });
  };

  return (
    <div
      style={{ maxHeight: CONTENT_HEIGHT }}
      className="w-full pr-1 pt-2 overflow-y-auto scrollable"
    >
      {FILTERED_BUILDINGS().map((buildingName, index) => {
        // The unlock at levels for the building
        const buildingUnlockLevels = BUILDINGS()[buildingName].map(
          ({ unlocksAtLevel }) => unlocksAtLevel
        );
        const landCount = state.inventory["Basic Land"] ?? new Decimal(0);
        // Holds how many desired placed buildings (e.g. water wells)
        const buildingsPlaced = new Decimal(
          state.buildings[buildingName]?.length || 0
        );
        // Holds how many allowed buildings the user can place on the island at the current level.
        const allowedBuildings = buildingUnlockLevels.filter((level) =>
          landCount.gte(level)
        ).length;
        // Whats the next level of the desired building (e.g. water wells), user is yet to unlock.
        // If this is undefined then that means the user has unlocked all the levels of the building.
        const nextLockedLevel = buildingUnlockLevels.find((level) =>
          landCount.lt(level)
        );

        const buildingLimitReached = (
          inventory[buildingName] ?? new Decimal(0)
        ).greaterThanOrEqualTo(allowedBuildings);
        // true, if the user has unlocked all the levels and completed all the buildings.
        const allBuildingsBuilt =
          !nextLockedLevel &&
          buildingsPlaced.greaterThanOrEqualTo(allowedBuildings);

        const unplaced = inventory[buildingName]?.minus(buildingsPlaced);
        // This index represents which one of the allowed the user can build.
        // (e.g. Two hen houses can be built but none have been built yet so the index would be 0)
        // We need this to determine which set of ingredients should be used

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

                {!nextLockedLevel ||
                  (buildingLimitReached && (
                    <Label
                      icon={lock}
                      secondaryIcon={SUNNYSIDE.resource.land}
                      type="danger"
                    >{`${landCount.toNumber()}/${nextLockedLevel} Expansions Required`}</Label>
                  ))}
              </div>
            </OuterPanel>
          </div>
        );
      })}
    </div>
  );
};
