import { Box } from "components/ui/Box";
import Decimal from "decimal.js-light";
import { loadGameStateForVisit } from "features/game/actions/loadGameStateForVisit";
import { getKeys } from "features/game/types/craftables";
import { TradeListing } from "features/game/types/game";
import { ITEM_DETAILS } from "features/game/types/images";
import React, { useContext, useEffect, useState } from "react";
import token from "assets/icons/token_2.png";
import lock from "assets/skills/lock.png";
import { Context } from "features/game/GameProvider";
import { Button } from "components/ui/Button";
import { useActor } from "@xstate/react";
import { OuterPanel } from "components/ui/Panel";
import { SUNNYSIDE } from "assets/sunnyside";
import * as AuthProvider from "features/auth/lib/Provider";
import { hasMaxItems } from "features/game/lib/processEvent";
import { Label } from "components/ui/Label";
import { getBumpkinLevel } from "features/game/lib/level";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

interface Props {
  farmId: number;
  onClose: () => void;
}
export const PlayerTrade: React.FC<Props> = ({ farmId, onClose }) => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);
  const { authService } = useContext(AuthProvider.Context);
  const [authState] = useActor(authService);

  const [warning, setWarning] = useState<"pendingTransaction" | "hoarding">();
  const [isLoading, setIsLoading] = useState(true);
  const [listing, setListing] = useState<{ id: string; trade: TradeListing }>();
  const [showConfirm, setShowConfirm] = useState(false);

  const { t } = useAppTranslation();

  useEffect(() => {
    const load = async () => {
      const farm = await loadGameStateForVisit(
        farmId,
        authState.context.user.rawToken
      );

      const trades = farm.state.trades?.listings;
      if (trades && getKeys(trades).length > 0) {
        const firstTrade = getKeys(trades)[0];

        const trade = trades[firstTrade];

        setListing({ id: firstTrade, trade });
      }

      setIsLoading(false);
    };

    load();
  }, []);

  const level = getBumpkinLevel(
    gameState.context.state.bumpkin?.experience ?? 0
  );

  if (level < 10) {
    return (
      <div className="relative">
        <Label type="info" className="absolute top-2 right-2">
          {t("beta")}
        </Label>
        <div className="p-1 flex flex-col items-center">
          <img src={lock} className="w-1/5 mx-auto my-2 img-highlight-heavy" />
          <p className="text-sm">{t("bumpkinTrade.minLevel")}</p>
          <p className="text-xs mb-2">{t("statements.lvlUp")}</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return <p className="loading">{t("loading")}</p>;
  }

  if (!listing)
    return (
      <div className="p-2">
        <img src={SUNNYSIDE.icons.sad} className="mx-auto w-1/5 my-2" />
        <p className="text-sm mb-2 text-center">{t("playerTrade.no.trade")}</p>
      </div>
    );

  if (warning === "hoarding") {
    return (
      <div className="p-1 flex flex-col items-center">
        <img src={lock} className="w-1/5 mb-2" />
        <p className="text-sm mb-1 text-center">{t("playerTrade.max.item")}</p>
        <p className="text-xs mb-1 text-center">{t("playerTrade.Progress")}</p>
      </div>
    );
  }

  if (warning === "pendingTransaction") {
    return (
      <div className="p-1 flex flex-col items-center">
        <img src={SUNNYSIDE.icons.timer} className="w-1/6 mb-2" />
        <p className="text-sm mb-1 text-center">
          {t("playerTrade.transaction")}
        </p>
        <p className="text-xs mb-1 text-center">{t("playerTrade.Please")}</p>
      </div>
    );
  }

  const trade = listing.trade;

  const confirm = () => {
    // Check hoard
    const inventory = gameState.context.state.inventory;
    const updatedInventory = getKeys(trade.items).reduce(
      (acc, name) => ({
        ...acc,
        [name]: (inventory[name] ?? new Decimal(0)).add(trade.items[name] ?? 0),
      }),
      inventory
    );

    const hasMaxedOut = hasMaxItems({
      current: updatedInventory,
      old: gameState.context.state.previousInventory,
    });

    if (hasMaxedOut) {
      setWarning("hoarding");
      return;
    }

    if (
      gameState.context.transaction &&
      gameState.context.transaction.expiresAt > Date.now()
    ) {
      setWarning("pendingTransaction");
      return;
    }

    setShowConfirm(true);
  };

  const Action = () => {
    if (trade.boughtAt) {
      return (
        <div className="flex items-center justify-end">
          <img src={SUNNYSIDE.icons.neutral} className="h-4 mr-1"></img>

          <span className="text-xs">{t("playerTrade.sold")}</span>
        </div>
      );
    }

    if (showConfirm) {
      return (
        <Button
          onClick={() => {
            gameService.send("TRADE", {
              sellerId: farmId,
              tradeId: listing.id,
            });
            onClose();
          }}
        >
          <div className="flex items-center">
            <img src={SUNNYSIDE.icons.confirm} className="h-4 mr-1" />
            <span className="text-xs">{t("confirm")}</span>
          </div>
        </Button>
      );
    }

    const hasSFL = gameState.context.state.balance.gte(trade.sfl);
    const disabled =
      !hasSFL || !gameState.context.state.inventory["Block Buck"]?.gte(1);

    return (
      <Button
        disabled={disabled}
        onClick={() => {
          confirm();
        }}
      >
        {t("buy")}
      </Button>
    );
  };
  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <p className="text-xs mb-1 ml-0.5">{t("playerTrade.sale")}:</p>
        <Label type="info">{t("beta")}</Label>
      </div>
      <OuterPanel>
        <div className="flex justify-between">
          <div className="flex flex-wrap">
            {getKeys(trade.items).map((name) => (
              <Box
                image={ITEM_DETAILS[name].image}
                count={new Decimal(trade.items[name] ?? 0)}
                disabled
                key={name}
              />
            ))}
          </div>
          <div className="w-28">
            {Action()}

            <div className="flex items-center mt-1  justify-end mr-0.5">
              <p className="text-xs">{`${trade.sfl} SFL`}</p>
              <img src={token} className="h-6 ml-1" />
            </div>
            <div className="flex items-center mt-1  justify-end mr-0.5">
              <p className="text-xs">{`1 x`}</p>
              <img
                src={ITEM_DETAILS["Block Buck"].image}
                className="h-6 ml-1"
              />
            </div>
          </div>
        </div>
      </OuterPanel>
    </div>
  );
};
