import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";
import { InnerPanel } from "components/ui/Panel";
import {
  CALENDAR_EVENT_ICONS,
  CalendarEventName,
  SEASON_DETAILS,
} from "features/game/types/calendar";
import {
  CalendarEventDetails,
  InventoryItemName,
  TemperateSeasonName,
} from "features/game/types/game";
import { TranslationKeys } from "lib/i18n/dictionaries/types";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { getRelativeTime } from "lib/utils/time";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { CALEDNAR_EVENT_INFORMATION } from "./WeatherGuide";
import { SpecialEvents } from "./WeatherGuide";
import { getKeys } from "features/game/types/craftables";
import { SUNNYSIDE } from "assets/sunnyside";
import { useNow } from "lib/utils/hooks/useNow";

type Props = {
  season: TemperateSeasonName;
  event?: CalendarEventDetails;
  timestamp: number;
  onClose: () => void;
};

// TODO: Finalise the information for the events
const DUMMY_EVENT_INFORMATION: Record<
  Exclude<CalendarEventName, "calendar">,
  {
    title: TranslationKeys;
    description: TranslationKeys;
    prevention?: InventoryItemName;
  }
> = {
  tornado: {
    title: "calendar.events.tornado.title",
    description: "calendar.events.tornado.description",
    prevention: "Tornado Pinwheel",
  },
  fullMoon: {
    title: "calendar.events.fullMoon.title",
    description: "calendar.events.fullMoon.description",
  },
  tsunami: {
    title: "calendar.events.tsunami.title",
    description: "calendar.events.tsunami.description",
    prevention: "Mangrove",
  },
  greatFreeze: {
    title: "calendar.events.greatFreeze.title",
    description: "calendar.events.greatFreeze.description",
    prevention: "Thermal Stone",
  },
  bountifulHarvest: {
    title: "calendar.events.bountifulHarvest.title",
    description: "calendar.events.bountifulHarvest.description",
  },
  sunshower: {
    title: "calendar.events.sunshower.title",
    description: "calendar.events.sunshower.description",
  },
  unknown: {
    title: "calendar.events.unknown.title",
    description: "calendar.events.unknown.description",
  },
  doubleDelivery: {
    title: "calendar.events.doubleDelivery.title",
    description: "calendar.events.doubleDelivery.description",
  },
  insectPlague: {
    title: "calendar.events.insectPlague.title",
    description: "calendar.events.insectPlague.description",
    prevention: "Protective Pesticide",
  },
  fishFrenzy: {
    title: "calendar.events.fishFrenzy.title",
    description: "calendar.events.fishFrenzy.description",
  },
};

export const SeasonDaySpecialEvent: React.FC<{
  season: TemperateSeasonName;
  event: CalendarEventDetails;
  timestamp: number;
}> = ({ event, timestamp }) => {
  const { t } = useAppTranslation();
  const now = useNow();
  const { name } = event;
  const title =
    name === "calendar"
      ? event.title
      : t(
          DUMMY_EVENT_INFORMATION[
            name as Exclude<CalendarEventName, "calendar">
          ].title,
        );
  const description =
    name === "calendar"
      ? event.description
      : t(
          DUMMY_EVENT_INFORMATION[
            name as Exclude<CalendarEventName, "calendar">
          ].description,
        );

  const icon = CALENDAR_EVENT_ICONS[name];

  return (
    <>
      <div className="flex flex-row  mb-2">
        <Label type="vibrant" className="mr-1">
          {title}
        </Label>
        <Label type="info" secondaryIcon={SUNNYSIDE.icons.stopwatch}>
          {getRelativeTime(timestamp, now, "medium")}
        </Label>
      </div>

      <div className="flex mb-2 items-center ml-1">
        <img src={icon} className="h-8 mr-2 object-contain" />

        <div className="flex-1 text-xs">{description}</div>
      </div>

      {/* 
      TODO in following PR I will create a weather guide
      
      {name === "unknown" && (
        <div className="flex flex-col gap-2 my-2 w-full">
          <Label type="default">{t("temperateSeason.possibleEvents")}</Label>
          <div className="flex flex-col gap-2">
            {Object.entries(DUMMY_EVENT_INFORMATION)
              .filter(
                ([name]) =>
                  name !== "unknown" &&
                  name !== "fullMoon" &&
                  name !== "doubleDelivery",
              )
              .map(([name, data]) => (
                <div key={name} className="flex items-center gap-1">
                  <img
                    src={CALENDAR_EVENT_ICONS[name as CalendarEventName]}
                    className="w-6 h-6"
                  />

                  <div className="flex flex-col">
                    <span className="text-xs">{t(data.title)}</span>
                    {data.prevention && (
                      <span className="text-xxs">{data.prevention}</span>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>
      )} */}
    </>
  );
};

export const SeasonDayDetails: React.FC<Props> = ({
  event,
  season,
  timestamp,
  onClose,
}) => {
  const { t } = useTranslation();
  const [page, setPage] = useState(0);

  const seasonDetails = SEASON_DETAILS[season];

  if (!seasonDetails) {
    return null;
  }

  if (page === 1) {
    return (
      <InnerPanel className="shadow inset-3 mx-5 sm:mx-0">
        <Label type="default" className="mb-2">
          {t("temperateSeason.possibleEvents")}
        </Label>
        <p className="text-xs mb-2 ml-1">
          {t("temperateSeason.possibleEventsDescription")}
        </p>
        <SpecialEvents
          names={getKeys(CALEDNAR_EVENT_INFORMATION).filter((name) =>
            CALEDNAR_EVENT_INFORMATION[name]?.seasons.includes(season),
          )}
        />
        <div className="flex mt-1">
          <Button onClick={() => setPage(0)}>{t("back")}</Button>
        </div>
      </InnerPanel>
    );
  }

  return (
    <InnerPanel className="shadow inset-3 mx-5 sm:mx-0">
      <div className="p-1 mb-2">
        <Label type="default" className="ml-1 mb-1" icon={seasonDetails.icon}>
          {t(`season.${season}Day`)}
        </Label>
        <div className="text-xs mb-1">{seasonDetails.description}</div>
      </div>
      {event && (
        <SeasonDaySpecialEvent
          event={event}
          timestamp={timestamp}
          season={season}
        />
      )}
      <div className="flex mt-1">
        <Button onClick={onClose}>{t("close")}</Button>
        <Button className="ml-1" onClick={() => setPage(1)}>
          {t("read.more")}
        </Button>
      </div>
    </InnerPanel>
  );
};
