import React from "react";
import { CloseButtonPanel } from "../../CloseablePanel";
import { NPC_WEARABLES } from "lib/npcs";
import { Label } from "components/ui/Label";
import { SUNNYSIDE } from "assets/sunnyside";
import { Button } from "components/ui/Button";
import { useAppTranslation } from "hooks/useAppTranslation";

type StreamSchedule = {
  day: number; // 0 = Sunday, 1 = Monday, etc.
  hour: number;
  minute: number;
};

const getNextStreamTime = (schedule: StreamSchedule): Date => {
  const now = new Date();
  const sydneyTime = new Date(
    now.toLocaleString("en-US", { timeZone: "Australia/Sydney" }),
  );

  // Create next stream date
  const nextStream = new Date(sydneyTime);
  nextStream.setHours(schedule.hour, schedule.minute, 0, 0);

  // If current time is past the target time, move to next week
  if (sydneyTime > nextStream) {
    nextStream.setDate(nextStream.getDate() + 7);
  }

  // Move to the target day if not already on that day
  while (nextStream.getDay() !== schedule.day) {
    nextStream.setDate(nextStream.getDate() + 1);
  }

  return nextStream;
};

export const Streams: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { t } = useAppTranslation();
  const tuesdayStream = getNextStreamTime({ day: 2, hour: 15, minute: 30 }); // Tuesday 3:30 PM
  const fridayStream = getNextStreamTime({ day: 5, hour: 23, minute: 0 }); // Friday 11:00 PM

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
