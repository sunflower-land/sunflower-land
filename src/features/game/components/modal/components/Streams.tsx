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
    startHour: 10,
    startMinute: 0,
    durationMinutes: 60,
    notifyMinutesBefore: 10,
  } as StreamConfig,
};

export const getNextStreamTime = (schedule: StreamSchedule): number => {
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

  // If we're past the stream time today, calculate for next week
  if (
    currentDay === schedule.day &&
    (currentHour > schedule.hour ||
      (currentHour === schedule.hour && currentMinute >= schedule.minute))
  ) {
    minutesUntilStream =
      7 * 24 * 60 - // Full week in minutes
      (currentHour * 60 + currentMinute) + // Minutes passed today
      (schedule.hour * 60 + schedule.minute); // Stream time
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

  return nextStreamTime.getTime();
};

export type StreamNotification = {
  startAt: number;
  endAt: number;
  notifyAt: number;
};

export function getStream(): StreamNotification | null {
  let nextStream: StreamNotification | null = null;
  let nextStreamTime = Infinity;

  for (const stream of Object.values(STREAMS_CONFIG)) {
    const streamStartTime = getNextStreamTime({
      day: stream.day,
      hour: stream.startHour,
      minute: stream.startMinute,
    });

    if (streamStartTime < nextStreamTime) {
      nextStreamTime = streamStartTime;
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
  const tuesdayStream = getNextStreamTime({
    day: STREAMS_CONFIG.tuesday.day,
    hour: STREAMS_CONFIG.tuesday.startHour,
    minute: STREAMS_CONFIG.tuesday.startMinute,
  }); // Tuesday 3:30 PM
  const fridayStream = getNextStreamTime({
    day: STREAMS_CONFIG.friday.day,
    hour: STREAMS_CONFIG.friday.startHour,
    minute: STREAMS_CONFIG.friday.startMinute,
  }); // Friday 11:00 AM

  return (
    <CloseButtonPanel bumpkinParts={NPC_WEARABLES.birdie} onClose={onClose}>
      <div className="p-2">
        <Label className="mb-2" type="default">
          {t("streams.title")}
        </Label>
        <p className="text-xs mb-2">{t("streams.description")}</p>
        <Label
          type="transparent"
          icon={SUNNYSIDE.icons.stopwatch}
          className="mb-2 ml-2"
        >
          {`${t("streams.discord")} - ${new Date(tuesdayStream).toLocaleString()}`}
        </Label>
        <Label
          type="transparent"
          icon={SUNNYSIDE.icons.stopwatch}
          className="mb-2 ml-2"
        >
          {`${t("streams.twitch")} - ${new Date(fridayStream).toLocaleString()}`}
        </Label>
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
