/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { useContext, useState } from "react";
import { Context } from "../../../GameProvider";
import { MachineState } from "../../../lib/gameMachine";
import { useSelector } from "@xstate/react";
import calendarIcon from "assets/icons/calendar.webp";
import { PIXEL_SCALE } from "../../../lib/constants";
import { Modal } from "components/ui/Modal";
import { Panel } from "components/ui/Panel";
import { capitalize } from "lib/utils/capitalize";
import useUiRefresher from "lib/utils/hooks/useUiRefresher";
import { SUNNYSIDE } from "assets/sunnyside";
import { useTranslation } from "react-i18next";
import {
  CalendarEventName,
  SEASON_DETAILS,
} from "features/game/types/calendar";
import { GameState, TemperateSeasonName } from "features/game/types/game";
import { DateCard } from "./DateCard";
import { ModalOverlay } from "components/ui/ModalOverlay";
import { SeasonDayDetails } from "./SeasonDayDetails";
import {
  getHasReadTemperateSeasonTutorial,
  setHasReadTemperateSeasonTutorial,
} from "features/game/lib/temperateSeason";
import { SeasonsIntroduction } from "./SeasonsIntroduction";
import { RoundButton } from "components/ui/RoundButton";

export type LocalCalendarDetails = {
  dateNumber: number;
  monthNumber: number;
  dateString: string;
  specialEvent?: CalendarEventName;
  isPastDay: boolean;
  season: TemperateSeasonName;
};

const _season = (state: MachineState) => {
  return state.context.state.season;
};

const _calendar = (state: MachineState) => {
  return state.context.state.calendar;
};

const isPastDay = (date: Date, today: Date) => {
  return (
    date.getUTCMonth() < today.getUTCMonth() ||
    (date.getUTCMonth() === today.getUTCMonth() &&
      date.getUTCDate() < today.getUTCDate())
  );
};

export const getCalendarDays = ({
  game,
}: {
  game: GameState;
}): LocalCalendarDetails[] => {
  const { season, calendar } = game;

  const specialEvents = calendar.dates.reduce(
    (acc, curr) => {
      acc[curr.date] = curr.name;
      return acc;
    },
    {} as Record<string, CalendarEventName>,
  );

  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  // Get Monday by subtracting days since last Monday
  const monday = new Date(today);
  const daysFromMonday = (today.getUTCDay() + 6) % 7;
  monday.setUTCDate(today.getUTCDate() - daysFromMonday);

  return Array.from({ length: 28 }, (_, index) => {
    const date = new Date(monday);
    date.setUTCDate(monday.getUTCDate() + index);

    // Calculate which season this date falls into
    const daysSinceSeasonStart = Math.floor(
      (date.getTime() - new Date(season.startedAt).getTime()) /
        (1000 * 60 * 60 * 24),
    );
    let seasonIndex = Math.floor(daysSinceSeasonStart / 7) % 4;

    // Avoid edge case where spring gives -1
    seasonIndex = Math.max(0, seasonIndex);

    // Map index to season name, starting from the current season
    const seasons: TemperateSeasonName[] = [
      "spring",
      "summer",
      "autumn",
      "winter",
    ];
    const currentSeasonIndex = seasons.indexOf(season.season);
    const dateSeasonIndex = (currentSeasonIndex + seasonIndex) % 4;
    const dateSeason = seasons[dateSeasonIndex];

    const formattedDate = date.toISOString().split("T")[0];
    const specialEvent = specialEvents[formattedDate];

    return {
      dateNumber: date.getUTCDate(),
      monthNumber: date.getUTCMonth() + 1,
      dateString: formattedDate,
      specialEvent,
      isPastDay: isPastDay(date, today),
      season: dateSeason,
    };
  });
};

const ONE_MINUTE = 1000 * 60; // 1 minute

interface GameCalendarButtonProps {
  onClick: () => void;
  showTutorial: boolean;
}
const GameCalendarButton: React.FC<GameCalendarButtonProps> = ({
  onClick,
  showTutorial,
}) => (
  <div
    className="absolute"
    style={{
      top: `${PIXEL_SCALE * 40}px`,
      left: `${PIXEL_SCALE * 5}px`,
    }}
  >
    <RoundButton
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      buttonSize={18}
    >
      <img
        src={calendarIcon}
        className="absolute group-active:translate-y-[2px]"
        style={{
          width: `${PIXEL_SCALE * 10}px`,
          left: `${PIXEL_SCALE * 4}px`,
          top: `${PIXEL_SCALE * 3}px`,
        }}
      />
      {showTutorial && (
        <img
          className="absolute cursor-pointer group-hover:img-highlight z-30 animate-pulsate"
          src={SUNNYSIDE.icons.click_icon}
          onClick={() => onClick()}
          style={{
            width: `${PIXEL_SCALE * 15}px`,
            left: `${PIXEL_SCALE * 12}px`,
            top: `${PIXEL_SCALE * 12}px`,
          }}
        />
      )}
    </RoundButton>
  </div>
);

export const GameCalendar: React.FC = () => {
  const { gameService } = useContext(Context);

  const season = useSelector(gameService, _season);
  const calendar = useSelector(gameService, _calendar);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<LocalCalendarDetails>();
  const [hasReadTutorial, setHasReadTutorial] = useState(
    getHasReadTemperateSeasonTutorial(),
  );

  const { t } = useTranslation();
  useUiRefresher({ delay: ONE_MINUTE });

  const now = new Date();
  const utcDay = now.toLocaleString(navigator.language, {
    weekday: "short",
    timeZone: "UTC",
  });

  const utcDate = now.toLocaleString(navigator.language, {
    day: "numeric",
    timeZone: "UTC",
  });
  const utcTime = now.toLocaleTimeString(navigator.language, {
    timeZone: "UTC",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  const seasonDetails = SEASON_DETAILS[season.season];

  const formattedTime = () => {
    const lowerCaseTime = utcTime.toLowerCase();
    // remove space
    return lowerCaseTime.replace(/\s/g, "");
  };

  const acknowledgeTutorial = () => {
    setHasReadTemperateSeasonTutorial();
    setHasReadTutorial(true);
  };

  if (!hasReadTutorial) {
    return (
      <>
        <Modal show={isCalendarOpen} onHide={() => setIsCalendarOpen(false)}>
          <SeasonsIntroduction onClose={acknowledgeTutorial} />
        </Modal>
        <GameCalendarButton
          onClick={() => setIsCalendarOpen(!isCalendarOpen)}
          showTutorial={true}
        />
      </>
    );
  }

  return (
    <>
      <Modal
        show={isCalendarOpen}
        onHide={() => {
          setIsCalendarOpen(false);
          setSelectedDate(undefined);
        }}
      >
        <Panel className="flex flex-col justify-between p-1">
          <div className="flex justify-between px-1 pb-2">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-1">
                <div className="flex items-center space-x-1 mt-0.5 text-xs sm:text-sm">
                  <span>{utcDay}</span>
                  <span>{utcDate}</span>
                </div>
                <img src={calendarIcon} className="h-6 sm:h-7 mr-1" />
              </div>
              <div className="flex items-center space-x-1">
                <span className="text-xs sm:text-sm">
                  {capitalize(season.season)}
                </span>
                <img src={seasonDetails.icon} className="w-5 sm:w-6" />
              </div>
            </div>
            <div className="flex flex-col items-end space-y-1">
              <p className="text-xs whitespace-nowrap text-end">
                {t("sunflowerClock")}
              </p>
              <div className="flex items-center">
                <img
                  src={SUNNYSIDE.icons.stopwatch}
                  className="h-4 mr-1 object-contain"
                />
                <span className="text-xs">{formattedTime()}</span>
              </div>
            </div>
          </div>
          {/* Make me a grid of 7 days */}
          <div className="grid grid-cols-7 gap-2 mb-2">
            {[
              "days.mon",
              "days.tue",
              "days.wed",
              "days.thu",
              "days.fri",
              "days.sat",
              "days.sun",
            ].map((day) => (
              <div key={day} className="flex flex-col ml-1 text-xs sm:text-sm">
                {t(day)}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1 sm:gap-2">
            {getCalendarDays({
              game: gameService.getSnapshot().context.state,
            }).map((details, index) => (
              <DateCard
                key={index}
                index={index}
                details={details}
                onClick={() => setSelectedDate(details)}
              />
            ))}
          </div>
        </Panel>
        <ModalOverlay
          show={!!selectedDate}
          onBackdropClick={() => setSelectedDate(undefined)}
          className="inset-3"
        >
          <SeasonDayDetails
            season={selectedDate?.season as TemperateSeasonName}
            event={
              calendar.dates.find(
                (date) => date.date === selectedDate?.dateString,
              )!
            }
            timestamp={
              selectedDate ? new Date(selectedDate.dateString).getTime() : 0
            }
            onClose={() => setSelectedDate(undefined)}
          />
        </ModalOverlay>
      </Modal>
      <GameCalendarButton
        onClick={() => setIsCalendarOpen(!isCalendarOpen)}
        showTutorial={false}
      />
    </>
  );
};
