import { Label } from "components/ui/Label";
import { InnerPanel } from "components/ui/Panel";
import React, { useContext } from "react";
import { useSelector } from "@xstate/react";
import { Context } from "features/game/GameProvider";
import { MachineState } from "features/game/lib/gameMachine";
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
  const hasActiveTrades =
    getKeys(trades.offers ?? {}).length > 0 ||
    getKeys(trades.listings ?? {}).length > 0;

  if (!hasActiveTrades) {
    return (
      <InnerPanel className="m-1">
        <Label type="default" icon={tradeIcon}>
          {`${t("active")} ${t("marketplace.trades")}`}
        </Label>
        <div className="text-sm p-2">
          <p>{t("marketplace.noMyOffers")}</p>
          <p>{t("marketplace.noMyListings")}</p>
        </div>
      </InnerPanel>
    );
  }

  return (
    <div className="overflow-y-scroll scrollable pr-1 h-full">
      <MyOffers />
      <MyListings />
    </div>
  );
};
