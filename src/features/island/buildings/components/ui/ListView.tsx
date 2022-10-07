import React from "react";

import lock from "assets/skills/lock.png";

import { ITEM_DETAILS } from "features/game/types/images";
import { getKeys } from "features/game/types/craftables";
import { OuterPanel } from "components/ui/Panel";
import { Label } from "components/ui/Label";
import { BuildingName, BUILDINGS } from "features/game/types/buildings";
import { GameState } from "features/game/types/game";
import { getBumpkinLevel } from "features/game/lib/level";

const CONTENT_HEIGHT = 380;

export const ListView: React.FC<{
  state: GameState;
  onClick: (name: BuildingName) => void;
}> = ({ state, onClick }) => {
  const { bumpkin, inventory } = state;

  const buildings = getKeys(BUILDINGS).sort((a, b) =>
    BUILDINGS[a].unlocksAtLevels[0] > BUILDINGS[b].unlocksAtLevels[0] ? 1 : -1
  );

  return (
    <div
      style={{ maxHeight: CONTENT_HEIGHT }}
      className="w-full pr-1 pt-2.5 overflow-y-auto scrollable"
    >
      {buildings.map((buildingName, index) => {
        const buildingLevel = BUILDINGS[buildingName].unlocksAtLevels[0];
        return (
          <div key={index} onClick={() => onClick(buildingName)}>
            <OuterPanel className="flex relative items-center py-2 mb-1 cursor-pointer hover:bg-brown-200">
              <Label className="px-1 text-xxs absolute -top-3 -right-1">
                {inventory[buildingName]?.toNumber() || 0}
              </Label>
              <div className="w-16 justify-center flex">
                <img src={ITEM_DETAILS[buildingName].image} className="h-12" />
              </div>

              <div className="flex-1 flex flex-col justify-center">
                <span className="text-sm">{buildingName}</span>

                {!bumpkin ||
                  (getBumpkinLevel(bumpkin.experience) < buildingLevel && (
                    <div className="flex items-center">
                      <span
                        className="bg-error border text-xxs p-1 rounded-md"
                        style={{ lineHeight: "10px" }}
                      >
                        Lvl {buildingLevel}
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
