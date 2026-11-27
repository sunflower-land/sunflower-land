import { NoticeboardItems } from "features/world/ui/kingdom/KingdomNoticeboard";
import React, { useContext } from "react";
import { useSelector } from "@xstate/react";

import lightingIcon from "assets/icons/lightning.png";
import page from "public/world/page.png";
import { SUNNYSIDE } from "assets/sunnyside";
import {
  CALENDAR_EVENT_ICONS,
  type CalendarEventName,
} from "features/game/types/calendar";
import type {
  InventoryItemName,
  TemperateSeasonName,
} from "features/game/types/game";
import type { TranslationKeys } from "lib/i18n/dictionaries/types";
import { getKeys } from "lib/object";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { SEASON_ICONS } from "features/island/buildings/components/building/market/SeasonalSeeds";
import { Label } from "components/ui/Label";
import type { BuffLabel } from "features/game/types";
import { Context } from "features/game/GameProvider";
import type { MachineState } from "features/game/lib/gameMachine";
import { hasFeatureAccess } from "lib/flags";
import {
  WEATHER_EVENTS,
  type WeatherEventName,
} from "features/game/types/weather";
import {
  WEATHER_ITEM_EVENTS,
  type WeatherItemName,
} from "features/game/types/weatherItems";
import {
  WINDFALL_BONUS,
  type WindfallName,
} from "features/game/lib/weatherItemCover";
import { ITEM_DETAILS } from "features/game/types/images";
import { WEATHER_EVENT_ICONS } from "./WeatherForecast";

export const CALEDNAR_EVENT_INFORMATION: Partial<
  Record<
    Exclude<CalendarEventName, "calendar">,
    {
      title: TranslationKeys;
      description: TranslationKeys;
      prevention?: InventoryItemName;
      seasons: TemperateSeasonName[];
      buffs: (Omit<BuffLabel, "shortDescription"> & {
        shortDescription: TranslationKeys;
      })[];
    }
  >
> = {
  bountifulHarvest: {
    title: "calendar.events.bountifulHarvest.title",
    description: "calendar.events.bountifulHarvest.description",
    seasons: ["summer", "spring"],
    buffs: [
      {
        shortDescription: "calendar.events.bountifulHarvest.effect",
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
        shortDescription: "calendar.events.tornado.effect",
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
        shortDescription: "calendar.events.fishFrenzy.effect",
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
        shortDescription: "calendar.events.tsunami.effect",
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
        shortDescription: "calendar.events.greatFreeze.effect",
        labelType: "danger",
        boostTypeIcon: SUNNYSIDE.icons.death,
      },
    ],
  },

  sunshower: {
    title: "calendar.events.sunshower.title",
    description: "calendar.events.sunshower.description",
    seasons: ["winter", "autumn"],
    buffs: [
      {
        shortDescription: "calendar.events.sunshower.effect",
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
        shortDescription: "calendar.events.insectPlague.effect",
        labelType: "danger",
        boostTypeIcon: SUNNYSIDE.icons.death,
      },
    ],
  },
};

const _weatherOn = (state: MachineState) =>
  hasFeatureAccess(state.context.state, "WEATHER");

export const WeatherGuide: React.FC = () => {
  const { t } = useAppTranslation();
  const { gameService } = useContext(Context);
  const weatherOn = useSelector(gameService, _weatherOn);

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
            text: weatherOn
              ? t("weather.guide.duration")
              : t("season.weatherEventsCanLastUpTo24Hours"),
          },
        ]}
      />

      <Label type="default" className="my-2">
        {t("season.possibleEvents")}
      </Label>

      {weatherOn ? (
        <WeatherEvents names={getKeys(WEATHER_EVENTS)} />
      ) : (
        <SpecialEvents names={getKeys(CALEDNAR_EVENT_INFORMATION)} />
      )}
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
          <EventRow
            key={event}
            index={index}
            icon={CALENDAR_EVENT_ICONS[event]}
            title={t(title)}
            seasons={seasons}
            description={t(description)}
          >
            {buffs.length > 0 && (
              <div className="flex flex-wrap mt-1">
                {buffs.map((buff) => (
                  <Label
                    type={buff.labelType}
                    key={buff.shortDescription}
                    icon={buff.boostTypeIcon}
                  >
                    {t(buff.shortDescription)}
                  </Label>
                ))}
              </div>
            )}
          </EventRow>
        );
      })}
    </>
  );
};

/** The item that covers each weather event, if it has one. */
const WEATHER_EVENT_ITEMS = getKeys(WEATHER_ITEM_EVENTS).reduce(
  (items, item) => ({ ...items, [WEATHER_ITEM_EVENTS[item]]: item }),
  {} as Partial<Record<WeatherEventName, WeatherItemName>>,
);

const WINDFALL_LABELS: Record<WindfallName, TranslationKeys> = {
  bountifulHarvest: "weather.guide.bountifulHarvest",
  fishFrenzy: "weather.guide.fishFrenzy",
};

const isWindfall = (name: WeatherEventName): name is WindfallName =>
  name in WINDFALL_BONUS;

/** The weather events, with the item that covers each and what it does. */
export const WeatherEvents: React.FC<{ names: WeatherEventName[] }> = ({
  names,
}) => {
  const { t } = useAppTranslation();

  return (
    <>
      {names.map((name, index) => {
        const item = WEATHER_EVENT_ITEMS[name];
        const isThreat = WEATHER_EVENTS[name].kind === "threat";
        // Same hints as the forecast: Heavy Rains shrinks harvests without
        // its item, so it reads like a threat.
        const itemHint =
          item &&
          (isThreat
            ? t("weather.hint.protect", { item })
            : name === "heavyRains"
              ? t("weather.hint.avoidLoss", { item })
              : t("weather.hint.boost", { item }));

        return (
          <EventRow
            key={name}
            index={index}
            icon={WEATHER_EVENT_ICONS[name]}
            title={t(`weather.events.${name}`)}
            seasons={WEATHER_EVENTS[name].seasons}
            description={t(`weather.effects.${name}`)}
          >
            {isWindfall(name) && (
              <div className="flex flex-col items-start mt-1">
                <Label type="success" icon={SUNNYSIDE.icons.heart}>
                  {t(WINDFALL_LABELS[name], {
                    amount: WINDFALL_BONUS[name],
                  })}
                </Label>
                <p className="text-xxs mt-0.5">
                  {t("weather.guide.guardianDoubles")}
                </p>
              </div>
            )}
            {item && (
              <div className="flex items-center gap-1 mt-1">
                <img
                  src={ITEM_DETAILS[item].image}
                  className="w-6 object-contain"
                />
                <p className="text-xxs">{itemHint}</p>
              </div>
            )}
          </EventRow>
        );
      })}
    </>
  );
};

const EventRow: React.FC<
  React.PropsWithChildren<{
    index: number;
    icon: string;
    title: string;
    seasons: TemperateSeasonName[];
    description: string;
  }>
> = ({ index, icon, title, seasons, description, children }) => (
  <div
    className={`flex justify-between items-start p-2 ${
      index % 2 === 0 ? "bg-[#ead4aa] rounded-md" : ""
    }`}
  >
    <img src={icon} className="w-8 mr-2" />
    <div className="flex-1">
      <div className="flex justify-between">
        <p className="text-sm">{title}</p>
        <div className="flex items-center">
          {seasons.map((season) => (
            <img key={season} src={SEASON_ICONS[season]} className="h-4 ml-1" />
          ))}
        </div>
      </div>
      <p className="text-xs">{description}</p>
      {children}
    </div>
  </div>
);
