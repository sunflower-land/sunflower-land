import React, { useContext } from "react";
import { useSelector } from "@xstate/react";

import { Label } from "components/ui/Label";
import { Context } from "features/game/GameProvider";
import type { MachineState } from "features/game/lib/gameMachine";
import {
  formatWithdrawableDate,
  getWithdrawBlockedUntil,
} from "features/game/lib/withdrawCooldown";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

const _errorDetails = (state: MachineState) => state.context.errorDetails;

/**
 * A FLOWER withdrawal was refused because another farm on the same network
 * withdrew recently. The API says when the hold lifts via
 * `data.blockedUntil`; without it only the generic wording is shown.
 */
export const DuplicateWithdraw: React.FC = () => {
  const { t } = useAppTranslation();
  const { gameService } = useContext(Context);

  const errorDetails = useSelector(gameService, _errorDetails);
  const blockedUntil = getWithdrawBlockedUntil(errorDetails);

  return (
    <div className=" p-1">
      <Label type="danger" className="mb-2">
        {t("withdraw.duplicate.title")}
      </Label>
      <p className="text-xs mb-1">{t("withdraw.duplicate.description")}</p>
      {blockedUntil !== undefined && (
        <p className="text-xs mt-2">
          {t("withdraw.duplicate.blockedUntil", {
            date: formatWithdrawableDate(blockedUntil),
          })}
        </p>
      )}
      <p className="text-xs mt-2">{t("withdraw.duplicate.waitMessage")}</p>
    </div>
  );
};
