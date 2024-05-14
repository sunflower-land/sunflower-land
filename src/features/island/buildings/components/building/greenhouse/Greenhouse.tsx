import React, { useContext } from "react";

import greenhouse from "assets/buildings/greenhouse.webp";

import { PIXEL_SCALE } from "features/game/lib/constants";
import { BuildingProps } from "../Building";
import { Context } from "features/game/GameProvider";
import { useActor } from "@xstate/react";
import { BuildingImageWrapper } from "../BuildingImageWrapper";
import { useNavigate } from "react-router-dom";

export const Greenhouse: React.FC<BuildingProps> = ({ isBuilt, onRemove }) => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);

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
          src={greenhouse}
          className="absolute pointer-events-none"
          style={{
            width: `${PIXEL_SCALE * 78}px`,
            bottom: `${PIXEL_SCALE * 2}px`,
            left: `${PIXEL_SCALE * 0}px`,
          }}
        />
      </BuildingImageWrapper>
    </div>
  );
};
