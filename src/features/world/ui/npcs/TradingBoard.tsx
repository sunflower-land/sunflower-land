import { SUNNYSIDE } from "assets/sunnyside";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import React, { useContext, useState } from "react";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { BuyPanel } from "../trader/BuyPanel";
import { Trade } from "features/bumpkins/components/Trade";
import { Context } from "features/game/GameProvider";
import { useActor } from "@xstate/react";

import tradeIcon from "assets/icons/trade.png";

interface Props {
  onClose: () => void;
}

export const TradingBoard: React.FC<Props> = ({ onClose }) => {
  const [tab, setTab] = useState(0);
  const { t } = useAppTranslation();

  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);
  const {
    context: { state },
  } = gameState;

  const notCloseable = gameService.state.matches("fulfillTradeListing");

  return (
    <CloseButtonPanel
      onClose={notCloseable ? undefined : onClose}
      tabs={[
        { icon: SUNNYSIDE.icons.search, name: t("buy") },
        { icon: tradeIcon, name: t("sell") },
      ]}
      setCurrentTab={setTab}
      currentTab={tab}
    >
      {tab === 0 && <BuyPanel />}
      {tab === 1 && <Trade />}
    </CloseButtonPanel>
  );
};
