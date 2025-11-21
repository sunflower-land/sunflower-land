import { SUNNYSIDE } from "assets/sunnyside";
import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";
import { Panel } from "components/ui/Panel";
import {
  NoticeboardItems,
  NoticeboardItemsElements,
} from "features/world/ui/kingdom/KingdomNoticeboard";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import React, { useState } from "react";
import { SeasonalEventName } from "features/game/types/calendar";
import { useSelector } from "@xstate/react";
import { useGame } from "features/game/GameProvider";
import { MachineState } from "features/game/lib/gameMachine";
import { getRelativeTime } from "lib/utils/time";
import { useNow } from "lib/utils/hooks/useNow";
import { useMathRandom } from "lib/utils/hooks/useMathRandom";
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
  const randomOne = useMathRandom();
  const randomTwo = useMathRandom();
  const randomThree = useMathRandom();
  const now = useNow({ live: true });

  const [eventIconPositions] = useState<
    {
      top: number;
      left: number;
      delay: number;
    }[]
  >(
    [...Array(30)].map(() => ({
      top: randomOne * 100,
      left: randomTwo * 100,
      delay: randomThree * 2,
    })),
  );

  const eventStartTime = useSelector(
    gameService,
    (state: MachineState) => state.context.state.calendar[eventName]?.startedAt,
  );

  const getEventEndTime = () => {
    // In development: check at the start of each minute
    // const now = new Date();
    // const nextMinute = new Date(now);
    // nextMinute.setSeconds(0);
    // nextMinute.setMilliseconds(0);
    // nextMinute.setMinutes(nextMinute.getMinutes() + 1);
    // return nextMinute.getTime();

    // In production: check at UTC midnight
    const tomorrow = new Date(eventStartTime ?? now);
    tomorrow.setUTCHours(24, 0, 0, 0);
    return tomorrow.getTime();
  };

  const eventEndTime = getEventEndTime();

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
                {`Event Over - ${getRelativeTime(eventEndTime)}`}
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
