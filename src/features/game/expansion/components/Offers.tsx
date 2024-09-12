import { useActor } from "@xstate/react";
import React, { useContext } from "react";

import { Context } from "features/game/GameProvider";

import { ClaimReward } from "./ClaimReward";
import { getKeys } from "features/game/types/decorations";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { Button } from "components/ui/Button";

/**
 * Display offers that have been fulfilled
 */
export const OffersPopup: React.FC = () => {
  const { gameService } = useContext(Context);
  const [state] = useActor(gameService);

  const { t } = useAppTranslation();

  const { trades } = state.context.state;
  const offerId = getKeys(trades.offers ?? {}).find(
    (id) => !!trades.offers?.[id].fulfilledAt,
  );

  if (!offerId) {
    return (
      <div>
        <Button onClick={() => gameService.send("RESET")}>
          {t("continue")}
        </Button>
      </div>
    );
  }

  const offer = trades.offers![offerId];

  const close = () => {
    gameService.send("CLOSE");
  };

  const claim = () => {
    gameService.send("offer.claimed", {
      tradeId: offerId,
    });
  };

  return (
    <ClaimReward
      onClaim={claim}
      onClose={close}
      reward={{
        createdAt: Date.now(),
        id: "offer-claimed",
        items: offer.collection === "collectibles" ? offer.items : {},
        wearables: offer.collection === "wearables" ? offer.items : {},
        sfl: 0,
        coins: 0,
        message: t("marketplace.offerClaimed"),
      }}
    />
  );
};
