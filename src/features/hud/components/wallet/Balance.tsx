import React, { useContext, useState } from "react";
import { useActor } from "@xstate/react";

import { InnerPanel } from "components/ui/Panel";

import token from "assets/icons/token.gif";

import { Context } from "features/game/GameProvider";
import Decimal from "decimal.js-light";
import { Wallet } from "./Wallet";

export const Balance: React.FC = () => {
  const { gameService } = useContext(Context);
  const [game] = useActor(gameService);
  const [showWallet, setShowWallet] = useState(false);

  const handleClick = () => setShowWallet(true);

  return (
    <>
      <InnerPanel className="fixed top-2 right-2 z-50 flex items-center shadow-lg cursor-pointer">
        <div className="flex justify-center items-center" onClick={handleClick}>
          <img src={token} className="w-8 col img-highlight" />
          <span className="col text-white text-sm text-shadow ml-2">
            {game.context.state.balance
              .toDecimalPlaces(3, Decimal.ROUND_DOWN)
              .toString()}
          </span>
        </div>
      </InnerPanel>
      <Wallet isOpen={showWallet} onClose={() => setShowWallet(false)} />
    </>
  );
};
