import React from "react";
import classNames from "classnames";

import lock from "assets/skills/lock.png";

import { ITEM_DETAILS } from "features/game/types/images";
import { getKeys } from "features/game/types/craftables";
import { OuterPanel } from "components/ui/Panel";
import { Label } from "components/ui/Label";
import { BuildingName, BUILDINGS } from "features/game/types/buildings";
import { useShowScrollbar } from "lib/utils/hooks/useShowScrollbar";
import { GameState } from "features/game/types/game";

const CONTENT_HEIGHT = 380;

export const ListView: React.FC<{
  state: GameState;
  onClick: (name: BuildingName) => void;
}> = ({ state, onClick }) => {
  const { ref: itemContainerRef, showScrollbar } =
    useShowScrollbar(CONTENT_HEIGHT);

  const { bumpkin, inventory } = state;

  const buildings = getKeys(BUILDINGS).sort((a, b) =>
    BUILDINGS[a].levelRequired > BUILDINGS[b].levelRequired ? 1 : -1
  );

  return (
    <div
      ref={itemContainerRef}
      style={{ maxHeight: CONTENT_HEIGHT }}
      className={classNames("w-full pr-1 pt-2.5 overflow-y-auto", {
        scrollable: showScrollbar,
      })}
    >
      {buildings.map((buildingName, index) => (
        <div key={index} onClick={() => onClick(buildingName)}>
          <OuterPanel className="flex relative items-center py-2 mb-1 cursor-pointer hover:bg-brown-200">
            <Label className="px-1 text-xxs absolute -top-3 -right-1">
              {inventory[buildingName]?.toNumber() || 0}/1
            </Label>
            <div className="w-16 justify-center flex">
              <img src={ITEM_DETAILS[buildingName].image} className="h-12" />
            </div>

            <div className="flex-1 flex flex-col justify-center">
              <span className="text-sm">{buildingName}</span>

              {bumpkin.level < BUILDINGS[buildingName].levelRequired ? (
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
};
