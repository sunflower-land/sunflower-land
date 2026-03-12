import React, { useContext, useState } from "react";
import { useSelector } from "@xstate/react";
import { Context } from "features/game/GameProvider";
import { ModalContext } from "features/game/components/modal/ModalProvider";
import { ButtonPanel } from "components/ui/Panel";
import { Label } from "components/ui/Label";
import { SUNNYSIDE } from "assets/sunnyside";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { VIP_TRIAL_PERIOD_MS } from "features/game/lib/vipAccess";
import vipIcon from "assets/icons/vip.webp";

import { secondsToString } from "lib/utils/time";
import { useNow } from "lib/utils/hooks/useNow";

function acknowledgeVipExpiry() {
  localStorage.setItem("vipExpiryAcknowledged", new Date().toISOString());
}

function vipAcknowledgedAt() {
  const value = localStorage.getItem("vipExpiryAcknowledged");

  if (!value) return null;

  return new Date(value);
}

const THREE_DAYS_MS = 3 * 24 * 60 * 60 * 1000;
const TWENTY_FOUR_HOURS_MS = 24 * 60 * 60 * 1000;

export const VIPExpiryWidget: React.FC = () => {
  const { openModal } = useContext(ModalContext);
  const { t } = useAppTranslation();
  const [acknowledgedAt, setAcknowledgedAt] = useState<Date | null>(() =>
    vipAcknowledgedAt(),
  );
  const now = useNow();
  const { gameService } = useContext(Context);

  const vip = useSelector(gameService, (state) => state.context.state.vip);

  const expiresAt = Math.max(
    vip?.expiresAt ?? 0,
    (vip?.trialStartedAt ?? 0) + VIP_TRIAL_PERIOD_MS,
  );

  const isExpiring = now > expiresAt - THREE_DAYS_MS;
  const isExpired = now > expiresAt;

  const show = (() => {
    const isVipExpired = vip?.expiresAt && vip.expiresAt < now;
    if (isVipExpired) {
      const hasAcknowledgedExpiry =
        acknowledgedAt && acknowledgedAt.getTime() < now;
      return !hasAcknowledgedExpiry;
    }
    const acknowledgedRecently =
      acknowledgedAt && acknowledgedAt.getTime() > now - TWENTY_FOUR_HOURS_MS;
    return isExpiring && !acknowledgedRecently;
  })();

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    acknowledgeVipExpiry();
    setAcknowledgedAt(new Date());
  };

  const handleClick = () => {
    acknowledgeVipExpiry();
    openModal("VIP_SAVINGS");
    setAcknowledgedAt(new Date());
  };

  if (!show) {
    return null;
  }

  if (isExpired) {
    return (
      <ButtonPanel
        className="flex justify-center cursor-pointer"
        onClick={handleClick}
      >
        <div className="flex items-center">
          <Label type="danger" icon={vipIcon}>
            {t("vipExpiry.expired")}
          </Label>
          <img
            src={SUNNYSIDE.icons.close}
            className="h-5 cursor-pointer ml-2"
            alt="Close"
            onClick={handleClose}
          />
        </div>
      </ButtonPanel>
    );
  }

  return (
    <ButtonPanel
      className="flex justify-center cursor-pointer"
      onClick={handleClick}
    >
      <div>
        <div className="flex items-center">
          <Label type="info" icon={SUNNYSIDE.icons.stopwatch} className="ml-1">
            {t("vipExpiry.expiring")}
          </Label>
          <img
            src={SUNNYSIDE.icons.close}
            className="h-5 cursor-pointer ml-2"
            alt="Close"
            onClick={handleClose}
          />
        </div>
        <p className="text-xs">
          {t("vipExpiry.timeLeft", {
            time: secondsToString((expiresAt - now) / 1000, {
              length: "short",
            }),
          })}
        </p>
      </div>
    </ButtonPanel>
  );
};
