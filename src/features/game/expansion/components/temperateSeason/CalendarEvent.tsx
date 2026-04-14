import React, { useContext } from "react";
import { Button } from "components/ui/Button";
import { Modal } from "components/ui/Modal";
import { Panel } from "components/ui/Panel";
import { Context } from "features/game/GameProvider";
import {
  CALENDAR_EVENT_ICONS,
  getActiveCalendarEvent,
} from "features/game/types/calendar";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { MachineState } from "features/game/lib/gameMachine";
import { useSelector } from "@xstate/react";
import { WeatherEvent } from "./WeatherEvent";
import { SUNNYSIDE } from "assets/sunnyside";
import { ITEM_DETAILS } from "features/game/types/images";

const _state = (state: MachineState) => state.context.state;

export const CalendarEvent: React.FC = () => {
  const { gameService } = useContext(Context);
  const state = useSelector(gameService, _state);

  const hasMangrove = state.calendar.tsunami?.protected;
  const hasPinwheel = state.calendar.tornado?.protected;
  const hasThermalStone = state.calendar.greatFreeze?.protected;
  const hasProtectivePesticide = state.calendar.insectPlague?.protected;

  const { t } = useAppTranslation();
  const event = getActiveCalendarEvent({ calendar: state.calendar });

  const handleAcknowledge = () => {
    gameService.send({ type: "calendarEvent.acknowledged" });
    gameService.send({ type: "ACKNOWLEDGE" });
  };

  const handleAFK = () => {
    gameService.send({ type: "daily.reset" });
    gameService.send({ type: "CONTINUE" });
  };

  return (
    <Modal show>
      {event === "tornado" && (
        <WeatherEvent
          eventName={event}
          acknowledge={handleAcknowledge}
          handleAFK={handleAFK}
          eventIcon={CALENDAR_EVENT_ICONS.tornado}
          noticeboardItems={
            hasPinwheel
              ? [
                  {
                    text: t("tornado.protected.one"),
                    icon: ITEM_DETAILS["Tornado Pinwheel"].image,
                  },
                  {
                    text: t("tornado.protected.two"),
                    icon: SUNNYSIDE.icons.plant,
                  },
                  {
                    text: t("tornado.protected.three"),
                    icon: SUNNYSIDE.icons.hammer,
                  },
                ]
              : [
                  {
                    text: t("tornado.destroyed.one"),
                    icon: SUNNYSIDE.icons.cancel,
                  },
                  {
                    text: t("tornado.destroyed.two"),
                    icon: SUNNYSIDE.icons.plant,
                  },
                  {
                    text: t("tornado.destroyed.three"),
                    icon: SUNNYSIDE.icons.hammer,
                  },
                ]
          }
          eventTitle={t("tornado.specialEvent")}
          showEventIcons={!hasPinwheel}
        />
      )}
      {event === "tsunami" && (
        <WeatherEvent
          eventName={event}
          eventTitle={t("tsunami.specialEvent")}
          acknowledge={handleAcknowledge}
          handleAFK={handleAFK}
          eventIcon={CALENDAR_EVENT_ICONS.tsunami}
          noticeboardItems={
            hasMangrove
              ? [
                  {
                    text: t("tsunami.protected.one"),
                    icon: ITEM_DETAILS["Mangrove"].image,
                  },
                  {
                    text: t("tsunami.protected.two"),
                    icon: SUNNYSIDE.icons.plant,
                  },
                  {
                    text: t("tsunami.protected.three"),
                    icon: SUNNYSIDE.icons.hammer,
                  },
                ]
              : [
                  {
                    text: t("tsunami.destroyed.one"),
                    icon: SUNNYSIDE.icons.cancel,
                  },
                  {
                    text: t("tsunami.destroyed.two"),
                    icon: SUNNYSIDE.icons.plant,
                  },
                  {
                    text: t("tsunami.destroyed.three"),
                    icon: SUNNYSIDE.icons.hammer,
                  },
                ]
          }
          showEventIcons={!hasMangrove}
        />
      )}
      {event === "greatFreeze" && (
        <WeatherEvent
          eventName={event}
          eventTitle={t("greatFreeze.specialEvent")}
          eventIcon={CALENDAR_EVENT_ICONS.greatFreeze}
          noticeboardItems={
            hasThermalStone
              ? [
                  {
                    text: t("greatFreeze.protected.one"),
                    icon: ITEM_DETAILS["Thermal Stone"].image,
                  },
                  {
                    text: t("greatFreeze.protected.two"),
                    icon: SUNNYSIDE.icons.plant,
                  },
                ]
              : [
                  {
                    text: t("greatFreeze.destroyed.one"),
                    icon: SUNNYSIDE.icons.cancel,
                  },
                  {
                    text: t("greatFreeze.destroyed.two"),
                    icon: SUNNYSIDE.icons.plant,
                  },
                ]
          }
          acknowledge={handleAcknowledge}
          handleAFK={handleAFK}
          showEventIcons={!hasThermalStone}
        />
      )}
      {event === "fullMoon" && (
        <WeatherEvent
          eventName={event}
          eventTitle={t("fullMoon.specialEvent")}
          eventIcon={CALENDAR_EVENT_ICONS.fullMoon}
          noticeboardItems={[
            {
              text: t("fullMoon.one"),
              icon: ITEM_DETAILS["Eggplant"].image,
            },
            {
              text: t("fullMoon.two"),
              icon: ITEM_DETAILS["Lunara"].image,
            },
            {
              text: t("fullMoon.three"),
              icon: SUNNYSIDE.icons.fish_icon,
            },
          ]}
          acknowledge={handleAcknowledge}
          handleAFK={handleAFK}
          showEventIcons
        />
      )}
      {event === "doubleDelivery" && (
        <WeatherEvent
          eventName={event}
          eventTitle={t("doubleDelivery.specialEvent")}
          eventIcon={CALENDAR_EVENT_ICONS.doubleDelivery}
          noticeboardItems={[
            {
              text: t("doubleDelivery.one"),
              icon: SUNNYSIDE.icons.lightning,
            },
            {
              text: t("doubleDelivery.two"),
              icon: SUNNYSIDE.icons.expression_alerted,
            },
          ]}
          acknowledge={handleAcknowledge}
          handleAFK={handleAFK}
          showEventIcons
        />
      )}
      {event === "bountifulHarvest" && (
        <WeatherEvent
          eventName={event}
          eventTitle={t("bountifulHarvest.specialEvent")}
          eventIcon={CALENDAR_EVENT_ICONS.bountifulHarvest}
          noticeboardItems={[
            {
              text: t("bountifulHarvest.noticeboard.one"),
              icon: CALENDAR_EVENT_ICONS.bountifulHarvest,
            },
            {
              text: t("bountifulHarvest.noticeboard.two"),
              icon: ITEM_DETAILS.Sunflower.image,
            },
            {
              text: t("bountifulHarvest.noticeboard.three"),
              icon: SUNNYSIDE.skills.crops,
            },
          ]}
          acknowledge={handleAcknowledge}
          handleAFK={handleAFK}
          showEventIcons
        />
      )}
      {event === "insectPlague" && (
        <WeatherEvent
          eventName={event}
          eventTitle={t("insectPlague.specialEvent")}
          eventIcon={CALENDAR_EVENT_ICONS.insectPlague}
          noticeboardItems={
            hasProtectivePesticide
              ? [
                  {
                    text: t("insectPlague.protected.one"),
                    icon: ITEM_DETAILS["Protective Pesticide"].image,
                  },
                  {
                    text: t("insectPlague.protected.two"),
                    icon: SUNNYSIDE.icons.plant,
                  },
                ]
              : [
                  {
                    text: t("insectPlague.destroyed.one"),
                    icon: SUNNYSIDE.icons.cancel,
                  },
                  {
                    text: t("insectPlague.destroyed.two"),
                    icon: SUNNYSIDE.icons.plant,
                  },
                ]
          }
          acknowledge={handleAcknowledge}
          handleAFK={handleAFK}
          showEventIcons={!hasProtectivePesticide}
        />
      )}
      {event === "sunshower" && (
        <WeatherEvent
          eventName={event}
          eventTitle={t("sunshower.specialEvent")}
          eventIcon={CALENDAR_EVENT_ICONS.sunshower}
          noticeboardItems={[
            {
              text: t("sunshower.info.one"),
              icon: SUNNYSIDE.icons.plant,
            },
          ]}
          acknowledge={handleAcknowledge}
          handleAFK={handleAFK}
          showEventIcons
        />
      )}
      {event === "fishFrenzy" && (
        <WeatherEvent
          eventTitle={t("fishFrenzy.specialEvent")}
          eventName={event}
          eventIcon={CALENDAR_EVENT_ICONS.fishFrenzy}
          noticeboardItems={[
            {
              text: t("fishFrenzy.info.one"),
              icon: SUNNYSIDE.icons.fish,
            },
          ]}
          acknowledge={handleAcknowledge}
          handleAFK={handleAFK}
          showEventIcons
        />
      )}
      {!event && (
        <Panel>
          <Button
            onClick={() => {
              gameService.send({ type: "ACKNOWLEDGE" });
            }}
          >
            {t("close")}
          </Button>
        </Panel>
      )}
    </Modal>
  );
};
