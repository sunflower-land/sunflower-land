import { useSelector } from "@xstate/react";
import { Context } from "features/game/GameProvider";
import { MachineState } from "features/game/lib/gameMachine";

import React, { useContext } from "react";
import { TradePointsProgressBar } from "./rewards/TradePointsProgressBar";
import { TradeRewardsShop } from "./rewards/MarketplaceRewardsShop";

const _tradingPoints = (state: MachineState) =>
  state.context.state.trades.tradePoints;

export const MarketplaceRewards: React.FC = () => {
  const { gameService } = useContext(Context);
  // To be used to access total tradePoints
  const tradePoints = useSelector(gameService, _tradingPoints);

  return (
    <div className="overflow-y-scroll scrollable pr-1 h-full">
      <TradePointsProgressBar tradingPoints={tradePoints ?? 0} />
      <TradeRewardsShop />
    </div>
  );
};
