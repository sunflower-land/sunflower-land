import React, { useRef } from "react";
import { SUNNYSIDE } from "assets/sunnyside";
import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";
import { Panel } from "components/ui/Panel";
import { useGame } from "features/game/GameProvider";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import tornado from "assets/icons/tornado.webp";
import { NoticeboardItems } from "features/world/ui/kingdom/KingdomNoticeboard";
import { ITEM_DETAILS } from "features/game/types/images";

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

  const hasPinwheel =
    !!gameState.context.state.collectibles["Tornado Pinwheel"];

  return (
    <>
      <Panel className="relative z-10">
        <div className="p-1">
          <Label type="vibrant" icon={tornado} className="mb-2">
            {t("tornado.specialEvent")}
          </Label>

          <NoticeboardItems
            items={
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
