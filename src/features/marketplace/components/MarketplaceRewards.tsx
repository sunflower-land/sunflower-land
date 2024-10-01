import { useSelector } from "@xstate/react";
import { Label } from "components/ui/Label";
import { ResizableBar } from "components/ui/ProgressBar";
import { Context } from "features/game/GameProvider";
import { MachineState } from "features/game/lib/gameMachine";
import {
  getExperienceToNextTradingLevel,
  getTradingLevel,
  isMaxTradingLevel,
} from "features/game/lib/tradingLevels";
import { formatNumber } from "lib/utils/formatNumber";
import React, { useContext } from "react";
import trade_point from "src/assets/icons/trade_point.webp";

const _tradingPoints = (state: MachineState) =>
  state.context.state.trades.tradePoints;

export const MarketplaceRewards: React.FC = () => {
  const { gameService } = useContext(Context);
  // To be used to access total tradePoints
  const tradePoints = useSelector(gameService, _tradingPoints);

  return <TradePointsProgressBar tradingPoints={tradePoints} />;
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
    <div className="flex items-center p-2">
      <div className="ml-1">
        <Label
          icon={trade_point}
          type="vibrant"
        >{`Trading Level: ${currentTradingLevel} ${maxTradingLevel ? "(MAX)" : ""}`}</Label>
      </div>
      <div className="ml-4">
        <ResizableBar
          percentage={getProgressPercentage()} // Will replace with trading level
          type="progress"
          outerDimensions={{
            width: 30,
            height: 7,
          }}
        />
      </div>
      {/* Will be replaced with the level progress */}
      <p className="ml-4">
        {`${formatNumber(currentExperienceProgress, {
          decimalPlaces: 0,
        })}/${maxTradingLevel ? "-" : formatNumber(experienceToNextLevel, { decimalPlaces: 0 })} XP`}
      </p>
    </div>
  );
};
