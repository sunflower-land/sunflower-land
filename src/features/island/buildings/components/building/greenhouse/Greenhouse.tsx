import React, { useContext } from "react";

import { SUNNYSIDE } from "assets/sunnyside";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { BuildingProps } from "../Building";
import { Context } from "features/game/GameProvider";
import { useSelector } from "@xstate/react";
import { BuildingImageWrapper } from "../BuildingImageWrapper";
import { useNavigate } from "react-router-dom";
import { MachineState } from "features/game/lib/gameMachine";
import { getKeys } from "features/game/types/craftables";
import { getReadyAt } from "features/game/events/landExpansion/harvestGreenHouse";
import { GreenHouseCropName } from "features/game/types/crops";
import { GreenHouseFruitName } from "features/game/types/fruits";
import { ITEM_DETAILS } from "features/game/types/images";

const selectReadyPlants = (state: MachineState) => {
  const pots = state.context.state.greenhouse.pots;

  return getKeys(pots).reduce(
    (plants, id) => {
      const pot = pots[id];

      if (!pot.plant) {
        return plants;
      }

      const isReady =
        Date.now() >
        getReadyAt({
          game: state.context.state,
          plant: pot.plant.name,
          createdAt: pot.plant.plantedAt,
        });

      if (!isReady) {
        return plants;
      }

      return [...plants, pot.plant.name];
    },
    [] as (GreenHouseCropName | GreenHouseFruitName)[],
  );
};

export const Greenhouse: React.FC<BuildingProps> = ({ isBuilt, onRemove }) => {
  const { gameService, showAnimations } = useContext(Context);

  const readyPlants = useSelector(gameService, selectReadyPlants);

  const navigate = useNavigate();

  const handleClick = () => {
    if (onRemove) {
      onRemove();
      return;
    }

    if (isBuilt) {
      navigate("/greenhouse");

      // Add future on click actions here
      return;
    }
  };

  return (
    <div className="absolute h-full w-full">
      <BuildingImageWrapper name="Greenhouse" onClick={handleClick}>
        <img
          src={SUNNYSIDE.building.greenhouse}
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
