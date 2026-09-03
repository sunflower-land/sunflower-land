import React, { useContext } from "react";
import { useSelector } from "@xstate/react";

import { SUNNYSIDE } from "assets/sunnyside";
import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";
import { Context } from "features/game/GameProvider";
import type { MachineState } from "features/game/lib/gameMachine";
import { type ErrorCode, ERRORS } from "lib/errors";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import {
  clearSocialLinkAttempt,
  clearSocialLinkUrlParams,
  formatAvailableAt,
  getUrlAvailableAt,
  readSocialLinkAttempt,
  SOCIAL_PROVIDER_LABELS,
} from "../lib/socialLink";

const _errorDetails = (state: MachineState) => state.context.errorDetails;
const _isTelegramLinkFailed = (state: MachineState) =>
  state.matches("linkingTelegramFailed");
const _isUrlError = (state: MachineState) => state.matches("error");

interface Props {
  errorCode: ErrorCode;
}

/**
 * A social link (or unlink) was refused. Reached two ways:
 *  - Telegram links are an effect, so this renders in the effect-failed
 *    modal with `availableAt` on `context.errorDetails`.
 *  - Discord / X link via OAuth redirect, so this renders from the game
 *    machine's `error` state with `availableAt` in the query string.
 */
export const SocialLinkError: React.FC<Props> = ({ errorCode }) => {
  const { gameService } = useContext(Context);
  const { t } = useAppTranslation();

  const errorDetails = useSelector(gameService, _errorDetails);
  const isTelegramLinkFailed = useSelector(gameService, _isTelegramLinkFailed);
  const isUrlError = useSelector(gameService, _isUrlError);

  const provider = isTelegramLinkFailed ? "telegram" : readSocialLinkAttempt();
  const providerLabel = provider
    ? SOCIAL_PROVIDER_LABELS[provider]
    : t("socialLink.genericProvider");

  const availableAt =
    typeof errorDetails?.availableAt === "number"
      ? errorDetails.availableAt
      : getUrlAvailableAt();
  const date = availableAt ? formatAvailableAt(availableAt) : "";

  const isNotLinked = errorCode === ERRORS.SOCIAL_NOT_LINKED;

  const message =
    errorCode === ERRORS.SOCIAL_ACCOUNT_RECLAIMED
      ? t("socialLink.error.reclaimed", { provider: providerLabel, date })
      : errorCode === ERRORS.SOCIAL_ACCOUNT_COOLDOWN
        ? t("socialLink.error.cooldown", { provider: providerLabel, date })
        : isNotLinked
          ? t("socialLink.error.notLinked", { provider: providerLabel })
          : t("socialLink.error.alreadyLinked", { provider: providerLabel });

  const onContinue = () => {
    clearSocialLinkAttempt();
    clearSocialLinkUrlParams();

    if (isNotLinked) {
      // The client thought the account was linked and the server disagreed.
      // A pruned response can't tell us a key is gone, so reload to resync.
      window.location.reload();
      return;
    }

    // From `error` (OAuth redirect) this reloads the session; from an
    // effect-failed state it just returns to playing.
    gameService.send(isUrlError ? "REFRESH" : "CONTINUE");
  };

  return (
    <div className="flex flex-col text-center items-center p-1">
      <div className="flex mb-3 items-center ml-8">
        <img
          src={SUNNYSIDE.npcs.humanDeath}
          alt={t("warning")}
          className="w-full"
        />
      </div>

      <Label type="danger" className="mb-2">
        {t("socialLink.error.title")}
      </Label>

      <p className="text-sm text-center mb-3">{message}</p>

      {!!availableAt && (
        <Label type="info" icon={SUNNYSIDE.icons.stopwatch} className="mb-3">
          {date}
        </Label>
      )}

      {!isNotLinked && (
        <p className="text-xs text-center mb-3 opacity-75">
          {t("socialLink.error.cooldownRule")}
        </p>
      )}

      <Button onClick={onContinue}>
        {t(isNotLinked ? "refresh" : "continue")}
      </Button>
    </div>
  );
};
