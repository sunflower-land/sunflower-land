import { Label } from "components/ui/Label";
import { InnerPanel } from "components/ui/Panel";
import {
  TRADE_REWARDS_ITEMS,
  TRADE_REWARDS_PACKS,
  TradeRewardPacks,
  TradeRewardsItem,
} from "features/game/events/landExpansion/redeemTradeReward";
import { getKeys } from "features/game/types/decorations";
import React, { useContext, useState } from "react";
import { RewardsViewCard } from "./RewardsViewCard";
import { Context } from "features/game/GameProvider";
import { ItemDetail } from "./ItemDetail";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { Modal } from "components/ui/Modal";
import { hasFeatureAccess } from "lib/flags";
import { MachineState } from "features/game/lib/gameMachine";
import { useSelector } from "@xstate/react";

const _state = (state: MachineState) => state.context.state;

export const TradeRewardsShop: React.FC = () => {
  const { t } = useAppTranslation();
  const { gameService } = useContext(Context);
  const state = useSelector(gameService, _state);

  const [showDetails, setShowDetails] = useState(false);
  const [selected, setSelected] = useState<TradeRewardsItem | TradeRewardPacks>(
    "Treasure Key",
  );

  const onClick = (item: TradeRewardsItem | TradeRewardPacks) => {
    setSelected(item);
    setShowDetails(true);
  };

  const onClose = () => setShowDetails(false);

  if (!hasFeatureAccess(state, "MARKETPLACE_REWARDS")) {
    return (
      <InnerPanel className="h-auto  w-full mb-1">
        <p>{`Coming Soon`}</p>
      </InnerPanel>
    );
  }

  return (
    <>
      <InnerPanel className="h-auto  w-full mb-1">
        <Label className="mb-2" type="default">
          {t("marketplace.reward.shop")}
        </Label>
        <div className="flex flex-wrap flex-row my-1">
          {getKeys(TRADE_REWARDS_ITEMS).map((item) => (
            <div
              className="w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/5 xl:w-[14.2%] pr-1 pb-1"
              key={item}
            >
              <RewardsViewCard
                onClick={() => onClick(item)}
                TradeReward={TRADE_REWARDS_ITEMS[item]}
              />
            </div>
          ))}
        </div>
        <Label className="mb-2" type="default">{`Trade Reward Packs`}</Label>
        <div className="flex flex-wrap flex-row">
          {getKeys(TRADE_REWARDS_PACKS).map((item) => (
            <div
              className="w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/5 xl:w-[14.2%] pr-1 pb-1"
              key={item}
            >
              <RewardsViewCard
                onClick={() => onClick(item)}
                TradeReward={TRADE_REWARDS_PACKS[item]}
              />
            </div>
          ))}
        </div>
      </InnerPanel>
      <Modal show={showDetails} onHide={onClose}>
        <ItemDetail onClose={onClose} itemName={selected} />
      </Modal>
    </>
  );
};
