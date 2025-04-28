import { SUNNYSIDE } from "assets/sunnyside";
import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { useGame } from "features/game/GameProvider";
import { ITEM_DETAILS } from "features/game/types/images";
import { NoticeboardItems } from "features/world/ui/kingdom/KingdomNoticeboard";
import React from "react";
import { getActiveFloatingIsland } from "features/game/types/floatingIsland";
import { useNavigate } from "react-router";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
interface Props {
  onClose: () => void;
}

export const HotAirBalloon = ({ onClose }: Props) => {
  const { gameState } = useGame();

  const { t } = useAppTranslation();

  const schedule = gameState.context.state.floatingIsland.schedule;

  const navigate = useNavigate();

  const isActive = getActiveFloatingIsland({
    state: gameState.context.state,
  });

  const isOpen = schedule.some((schedule) => {
    const now = new Date();
    const start = new Date(schedule.startAt);
    const end = new Date(schedule.endAt);
    return now >= start && now <= end;
  });

  return (
    <CloseButtonPanel onClose={onClose}>
      <div className="p-1">
        <Label type="default" className="mb-1">
          {t("hotAirBalloon.readyToFly")}
        </Label>
        <p className="text-xs mb-2">{t("hotAirBalloon.description")}</p>
        <NoticeboardItems
          items={[
            {
              text: t("hotAirBalloon.exchangeInfo"),
              icon: ITEM_DETAILS["Love Charm"].image,
            },

            {
              text: t("hotAirBalloon.puzzleInfo"),
              icon: SUNNYSIDE.icons.expression_confused,
            },
          ]}
        />
        <div className="flex ">
          <Label type="default" className="mt-2 mb-1 mr-2">
            {t("hotAirBalloon.flightTimes")}
          </Label>
          {isOpen && (
            <Label type="success" className="mt-2 mb-1">
              {t("hotAirBalloon.openNow")}
            </Label>
          )}
        </div>
        {schedule.map((schedule, index) => {
          const start = new Date(schedule.startAt);
          const end = new Date(schedule.endAt);
          const startTime = start.toLocaleString("en-GB", {
            weekday: "short",
            day: "numeric",
            month: "short",
            hour: "2-digit",
            minute: "2-digit",
          });
          const endTime = end.toLocaleString("en-GB", {
            ...(end.getDate() !== start.getDate() && {
              weekday: "short",
              day: "numeric",
              month: "short",
            }),
            hour: "2-digit",
            minute: "2-digit",
          });

          return (
            <Label
              type="transparent"
              className="mt-2 mb-1 ml-4"
              icon={SUNNYSIDE.icons.stopwatch}
              key={index}
            >
              {`${startTime} - ${endTime}`}
            </Label>
          );
        })}
        {schedule.length === 0 && (
          <p className="text-xs mb-2">{t("hotAirBalloon.noFlights")}</p>
        )}
        <Button
          disabled={!isActive}
          onClick={() => {
            navigate("/world/love_island");
            onClose();
          }}
          className="mt-2"
        >
          {t("hotAirBalloon.letsGo")}
        </Button>
      </div>
    </CloseButtonPanel>
  );
};
