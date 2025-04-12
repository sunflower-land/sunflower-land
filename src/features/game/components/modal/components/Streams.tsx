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

const getNextStreamTime = (schedule: StreamSchedule): Date => {
  // Get current time in Sydney timezone
  const sydneyTime = new Date();
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: "Australia/Sydney",
    hour: "numeric",
    minute: "numeric",
    hour12: false,
  });

  const parts = formatter.formatToParts(sydneyTime);
  const currentHour = parseInt(
    parts.find((p) => p.type === "hour")?.value ?? "0",
  );
  const currentMinute = parseInt(
    parts.find((p) => p.type === "minute")?.value ?? "0",
  );

  // Calculate hours and minutes to add
  let hoursToAdd = schedule.hour - currentHour;
  let minutesToAdd = schedule.minute - currentMinute;

  // Adjust if minutes or hours are negative
  if (minutesToAdd < 0) {
    hoursToAdd--;
    minutesToAdd += 60;
  }
  if (hoursToAdd < 0) hoursToAdd += 24;

  // Set the next stream time
  sydneyTime.setHours(sydneyTime.getHours() + hoursToAdd);
  sydneyTime.setMinutes(sydneyTime.getMinutes() + minutesToAdd);
  sydneyTime.setSeconds(0);
  sydneyTime.setMilliseconds(0);

  // Adjust day if needed
  if (schedule.day !== undefined) {
    const daysToAdd = (schedule.day - sydneyTime.getDay() + 7) % 7;
    sydneyTime.setDate(sydneyTime.getDate() + daysToAdd);
  }

  return sydneyTime;
};

export const Streams: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { t } = useAppTranslation();
  const tuesdayStream = getNextStreamTime({ day: 2, hour: 15, minute: 30 }); // Tuesday 3:30 PM
  const fridayStream = getNextStreamTime({ day: 5, hour: 11, minute: 0 }); // Friday 11:00 AM

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
