import React, { useContext, useState } from "react";
import { Modal } from "components/ui/Modal";
import { ButtonPanel, Panel } from "components/ui/Panel";
import { Label } from "components/ui/Label";
import { Button } from "components/ui/Button";
import { Context } from "features/game/GameProvider";

import { ITEM_DETAILS } from "features/game/types/images";
import { useSelector } from "@xstate/react";
import { MachineState } from "features/game/lib/gameMachine";
import {
  getHasReadTemperateSeasonTutorial,
  setHasReadTemperateSeasonTutorial,
  setLastTemperateSeasonStartedAt,
} from "features/game/lib/temperateSeason";
import { SeasonsIntroduction } from "./SeasonsIntroduction";
import { useTranslation } from "react-i18next";
import { IngredientsPopover } from "components/ui/IngredientsPopover";
import { ModalOverlay } from "components/ui/ModalOverlay";
import {
  CALENDAR_EVENT_ICONS,
  SEASON_DETAILS,
} from "features/game/types/calendar";
import { SeasonDayDetails } from "./SeasonDayDetails";
import { CalendarEventDetails } from "features/game/types/game";
import { SUNNYSIDE } from "assets/sunnyside";

const _calendar = (state: MachineState) => state.context.state.calendar;

const SeasonWeek = () => {
  const { gameService } = useContext(Context);

  const season = useSelector(gameService, _season);
  const calendar = useSelector(gameService, _calendar);

  const [showWeekday, setShowWeekday] = useState<number>();

  const today = new Date().getUTCDay();
  const weekDayStartsAt = new Date(season.startedAt);

  const makeWeekData = () => {
    return Array.from({ length: 7 }, (_, index) => {
      const date = new Date(weekDayStartsAt);
      date.setUTCDate(weekDayStartsAt.getUTCDate() + index);

      const formattedDate = date.toISOString().split("T")[0];

      return {
        date: date.getUTCDate(),
        event: calendar.dates.find((e) => e.date === formattedDate),
      };
    });
  };

  const weekData = makeWeekData();

  return (
    <div>
      <ModalOverlay
        show={showWeekday !== undefined}
        onBackdropClick={() => setShowWeekday(undefined)}
        className="inset-3 top-4"
      >
        <SeasonDayDetails
          season={season.season}
          event={weekData[showWeekday ?? 0].event as CalendarEventDetails}
          timestamp={new Date(
            weekDayStartsAt.getTime() +
              1000 * 60 * 60 * 24 * (showWeekday ?? 0),
          ).getTime()}
          onClose={() => setShowWeekday(undefined)}
        />
      </ModalOverlay>

      <div className="grid grid-cols-7 gap-1">
        {weekData.map((data, index) => {
          return (
            <ButtonPanel
              variant={index < today ? "primary" : "secondary"}
              key={data.date}
              className="h-12 relative flex items-center justify-center"
              onClick={() => setShowWeekday(index)}
            >
              {data.event && (
                <img
                  src={CALENDAR_EVENT_ICONS[data.event.name]}
                  className="absolute w-6 h-6 object-contain"
                />
              )}
              <span className="absolute -top-1 -right-1 text-xxs">
                {data.date}
              </span>
            </ButtonPanel>
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

  const [showIngredients, setShowIngredients] = useState(false);

  const seasonDetails = SEASON_DETAILS[season.season];

  const acknowledgeTutorial = () => {
    setHasReadTemperateSeasonTutorial();
    setHasReadTutorial(true);
  };

  const acknowledgeSeason = () => {
    setLastTemperateSeasonStartedAt(season.startedAt);
    gameService.send("ACKNOWLEDGE");
  };

  if (!hasReadTutorial) {
    return <SeasonsIntroduction onClose={acknowledgeTutorial} />;
  }

  return (
    <Panel>
      <div
        className="flex flex-col gap-1"
        onClick={() => setShowIngredients(false)}
      >
        <div className="relative w-full">
          <div className="flex absolute w-full p-1 pr-0 left-1 top-1">
            <Label
              type="vibrant"
              icon={seasonDetails.icon}
              className="capitalize mr-1"
            >
              X has begun
            </Label>
            <Label type="warning">New crops & fish!</Label>
          </div>
        </div>
        <div className="w-full object-cover rounded-t-md">
          <img
            src={SUNNYSIDE.announcement[season.season]}
            className="w-full h-full object-cover"
            alt="Season banner"
          />
        </div>

        <Label type="default" className="capitalize">
          X Events
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
