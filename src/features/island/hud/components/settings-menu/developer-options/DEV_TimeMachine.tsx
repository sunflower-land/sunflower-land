import { Button } from "components/ui/Button";
import { Panel } from "components/ui/Panel";
import { getCurrentChapter } from "features/game/types/chapters";
import useUiRefresher from "lib/utils/hooks/useUiRefresher";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { SUNNYSIDE } from "assets/sunnyside";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import React, { useEffect, useState } from "react";

interface DEVTimeMachineProps {
  onClose: () => void;
}

const originalDate = window.Date;
let timeMachineOffsetMs = 0;

const TimeMachineDate = class extends originalDate {
  constructor(...args: any[]) {
    if (args.length > 0) {
      super(...args);
    } else {
      super(originalDate.now() + (timeMachineOffsetMs ?? 0));
    }
  }
};

const applyTimeMachine = () => {
  if (window.Date !== TimeMachineDate) {
    window.Date = TimeMachineDate as DateConstructor;
  }

  TimeMachineDate.now = () => originalDate.now() + (timeMachineOffsetMs ?? 0);
  TimeMachineDate.parse = originalDate.parse;
  TimeMachineDate.UTC = originalDate.UTC;
};

function formatDateTimeInputs(timestamp: number) {
  const date = new originalDate(timestamp);
  const pad = (value: number) => String(value).padStart(2, "0");

  return {
    date: `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
      date.getDate(),
    )}`,
    time: `${pad(date.getHours())}:${pad(date.getMinutes())}`,
  };
}

function getChapterLabel(now: number) {
  try {
    return getCurrentChapter(now);
  } catch {
    return undefined;
  }
}

export const DEV_TimeMachine: React.FC<DEVTimeMachineProps> = ({ onClose }) => {
  useUiRefresher();
  const { t } = useAppTranslation();
  const [dateTime] = useState(() =>
    formatDateTimeInputs(originalDate.now() + (timeMachineOffsetMs ?? 0)),
  );
  const [date, setDate] = useState(dateTime.date);
  const [time, setTime] = useState(dateTime.time);
  const [, refresh] = useState(0);

  useEffect(() => {
    applyTimeMachine();

    return () => {
      window.Date = originalDate;
      timeMachineOffsetMs = 0;
    };
  }, []);

  const applyDateTime = () => {
    const selectedDate = new originalDate(`${date}T${time}`);

    if (Number.isNaN(selectedDate.getTime())) return;

    timeMachineOffsetMs = selectedDate.getTime() - originalDate.now();
    applyTimeMachine();
    refresh((value) => value + 1);
  };

  const shiftTime = (milliseconds: number) => {
    timeMachineOffsetMs += milliseconds;
    applyTimeMachine();

    const shiftedDateTime = formatDateTimeInputs(TimeMachineDate.now());
    setDate(shiftedDateTime.date);
    setTime(shiftedDateTime.time);
    refresh((value) => value + 1);
  };

  const resetDateTime = () => {
    timeMachineOffsetMs = 0;
    applyTimeMachine();
    const currentDateTime = formatDateTimeInputs(originalDate.now());
    setDate(currentDateTime.date);
    setTime(currentDateTime.time);
    refresh((value) => value + 1);
  };

  const now = TimeMachineDate.now();

  return (
    <div
      className="pointer-events-none fixed inset-x-0 bottom-2 z-[60] flex justify-center px-2"
      onClick={(event) => event.stopPropagation()}
      onMouseDown={(event) => event.stopPropagation()}
      onMouseUp={(event) => event.stopPropagation()}
      onPointerDown={(event) => event.stopPropagation()}
      onTouchStart={(event) => event.stopPropagation()}
      onTouchEnd={(event) => event.stopPropagation()}
    >
      <Panel className="pointer-events-auto w-full max-w-md">
        <div className="flex flex-col gap-2 p-2">
          <div className="flex text-center">
            <div className="grow text-sm">
              {t("gameOptions.developerOptions.timeMachine")}
            </div>
            <img
              src={SUNNYSIDE.icons.close}
              className="cursor-pointer"
              onClick={onClose}
              style={{
                width: `${PIXEL_SCALE * 11}px`,
              }}
              alt={t("close")}
            />
          </div>
          <div className="flex gap-2">
            <label className="flex flex-1 flex-col gap-1 text-sm">
              {t("date")}
              <input
                type="date"
                value={date}
                onChange={(event) => setDate(event.target.value)}
                className="rounded border border-brown-400 bg-brown-100 px-2 py-1 text-brown-900"
              />
            </label>
            <label className="flex flex-1 flex-col gap-1 text-sm">
              {t("timeMachine.time")}
              <input
                type="time"
                value={time}
                onChange={(event) => setTime(event.target.value)}
                className="rounded border border-brown-400 bg-brown-100 px-2 py-1 text-brown-900"
              />
            </label>
          </div>
          <div className="flex gap-2">
            <Button className="flex-1 p-1" onClick={applyDateTime}>
              {t("apply")}
            </Button>
            <Button className="flex-1 p-1" onClick={resetDateTime}>
              {t("timeMachine.reset")}
            </Button>
          </div>
          <div className="grid grid-cols-4 gap-1">
            <Button className="p-1" onClick={() => shiftTime(-86400000)}>
              {t("timeMachine.backDay")}
            </Button>
            <Button className="p-1" onClick={() => shiftTime(-3600000)}>
              {t("timeMachine.backHour")}
            </Button>
            <Button className="p-1" onClick={() => shiftTime(3600000)}>
              {t("timeMachine.forwardHour")}
            </Button>
            <Button className="p-1" onClick={() => shiftTime(86400000)}>
              {t("timeMachine.forwardDay")}
            </Button>
          </div>
          <div className="text-center text-sm">
            {getChapterLabel(now) ?? t("timeMachine.outsideChapter")}
          </div>
        </div>
      </Panel>
    </div>
  );
};
