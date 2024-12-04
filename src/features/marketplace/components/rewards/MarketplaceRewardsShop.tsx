import { useActor } from "@xstate/react";
import { Label } from "components/ui/Label";
import { InnerPanel } from "components/ui/Panel";
import {
  TRADE_REWARDS,
  TradeRewardsItem,
} from "features/game/events/landExpansion/redeemTradeReward";
import { getKeys } from "features/game/types/decorations";
import React, { useContext, useState } from "react";
import { RewardsViewCard } from "./RewardsViewCard";
import { Context } from "features/game/GameProvider";
import { ItemDetail } from "./ItemDetail";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { Modal } from "components/ui/Modal";

export const TradeRewardsShop: React.FC = () => {
  const { t } = useAppTranslation();
  const { gameService } = useContext(Context);

  const [
    {
      context: { state },
    },
  ] = useActor(gameService);
  const [showDetails, setShowDetails] = useState(false);
  const [selected, setSelected] = useState<TradeRewardsItem>("Treasure Key");

  const onClick = (item: TradeRewardsItem) => {
    setSelected(item);
    setShowDetails(true);
  };

  const onClose = () => setShowDetails(false);
  return (
    <>
      <InnerPanel className="h-auto  w-full mb-1">
        <Label className="mb-2" type="default">
          {t("marketplace.reward.shop")}
        </Label>
        <div className="flex flex-wrap flex-row">
          {getKeys(TRADE_REWARDS(state)).map((item) => {
            return (
              <div
                className="w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/5 xl:w-[14.2%] pr-1 pb-1"
                key={item}
              >
                <RewardsViewCard
                  onClick={() => onClick(item)}
                  TradeReward={TRADE_REWARDS(state)[item]}
                />
              </div>
            );
          })}
        </div>
      </InnerPanel>
      <Modal show={showDetails} onHide={onClose}>
        <ItemDetail onClose={onClose} itemName={selected} />
      </Modal>
    </>
  );
};
