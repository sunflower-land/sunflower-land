import React, { useContext, useEffect, useState } from "react";
import { WarIntro } from "./components/WarIntro";

import { WarCollection } from "./components/WarCollection";
import { Context } from "features/game/GameProvider";
import { useActor } from "@xstate/react";
import { Inventory } from "features/game/types/game";
import { WarSide } from "features/game/events/pickSide";
import { WarMessenger } from "./components/WarMessenger";

const hasPickedSide = (inventory: Inventory) => {
  return (
    inventory["Goblin War Banner"]?.gt(0) ||
    inventory["Human War Banner"]?.gt(0)
  );
};

export const GoblinWar: React.FC = () => {
  const [isReady, setIsReady] = useState(false);
  const { gameService } = useContext(Context);
  const [
    {
      matches,
      value,
      context: {
        state: { inventory },
      },
    },
    state,
  ] = useActor(gameService);

  useEffect(() => {
    if (matches("playing")) {
      setIsReady(true);
    }
  }, [value]);

  const handlePickSide = (side: WarSide) => {
    gameService.send({ type: "side.picked", side });
  };

  if (!isReady) {
    return null;
  }

  if (!hasPickedSide(inventory)) {
    return <WarIntro onPickSide={handlePickSide} />;
  }

  const side = inventory["Goblin War Banner"]?.gt(0)
    ? WarSide.Goblin
    : WarSide.Human;

  return (
    <>
      <WarCollection side={side} />
      <WarMessenger side={side} />
    </>
  );
};
