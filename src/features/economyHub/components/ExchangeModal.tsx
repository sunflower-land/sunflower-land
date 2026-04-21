import React, { useContext, useEffect, useState } from "react";
import { useSelector } from "@xstate/react";

import { ButtonPanel, Panel } from "components/ui/Panel";
import { Modal } from "components/ui/Modal";
import { Label } from "components/ui/Label";
import { Button } from "components/ui/Button";
import { SUNNYSIDE } from "assets/sunnyside";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

import { Context as GameContext } from "features/game/GameProvider";
import * as AuthProvider from "features/auth/lib/Provider";
import type { EconomyExchange } from "features/game/types/marketplace";
import { Loading } from "features/auth/components";
import { ErrorMessage } from "features/auth/ErrorMessage";

type Props = {
  onClose: () => void;
  exchanges: EconomyExchange[];
};

/**
 * Full exchange modal.
 *
 * Lists every exchange the player can redeem. Each row shows:
 *   [ icon ]  [ "5x Chicken Feet" / "Chicken Rescue" ]  [ "25 marks" ]
 *
 * Tapping a row opens a confirmation sub-modal. Confirming fires the
 * `economies.exchanged` post-effect with the exchange id; the UI waits on
 * the game machine (loading / success / error) before returning to the list.
 * The hub revalidates economies data when the effect succeeds so ✓ states
 * stay in sync.
 *
 * Claimed exchanges show a ✓ tick badge and are not clickable.
 *
 * Mount only while open; the parent unmounting clears local state and avoids
 * syncing `show` via an effect.
 */
export const ExchangeModal: React.FC<Props> = ({ onClose, exchanges }) => {
  const { t } = useAppTranslation();
  const { gameService } = useContext(GameContext);
  const { authService } = useContext(AuthProvider.Context);
  const authToken = authService.getSnapshot().context.user.rawToken as string;
  const [pending, setPending] = useState<EconomyExchange | null>(null);
  /** Only treat machine exchange states as belonging to this confirm flow. */
  const [inFlightId, setInFlightId] = useState<string | null>(null);

  const { isClaiming, isSuccess, isFailed, errorCode } = useSelector(
    gameService,
    (state) => ({
      isClaiming: state.matches("exchangingEconomy"),
      isSuccess: state.matches("exchangingEconomySuccess"),
      isFailed: state.matches("exchangingEconomyFailed"),
      errorCode: state.context.errorCode,
    }),
  );

  /** If the hub unmounts this modal mid post-effect, unblock the game machine. */
  useEffect(() => {
    return () => {
      const snap = gameService.getSnapshot();
      if (
        snap.matches("exchangingEconomy") ||
        snap.matches("exchangingEconomySuccess") ||
        snap.matches("exchangingEconomyFailed")
      ) {
        gameService.send("CONTINUE");
      }
    };
  }, [gameService]);

  const confirmExchange = () => {
    if (!pending) return;
    setInFlightId(pending.id);
    gameService.send("economies.exchanged", {
      effect: {
        type: "economies.exchanged",
        id: pending.id,
      },
      authToken,
    });
  };

  const acknowledge = () => {
    setInFlightId(null);
    gameService.send("CONTINUE");
    setPending(null);
  };

  const showWorking = !!pending && inFlightId === pending.id && isClaiming;
  const showDone = !!pending && inFlightId === pending.id && isSuccess;
  const showErr = !!pending && inFlightId === pending.id && isFailed;

  const confirmBackdrop =
    showWorking || showDone || showErr ? ("static" as const) : true;

  return (
    <>
      <Modal show={!pending} onHide={onClose}>
        <Panel>
          <div className="p-1">
            <Label type="vibrant" className="mb-2">
              {t("economyHub.exchange")}
            </Label>
            <p className="text-xs mb-3 leading-tight">
              {t("economyHub.exchangeDescription")}
            </p>

            {exchanges.length === 0 ? (
              <p className="text-xs p-1 mb-2 text-brown-700">
                {t("economyHub.noExchanges")}
              </p>
            ) : (
              <div className="flex flex-col gap-1 max-h-[50vh] overflow-y-auto scrollable pr-1 mb-2">
                {exchanges.map((exchange) => (
                  <ExchangeRow
                    key={exchange.id}
                    exchange={exchange}
                    onSelect={() => setPending(exchange)}
                    disabled={showWorking}
                  />
                ))}
              </div>
            )}

            <Button onClick={onClose}>{t("close")}</Button>
          </div>
        </Panel>
      </Modal>

      <Modal
        show={!!pending}
        backdrop={confirmBackdrop}
        onHide={() => {
          if (showWorking) return;
          setInFlightId(null);
          setPending(null);
        }}
      >
        <Panel>
          <div className="p-1">
            {showWorking && (
              <>
                <Label type="vibrant" className="mb-2">
                  {t("economyHub.confirmExchangeTitle")}
                </Label>
                <Loading text={t("claiming")} />
              </>
            )}

            {showDone && (
              <>
                <Label type="vibrant" className="mb-2">
                  {t("economyHub.confirmExchangeTitle")}
                </Label>
                <p className="text-sm mb-3 leading-tight">
                  {t("economyHub.exchangeSuccess")}
                </p>
                <Button onClick={acknowledge}>{t("continue")}</Button>
              </>
            )}

            {showErr && (
              <>
                <Label type="vibrant" className="mb-2">
                  {t("economyHub.confirmExchangeTitle")}
                </Label>
                <div className="mb-2">
                  {errorCode ? (
                    <ErrorMessage errorCode={errorCode} />
                  ) : (
                    <p className="text-sm text-brown-700">
                      {t("economyHub.exchangeFailed")}
                    </p>
                  )}
                </div>
                <Button onClick={acknowledge}>{t("continue")}</Button>
              </>
            )}

            {!showWorking && !showDone && !showErr && pending && (
              <>
                <Label type="vibrant" className="mb-2">
                  {t("economyHub.confirmExchangeTitle")}
                </Label>
                <p className="text-sm mb-3 leading-tight">
                  {t("economyHub.confirmExchangeMessage", {
                    itemCount: pending.itemAmount,
                    item: pending.itemName,
                    rewardCount: pending.rewardAmount,
                    reward: pending.rewardName,
                  })}
                </p>
                <div className="flex gap-1">
                  <Button onClick={() => setPending(null)}>
                    {t("cancel")}
                  </Button>
                  <Button onClick={confirmExchange}>{t("confirm")}</Button>
                </div>
              </>
            )}
          </div>
        </Panel>
      </Modal>
    </>
  );
};

type RowProps = {
  exchange: EconomyExchange;
  onSelect: () => void;
  disabled?: boolean;
};

const ExchangeRow: React.FC<RowProps> = ({ exchange, onSelect, disabled }) => {
  const { t } = useAppTranslation();

  return (
    <ButtonPanel
      onClick={exchange.claimed || disabled ? undefined : onSelect}
      disabled={exchange.claimed || disabled}
      className="flex items-center gap-2"
    >
      {/* Left: item icon. */}
      <div
        className="flex items-center justify-center flex-none"
        style={{
          width: `${PIXEL_SCALE * 16}px`,
          height: `${PIXEL_SCALE * 16}px`,
        }}
      >
        {exchange.itemImage ? (
          <img
            src={exchange.itemImage}
            alt=""
            className="object-contain"
            style={{
              maxWidth: "100%",
              maxHeight: "100%",
              imageRendering: "pixelated",
            }}
          />
        ) : (
          <div className="w-full h-full bg-brown-200 rounded-sm" />
        )}
      </div>

      {/* Middle: item amount + name, then economy name. */}
      <div className="flex-1 min-w-0">
        <p className="text-sm truncate">
          {t("economyHub.exchangeItemCount", {
            count: exchange.itemAmount,
            item: exchange.itemName,
          })}
        </p>
        <p className="text-xxs underline text-brown-700 truncate">
          {exchange.economyLabel}
        </p>
      </div>

      {/* Right: reward label or claimed tick. */}
      <div className="flex items-center flex-none">
        {exchange.claimed ? (
          <img
            src={SUNNYSIDE.icons.confirm}
            alt=""
            className="object-contain"
            style={{
              width: `${PIXEL_SCALE * 10}px`,
              height: `${PIXEL_SCALE * 10}px`,
            }}
          />
        ) : (
          <Label
            type="warning"
            icon={exchange.rewardImage}
            className="whitespace-nowrap"
          >
            {t("economyHub.exchangeRewardCount", {
              count: exchange.rewardAmount,
              reward: exchange.rewardName,
            })}
          </Label>
        )}
      </div>
    </ButtonPanel>
  );
};
