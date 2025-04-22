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

export const getNextStreamTime = (schedule: StreamSchedule): Date => {
  // Get current time in Sydney timezone
  const now = new Date();
  const sydneyTime = new Intl.DateTimeFormat("en-US", {
    timeZone: "Australia/Sydney",
    hour: "numeric",
    minute: "numeric",
    weekday: "long",
    hour12: false,
  }).format(now);

  // Parse Sydney time components
  const [weekday, time] = sydneyTime.split(", ");
  const [hour, minute] = time.split(":").map(Number);
  const currentDayOfWeek = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ].indexOf(weekday.toLowerCase());
  const currentTimeMinutes = hour * 60 + minute;

  // Calculate time until next stream
  const streamTimeMinutes = schedule.hour * 60 + schedule.minute;
  let minutesUntilStream = streamTimeMinutes - currentTimeMinutes;

  // If the stream time has passed today, look for next occurrence
  if (minutesUntilStream <= 0) {
    minutesUntilStream += 24 * 60; // Add 24 hours
  }

  // Calculate days until next stream
  let daysUntilStream = 0;
  if (schedule.day !== undefined) {
    daysUntilStream = (schedule.day - currentDayOfWeek + 7) % 7;
    if (daysUntilStream === 0 && minutesUntilStream >= 24 * 60) {
      daysUntilStream = 7; // If stream already passed today, look for next week
    }
  }

  // Create the next stream time in Sydney timezone
  const nextStreamTime = new Date(now);
  nextStreamTime.setDate(nextStreamTime.getDate() + daysUntilStream);
  nextStreamTime.setHours(schedule.hour, schedule.minute, 0, 0);

  return nextStreamTime;
};

export function getStream(): {
  startAt: number;
  endAt: number;
  notifyAt: number;
} | null {
  // Get current time in Sydney timezone
  const now = new Date();
  const sydneyTime = new Intl.DateTimeFormat("en-US", {
    timeZone: "Australia/Sydney",
    hour: "numeric",
    minute: "numeric",
    weekday: "long",
    hour12: false,
  }).format(now);

  // Parse Sydney time components
  const [weekday, time] = sydneyTime.split(", ");
  const [hour, minute] = time.split(":").map(Number);
  const currentDayOfWeek = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ].indexOf(weekday.toLowerCase());
  const currentTimeMinutes = hour * 60 + minute;

  // Check each stream configuration
  for (const stream of Object.values(STREAMS_CONFIG)) {
    const streamStartMinutes = stream.startHour * 60 + stream.startMinute;
    const streamEndMinutes = streamStartMinutes + stream.durationMinutes;

    // Calculate days until next stream
    let daysUntilStream = (stream.day - currentDayOfWeek + 7) % 7;
    if (daysUntilStream === 0 && currentTimeMinutes >= streamEndMinutes) {
      daysUntilStream = 7; // If stream already ended today, look for next week
    }

    // If we're within the stream window (including notification time)
    if (
      daysUntilStream === 0 &&
      currentTimeMinutes >= streamStartMinutes - stream.notifyMinutesBefore &&
      currentTimeMinutes < streamEndMinutes
    ) {
      // Create a Date object for the stream start time in Sydney timezone
      const startTime = new Date(now);
      startTime.setHours(stream.startHour, stream.startMinute, 0, 0);

      // Convert to local time for display
      const localStartTime = new Date(
        startTime.toLocaleString("en-US", { timeZone: "Australia/Sydney" }),
      );
      const localEndTime = new Date(
        localStartTime.getTime() + stream.durationMinutes * 60 * 1000,
      );
      const localNotifyTime = new Date(
        localStartTime.getTime() - stream.notifyMinutesBefore * 60 * 1000,
      );

      return {
        startAt: localStartTime.getTime(),
        endAt: localEndTime.getTime(),
        notifyAt: localNotifyTime.getTime(),
      };
    }
  }

  return null;
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
          {`${t("streams.discord")} - ${tuesdayStream.toLocaleString()}`}
        </Label>
        <Label
          type="transparent"
          icon={SUNNYSIDE.icons.stopwatch}
          className="mb-2 ml-2"
        >
          {`${t("streams.twitch")} - ${fridayStream.toLocaleString()}`}
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
