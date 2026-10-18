import React, { useContext, useState } from "react";
import { useSelector } from "@xstate/react";

import { SUNNYSIDE } from "assets/sunnyside";
import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";
import { Modal } from "components/ui/Modal";
import { InnerPanel } from "components/ui/Panel";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { Context as GameContext } from "features/game/GameProvider";
import type { MachineState } from "features/game/lib/gameMachine";
import * as AuthProvider from "features/auth/lib/Provider";
import type { AuthMachineState } from "features/auth/lib/authMachine";
import { ErrorMessage } from "features/auth/ErrorMessage";
import { Loading } from "features/auth/components/Loading";
import {
  formatAvailableAt,
  SOCIAL_PROVIDER_LABELS,
  SOCIAL_UNLINK_EVENTS,
  SOCIAL_UNLINK_MIN_COOLDOWN_DAYS,
  type SocialUnlinkResult,
  type UnlinkableSocialProvider,
} from "features/auth/lib/socialLink";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

/**
 * The soft-ban verification runs through Discord or Telegram, so those are
 * the only two offered here. X can be unlinked from Settings once the
 * player is back in the game.
 */
type SoftBanProvider = Extract<
  UnlinkableSocialProvider,
  "discord" | "telegram"
>;

const PROVIDERS: SoftBanProvider[] = ["discord", "telegram"];

const PROVIDER_ICONS: Record<SoftBanProvider, string> = {
  discord: SUNNYSIDE.icons.discord,
  telegram: SUNNYSIDE.icons.telegram,
};

const _discordLinked = (state: MachineState) => !!state.context.state.discord;
const _telegramLinked = (state: MachineState) => !!state.context.state.telegram;
const _unlinking = (state: MachineState) => state.matches("unlinkingSocial");
const _unlinked = (state: MachineState) =>
  state.matches("unlinkingSocialSuccess");
const _unlinkFailed = (state: MachineState) =>
  state.matches("unlinkingSocialFailed");
const _unlinkResult = (state: MachineState) =>
  state.context.data.unlinkingSocial as SocialUnlinkResult | undefined;
const _errorCode = (state: MachineState) => state.context.errorCode;
const _rawToken = (state: AuthMachineState) => state.context.user.rawToken;

interface Props {
  show: boolean;
  onClose: () => void;
}

/**
 * Lets a soft-banned player unlink Discord / Telegram without reaching
 * Settings, which the investigation screen blocks. One row per provider,
 * a confirm step that spells out the cooldown, then the request result.
 */
export const SoftBanSocialUnlink: React.FC<Props> = ({ show, onClose }) => {
  const { gameService } = useContext(GameContext);
  const { authService } = useContext(AuthProvider.Context);
  const { t } = useAppTranslation();

  const rawToken = useSelector(authService, _rawToken);
  const discordLinked = useSelector(gameService, _discordLinked);
  const telegramLinked = useSelector(gameService, _telegramLinked);
  const unlinking = useSelector(gameService, _unlinking);
  const unlinked = useSelector(gameService, _unlinked);
  const unlinkFailed = useSelector(gameService, _unlinkFailed);
  const unlinkResult = useSelector(gameService, _unlinkResult);
  const errorCode = useSelector(gameService, _errorCode);

  // Provider awaiting the player's confirmation
  const [confirming, setConfirming] = useState<SoftBanProvider>();

  const linked: Record<SoftBanProvider, boolean> = {
    discord: discordLinked,
    telegram: telegramLinked,
  };

  const inFlight = unlinking || unlinked || unlinkFailed;

  const close = () => {
    setConfirming(undefined);
    onClose();
  };

  const unlink = (provider: SoftBanProvider) => {
    setConfirming(undefined);
    gameService.send(SOCIAL_UNLINK_EVENTS[provider], {
      effect: { type: SOCIAL_UNLINK_EVENTS[provider] },
      authToken: rawToken,
    });
  };

  let content: React.ReactNode;

  if (unlinking) {
    content = (
      <Loading
        text={t("socialLink.unlinking", {
          provider: t("socialLink.genericProvider"),
        })}
      />
    );
  } else if (unlinked) {
    const provider = unlinkResult?.provider;
    const label = provider
      ? SOCIAL_PROVIDER_LABELS[provider]
      : t("socialLink.genericProvider");

    content = (
      <div className="flex flex-col gap-2">
        <p className="text-sm ml-1">
          {t("socialLink.unlinked", { provider: label })}
        </p>
        {!!unlinkResult?.availableAt && (
          <Label type="info" icon={SUNNYSIDE.icons.stopwatch} className="ml-1">
            {t("softBan.unlinkSocial.lockedUntil", {
              date: formatAvailableAt(unlinkResult.availableAt),
            })}
          </Label>
        )}
        <Button onClick={() => gameService.send("CONTINUE")}>
          {t("continue")}
        </Button>
      </div>
    );
  } else if (unlinkFailed && errorCode) {
    content = <ErrorMessage errorCode={errorCode} />;
  } else if (confirming) {
    const label = SOCIAL_PROVIDER_LABELS[confirming];

    content = (
      <div className="flex flex-col gap-2">
        <Label type="danger" icon={SUNNYSIDE.icons.stopwatch} className="ml-1">
          {t("softBan.unlinkSocial.lock", {
            days: SOCIAL_UNLINK_MIN_COOLDOWN_DAYS,
          })}
        </Label>
        <p className="text-xs ml-1">
          {t("softBan.unlinkSocial.warning", {
            provider: label,
            days: SOCIAL_UNLINK_MIN_COOLDOWN_DAYS,
          })}
        </p>
        <div className="flex gap-1">
          <Button onClick={() => setConfirming(undefined)}>
            {t("cancel")}
          </Button>
          <Button onClick={() => unlink(confirming)}>
            {t("softBan.unlinkSocial.confirm", { provider: label })}
          </Button>
        </div>
      </div>
    );
  } else {
    content = (
      <div className="flex flex-col gap-1">
        <p className="text-xs ml-1 mb-1">
          {t("softBan.unlinkSocial.description", {
            days: SOCIAL_UNLINK_MIN_COOLDOWN_DAYS,
          })}
        </p>
        {PROVIDERS.map((provider) => (
          <InnerPanel
            key={provider}
            className="flex items-center justify-between gap-2 p-1"
          >
            <Label type="default" icon={PROVIDER_ICONS[provider]}>
              {SOCIAL_PROVIDER_LABELS[provider]}
            </Label>
            {linked[provider] ? (
              <Button
                className="w-auto px-3 h-8 text-xs"
                onClick={() => setConfirming(provider)}
              >
                {t("softBan.unlinkSocial.unlink")}
              </Button>
            ) : (
              <span className="text-xs opacity-75 mr-1">
                {t("softBan.unlinkSocial.notLinked")}
              </span>
            )}
          </InnerPanel>
        ))}
      </div>
    );
  }

  return (
    // Closing mid-request would drop the result, so the panel only closes
    // once the player has acknowledged it.
    <Modal show={show} onHide={inFlight ? undefined : close}>
      <CloseButtonPanel
        title={t("softBan.unlinkSocial")}
        onClose={inFlight ? undefined : close}
      >
        {content}
      </CloseButtonPanel>
    </Modal>
  );
};
