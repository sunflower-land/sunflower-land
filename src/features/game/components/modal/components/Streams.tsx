import React from "react";
import { CloseButtonPanel } from "../../CloseablePanel";
import { NPC_WEARABLES } from "lib/npcs";
import { Label } from "components/ui/Label";
import { SUNNYSIDE } from "assets/sunnyside";
import { Button } from "components/ui/Button";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

type StreamSchedule = {
  day: number; // 0 = Sunday, 1 = Monday, etc.
  hour: number;
  minute: number;
};

type StreamConfig = {
  day: number;
  startHour: number;
  startMinute: number;
  durationMinutes: number;
  notifyMinutesBefore: number;
  /** If set, stream only runs every N weeks (e.g. 2 = bi-weekly). */
  intervalWeeks?: number;
  /** YYYY-MM-DD: first stream date (used with intervalWeeks to determine "on" weeks). */
  anchorDate?: string;
};

const NO_STREAM_DATES = [
  "2025-04-25", // ANZAC Day
  "2025-12-26", // Boxing Day
];

export const STREAMS_CONFIG = {
  /** Discord stream: every second Wednesday at 15:30 Sydney (04:30 UTC during AEDT). */
  wednesday: {
    day: 3,
    startHour: 15,
    startMinute: 30,
    durationMinutes: 60,
    notifyMinutesBefore: 10,
    intervalWeeks: 2,
    anchorDate: "2026-02-18",
  } as StreamConfig,
  /** Twitch stream: every second Friday. Starting today. */
  friday: {
    day: 5,
    startHour: 11,
    startMinute: 0,
    durationMinutes: 60,
    notifyMinutesBefore: 15,
    intervalWeeks: 2,
    anchorDate: "2026-02-13",
  } as StreamConfig,
};

const SYDNEY = "Australia/Sydney";
const DAY_MS = 24 * 60 * 60 * 1000;

type SydneyClock = {
  year: number;
  month: number; // 1-12
  day: number; // 1-31
  weekday: number; // 0 = Sunday, 1 = Monday, etc.
  hour: number;
  minute: number;
};

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/** Sydney wall-clock components for a timestamp. */
function getSydneyClock(ms: number): SydneyClock {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: SYDNEY,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date(ms));
  const get = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((p) => p.type === type)?.value ?? "";

  return {
    year: Number(get("year")),
    month: Number(get("month")),
    day: Number(get("day")),
    weekday: WEEKDAYS.indexOf(get("weekday")),
    hour: Number(get("hour")),
    minute: Number(get("minute")),
  };
}

/** Get YYYY-MM-DD for a timestamp in Sydney. */
function getSydneyDateString(ms: number): string {
  const { year, month, day } = getSydneyClock(ms);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${year}-${pad(month)}-${pad(day)}`;
}

/** Sydney's UTC offset (ms) at a given timestamp. */
function getSydneyOffsetMs(ms: number): number {
  const { year, month, day, hour, minute } = getSydneyClock(ms);
  const asUtc = Date.UTC(year, month - 1, day, hour, minute);
  return asUtc - Math.floor(ms / 60000) * 60000;
}

/**
 * Timestamp for a Sydney wall-clock date/time. `dayNumber` is a calendar day
 * count (Date.UTC(y, m, d) / DAY_MS) so callers can step whole days without
 * DST changing the time of day.
 */
function sydneyWallClockToMs(dayNumber: number, hour: number, minute: number) {
  const asUtc = dayNumber * DAY_MS + (hour * 60 + minute) * 60000;
  // Two passes: the offset guessed from the UTC instant may straddle a DST
  // switch, so re-read it from the corrected instant.
  const guess = asUtc - getSydneyOffsetMs(asUtc);
  return asUtc - getSydneyOffsetMs(guess);
}

/** True if this stream date (YYYY-MM-DD) falls on an "on" week for bi-weekly. */
function isOnIntervalWeek(
  streamDateStr: string,
  anchorDate: string,
  intervalWeeks: number,
): boolean {
  const [ay, am, ad] = anchorDate.split("-").map(Number);
  const [sy, sm, sd] = streamDateStr.split("-").map(Number);
  const anchorDays = Date.UTC(ay, am - 1, ad) / DAY_MS;
  const streamDays = Date.UTC(sy, sm - 1, sd) / DAY_MS;
  const weeksSince = Math.floor((streamDays - anchorDays) / 7);
  return weeksSince >= 0 && weeksSince % intervalWeeks === 0;
}

type GetNextStreamTimeOptions = {
  intervalWeeks?: number;
  anchorDate?: string;
  now?: number;
};

export const getNextStreamTime = (
  schedule: StreamSchedule,
  options?: GetNextStreamTimeOptions,
): { startTime: number; isOngoing: boolean } => {
  const { intervalWeeks = 1, anchorDate, now = Date.now() } = options ?? {};

  const today = getSydneyClock(now);
  const todayNumber = Date.UTC(today.year, today.month - 1, today.day) / DAY_MS;

  const isOnWeek = (dayNumber: number) => {
    const dateStr = getSydneyDateString(dayNumber * DAY_MS);
    if (NO_STREAM_DATES.includes(dateStr)) return false;
    if (!anchorDate || intervalWeeks === 1) return true;
    return isOnIntervalWeek(dateStr, anchorDate, intervalWeeks);
  };

  let daysUntilStream = (schedule.day - today.weekday + 7) % 7;

  if (daysUntilStream === 0) {
    const minutesSinceStart =
      (today.hour - schedule.hour) * 60 + (today.minute - schedule.minute);

    if (minutesSinceStart >= 0 && minutesSinceStart < 60) {
      const onWeek =
        !anchorDate ||
        intervalWeeks === 1 ||
        isOnIntervalWeek(getSydneyDateString(now), anchorDate, intervalWeeks);
      if (onWeek) {
        return {
          startTime: sydneyWallClockToMs(
            todayNumber,
            schedule.hour,
            schedule.minute,
          ),
          isOngoing: true,
        };
      }
    }

    // Today's stream has already started (or is on an off week)
    if (minutesSinceStart >= 0) daysUntilStream = 7;
  }

  let streamDayNumber = todayNumber + daysUntilStream;
  while (!isOnWeek(streamDayNumber)) {
    streamDayNumber += 7;
  }

  return {
    startTime: sydneyWallClockToMs(
      streamDayNumber,
      schedule.hour,
      schedule.minute,
    ),
    isOngoing: false,
  };
};

export type StreamNotification = {
  startAt: number;
  endAt: number;
  notifyAt: number;
};

export function getStream(): StreamNotification | null {
  let nextStream: StreamNotification | null = null;
  let nextStreamTime = Infinity;
  let ongoingStream: StreamNotification | null = null;

  for (const stream of Object.values(STREAMS_CONFIG)) {
    const { startTime, isOngoing } = getNextStreamTime(
      {
        day: stream.day,
        hour: stream.startHour,
        minute: stream.startMinute,
      },
      {
        intervalWeeks: stream.intervalWeeks,
        anchorDate: stream.anchorDate,
      },
    );

    if (isOngoing) {
      ongoingStream = {
        startAt: startTime,
        endAt: startTime + stream.durationMinutes * 60 * 1000,
        notifyAt: startTime - stream.notifyMinutesBefore * 60 * 1000,
      };
      return ongoingStream;
    }

    if (startTime < nextStreamTime) {
      nextStreamTime = startTime;
      nextStream = {
        startAt: nextStreamTime,
        endAt: nextStreamTime + stream.durationMinutes * 60 * 1000,
        notifyAt: nextStreamTime - stream.notifyMinutesBefore * 60 * 1000,
      };
    }
  }

  return nextStream;
}

export const StreamsContent: React.FC = () => {
  const { t } = useAppTranslation();
  const { startTime: wednesdayStream, isOngoing: wednesdayOngoing } =
    getNextStreamTime(
      {
        day: STREAMS_CONFIG.wednesday.day,
        hour: STREAMS_CONFIG.wednesday.startHour,
        minute: STREAMS_CONFIG.wednesday.startMinute,
      },
      {
        intervalWeeks: STREAMS_CONFIG.wednesday.intervalWeeks,
        anchorDate: STREAMS_CONFIG.wednesday.anchorDate,
      },
    );
  const { startTime: fridayStream, isOngoing: fridayOngoing } =
    getNextStreamTime(
      {
        day: STREAMS_CONFIG.friday.day,
        hour: STREAMS_CONFIG.friday.startHour,
        minute: STREAMS_CONFIG.friday.startMinute,
      },
      {
        intervalWeeks: STREAMS_CONFIG.friday.intervalWeeks,
        anchorDate: STREAMS_CONFIG.friday.anchorDate,
      },
    );
  const timeOptions: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "2-digit",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: false,
  };
  const { timeZone } = Intl.DateTimeFormat().resolvedOptions();
  return (
    <>
      <div className="p-2">
        <p className="text-xs mb-2">{t("streams.description")}</p>
        <section className="flex flex-col gap-1">
          <Label
            type="info"
            secondaryIcon={SUNNYSIDE.icons.stopwatch}
            className="mb-1"
          >
            {t("current.timezone", {
              timeZone,
            })}
          </Label>
          {(wednesdayOngoing || fridayOngoing) && (
            <Label
              type="success"
              icon={SUNNYSIDE.icons.stopwatch}
              className="mb-1"
            >
              {t(`streams.${wednesdayOngoing ? "thursday" : "friday"}.ongoing`)}
            </Label>
          )}
          <Label
            type="transparent"
            icon={SUNNYSIDE.icons.stopwatch}
            className="mb-2 ml-2"
          >
            {`${t("streams.discord")} - ${new Date(
              wednesdayStream,
            ).toLocaleString("en-AU", timeOptions)}`}
          </Label>
          <Label
            type="transparent"
            icon={SUNNYSIDE.icons.stopwatch}
            className="mb-2 ml-2"
          >
            {`${t("streams.twitch")} - ${new Date(fridayStream).toLocaleString(
              "en-AU",
              timeOptions,
            )}`}
          </Label>
        </section>
      </div>
      <div className="flex">
        <Button
          className="mr-1"
          onClick={() =>
            window.open("https://www.twitch.tv/0xsunflowerstudios", "_blank")
          }
        >
          {t("streams.twitch")}
        </Button>
        <Button
          onClick={() =>
            window.open("https://discord.gg/sunflowerland", "_blank")
          }
        >
          {t("streams.discord")}
        </Button>
      </div>
    </>
  );
};

export const Streams: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { t } = useAppTranslation();

  return (
    <CloseButtonPanel
      bumpkinParts={NPC_WEARABLES.streamer}
      onClose={onClose}
      title={t("streams.title")}
    >
      <StreamsContent />
    </CloseButtonPanel>
  );
};
