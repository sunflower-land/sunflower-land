import React, { useContext } from "react";

import { useSelector } from "@xstate/react";
import { Button } from "components/ui/Button";

import { PortalContext } from "../../lib/PortalProvider";
import { Label } from "components/ui/Label";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { PortalMachineState } from "../../lib/halloweenMachine";
import sfl from "assets/icons/sfl.webp";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import {
  HALLOWEEN_NPC_WEARABLES,
  RESTOCK_ATTEMPTS,
  RESTOCK_ATTEMPTS_SFL,
  UNLIMITED_ATTEMPTS_SFL,
} from "../../HalloweenConstants";
import { purchase } from "features/portal/lib/portalUtil";
import { SUNNYSIDE } from "assets/sunnyside";
import { setPrecision } from "lib/utils/formatNumber";
import sflIcon from "assets/icons/sfl.webp";
import Decimal from "decimal.js-light";
import { PIXEL_SCALE } from "features/game/lib/constants";

const _sflBalance = (state: PortalMachineState) =>
  state.context.state?.balance ?? new Decimal(0);

export const HalloweenNoAttemptsPanel: React.FC = () => {
  const { portalService } = useContext(PortalContext);
  const { t } = useAppTranslation();

  const sflBalance = useSelector(portalService, _sflBalance);

  return (
    <CloseButtonPanel bumpkinParts={HALLOWEEN_NPC_WEARABLES}>
      <div className="p-2">
        <div className="flex gap-1 justify-between items-center mb-2">
          <Label icon={SUNNYSIDE.icons.lock} type="danger">
            {t("halloween.noAttemptsRemaining")}
          </Label>
          <Label
            icon={sfl}
            type={sflBalance.lt(RESTOCK_ATTEMPTS_SFL) ? "danger" : "default"}
          >
            {t("halloween.sflRequired")}
          </Label>
        </div>

        <p className="text-sm mb-2">{t("halloween.youHaveRunOutOfAttempts")}</p>
        <p className="text-sm mb-2">{t("halloween.wouldYouLikeToUnlock")}</p>

        <div className="flex items-center space-x-1 relative">
          <p className="balance-text">{setPrecision(sflBalance).toString()}</p>
          <img
            src={sflIcon}
            alt="SFL"
            style={{
              width: `${PIXEL_SCALE * 11}px`,
            }}
          />
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <Button onClick={() => portalService.send("CANCEL_PURCHASE")}>
          {t("back")}
        </Button>
        <Button
          disabled={sflBalance.lt(RESTOCK_ATTEMPTS_SFL)}
          onClick={() =>
            purchase({
              sfl: RESTOCK_ATTEMPTS_SFL,
              items: {},
            })
          }
        >
          {t("halloween.buyAttempts", {
            attempts: RESTOCK_ATTEMPTS,
            sfl: RESTOCK_ATTEMPTS_SFL,
          })}
        </Button>
        <Button
          disabled={sflBalance.lt(UNLIMITED_ATTEMPTS_SFL)}
          onClick={() =>
            purchase({
              sfl: UNLIMITED_ATTEMPTS_SFL,
              items: {},
            })
          }
        >
          {t("halloween.unlockAttempts", {
            sfl: UNLIMITED_ATTEMPTS_SFL,
          })}
        </Button>
      </div>
    </CloseButtonPanel>
  );
};
