import { useSelector } from "@xstate/react";
import { Context } from "features/game/GameProvider";
import type { MachineState } from "features/game/lib/gameMachine";

import React, { useContext } from "react";
import { TradePointsProgressBar } from "./rewards/TradePointsProgressBar";
import { TradeRewardsShop } from "./rewards/MarketplaceRewardsShop";

const _tradingPoints = (state: MachineState) =>
  state.context.state.trades.tradePoints;
const _tradePointBalance = (state: MachineState) =>
  state.context.state.inventory["Trade Point"]?.toNumber() ?? 0;

export const MarketplaceRewards: React.FC = () => {
  const { gameService } = useContext(Context);
  // To be used to access total tradePoints
  const tradePoints = useSelector(gameService, _tradingPoints);
  const tradePointBalance = useSelector(gameService, _tradePointBalance);

  return (
    <div className="overflow-y-scroll scrollable pr-1 h-full">
      <TradePointsProgressBar
        tradingPoints={tradePoints ?? 0}
        balance={tradePointBalance}
      />
      <TradeRewardsShop />
    </div>
  );
};
