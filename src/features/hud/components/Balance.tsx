import React, { useContext } from "react";
import { useActor } from "@xstate/react";

import { InnerPanel } from "components/ui/Panel";

import token from "assets/icons/token.png";

import { Context } from "features/game/GameProvider";

export const Balance: React.FC = () => {
  const { gameService } = useContext(Context);
  const [game] = useActor(gameService);
  return (
    <InnerPanel className="fixed top-2 right-2 z-50 flex items-center shadow-lg">
      <img src={token} className="w-8 img-highlight" />
      <span className="text-white text-sm text-shadow ml-2">
        {game.context.state.balance.toFixed(2)}
      </span>
    </InnerPanel>
  );
};
