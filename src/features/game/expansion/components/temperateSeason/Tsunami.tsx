import React, { useRef } from "react";
import { SUNNYSIDE } from "assets/sunnyside";
import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";
import { Panel } from "components/ui/Panel";
import { useGame } from "features/game/GameProvider";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import tsunami from "assets/icons/tsunami.webp";
import { NoticeboardItems } from "features/world/ui/kingdom/KingdomNoticeboard";
import { ITEM_DETAILS } from "features/game/types/images";

export const Tsunami: React.FC<{
  acknowledge: () => void;
}> = ({ acknowledge }) => {
  const { gameState } = useGame();
  const { t } = useAppTranslation();

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

  const hasMangrove = !!gameState.context.state.collectibles["Mangrove"];

  return (
    <>
      <Panel className="relative z-10">
        <div className="p-1">
          <Label type="vibrant" icon={tsunami} className="mb-2">
            {t("tsunami.specialEvent")}
          </Label>

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
        <Button onClick={acknowledge}>{t("continue")}</Button>
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
