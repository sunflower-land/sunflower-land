import { useActor } from "@xstate/react";
import { Label } from "components/ui/Label";
import { InnerPanel } from "components/ui/Panel";
import { TRADE_REWARDS } from "features/game/events/landExpansion/redeemTradeReward";
import { getKeys } from "features/game/types/decorations";
import React, { useContext } from "react";
import { RewardsViewCard } from "./RewardsViewCard";
import { Context } from "features/game/GameProvider";

export const TradeRewardsShop: React.FC = () => {
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
