import React, { useContext } from "react";

import sandHill from "assets/land/sand_hill.png";
import sandDug from "assets/land/sand_dug.png";
import { GRID_WIDTH_PX, PIXEL_SCALE } from "features/game/lib/constants";
import { Context } from "features/game/GameProvider";
import { useActor } from "@xstate/react";

export const SandHills: React.FC = () => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);

  // TODO generate daily hills and positions
  const hills = [
    {
      x: 2,
      y: 4,
      id: "1",
    },
    {
      x: 4,
      y: -1,
      id: "2",
    },
    {
      x: -3,
      y: 1,
      id: "3",
    },
    {
      x: -2,
      y: 6,
      id: "4",
    },
    {
      x: 1,
      y: 9,
      id: "5",
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
      {hills.map((hill, index) => {
        const digs =
          gameState.context.state.mysteryPrizes?.["Sand Shovel"] ?? [];
        const isDug = digs.find((dig) => dig.id === hill.id);

        const canDig = true; // TODO
        return (
          <img
            src={isDug ? sandDug : sandHill}
            className="absolute cursor-pointer hover:img-highlight"
            key={index}
            onClick={isDug ? undefined : () => dig(hill.id)}
            style={{
              top: `calc(50% - ${GRID_WIDTH_PX * hill.y}px)`,
              left: `calc(50% + ${GRID_WIDTH_PX * hill.x}px)`,
              width: `${PIXEL_SCALE * 16}px`,
              bottom: `${PIXEL_SCALE * 2}px`,
            }}
          />
        );
      })}
    </>
  );
};
