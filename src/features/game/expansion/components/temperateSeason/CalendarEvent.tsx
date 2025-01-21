import React, { useContext } from "react";
import { Button } from "components/ui/Button";
import { Modal } from "components/ui/Modal";
import { Panel } from "components/ui/Panel";
import { Context } from "features/game/GameProvider";
import { getActiveCalendarEvent } from "features/game/types/calendar";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { Tornado } from "./Tornado";
import { Tsunami } from "./Tsunami";
import { FullMoon } from "./FullMoon";
import { GreatFreeze } from "./GreatFreeze";
import { DoubleDelivery } from "./DoubleDelivery";
import { MachineState } from "features/game/lib/gameMachine";
import { useSelector } from "@xstate/react";
import { BountifulHarvest } from "./BountifulHarvest";
import { InsectPlague } from "./InsectPlague";
import { Sunshower } from "./Sunshower";

const _state = (state: MachineState) => state.context.state;

export const CalendarEvent: React.FC = () => {
  const { gameService } = useContext(Context);
  const state = useSelector(gameService, _state);
  const { t } = useAppTranslation();
  const event = getActiveCalendarEvent({ game: state });

  const handleAcknowledge = () => {
    gameService.send({ type: "calendarEvent.acknowledged" });
    gameService.send({ type: "ACKNOWLEDGE" });
  };

  const handleAFK = () => {
    gameService.send({ type: "daily.reset" });
    gameService.send({ type: "CONTINUE" });
  };

  return (
    <Modal show>
      {event === "tornado" && <Tornado acknowledge={handleAcknowledge} />}
      {event === "tsunami" && (
        <Tsunami acknowledge={handleAcknowledge} handleAFK={handleAFK} />
      )}
      {event === "greatFreeze" && (
        <GreatFreeze acknowledge={handleAcknowledge} />
      )}
      {event === "fullMoon" && <FullMoon acknowledge={handleAcknowledge} />}
      {event === "doubleDelivery" && (
        <DoubleDelivery acknowledge={handleAcknowledge} />
      )}
      {event === "bountifulHarvest" && (
        <BountifulHarvest acknowledge={handleAcknowledge} />
      )}
      {event === "insectPlague" && (
        <InsectPlague acknowledge={handleAcknowledge} />
      )}
      {event === "sunshower" && <Sunshower acknowledge={handleAcknowledge} />}
      {!event && (
        <Panel>
          <Button
            onClick={() => {
              gameService.send({ type: "ACKNOWLEDGE" });
            }}
          >
            {t("close")}
          </Button>
        </Panel>
      )}
    </Modal>
  );
};
