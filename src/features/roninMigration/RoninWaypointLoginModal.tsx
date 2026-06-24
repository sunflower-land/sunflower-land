import React, { useContext, useState } from "react";

import { Button } from "components/ui/Button";
import { Modal } from "components/ui/Modal";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { Context } from "features/game/GameProvider";
import { SUNNYSIDE } from "assets/sunnyside";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { RoninMigrateAssistant } from "./RoninMigrateAssistant";
import { setRoninWaypointPopupShown } from "./roninWaypointPopup";

/**
 * Shown via the gameMachine's `roninMigration` notifying state when a player
 * logs in with any Ronin wallet (Ronin Waypoint or the Ronin browser
 * extension). Explains the Ronin Waypoint migration situation, shows the
 * migration guide, and can open the migration assistant (a copy of the Bank
 * transfer flow). The machine decides when this appears - see the
 * `roninMigration` transition in gameMachine.ts.
 */
export const RoninWaypointLoginModal: React.FC = () => {
  const { t } = useAppTranslation();
  const { gameService } = useContext(Context);

  const [showAssistant, setShowAssistant] = useState(false);

  const onClose = () => {
    // Persist the "shown" flag synchronously here, before sending ACKNOWLEDGE.
    // The machine's `notifying` state re-evaluates its `always` guards as part
    // of the same macrostep, and one of them re-enters `roninMigration` unless
    // this flag is already set. XState v4 runs plain side-effect actions after
    // those guards are computed, so writing it from a machine action would lose
    // the race and require a second click to dismiss.
    setRoninWaypointPopupShown();
    gameService.send("ACKNOWLEDGE");
  };

  return (
    <Modal show onHide={onClose}>
      {showAssistant ? (
        <RoninMigrateAssistant
          onClose={onClose}
          onBack={() => setShowAssistant(false)}
        />
      ) : (
        <CloseButtonPanel
          title={t("transfer.ronin.migrate.loginTitle")}
          onClose={onClose}
        >
          <div className="flex flex-col gap-2 p-1 mb-2 text-xs">
            <p>
              <img
                src={SUNNYSIDE.icons.roninIcon}
                className="h-5 inline-block mr-1 align-text-bottom"
                alt="Ronin"
              />
              {t("transfer.ronin.migrate.loginIntro")}
            </p>
            <p>
              <img
                src={SUNNYSIDE.icons.roninIcon}
                className="h-5 inline-block mr-1 align-text-bottom"
                alt="Ronin"
              />
              {t("transfer.ronin.migrate.loginIntro2")}
            </p>
            <p>
              {" "}
              <img
                src={SUNNYSIDE.icons.roninIcon}
                className="h-5 inline-block mr-1 align-text-bottom"
                alt="Ronin"
              />
              {t("transfer.ronin.migrate.deadline")}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-1">
            <Button onClick={onClose}>
              {t("transfer.ronin.migrate.notWaypoint")}
            </Button>
            <Button onClick={() => setShowAssistant(true)}>
              {t("transfer.ronin.migrate.migrateNow")}
            </Button>
          </div>
        </CloseButtonPanel>
      )}
    </Modal>
  );
};
