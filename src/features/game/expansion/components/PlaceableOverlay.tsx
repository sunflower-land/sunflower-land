import React, { useContext } from "react";
import { Context } from "features/game/GameProvider";
import { useActor } from "@xstate/react";

export const PlaceableOverlay: React.FC = ({ children }) => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);

  return (
    <>
      <div
        id="editing-overlay z-20 absolute"
        className="w-full h-full"
        style={{
          pointerEvents: gameState.matches("editing") ? "none" : "auto",
        }}
      >
        {children}
      </div>
    </>
  );
};
