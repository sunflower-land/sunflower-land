import React, { useContext, useState } from "react";
import { useSelector } from "@xstate/react";

import { Context } from "features/game/GameProvider";
import type { MachineState } from "features/game/lib/gameMachine";
import { Modal } from "components/ui/Modal";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { useNow } from "lib/utils/hooks/useNow";
import { getActiveWeather } from "features/game/types/weather";
import {
  EventTimeLabel,
  ProtectionRow,
  WEATHER_EVENT_ICONS,
  useForecastState,
} from "./WeatherForecast";

const _weather = (state: MachineState) => state.context.state.weather;

/**
 * Shown once per weather event, when it has started: what it does, how long
 * it lasts and whether the farm is ready for it.
 */
export const WeatherEventPopup: React.FC = () => {
  const { gameService } = useContext(Context);
  const { t } = useAppTranslation();
  // Ticks every second so Continue knows whether the event is still running
  // when the player clicks.
  const now = useNow({ live: true, intervalMs: 1000 });

  const weather = useSelector(gameService, _weather);
  const { events, items, unprotected, guardianCovered, guardiansPlaced } =
    useForecastState(now);

  // The running event, read from the current state so its start matches the
  // forecast's. The one the popup opened for stays shown if it ends while the
  // popup is still open.
  const [opened] = useState(() => getActiveWeather({ weather, now }));
  const running = getActiveWeather({ weather, now });
  const event = running ?? opened;

  const close = () => {
    // Only a running event can be acknowledged; one that ended while the
    // popup was open needs nothing recorded.
    if (running) {
      gameService.send({ type: "weather.acknowledged" });
    }
    gameService.send({ type: "ACKNOWLEDGE" });
  };

  return (
    <Modal show>
      <CloseButtonPanel onClose={close}>
        <div className="flex flex-col gap-2 p-1">
          {event && (
            <>
              <div className="flex flex-wrap items-center gap-1">
                <Label type="vibrant" icon={WEATHER_EVENT_ICONS[event.name]}>
                  {t(`weather.events.${event.name}`)}
                </Label>
                <EventTimeLabel event={event} now={now} />
              </div>
              <div className="flex items-center gap-2 ml-1">
                <img
                  src={WEATHER_EVENT_ICONS[event.name]}
                  className="w-8 object-contain"
                />
                <span className="text-xs">
                  {t(`weather.effects.${event.name}`)}
                </span>
              </div>
              {event.endAt > now && (
                <ProtectionRow
                  event={event}
                  now={now}
                  events={events}
                  items={items}
                  unprotected={unprotected}
                  guardianCovered={guardianCovered}
                  guardiansPlaced={guardiansPlaced}
                />
              )}
            </>
          )}
        </div>
        <Button onClick={close}>{t("continue")}</Button>
      </CloseButtonPanel>
    </Modal>
  );
};
