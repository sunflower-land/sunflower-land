import React, { useContext } from "react";
import { useSelector } from "@xstate/react";

import { SUNNYSIDE } from "assets/sunnyside";
import { Label } from "components/ui/Label";
import { Modal } from "components/ui/Modal";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { Context as GameContext } from "features/game/GameProvider";
import type { MachineState } from "features/game/lib/gameMachine";
import {
  SocialUnlinkCard,
  SocialUnlinkStatus,
  useSocialUnlinkInFlight,
} from "features/auth/components/SocialUnlink";
import {
  SOCIAL_UNLINK_MIN_COOLDOWN_DAYS,
  type UnlinkableSocialProvider,
} from "features/auth/lib/socialLink";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

/**
 * The soft-ban verification is done through Discord or Telegram, so those
 * are the only two offered here. X can still be unlinked from Settings once
 * the player is back in the game.
 */
const PROVIDERS: UnlinkableSocialProvider[] = ["discord", "telegram"];

const _discordLinked = (state: MachineState) => !!state.context.state.discord;
const _telegramLinked = (state: MachineState) => !!state.context.state.telegram;

interface Props {
  show: boolean;
  onClose: () => void;
}

/**
 * Lets a soft-banned player unlink Discord / Telegram without reaching
 * Settings, which the investigation screen blocks. The unlink itself is the
 * same request and confirm step as Settings > Linked Accounts.
 */
export const SoftBanSocialUnlink: React.FC<Props> = ({ show, onClose }) => {
  const { gameService } = useContext(GameContext);
  const { t } = useAppTranslation();

  const inFlight = useSocialUnlinkInFlight();
  const discordLinked = useSelector(gameService, _discordLinked);
  const telegramLinked = useSelector(gameService, _telegramLinked);

  const linked: Record<UnlinkableSocialProvider, boolean> = {
    discord: discordLinked,
    telegram: telegramLinked,
    twitter: false,
  };
  const linkedProviders = PROVIDERS.filter((provider) => linked[provider]);

  return (
    // Closing mid-request would drop the success / error view, so the panel
    // only closes once the player has acknowledged the result.
    <Modal show={show} onHide={inFlight ? undefined : onClose}>
      <CloseButtonPanel
        title={t("softBan.unlinkSocial")}
        onClose={inFlight ? undefined : onClose}
      >
        {inFlight ? (
          <SocialUnlinkStatus />
        ) : (
          <div className="flex flex-col gap-1">
            <p className="text-xs mx-1">
              {t("softBan.unlinkSocial.description")}
            </p>
            <Label type="warning" icon={SUNNYSIDE.icons.stopwatch}>
              {t("softBan.unlinkSocial.cooldown", {
                days: SOCIAL_UNLINK_MIN_COOLDOWN_DAYS,
              })}
            </Label>

            {linkedProviders.map((provider) => (
              <SocialUnlinkCard key={provider} provider={provider} />
            ))}

            {linkedProviders.length === 0 && (
              <p className="text-xs italic opacity-75 mx-1 my-1">
                {t("softBan.unlinkSocial.none")}
              </p>
            )}
          </div>
        )}
      </CloseButtonPanel>
    </Modal>
  );
};
