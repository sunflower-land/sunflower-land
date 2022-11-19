import React, { useContext } from "react";

import sandHill from "assets/land/sand_hill.png";
import { GRID_WIDTH_PX, PIXEL_SCALE } from "features/game/lib/constants";
import { Context } from "features/game/GameProvider";
import { useActor } from "@xstate/react";

export const SandHills: React.FC = () => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);

  const hills = [
    {
      x: 2,
      y: 4,
    },
    {
      x: 4,
      y: -1,
    },
    {
      x: -3,
      y: 1,
    },
    {
      x: -2,
      y: 6,
    },
    {
      x: 1,
      y: 9,
    },
  ];

  const dig = (id: string) => {
    console.log({ id });
    gameService.send("REVEAL", {
      event: {
        type: "treasure.dug",
        id,
        createdAt: new Date(),
      },
    });
  };

  return (
    <>
      {hills.map((hillPosition, index) => (
        <img
          src={sandHill}
          className="absolute cursor-pointer hover:img-highlight"
          key={index}
          onClick={() => dig(index.toString())}
          style={{
            top: `calc(50% - ${GRID_WIDTH_PX * hillPosition.y}px)`,
            left: `calc(50% + ${GRID_WIDTH_PX * hillPosition.x}px)`,
            width: `${PIXEL_SCALE * 16}px`,
            bottom: `${PIXEL_SCALE * 2}px`,
          }}
        />
      ))}
    </>
  );
};
