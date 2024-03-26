import { SUNNYSIDE } from "assets/sunnyside";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import React, { useContext, useEffect, useState } from "react";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { Context } from "features/game/GameProvider";
import { Context as AuthContext } from "features/auth/lib/Provider";
import { useActor } from "@xstate/react";

import { getMarketPrices } from "features/game/actions/getMarketPrices";
import { SalesPanel } from "./SalesPanel";
import {
  getCachedMarketPrices,
  setCachedMarketPrices,
} from "./lib/marketCache";

const SIXTY_SECONDS = 1000 * 10;

interface Props {
  onClose: () => void;
}

export const GoblinMarket: React.FC<Props> = ({ onClose }) => {
  const { t } = useAppTranslation();

  const { gameService } = useContext(Context);
  const { authService } = useContext(AuthContext);
  const [authState] = useActor(authService);

  const [marketPrices, setMarketPrices] = useState(getCachedMarketPrices());

  const notCloseable = gameService.state.matches("fulfillTradeListing");

  useEffect(() => {
    const load = async () => {
      if (!marketPrices || marketPrices.cachedAt < Date.now() - SIXTY_SECONDS) {
        const marketPrices = await getMarketPrices(
          gameService.state.context.farmId,
          gameService.state.context.transactionId as string,
          authState.context.user.rawToken as string
        );
        setCachedMarketPrices(marketPrices);
        setMarketPrices({ prices: marketPrices, cachedAt: Date.now() });
      }
    };
    load();
    const interval = setInterval(load, SIXTY_SECONDS);
    return () => clearInterval(interval);
  }, []);

  return (
    <CloseButtonPanel
      onClose={notCloseable ? undefined : onClose}
      tabs={[{ icon: SUNNYSIDE.icons.search, name: t("sell") }]}
    >
      {<SalesPanel marketPrices={marketPrices?.prices} />}
    </CloseButtonPanel>
  );
};
