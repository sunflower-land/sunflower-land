import React, { useContext, useState } from "react";
import { useActor } from "@xstate/react";

import { InnerPanel } from "components/ui/Panel";

import token from "assets/icons/token.gif";

import { Context } from "features/game/GameProvider";
import Decimal from "decimal.js-light";

export const Balance: React.FC = () => {
  const { gameService } = useContext(Context);
  const [game] = useActor(gameService);
  const [isShown, setIsShown] = useState(false);

  return (
    <InnerPanel className="fixed top-2 right-2 z-50 flex items-center shadow-lg cursor-pointer">
      <img src={token} className="w-8 img-highlight" />
      <span
        className="text-white text-sm text-shadow ml-2"
        onMouseEnter={() => setIsShown(true)}
        onMouseLeave={() => setIsShown(false)}
      >
        {isShown === false ? (
          game.context.state.balance
            .toDecimalPlaces(3, Decimal.ROUND_DOWN)
            .toString()
        ) : (
          <small>{game.context.state.balance.toString()}</small>
        )}
      </span>
    </InnerPanel>
  );
};
