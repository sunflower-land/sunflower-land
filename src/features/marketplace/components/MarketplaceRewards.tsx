import { useActor, useSelector } from "@xstate/react";
import { Label } from "components/ui/Label";
import { InnerPanel } from "components/ui/Panel";
import { ResizableBar } from "components/ui/ProgressBar";
import { TRADE_REWARDS } from "features/game/events/landExpansion/redeemTradeReward";
import { Context } from "features/game/GameProvider";
import { MachineState } from "features/game/lib/gameMachine";
import {
  getExperienceToNextTradingLevel,
  getTradingLevel,
  isMaxTradingLevel,
} from "features/game/lib/tradingLevels";
import { getKeys } from "features/game/types/decorations";
import { formatNumber } from "lib/utils/formatNumber";
import React, { useContext } from "react";
import trade_point from "src/assets/icons/trade_points_coupon.webp";
import { RewardsViewCard } from "./RewardsViewCard";

const _tradingPoints = (state: MachineState) =>
  state.context.state.trades.tradePoints;

export const MarketplaceRewards: React.FC = () => {
  const { gameService } = useContext(Context);
  // To be used to access total tradePoints
  const tradePoints = useSelector(gameService, _tradingPoints);

  return (
    <>
      <div className="overflow-y-scroll scrollable pr-1 h-full">
        <TradePointsProgressBar tradingPoints={tradePoints ?? 0} />
        <TradeRewardsShop />
      </div>
    </>
  );
};

const TradePointsProgressBar: React.FC<{ tradingPoints: number }> = ({
  tradingPoints,
}) => {
  const { currentExperienceProgress, experienceToNextLevel } =
    getExperienceToNextTradingLevel(tradingPoints);

  const maxTradingLevel = isMaxTradingLevel(tradingPoints);
  const currentTradingLevel = getTradingLevel(tradingPoints);

  const getProgressPercentage = () => {
    let progressRatio = 1;
    if (!maxTradingLevel) {
      progressRatio = Math.min(
        1,
        currentExperienceProgress / experienceToNextLevel,
      );
    }

    return progressRatio * 100;
  };

  return (
    <InnerPanel className="flex items-center mb-2">
      <div className="ml-1">
        <Label icon={trade_point} type="vibrant">
          {`Trading Level: ${currentTradingLevel} ${maxTradingLevel ? "(MAX)" : ""}`}
        </Label>
      </div>
      <div className="ml-4">
        <ResizableBar
          percentage={getProgressPercentage()}
          type="progress"
          outerDimensions={{
            width: 30,
            height: 7,
          }}
        />
      </div>
      <p className="ml-4">
        {`${formatNumber(currentExperienceProgress, {
          decimalPlaces: 0,
        })} / ${maxTradingLevel ? "-" : formatNumber(experienceToNextLevel, { decimalPlaces: 0 })} XP`}
      </p>
    </InnerPanel>
  );
};

const TradeRewardsShop: React.FC = () => {
  const { gameService } = useContext(Context);

  const [
    {
      context: { state },
    },
  ] = useActor(gameService);

  return (
    <InnerPanel className="h-auto  w-full mb-1">
      <Label className="mb-2" type="default">
        {`Trade Rewards Shop`}
      </Label>
      <div className="flex flex-wrap flex-row">
        {getKeys(TRADE_REWARDS(state)).map((item) => {
          return (
            <div
              className="w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/5 xl:w-[14.2%] pr-1 pb-1"
              key={item}
            >
              <RewardsViewCard
                onClick={() => undefined}
                TradeReward={TRADE_REWARDS(state)[item]}
              />
            </div>
          );
        })}
      </div>
    </InnerPanel>
  );
};
