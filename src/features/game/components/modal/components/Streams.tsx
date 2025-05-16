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
};

const NO_STREAM_DATES = [
  "2025-04-25", // ANZAC Day
  "2025-12-26", // Boxing Day
];

export const STREAMS_CONFIG = {
  tuesday: {
    day: 2,
    startHour: 15,
    startMinute: 30,
    durationMinutes: 60,
    notifyMinutesBefore: 10,
  } as StreamConfig,
  friday: {
    day: 5,
    startHour: 11,
    startMinute: 0,
    durationMinutes: 60,
    notifyMinutesBefore: 15,
  } as StreamConfig,
};

export const getNextStreamTime = (
  schedule: StreamSchedule,
): { startTime: number; isOngoing: boolean } => {
  // Create a date object in Sydney timezone
  const sydneyTime = new Date();
  const sydneyDate = new Date(
    sydneyTime.toLocaleString("en-US", { timeZone: "Australia/Sydney" }),
  );

  // Get current day, hour and minute in Sydney
  const currentDay = sydneyDate.getDay();
  const currentHour = sydneyDate.getHours();
  const currentMinute = sydneyDate.getMinutes();

  // Calculate minutes until next stream
  let minutesUntilStream = 0;
  let isOngoing = false;

  // Check if we're in the middle of a stream
  if (
    currentDay === schedule.day &&
    (currentHour > schedule.hour ||
      (currentHour === schedule.hour && currentMinute >= schedule.minute))
  ) {
    // We're past the start time today, check if we're still within stream duration
    const minutesSinceStart =
      (currentHour - schedule.hour) * 60 + (currentMinute - schedule.minute);
    if (minutesSinceStart < 60) {
      // Assuming 60 minute stream duration
      isOngoing = true;
      minutesUntilStream = -minutesSinceStart;
    } else {
      // Stream has ended, calculate for next week
      minutesUntilStream =
        7 * 24 * 60 - // Full week in minutes
        (currentHour * 60 + currentMinute) + // Minutes passed today
        (schedule.hour * 60 + schedule.minute); // Stream time
    }
  } else {
    // Calculate days until next stream
    const daysUntilStream = (schedule.day - currentDay + 7) % 7;

    // Calculate total minutes until stream
    minutesUntilStream =
      daysUntilStream * 24 * 60 + // Days in minutes
      (schedule.hour * 60 + schedule.minute) - // Stream time
      (currentHour * 60 + currentMinute); // Current time
  }

  const nextStreamDate = new Date(
    sydneyTime.getTime() + minutesUntilStream * 60000,
  )
    .toISOString()
    .split("T")[0];

  if (NO_STREAM_DATES.includes(nextStreamDate)) {
    minutesUntilStream += 7 * 24 * 60;
  }

  // Create the next stream time by adding minutes to current time
  const nextStreamTime = new Date(
    sydneyTime.getTime() + minutesUntilStream * 60000,
  );

  // Set seconds to 00 by rounding down to the nearest minute
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
    const { startTime, isOngoing } = getNextStreamTime({
      day: stream.day,
      hour: stream.startHour,
      minute: stream.startMinute,
    });

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
  const { startTime: tuesdayStream, isOngoing: tuesdayOngoing } =
    getNextStreamTime({
      day: STREAMS_CONFIG.tuesday.day,
      hour: STREAMS_CONFIG.tuesday.startHour,
      minute: STREAMS_CONFIG.tuesday.startMinute,
    }); // Tuesday 3:30 PM
  const { startTime: fridayStream, isOngoing: fridayOngoing } =
    getNextStreamTime({
      day: STREAMS_CONFIG.friday.day,
      hour: STREAMS_CONFIG.friday.startHour,
      minute: STREAMS_CONFIG.friday.startMinute,
    }); // Friday 11:00 AM
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
    <CloseButtonPanel bumpkinParts={NPC_WEARABLES.birdie} onClose={onClose}>
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
          {(tuesdayOngoing || fridayOngoing) && (
            <Label
              type="success"
              icon={SUNNYSIDE.icons.stopwatch}
              className="mb-1"
            >
              {t(`streams.${tuesdayOngoing ? "tuesday" : "friday"}.ongoing`)}
            </Label>
          )}
          <Label
            type="transparent"
            icon={SUNNYSIDE.icons.stopwatch}
            className="mb-2 ml-2"
          >
            {`${t("streams.discord")} - ${new Date(
              tuesdayStream,
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
