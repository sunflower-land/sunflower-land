import { SUNNYSIDE } from "assets/sunnyside";
import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";
import { Panel } from "components/ui/Panel";
import {
  NoticeboardItems,
  NoticeboardItemsElements,
} from "features/world/ui/kingdom/KingdomNoticeboard";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import React, { useCallback, useRef, useState } from "react";
import { useEventOver } from "./CalendarEvent";

interface Props {
  eventTitle: string;
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
}) => {
  const { t } = useAppTranslation();
  const [eventOver, setEventOver] = useState(false);

  const eventOverCallback = useCallback(
    () => setEventOver(true),
    [setEventOver],
  );
  useEventOver({ setEventOver: eventOverCallback });

  const eventIconPositions = useRef<
    {
      top: number;
      left: number;
      delay: number;
    }[]
  >(
    [...Array(30)].map(() => ({
      top: Math.random() * 100,
      left: Math.random() * 100,
      delay: Math.random() * 2,
    })),
  );
  return (
    <>
      <Panel className="relative z-10">
        <div className="p-1">
          <div className="flex flex-row justify-between">
            <Label type="vibrant" icon={eventIcon} className="mb-2">
              {eventTitle}
            </Label>
            {eventOver && (
              <Label type="danger" icon={SUNNYSIDE.icons.stopwatch}>
                {`Event Over`}
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
          {eventIconPositions.current.map(({ top, left, delay }, i) => (
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
