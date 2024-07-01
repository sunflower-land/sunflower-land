import { SUNNYSIDE } from "assets/sunnyside";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import React, { useContext, useEffect, useState } from "react";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { BuyPanel } from "../trader/BuyPanel";
import { Trade } from "features/bumpkins/components/Trade";
import { Context } from "features/game/GameProvider";
import { Context as AuthContext } from "features/auth/lib/Provider";
import { useActor } from "@xstate/react";

import tradeIcon from "assets/icons/trade.png";
import {
  FloorPrices,
  getListingsFloorPrices,
} from "features/game/actions/getListingsFloorPrices";

interface Props {
  onClose: () => void;
}

export const TradingBoard: React.FC<Props> = ({ onClose }) => {
  const [tab, setTab] = useState(0);
  const { t } = useAppTranslation();

  const { gameService } = useContext(Context);
  const { authService } = useContext(AuthContext);
  const [authState] = useActor(authService);

  const [floorPrices, setFloorPrices] = useState<FloorPrices>({});

  const notCloseable = gameService.state.matches("fulfillTradeListing");

  useEffect(() => {
    const load = async () => {
      const floorPrices = await getListingsFloorPrices(
        authState.context.user.rawToken,
      );
      setFloorPrices((prevFloorPrices) => ({
        ...prevFloorPrices,
        ...floorPrices,
      }));
    };
    load();
  }, []);

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
      {tab === 0 && <BuyPanel floorPrices={floorPrices} />}
      {tab === 1 && <Trade floorPrices={floorPrices} />}
    </CloseButtonPanel>
  );
};
