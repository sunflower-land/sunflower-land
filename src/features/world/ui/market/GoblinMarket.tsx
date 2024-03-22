import { SUNNYSIDE } from "assets/sunnyside";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import React, { useContext, useEffect, useState } from "react";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { Context } from "features/game/GameProvider";
import { Context as AuthContext } from "features/auth/lib/Provider";
import { useActor } from "@xstate/react";

import {
  MarketPrices,
  getMarketPrices,
} from "features/game/actions/getMarketPrices";
import { SalesPanel } from "./SalesPanel";

interface Props {
  onClose: () => void;
}

export const GoblinMarket: React.FC<Props> = ({ onClose }) => {
  const { t } = useAppTranslation();

  const { gameService } = useContext(Context);
  const { authService } = useContext(AuthContext);
  const [authState] = useActor(authService);

  const [marketPrices, setMarketPrices] = useState<MarketPrices>({
    Apple: 0,
    Orange: 0,
    Banana: 0,
  });

  const notCloseable = gameService.state.matches("fulfillTradeListing");

  useEffect(() => {
    const load = async () => {
      const marketPrices = await getMarketPrices(
        gameService.state.context.farmId,
        gameService.state.context.transactionId as string,
        authState.context.user.rawToken as string
      );
      setMarketPrices((prevMarketPrices) => ({
        ...prevMarketPrices,
        ...marketPrices,
      }));
    };
    load();
  }, []);

  return (
    <CloseButtonPanel
      onClose={notCloseable ? undefined : onClose}
      tabs={[{ icon: SUNNYSIDE.icons.search, name: t("sell") }]}
    >
      {<SalesPanel marketPrices={marketPrices} />}
    </CloseButtonPanel>
  );
};
