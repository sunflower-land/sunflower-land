import React, { type PropsWithChildren, useContext, useState } from "react";
import { useSelector } from "@xstate/react";

import { SUNNYSIDE } from "assets/sunnyside";
import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";
import { ButtonPanel, InnerPanel } from "components/ui/Panel";
import { Context as GameContext } from "features/game/GameProvider";
import type { MachineState } from "features/game/lib/gameMachine";
import * as AuthProvider from "features/auth/lib/Provider";
import type { AuthMachineState } from "features/auth/lib/authMachine";
import { ErrorMessage } from "features/auth/ErrorMessage";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { Loading } from "./Loading";
import {
  formatAvailableAt,
  SOCIAL_PROVIDER_LABELS,
  SOCIAL_UNLINK_EVENTS,
  SOCIAL_UNLINK_MIN_COOLDOWN_DAYS,
  type SocialUnlinkResult,
  type UnlinkableSocialProvider,
} from "../lib/socialLink";

const PROVIDER_ICONS: Record<UnlinkableSocialProvider, string> = {
  discord: SUNNYSIDE.icons.discord,
  twitter: SUNNYSIDE.icons.x,
  telegram: SUNNYSIDE.icons.telegram,
};

const _unlinking = (state: MachineState) => state.matches("unlinkingSocial");
const _unlinkingSuccess = (state: MachineState) =>
  state.matches("unlinkingSocialSuccess");
const _unlinkingFailed = (state: MachineState) =>
  state.matches("unlinkingSocialFailed");
const _unlinkResult = (state: MachineState) =>
  state.context.data.unlinkingSocial as SocialUnlinkResult | undefined;
const _errorCode = (state: MachineState) => state.context.errorCode;
const _rawToken = (state: AuthMachineState) => state.context.user.rawToken;

interface GateProps {
  provider: UnlinkableSocialProvider;
  /** Called after the player acknowledges a successful unlink. */
  onDone?: () => void;
}

/**
 * Wraps a provider's settings panel. While an unlink is in flight it
 * replaces the panel with the loading / success / error view; otherwise it
 * renders the panel and, if the provider is linked, an "Unlink" card below.
 */
export const SocialUnlinkGate: React.FC<PropsWithChildren<GateProps>> = ({
  provider,
  onDone,
  children,
}) => {
  const { gameService } = useContext(GameContext);
  const { t } = useAppTranslation();

  const unlinking = useSelector(gameService, _unlinking);
  const unlinkingSuccess = useSelector(gameService, _unlinkingSuccess);
  const unlinkingFailed = useSelector(gameService, _unlinkingFailed);
  const unlinkResult = useSelector(gameService, _unlinkResult);
  const errorCode = useSelector(gameService, _errorCode);
  const linked = useSelector(
    gameService,
    (state: MachineState) => !!state.context.state[provider],
  );

  const providerLabel = SOCIAL_PROVIDER_LABELS[provider];

  if (unlinking) {
    return (
      <Loading text={t("socialLink.unlinking", { provider: providerLabel })} />
    );
  }

  if (unlinkingSuccess) {
    // The response names the provider; trust it over the prop in case the
    // success state outlives a panel switch.
    const unlinkedLabel = unlinkResult?.provider
      ? SOCIAL_PROVIDER_LABELS[unlinkResult.provider]
      : providerLabel;
    const availableAt = unlinkResult?.availableAt;

    return (
      <div className="flex flex-col gap-2">
        <p className="text-sm ml-1">
          {t("socialLink.unlinked", { provider: unlinkedLabel })}
        </p>

        {!!availableAt && (
          <ButtonPanel variant="card">
            <div className="flex items-center gap-2">
              <Label type="info" icon={SUNNYSIDE.icons.stopwatch}>
                {formatAvailableAt(availableAt)}
              </Label>
            </div>
            <p className="text-xs mt-1 ml-1">
              {t("socialLink.unlinked.availableAt", {
                provider: unlinkedLabel,
                date: formatAvailableAt(availableAt),
              })}
            </p>
          </ButtonPanel>
        )}

        <Button
          onClick={() => {
            gameService.send("CONTINUE");
            onDone?.();
          }}
        >
          {t("continue")}
        </Button>
      </div>
    );
  }

  if (unlinkingFailed && errorCode) {
    return <ErrorMessage errorCode={errorCode} />;
  }

  return (
    <>
      {children}
      {linked && <SocialUnlinkCard provider={provider} />}
    </>
  );
};

const SocialUnlinkCard: React.FC<{ provider: UnlinkableSocialProvider }> = ({
  provider,
}) => {
  const { gameService } = useContext(GameContext);
  const { authService } = useContext(AuthProvider.Context);
  const { t } = useAppTranslation();

  const rawToken = useSelector(authService, _rawToken);
  const twitterUsername = useSelector(
    gameService,
    (state: MachineState) => state.context.state.twitter?.username,
  );

  const [confirming, setConfirming] = useState(false);

  const providerLabel = SOCIAL_PROVIDER_LABELS[provider];

  const unlink = () => {
    setConfirming(false);
    gameService.send(SOCIAL_UNLINK_EVENTS[provider], {
      effect: { type: SOCIAL_UNLINK_EVENTS[provider] },
      authToken: rawToken,
    });
  };

  // X is the only provider whose handle reaches the client
  const description =
    provider === "twitter" && twitterUsername
      ? t("socialLink.unlink.descriptionWithHandle", {
          provider: providerLabel,
          handle: `@${twitterUsername}`,
        })
      : t("socialLink.unlink.description", { provider: providerLabel });

  return (
    <ButtonPanel variant="card">
      <div className="flex items-center justify-between gap-2">
        <Label type="default" icon={PROVIDER_ICONS[provider]}>
          {t("socialLink.unlink.title", { provider: providerLabel })}
        </Label>
        {!confirming && (
          <Button
            className="text-xs h-8 w-auto px-2 min-w-20"
            onClick={() => setConfirming(true)}
          >
            {t("socialLink.unlink")}
          </Button>
        )}
      </div>

      <p className="text-xs italic opacity-75 mt-1 ml-1">{description}</p>

      {confirming && (
        <InnerPanel className="mt-2 p-2 flex flex-col gap-2">
          <Label type="danger" icon={SUNNYSIDE.icons.stopwatch}>
            {t("socialLink.unlink.cooldownLabel", {
              days: SOCIAL_UNLINK_MIN_COOLDOWN_DAYS,
            })}
          </Label>
          <p className="text-xs">
            {t("socialLink.unlink.warning", {
              provider: providerLabel,
              days: SOCIAL_UNLINK_MIN_COOLDOWN_DAYS,
            })}
          </p>
          <p className="text-xs opacity-75">
            {t("socialLink.unlink.setupNote")}
          </p>
          <div className="flex gap-1 justify-end">
            <Button
              className="w-auto px-2"
              onClick={() => setConfirming(false)}
            >
              {t("socialLink.unlink.keep")}
            </Button>
            <Button className="w-auto px-2" onClick={unlink}>
              {t("socialLink.unlink.confirm")}
            </Button>
          </div>
        </InnerPanel>
      )}
    </ButtonPanel>
  );
};
