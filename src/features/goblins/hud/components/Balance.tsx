import React, { useContext, useState } from "react";
import { useActor } from "@xstate/react";

import { InnerPanel } from "components/ui/Panel";

import token from "assets/icons/token.gif";

import { Context } from "features/game/GoblinProvider";
import Decimal from "decimal.js-light";

export const Balance: React.FC = () => {
  const { goblinService } = useContext(Context);
  const [goblinState] = useActor(goblinService);
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
          goblinState.context.state.balance
            .toDecimalPlaces(3, Decimal.ROUND_DOWN)
            .toString()
        ) : (
          <small>{goblinState.context.state.balance.toString()}</small>
        )}
      </span>
    </InnerPanel>
  );
};
