import clipboard from "clipboard";
import React, { useState } from "react";

import { SUNNYSIDE } from "assets/sunnyside";
import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";
import { useGame } from "features/game/GameProvider";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { useSound } from "lib/utils/hooks/useSound";

/**
 * Shown when `ban.status === "lock"` — a hold placed by hand from the support
 * dashboard.
 *
 * Deliberately not `SoftBan`: that screen exists to walk the player through
 * Discord / Telegram / face verification, and none of those lift a lock. Only
 * support does, so the only route offered here is a support ticket. There is
 * no dismiss button — the modal is the whole session until the hold is lifted.
 */
export const Locked: React.FC = () => {
  const { gameService } = useGame();
  const { t } = useAppTranslation();

  const [copied, setCopied] = useState(false);
  const copypaste = useSound("copypaste");

  const farmId = gameService.getSnapshot()?.context?.farmId;

  return (
    <div className="p-1">
      <div className="flex justify-between flex-wrap items-center">
        <Label icon={SUNNYSIDE.icons.lock} type="danger" className="mb-1">
          {t("lock.title")}
        </Label>
        <Label
          type="default"
          popup={copied}
          className="mb-1"
          onClick={() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
            copypaste.play();
            clipboard.copy(String(farmId));
          }}
        >
          {t("gameOptions.farmId", { farmId })}
        </Label>
      </div>
      <p className="text-xs mb-2">{t("lock.description")}</p>
      <p className="text-xs mb-2">{t("lock.contactSupport")}</p>
      <Button
        onClick={() =>
          window.open(
            "https://sunflower-land.com/support/",
            "_blank",
            "noopener,noreferrer",
          )
        }
      >
        {t("lock.openSupport")}
      </Button>
    </div>
  );
};
