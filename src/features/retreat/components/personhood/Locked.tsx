import clipboard from "clipboard";
import React, { useContext, useState } from "react";
import { useSelector } from "@xstate/react";

import { SUNNYSIDE } from "assets/sunnyside";
import { Label } from "components/ui/Label";
import { Context, useGame } from "features/game/GameProvider";
import type { MachineState } from "features/game/lib/gameMachine";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { useSound } from "lib/utils/hooks/useSound";
import { SoftBan } from "./SoftBan";

const _banStatus = (state: MachineState) => state.context.state.ban.status;

const _isLocked = (state: MachineState) =>
  _banStatus(state) === "lock" || _banStatus(state) === "investigating";

/**
 * Whether this account is on hold: a support `lock` or a soft ban.
 *
 * Neither stops the player playing — the API keeps accepting their saves.
 * Both stop value leaving the account, so this is asked at the places that
 * move value: the bank's withdraw and transfer tabs, and every marketplace
 * action that is not a cancellation.
 */
export function useIsLocked(): boolean {
  const { gameService } = useContext(Context);

  return useSelector(gameService, _isLocked);
}

/**
 * Shown in place of a trade or a withdrawal when the account is on hold.
 *
 * A soft ban is lifted by the player themselves, so they get the `SoftBan`
 * steps (Discord / Telegram, then face verification) right where they were
 * blocked.
 *
 * A lock is different: the player has done nothing wrong as far as they know,
 * and most holds are lifted — so the copy reassures rather than accuses, and
 * never describes what is being checked. None of the verification steps lift
 * a lock. Support does, so a ticket is the only route offered, kept quiet
 * because most players will not need it.
 */
export const Locked: React.FC = () => {
  const { gameService } = useGame();
  const { t } = useAppTranslation();

  const status = useSelector(gameService, _banStatus);

  const [copied, setCopied] = useState(false);
  const copypaste = useSound("copypaste");

  const farmId = gameService.getSnapshot()?.context?.farmId;

  if (status === "investigating") {
    return <SoftBan />;
  }

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
