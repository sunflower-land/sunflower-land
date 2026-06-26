import { Label } from "components/ui/Label";
import { InnerPanel } from "components/ui/Panel";
import React, { useContext } from "react";
import { useSelector } from "@xstate/react";
import { Context } from "features/game/GameProvider";
import type { MachineState } from "features/game/lib/gameMachine";
import { getKeys } from "lib/object";
import { MyListings } from "./MyListings";
import { MyOffers } from "./MyOffers";
import tradeIcon from "assets/icons/trade.png";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

const _trades = (state: MachineState) => state.context.state.trades;

export const MyTrades: React.FC = () => {
  const { t } = useAppTranslation();
  const { gameService } = useContext(Context);
  const trades = useSelector(gameService, _trades);
  const hasOffers = getKeys(trades.offers ?? {}).length > 0;
  const hasListings = getKeys(trades.listings ?? {}).length > 0;
  const hasActiveTrades = hasOffers || hasListings;

  if (!hasActiveTrades) {
    return (
      <InnerPanel className="m-1">
        <Label type="default" icon={tradeIcon}>
          {t("marketplace.activeTrades")}
        </Label>
        <div className="text-sm p-2">
          <p>{t("marketplace.noMyOffers")}</p>
          <p>{t("marketplace.noMyListings")}</p>
        </div>
      </InnerPanel>
    );
  }

  return (
    <div className="flex h-full min-h-0 flex-col gap-1 pr-1">
      {hasOffers && (
        <div className="min-h-0 flex-1">
          <MyOffers fullHeight />
        </div>
      )}
      {hasListings && (
        <div className="min-h-0 flex-1">
          <MyListings fullHeight />
        </div>
      )}
    </div>
  );
};
