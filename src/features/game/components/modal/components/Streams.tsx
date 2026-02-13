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
  /** Discord stream: every second Thursday, same time. Starting next week. */
  thursday: {
    day: 4,
    startHour: 15,
    startMinute: 30,
    durationMinutes: 60,
    notifyMinutesBefore: 10,
    intervalWeeks: 2,
    anchorDate: "2026-02-19",
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

/** Get YYYY-MM-DD for a timestamp in Sydney. */
function getSydneyDateString(ms: number): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: SYDNEY,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date(ms));
  const y = parts.find((p) => p.type === "year")?.value ?? "";
  const m = parts.find((p) => p.type === "month")?.value ?? "";
  const d = parts.find((p) => p.type === "day")?.value ?? "";
  return `${y}-${m}-${d}`;
}

/** True if this stream date (YYYY-MM-DD) falls on an "on" week for bi-weekly. */
function isOnIntervalWeek(
  streamDateStr: string,
  anchorDate: string,
  intervalWeeks: number,
): boolean {
  const [ay, am, ad] = anchorDate.split("-").map(Number);
  const [sy, sm, sd] = streamDateStr.split("-").map(Number);
  const anchorDays = Date.UTC(ay, am - 1, ad) / (24 * 60 * 60 * 1000);
  const streamDays = Date.UTC(sy, sm - 1, sd) / (24 * 60 * 60 * 1000);
  const weeksSince = Math.floor((streamDays - anchorDays) / 7);
  return weeksSince >= 0 && weeksSince % intervalWeeks === 0;
}

type GetNextStreamTimeOptions = {
  intervalWeeks?: number;
  anchorDate?: string;
};

export const getNextStreamTime = (
  schedule: StreamSchedule,
  options?: GetNextStreamTimeOptions,
): { startTime: number; isOngoing: boolean } => {
  const { intervalWeeks = 1, anchorDate } = options ?? {};

  // Create a date object in Sydney timezone
  const sydneyTime = new Date();
  const sydneyDate = new Date(
    sydneyTime.toLocaleString("en-US", { timeZone: SYDNEY }),
  );

  // Get current day, hour and minute in Sydney
  const currentDay = sydneyDate.getDay();
  const currentHour = sydneyDate.getHours();
  const currentMinute = sydneyDate.getMinutes();

  // Calculate minutes until next stream (next occurrence of this day/time)
  let minutesUntilStream = 0;
  let isOngoing = false;

  const onRightDay =
    currentDay === schedule.day &&
    (currentHour > schedule.hour ||
      (currentHour === schedule.hour && currentMinute >= schedule.minute));

  if (onRightDay) {
    const minutesSinceStart =
      (currentHour - schedule.hour) * 60 + (currentMinute - schedule.minute);
    if (minutesSinceStart < 60) {
      const todayStr = getSydneyDateString(sydneyTime.getTime());
      const onWeek =
        !anchorDate ||
        intervalWeeks === 1 ||
        isOnIntervalWeek(todayStr, anchorDate, intervalWeeks);
      if (onWeek) {
        isOngoing = true;
        minutesUntilStream = -minutesSinceStart;
      } else {
        minutesUntilStream =
          7 * 24 * 60 -
          (currentHour * 60 + currentMinute) +
          (schedule.hour * 60 + schedule.minute);
      }
    } else {
      minutesUntilStream =
        7 * 24 * 60 -
        (currentHour * 60 + currentMinute) +
        (schedule.hour * 60 + schedule.minute);
    }
  } else {
    const daysUntilStream = (schedule.day - currentDay + 7) % 7;
    minutesUntilStream =
      daysUntilStream * 24 * 60 +
      (schedule.hour * 60 + schedule.minute) -
      (currentHour * 60 + currentMinute);
  }

  let nextStreamTime = new Date(
    sydneyTime.getTime() + minutesUntilStream * 60000,
  );

  // Skip NO_STREAM_DATES
  let nextStreamDate = getSydneyDateString(nextStreamTime.getTime());
  while (NO_STREAM_DATES.includes(nextStreamDate)) {
    minutesUntilStream += 7 * 24 * 60;
    nextStreamTime = new Date(
      sydneyTime.getTime() + minutesUntilStream * 60000,
    );
    nextStreamDate = getSydneyDateString(nextStreamTime.getTime());
  }

  // Bi-weekly: advance by 7 days until we hit an "on" week (and not a NO_STREAM date)
  if (anchorDate && intervalWeeks > 1) {
    for (;;) {
      nextStreamDate = getSydneyDateString(nextStreamTime.getTime());
      const onWeek = isOnIntervalWeek(
        nextStreamDate,
        anchorDate,
        intervalWeeks,
      );
      const skipped = NO_STREAM_DATES.includes(nextStreamDate);
      if (onWeek && !skipped) break;
      minutesUntilStream += 7 * 24 * 60;
      nextStreamTime = new Date(
        sydneyTime.getTime() + minutesUntilStream * 60000,
      );
    }
  }

  nextStreamTime.setSeconds(0);
  nextStreamTime.setMilliseconds(0);

  return {
    startTime: nextStreamTime.getTime(),
    isOngoing,
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

export const Streams: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { t } = useAppTranslation();
  const { startTime: thursdayStream, isOngoing: thursdayOngoing } =
    getNextStreamTime(
      {
        day: STREAMS_CONFIG.thursday.day,
        hour: STREAMS_CONFIG.thursday.startHour,
        minute: STREAMS_CONFIG.thursday.startMinute,
      },
      {
        intervalWeeks: STREAMS_CONFIG.thursday.intervalWeeks,
        anchorDate: STREAMS_CONFIG.thursday.anchorDate,
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
    <CloseButtonPanel bumpkinParts={NPC_WEARABLES.streamer} onClose={onClose}>
      <div className="p-2">
        <Label className="mb-2" type="default">
          {t("streams.title")}
        </Label>
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
          {(thursdayOngoing || fridayOngoing) && (
            <Label
              type="success"
              icon={SUNNYSIDE.icons.stopwatch}
              className="mb-1"
            >
              {t(`streams.${thursdayOngoing ? "thursday" : "friday"}.ongoing`)}
            </Label>
          )}
          <Label
            type="transparent"
            icon={SUNNYSIDE.icons.stopwatch}
            className="mb-2 ml-2"
          >
            {`${t("streams.discord")} - ${new Date(
              thursdayStream,
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
    </CloseButtonPanel>
  );
};
