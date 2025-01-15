import { Label } from "components/ui/Label";
import { InnerPanel } from "components/ui/Panel";
import { ResizableBar } from "components/ui/ProgressBar";
import {
  getExperienceToNextTradingLevel,
  isMaxTradingLevel,
  getTradingLevel,
} from "features/game/lib/tradingLevels";
import { formatNumber } from "lib/utils/formatNumber";
import React from "react";
import trade_point from "src/assets/icons/trade_points_coupon.webp";

interface Props {
  tradingPoints: number;
}
export const TradePointsProgressBar: React.FC<Props> = ({ tradingPoints }) => {
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
    <InnerPanel className="flex items-center mb-1">
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
