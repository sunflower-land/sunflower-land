import React, { useContext } from "react";

import { PIXEL_SCALE } from "features/game/lib/constants";
import type { BuildingProps } from "../Building";
import { Context } from "features/game/GameProvider";
import { useSelector } from "@xstate/react";
import { BuildingImageWrapper } from "../BuildingImageWrapper";
import { useNavigate } from "react-router";
import type { MachineState } from "features/game/lib/gameMachine";
import { getKeys } from "lib/object";
import { isGreenhouseReady } from "features/game/events/landExpansion/greenhouseReadiness";
import type { GreenHouseCropName } from "features/game/types/crops";
import type { GreenHouseFruitName } from "features/game/types/fruits";
import { ITEM_DETAILS } from "features/game/types/images";
import { GREENHOUSE_VARIANTS } from "features/island/lib/alternateArt";
import { SUNNYSIDE } from "assets/sunnyside";
import { saveIslandScrollPosition } from "features/game/expansion/lib/islandScroll";
import { useNow } from "lib/utils/hooks/useNow";

const _gameState = (state: MachineState) => state.context.state;

export const Greenhouse: React.FC<BuildingProps> = ({ isBuilt, season }) => {
  const { gameService, showAnimations } = useContext(Context);

  const gameState = useSelector(gameService, _gameState);

  const { pots } = gameState.greenhouse;
  const hasActivePlants = Object.values(pots).some((pot) => !!pot.plant);

  // Readiness is derived in-render (windowed plants become ready earlier than
  // their stored plantedAt implies) off a live clock, so the ready indicators
  // appear on time; the clock stops when nothing is growing.
  const now = useNow({ live: hasActivePlants });
  const readyPlants = getKeys(pots).reduce(
    (plants, id) => {
      const pot = pots[id];

      if (!pot.plant) {
        return plants;
      }

      if (!isGreenhouseReady(now, pot, gameState)) {
        return plants;
      }

      return [...plants, pot.plant.name];
    },
    [] as (GreenHouseCropName | GreenHouseFruitName)[],
  );

  const navigate = useNavigate();

  const handleClick = () => {
    if (isBuilt) {
      saveIslandScrollPosition();
      navigate("/greenhouse");

      // Add future on click actions here
      return;
    }
  };

  return (
    <div className="absolute h-full w-full">
      <BuildingImageWrapper name="Greenhouse" onClick={handleClick}>
        {hasActivePlants && (
          <img
            src={SUNNYSIDE.building.smoke}
            className="absolute pointer-events-none"
            style={{
              width: `${PIXEL_SCALE * 20}px`,
              left: `calc(${PIXEL_SCALE * 26}px - 50px)`,
              bottom: `calc(${PIXEL_SCALE * 46}px + 30px)`,
            }}
          />
        )}
        <img
          src={GREENHOUSE_VARIANTS[season]}
          className="absolute pointer-events-none"
          style={{
            width: `${PIXEL_SCALE * 78}px`,
            bottom: `${PIXEL_SCALE * 2}px`,
            left: `${PIXEL_SCALE * 0}px`,
          }}
        />
        {readyPlants.length > 0 && (
          <div
            className="absolute flex w-full items-center justify-center"
            style={{
              top: `${PIXEL_SCALE * 14}px`,
            }}
          >
            {readyPlants.map((plant, index) => (
              <img
                key={index}
                src={ITEM_DETAILS[plant].image}
                className={
                  "img-highlight-heavy w-8" + (showAnimations ? " ready" : "")
                }
              />
            ))}
          </div>
        )}
      </BuildingImageWrapper>
    </div>
  );
};
