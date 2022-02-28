import { useActor } from "@xstate/react";
import { Context } from "features/game/GameProvider";
import React, { useContext } from "react";

export const Deposit: React.FC = () => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);

  return (
    <div>
      <span className="text-shadow underline text-center text-xs block mt-1">
        {"Your farm's address"}
      </span>
      <span
        className="text-shadow text-sm block select-text text-center mt-2"
        style={{
          overflowWrap: "anywhere",
        }}
      >
        {gameState.context.state.farmAddress}
      </span>

      <span className="text-sm text-shadow underline block mt-6 text-center">
        How to deposit?
      </span>

      <span className="text-shadow block text-sm mt-2 text-center">
        1.Send SFL or items to the address above
      </span>
      <span className="text-shadow block text-sm text-center">
        {"2.Go to the menu and 'Sync on chain'"}
      </span>

      <span className="text-shadow block text-xxs underline text-center mt-4">
        Do not send MATIC or any other tokens to the address above
      </span>
    </div>
  );
};
