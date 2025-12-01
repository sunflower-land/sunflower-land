import { SUNNYSIDE } from "assets/sunnyside";
import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";
import { Panel } from "components/ui/Panel";
import {
  NoticeboardItems,
  NoticeboardItemsElements,
} from "features/world/ui/kingdom/KingdomNoticeboard";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import React, { useMemo, useState } from "react";
import { SeasonalEventName } from "features/game/types/calendar";
import { useSelector } from "@xstate/react";
import { useGame } from "features/game/GameProvider";
import { MachineState } from "features/game/lib/gameMachine";
import { getRelativeTime } from "lib/utils/time";
import { useNow } from "lib/utils/hooks/useNow";
import { useWhenTime } from "lib/utils/hooks/useWhenTime";

interface Props {
  eventTitle: string;
  eventName: SeasonalEventName;
  eventIcon: string;
  noticeboardItems: NoticeboardItemsElements[];
  acknowledge: () => void;
  handleAFK: () => void;
  showEventIcons?: boolean;
}

function createEventIconPositions() {
  return Array.from({ length: 30 }, () => ({
    top: Math.random() * 100,
    left: Math.random() * 100,
    delay: Math.random() * 2,
  }));
}

export const WeatherEvent: React.FC<Props> = ({
  acknowledge,
  handleAFK,
  eventIcon,
  noticeboardItems,
  eventTitle,
  showEventIcons,
  eventName,
}) => {
  const { t } = useAppTranslation();
  const [eventOver, setEventOver] = useState(false);
  const { gameService } = useGame();
  // Snapshot of "now" at mount – stays stable for the life of this component
  const now = useNow();

  const [eventIconPositions] = useState<
    {
      top: number;
      left: number;
      delay: number;
    }[]
  >(createEventIconPositions());

  const eventStartTime = useSelector(
    gameService,
    (state: MachineState) => state.context.state.calendar[eventName]?.startedAt,
  );

  // Compute the event end time once from a stable base time:
  // - Prefer the server/event-start time when available
  // - Fallback to the initial "now" snapshot
  const eventEndTime = useMemo(() => {
    const baseTime = eventStartTime ?? now;

    // In development: could check at the start of each minute using baseTime
    // const minuteStart = new Date(baseTime);
    // minuteStart.setSeconds(0);
    // minuteStart.setMilliseconds(0);
    // minuteStart.setMinutes(minuteStart.getMinutes() + 1);
    // return minuteStart.getTime();

    // In production: check at UTC midnight of the base day
    const midnight = new Date(baseTime);
    midnight.setUTCHours(24, 0, 0, 0);
    return midnight.getTime();
  }, [eventStartTime, now]);

  useWhenTime({
    targetTime: eventEndTime,
    callback: () => setEventOver(true),
  });

  return (
    <>
      <Panel className="relative z-10">
        <div className="p-1">
          <div className="flex flex-col items-start justify-between mb-2 gap-1">
            <Label type="vibrant" icon={eventIcon}>
              {eventTitle}
            </Label>
            {eventOver && (
              <Label type="danger" icon={SUNNYSIDE.icons.stopwatch}>
                {`Event Over - ${getRelativeTime(eventEndTime, now)}`}
              </Label>
            )}
          </div>
          <NoticeboardItems items={noticeboardItems} />
        </div>
        <Button onClick={eventOver ? handleAFK : acknowledge}>
          {t("continue")}
        </Button>
      </Panel>
      {showEventIcons && (
        <div className="fixed inset-0  overflow-hidden">
          {eventIconPositions.map(({ top, left, delay }, i) => (
            <img
              key={i}
              src={eventIcon}
              className="w-12 absolute animate-pulse"
              style={{
                left: `${left}%`,
                top: `${top}%`,
                animationDelay: `${delay}s`,
              }}
            />
          ))}
        </div>
      )}
    </>
  );
};
