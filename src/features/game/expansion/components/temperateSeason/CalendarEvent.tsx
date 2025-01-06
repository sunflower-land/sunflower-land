import React from "react";
import { Button } from "components/ui/Button";
import { Modal } from "components/ui/Modal";
import { Panel } from "components/ui/Panel";
import { useGame } from "features/game/GameProvider";
import { getPendingCalendarEvent } from "features/game/types/calendar";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { Tornado } from "./Tornado";

export const CalendarEvent: React.FC = () => {
  const { gameState, gameService } = useGame();
  const { t } = useAppTranslation();
  const event = getPendingCalendarEvent({ game: gameState.context.state });

  return (
    <Modal show>
      {event === "tornado" && <Tornado />}
      {!event && (
        <Panel>
          <Button onClick={() => gameService.send("ACKNOWLEDGE")}>
            {t("close")}
          </Button>
        </Panel>
      )}
    </Modal>
  );
};
