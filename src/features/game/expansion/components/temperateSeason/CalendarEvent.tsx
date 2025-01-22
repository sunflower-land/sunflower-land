import React, { useContext, useEffect } from "react";
import { Button } from "components/ui/Button";
import { Modal } from "components/ui/Modal";
import { Panel } from "components/ui/Panel";
import { Context } from "features/game/GameProvider";
import { getActiveCalendarEvent } from "features/game/types/calendar";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { MachineState } from "features/game/lib/gameMachine";
import { useSelector } from "@xstate/react";
import { WeatherEvent } from "./WeatherEvent";
import { SUNNYSIDE } from "assets/sunnyside";
import { ITEM_DETAILS } from "features/game/types/images";
import tsunami from "assets/icons/tsunami.webp";
import tornado from "assets/icons/tornado.webp";
import greatFreeze from "assets/icons/great-freeze.webp";
import fullMoon from "assets/icons/full_moon.png";
import doubleDelivery from "assets/icons/double_delivery_icon.webp";
import bountifulHarvest from "assets/icons/bountiful_harvest_icon.webp";
import sunshower from "assets/icons/sunshower.webp";
import locust from "assets/icons/locust.webp";

const _state = (state: MachineState) => state.context.state;

export const CalendarEvent: React.FC = () => {
  const { gameService } = useContext(Context);
  const state = useSelector(gameService, _state);

  const hasMangrove = state.calendar.tsunami?.protected;
  const hasPinwheel = state.calendar.tornado?.protected;
  const hasThermalStone = state.calendar.greatFreeze?.protected;
  const hasProtectivePesticide = state.calendar.insectPlague?.protected;

  const { t } = useAppTranslation();
  const event = getActiveCalendarEvent({ game: state });

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
        // <Tornado acknowledge={handleAcknowledge} />
        <WeatherEvent
          acknowledge={handleAcknowledge}
          handleAFK={handleAFK}
          eventIcon={tornado}
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
        <>
          {/* <Tsunami acknowledge={handleAcknowledge} handleAFK={handleAFK} /> */}
          <WeatherEvent
            eventTitle={t("tsunami.specialEvent")}
            acknowledge={handleAcknowledge}
            handleAFK={handleAFK}
            eventIcon={tsunami}
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
        </>
      )}
      {event === "greatFreeze" && (
        // <GreatFreeze acknowledge={handleAcknowledge} />
        <WeatherEvent
          eventTitle={t("greatFreeze.specialEvent")}
          eventIcon={greatFreeze}
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
        // <FullMoon acknowledge={handleAcknowledge} />
        <WeatherEvent
          eventTitle={t("fullMoon.specialEvent")}
          eventIcon={fullMoon}
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
        // <DoubleDelivery acknowledge={handleAcknowledge} />
        <WeatherEvent
          eventTitle={t("doubleDelivery.specialEvent")}
          eventIcon={doubleDelivery}
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
        // <BountifulHarvest acknowledge={handleAcknowledge} />
        <WeatherEvent
          eventTitle={t("bountifulHarvest.specialEvent")}
          eventIcon={bountifulHarvest}
          noticeboardItems={[
            {
              text: t("bountifulHarvest.noticeboard.one"),
              icon: bountifulHarvest,
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
        // <InsectPlague acknowledge={handleAcknowledge} />
        <WeatherEvent
          eventTitle={t("insectPlague.specialEvent")}
          eventIcon={locust}
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
        // <Sunshower acknowledge={handleAcknowledge} />
        <WeatherEvent
          eventTitle={t("sunshower.specialEvent")}
          eventIcon={sunshower}
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

export function useEventOver({ setEventOver }: { setEventOver: () => void }) {
  // Calculate time until next check
  const getNextCheckTime = () => {
    const now = new Date();

    // In development: check at the start of each minute
    // const nextMinute = new Date(now);
    // nextMinute.setSeconds(0);
    // nextMinute.setMilliseconds(0);
    // nextMinute.setMinutes(nextMinute.getMinutes() + 1);
    // return nextMinute.getTime() - now.getTime();

    // In production: check at UTC midnight
    const tomorrow = new Date(now);
    tomorrow.setUTCHours(24, 0, 0, 0);
    return tomorrow.getTime() - now.getTime();
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      setEventOver();
    }, getNextCheckTime());

    return () => clearTimeout(timeout);
  }, [setEventOver]);
}
