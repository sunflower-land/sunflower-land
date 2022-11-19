import React, { useContext } from "react";

import planted from "assets/crops/bean_planted.png";
import ready from "assets/crops/bean_ready.png";
import alerted from "assets/icons/expression_alerted.png";

import { PIXEL_SCALE } from "features/game/lib/constants";
import { CollectibleProps } from "../Collectible";
import { BeanName, BEANS } from "features/game/types/beans";
import { Context } from "features/game/GameProvider";
import { useActor } from "@xstate/react";

export const Bean: React.FC<CollectibleProps> = ({
  createdAt,
  id,
  name = "Magic Bean",
}) => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);

  const plantSeconds = BEANS()[name as BeanName].plantSeconds;

  const secondsPassed = (Date.now() - createdAt) / 1000;

  const timeLeft = plantSeconds - secondsPassed;

  const harvest = () => {
    console.log("Fire");
    gameService.send("REVEAL", {
      event: {
        type: "bean.harvested",
        id,
        name,
        createdAt: new Date(),
      },
    });
  };

  if (timeLeft <= 0) {
    return (
      <>
        <img
          src={alerted}
          className="animate-float z-10 absolute "
          style={{
            width: `${PIXEL_SCALE * 4}px`,
            left: `${PIXEL_SCALE * 12.8}px`,
            bottom: `${PIXEL_SCALE * 26}px`,
          }}
        />
        <img
          src={ready}
          onClick={harvest}
          style={{
            width: `${PIXEL_SCALE * 30}px`,
            bottom: `${PIXEL_SCALE * 1}px`,
          }}
          className="absolute hover:img-highlight cursor-pointer"
          alt="Bean"
        />
      </>
    );
  }

  return (
    <>
      <img
        src={planted}
        style={{
          width: `${PIXEL_SCALE * 30}px`,
          bottom: `${PIXEL_SCALE * 1}px`,
        }}
        className="absolute hover:img-highlight"
        alt="Bean"
      />
    </>
  );
};
