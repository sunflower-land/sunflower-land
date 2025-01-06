import React, { useRef } from "react";
import { SUNNYSIDE } from "assets/sunnyside";
import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";
import { Modal } from "components/ui/Modal";
import { Panel } from "components/ui/Panel";
import { useGame } from "features/game/GameProvider";
import { getPendingCalendarEvent } from "features/game/types/calendar";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import tornado from "assets/icons/tornado.webp";
import { NoticeboardItems } from "features/world/ui/kingdom/KingdomNoticeboard";

export const Tornado: React.FC = () => {
  const { gameState, gameService } = useGame();
  const { t } = useAppTranslation();

  const tornadoPositions = useRef<
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

  const acknowledge = () => {
    gameService.send("tornado.triggered");
    gameService.send("ACKNOWLEDGE");
  };

  return (
    <>
      <Panel className="relative z-10">
        <div className="p-1">
          <Label type="vibrant" icon={tornado} className="mb-2">
            Special Event - Tornado
          </Label>

          <p className="text-xs mb-1">
            You did not build a windmill to harness the tornado!
          </p>
          <NoticeboardItems
            items={[
              {
                text: "Some of your crops have been destroyed.",
                icon: SUNNYSIDE.icons.plant,
              },
              {
                text: "Some of your buildings have been damaged.",
                icon: SUNNYSIDE.icons.hammer,
              },
            ]}
          />
        </div>
        <Button onClick={acknowledge}>{t("continue")}</Button>
      </Panel>
      <div className="fixed inset-0  overflow-hidden">
        {tornadoPositions.current.map(({ top, left, delay }, i) => (
          <img
            key={i}
            src={tornado}
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

export const CalendarEvent: React.FC = () => {
  const { gameState, gameService } = useGame();
  const { t } = useAppTranslation();
  const event = getPendingCalendarEvent({ game: gameState.context.state });

  return (
    <Modal show>
      {event === "tornado" && <Tornado />}
      {!event && (
        <Panel>
          <Button onClick={() => gameService.send("ACKNOWLEDGE")}>
            {t("close")}
          </Button>
        </Panel>
      )}
    </Modal>
  );
};
