import React, { useContext, useState } from "react";
import { Modal } from "components/ui/Modal";
import { Panel } from "components/ui/Panel";
import { Label } from "components/ui/Label";
import { Button } from "components/ui/Button";
import { Context } from "features/game/GameProvider";

import { useSelector } from "@xstate/react";
import { MachineState } from "features/game/lib/gameMachine";
import {
  getHasReadTemperateSeasonTutorial,
  setHasReadTemperateSeasonTutorial,
  setLastTemperateSeasonStartedAt,
} from "features/game/lib/temperateSeason";
import { SeasonsIntroduction } from "./SeasonsIntroduction";
import { useTranslation } from "react-i18next";
import { ModalOverlay } from "components/ui/ModalOverlay";
import { SEASON_DETAILS } from "features/game/types/calendar";
import { SeasonDayDetails } from "./SeasonDayDetails";

import { SUNNYSIDE } from "assets/sunnyside";
import { DateCard } from "./DateCard";
import { getCalendarDays, LocalCalendarDetails } from "./GameCalendar";

const _calendar = (state: MachineState) => state.context.state.calendar;

const SeasonWeek = () => {
  const { gameService } = useContext(Context);

  const season = useSelector(gameService, _season);
  const calendar = useSelector(gameService, _calendar);

  const [selectedDate, setSelectedDate] = useState<LocalCalendarDetails>();

  const today = new Date().getUTCDay();
  const weekDayStartsAt = new Date(season.startedAt);

  // const makeWeekData = () => {
  //   const dates = getCalendarDays({ game: gameService.getSnapshot().context.state });

  //   return dates;
  //   return Array.from({ length: 7 }, (_, index) => {
  //     const date = new Date(weekDayStartsAt);
  //     date.setUTCDate(weekDayStartsAt.getUTCDate() + index);

  //     const formattedDate = date.toISOString().split("T")[0];

  //     return {
  //       date: date.getUTCDate(),
  //       event: calendar.dates.find((e) => e.date === formattedDate),
  //     };
  //   });
  // };

  // const weekData = makeWeekData();

  let weekData = getCalendarDays({
    game: gameService.getSnapshot().context.state,
  });

  // Only show current week
  weekData = weekData.slice(0, 7);

  return (
    <div>
      <ModalOverlay
        show={selectedDate !== undefined}
        onBackdropClick={() => setSelectedDate(undefined)}
        className="inset-3 top-4"
      >
        <SeasonDayDetails
          season={season.season}
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

      <div className="grid grid-cols-7 gap-1">
        {weekData.map((data, index) => {
          return (
            <DateCard
              key={index}
              index={index}
              details={data}
              onClick={() => setSelectedDate(data)}
            />
          );
        })}
      </div>
    </div>
  );
};

const _season = (state: MachineState) => state.context.state.season;

const SeasonChangedContent = () => {
  const { gameService } = useContext(Context);
  const [hasReadTutorial, setHasReadTutorial] = useState(
    getHasReadTemperateSeasonTutorial(),
  );

  const { t } = useTranslation();

  const season = useSelector(gameService, _season);

  const seasonDetails = SEASON_DETAILS[season.season];

  const acknowledgeTutorial = () => {
    setHasReadTemperateSeasonTutorial();
    setHasReadTutorial(true);
  };

  const acknowledgeSeason = () => {
    setLastTemperateSeasonStartedAt(season.startedAt);
    gameService.send({ type: "ACKNOWLEDGE" });
  };

  if (!hasReadTutorial) {
    return <SeasonsIntroduction onClose={acknowledgeTutorial} />;
  }

  return (
    <Panel>
      <div className="flex flex-col">
        <div className="relative w-full">
          <div className="flex flex-wrap absolute w-full p-1 pr-0 left-1 top-1">
            <Label
              type="vibrant"
              icon={seasonDetails.icon}
              className="capitalize mr-1 mb-1"
            >
              {t("season.hasBegun", { name: season.season })}
            </Label>
            <Label type="warning" className="mb-1">
              {t("season.newCrops")}
            </Label>
          </div>
        </div>
        <div className="w-full object-cover ">
          <img
            src={SUNNYSIDE.announcement[season.season]}
            className="w-full h-full object-cover rounded-md"
            alt="Season banner"
          />
        </div>

        <p className="text-xs my-2 pl-1 capitalize">
          {t("season.begun.description", { name: season.season })}
        </p>

        <Label type="default" className="capitalize mb-2">
          {t("season.7daysOfSeason", { name: season.season })}
        </Label>

        <SeasonWeek />
      </div>
      <Button className="mt-1 capitalize" onClick={acknowledgeSeason}>
        {t("temperateSeason.enterSeason", { season: season.season })}
      </Button>
    </Panel>
  );
};

export const SeasonChanged: React.FC = () => {
  return (
    <Modal show>
      <SeasonChangedContent />
    </Modal>
  );
};
