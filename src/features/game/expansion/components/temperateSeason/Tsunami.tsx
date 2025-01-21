import React, { useEffect, useRef, useState } from "react";
import { SUNNYSIDE } from "assets/sunnyside";
import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";
import { Panel } from "components/ui/Panel";
import { useGame } from "features/game/GameProvider";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import tsunami from "assets/icons/tsunami.webp";
import { NoticeboardItems } from "features/world/ui/kingdom/KingdomNoticeboard";
import { ITEM_DETAILS } from "features/game/types/images";
import { useSelector } from "@xstate/react";
import { MachineState } from "features/game/lib/gameMachine";
import { getActiveCalendarEvent } from "features/game/types/calendar";

const _hasMangrove = (state: MachineState) =>
  state.context.state.calendar.tsunami?.protected;

const _state = (state: MachineState) => state.context.state;

export const Tsunami: React.FC<{
  acknowledge: () => void;
  handleAFK: () => void;
}> = ({ acknowledge, handleAFK }) => {
  const { gameService } = useGame();
  const hasMangrove = useSelector(gameService, _hasMangrove);
  const state = useSelector(gameService, _state);
  const { t } = useAppTranslation();
  const [eventOver, setEventOver] = useState(false);
  const notTsunami = getActiveCalendarEvent({ game: state }) !== "tsunami";

  const tsunamiPositions = useRef<
    {
      top: number;
      left: number;
      delay: number;
    }[]
  >(
    [...Array(30)].map((_, i) => ({
      top: Math.random() * 100,
      left: Math.random() * 100,
      delay: Math.random() * 2,
    })),
  );

  useEffect(() => {
    if (notTsunami) {
      setEventOver(true);
    }
  }, [notTsunami]);

  return (
    <>
      <Panel className="relative z-10">
        <div className="p-1">
          <div className="flex flex-row justify-between">
            <Label type="vibrant" icon={tsunami} className="mb-2">
              {t("tsunami.specialEvent")}
            </Label>
            {eventOver && (
              <Label type="danger" icon={SUNNYSIDE.icons.stopwatch}>
                {`Event Over`}
              </Label>
            )}
          </div>

          <NoticeboardItems
            items={
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
          />
        </div>
        <Button onClick={notTsunami ? handleAFK : acknowledge}>
          {t("continue")}
        </Button>
      </Panel>
      <div className="fixed inset-0  overflow-hidden">
        {tsunamiPositions.current.map(({ top, left, delay }, i) => (
          <img
            key={i}
            src={tsunami}
            className="w-12 absolute animate-pulse"
            style={{
              left: `${left}%`,
              top: `${top}%`,
              animationDelay: `${delay}s`,
            }}
          />
        ))}
      </div>
    </>
  );
};
