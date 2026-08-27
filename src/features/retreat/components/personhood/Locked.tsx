import clipboard from "clipboard";
import React, { useContext, useState } from "react";
import { useSelector } from "@xstate/react";

import { SUNNYSIDE } from "assets/sunnyside";
import { Label } from "components/ui/Label";
import { Context, useGame } from "features/game/GameProvider";
import type { MachineState } from "features/game/lib/gameMachine";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { useSound } from "lib/utils/hooks/useSound";

const _isLocked = (state: MachineState) =>
  state.context.state.ban.status === "lock";

/**
 * Whether support has this account on hold.
 *
 * A lock does not stop the player playing — the API keeps accepting their
 * saves. It stops value leaving the account, so this is asked at the places
 * that move value: the bank's withdraw and transfer tabs, and every
 * marketplace action that is not a cancellation.
 */
export function useIsLocked(): boolean {
  const { gameService } = useContext(Context);

  return useSelector(gameService, _isLocked);
}

/**
 * Shown in place of a trade or a withdrawal when the account is on hold.
 *
 * The player has done nothing wrong as far as they know, and most holds are
 * lifted — so the copy reassures rather than accuses, and never describes what
 * is being checked. Deliberately not `SoftBan`: that screen walks the player
 * through Discord / Telegram / face verification, and none of those lift a
 * lock. Support does, so a ticket is the only route offered, kept quiet
 * because most players will not need it.
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
        <Label icon={SUNNYSIDE.icons.lock} type="default" className="mb-1">
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
      <p
        className="underline cursor-pointer text-xs my-1"
        onClick={() =>
          window.open(
            "https://sunflower-land.com/support/",
            "_blank",
            "noopener,noreferrer",
          )
        }
      >
        {t("lock.openSupport")}
      </p>
    </div>
  );
};
