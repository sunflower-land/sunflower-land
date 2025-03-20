import { NoticeboardItems } from "features/world/ui/kingdom/KingdomNoticeboard";
import React from "react";

import lightingIcon from "assets/icons/lightning.png";
import page from "public/world/page.png";
import { SUNNYSIDE } from "assets/sunnyside";
import {
  CALENDAR_EVENT_ICONS,
  CalendarEventName,
} from "features/game/types/calendar";
import {
  InventoryItemName,
  TemperateSeasonName,
} from "features/game/types/game";
import { TranslationKeys } from "lib/i18n/dictionaries/types";
import { getKeys } from "features/game/types/craftables";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { SEASON_ICONS } from "features/island/buildings/components/building/market/SeasonalSeeds";
import { Label } from "components/ui/Label";
import { BuffLabel } from "features/game/types";

export const CALEDNAR_EVENT_INFORMATION: Partial<
  Record<
    Exclude<CalendarEventName, "calendar">,
    {
      title: TranslationKeys;
      description: TranslationKeys;
      prevention?: InventoryItemName;
      seasons: TemperateSeasonName[];
      buffs: BuffLabel[];
    }
  >
> = {
  bountifulHarvest: {
    title: "calendar.events.bountifulHarvest.title",
    description: "calendar.events.bountifulHarvest.description",
    seasons: ["summer", "spring"],
    buffs: [
      {
        shortDescription: "+1 Crops & Fruit",
        labelType: "success",
        boostTypeIcon: SUNNYSIDE.icons.heart,
      },
    ],
  },
  tornado: {
    title: "calendar.events.tornado.title",
    description: "calendar.events.tornado.description",
    prevention: "Tornado Pinwheel",
    seasons: ["summer", "autumn"],
    buffs: [
      {
        shortDescription: "Damages crops & buildings",
        labelType: "danger",
        boostTypeIcon: SUNNYSIDE.icons.death,
      },
    ],
  },
  fishFrenzy: {
    title: "calendar.events.fishFrenzy.title",
    description: "calendar.events.fishFrenzy.description",
    seasons: ["spring", "summer", "autumn", "winter"],
    buffs: [
      {
        shortDescription: "+1 Fish",
        labelType: "success",
        boostTypeIcon: SUNNYSIDE.icons.heart,
      },
    ],
  },
  tsunami: {
    title: "calendar.events.tsunami.title",
    description: "calendar.events.tsunami.description",
    prevention: "Mangrove",
    seasons: ["spring"],
    buffs: [
      {
        shortDescription: "Damages crops & buildings",
        labelType: "danger",
        boostTypeIcon: SUNNYSIDE.icons.death,
      },
    ],
  },
  greatFreeze: {
    title: "calendar.events.greatFreeze.title",
    description: "calendar.events.greatFreeze.description",
    prevention: "Thermal Stone",
    seasons: ["winter"],
    buffs: [
      {
        shortDescription: "Slows crop growth",
        labelType: "danger",
        boostTypeIcon: SUNNYSIDE.icons.stopwatch,
      },
    ],
  },

  sunshower: {
    title: "calendar.events.sunshower.title",
    description: "calendar.events.sunshower.description",
    seasons: ["winter", "autumn"],
    buffs: [
      {
        shortDescription: "2x Crop Speed",
        labelType: "success",
        boostTypeIcon: SUNNYSIDE.icons.stopwatch,
      },
    ],
  },
  insectPlague: {
    title: "calendar.events.insectPlague.title",
    description: "calendar.events.insectPlague.description",
    prevention: "Protective Pesticide",
    seasons: ["spring", "summer"],
    buffs: [
      {
        shortDescription: "-1/2 Crops",
        labelType: "danger",
        boostTypeIcon: SUNNYSIDE.icons.death,
      },
    ],
  },
};

export const WeatherGuide: React.FC = () => {
  const { t } = useAppTranslation();
  return (
    <div className="max-h-[300px] overflow-y-auto scrollable pr-0.5">
      <NoticeboardItems
        items={[
          {
            icon: lightingIcon,
            text: t("season.watchOutForSpecialEvents"),
          },
          {
            icon: SUNNYSIDE.icons.heart,
            text: t("season.protectYourFarm"),
          },
          {
            icon: page,
            text: t("season.PlaceProtectiveEquipment"),
          },
          {
            icon: SUNNYSIDE.icons.stopwatch,
            text: t("season.weatherEventsCanLastUpTo24Hours"),
          },
        ]}
      />

      <Label type="default" className="my-2">
        {t("season.possibleEvents")}
      </Label>

      <SpecialEvents names={getKeys(CALEDNAR_EVENT_INFORMATION)} />
    </div>
  );
};

export const SpecialEvents: React.FC<{
  names: Exclude<CalendarEventName, "calendar">[];
}> = ({ names }) => {
  const { t } = useAppTranslation();

  return (
    <>
      {names.map((event, index) => {
        const { buffs, seasons, description, title } =
          CALEDNAR_EVENT_INFORMATION[event]!;
        return (
          <div
            key={event}
            className={`flex justify-between items-start p-2 ${
              index % 2 === 0 ? "bg-[#ead4aa] rounded-md" : ""
            }`}
          >
            <img src={CALENDAR_EVENT_ICONS[event]} className="w-8 mr-2" />
            <div className="flex-1">
              <div className="flex justify-between">
                <p className="text-sm">{t(title)}</p>
                <div className="flex items-center">
                  {seasons.map((season) => (
                    <img
                      key={season}
                      src={SEASON_ICONS[season]}
                      className="h-4 ml-1"
                    />
                  ))}
                </div>
              </div>
              <p className="text-xs">{t(description)}</p>
              {buffs.length > 0 && (
                <div className="flex flex-wrap mt-1">
                  {buffs.map((buff) => (
                    <Label
                      type={buff.labelType}
                      key={buff.shortDescription}
                      icon={buff.boostTypeIcon}
                    >
                      {buff.shortDescription}
                    </Label>
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </>
  );
};
