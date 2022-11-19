import React, { useContext } from "react";

import { Context } from "../GameProvider";
import { useActor } from "@xstate/react";
import { Button } from "components/ui/Button";

export const Revealed: React.FC = () => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);

  const onAcknowledge = () => {
    gameService.send("CONTINUE");
  };

  return (
    <div className="flex flex-col items-center p-1">
      <span className="text-center text-sm sm:text-base">Congratulations</span>
      <span>{JSON.stringify(gameState.context.revealed)}</span>
      <Button onClick={onAcknowledge}>Continue</Button>
    </div>
  );
};
