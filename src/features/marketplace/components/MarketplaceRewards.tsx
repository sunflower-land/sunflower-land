import { useSelector } from "@xstate/react";
import { MachineState } from "features/game/lib/gameMachine";

import React from "react";
import { TradePointsProgressBar } from "./rewards/TradePointsProgressBar";
import { TradeRewardsShop } from "./rewards/MarketplaceRewardsShop";
import { useGameService } from "features/game/hooks";

const _tradingPoints = (state: MachineState) =>
  state.context.state.trades.tradePoints;

export const MarketplaceRewards: React.FC = () => {
  const gameService = useGameService();
  // To be used to access total tradePoints
  const tradePoints = useSelector(gameService, _tradingPoints);

  return (
    <div className="overflow-y-scroll scrollable pr-1 h-full">
      <TradePointsProgressBar tradingPoints={tradePoints ?? 0} />
      <TradeRewardsShop />
    </div>
  );
};
