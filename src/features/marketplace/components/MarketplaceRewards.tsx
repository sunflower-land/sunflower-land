import { useActor } from "@xstate/react";
import { Label } from "components/ui/Label";
import { ResizableBar } from "components/ui/ProgressBar";
import { Context } from "features/game/GameProvider";
import React, { useContext } from "react";
import trade_point from "src/assets/icons/trade_point.webp";

export const MarketplaceRewards: React.FC = () => {
  const { gameService } = useContext(Context);
  const [
    {
      context: { state },
    },
  ] = useActor(gameService);
  // To be used to access total tradePoints

  return <TradePointsProgressBar />;
};

const TradePointsProgressBar: React.FC = () => {
  return (
    <div className="flex items-center p-2">
      <div className="ml-2">
        <Label icon={trade_point} type="vibrant">{`Trading Level`}</Label>
      </div>
      <div className="ml-4">
        <ResizableBar
          percentage={70} // Will replace with trading level
          type="progress"
          outerDimensions={{
            width: 30,
            height: 7,
          }}
        />
      </div>
      {/* Will be replaced with the level progress */}
      <p className="ml-4">{`${70 * 0.7}/70`}</p>
    </div>
  );
};
