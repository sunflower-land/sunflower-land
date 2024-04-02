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

const THIRTY_SECONDS = 1000 * 30;
const SIXTY_SECONDS = 1000 * 60;

interface Props {
  onClose: () => void;
}

export const GoblinMarket: React.FC<Props> = ({ onClose }) => {
  const { t } = useAppTranslation();

  const { gameService } = useContext(Context);
  const { authService } = useContext(AuthContext);
  const [authState] = useActor(authService);

  const [marketPrices, setMarketPrices] = useState(getCachedMarketPrices());
  const [loading, setLoading] = useState(false);

  const selling = gameService.state.matches("sellMarketResource");

  useEffect(() => {
    const load = async () => {
      if (
        !marketPrices ||
        marketPrices.cachedAt < Date.now() - THIRTY_SECONDS
      ) {
        setLoading(true);
        const marketPrices = await getMarketPrices(
          gameService.state.context.farmId,
          gameService.state.context.transactionId as string,
          authState.context.user.rawToken as string
        );
        setCachedMarketPrices(marketPrices);
        setMarketPrices({ prices: marketPrices, cachedAt: Date.now() });
        setLoading(false);
      }
    };
    load();
    const interval = setInterval(load, SIXTY_SECONDS);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!selling) {
      // Used when cache is updated after a sale
      const prices = getCachedMarketPrices();
      if (prices) setMarketPrices(prices);
    }
  }, [selling]);

  return (
    <CloseButtonPanel
      onClose={selling ? undefined : onClose}
      tabs={[{ icon: SUNNYSIDE.icons.search, name: t("sell") }]}
    >
      {<SalesPanel marketPrices={marketPrices} loadingNewPrices={loading} />}
    </CloseButtonPanel>
  );
};
