import React, { useRef } from "react";
import { SUNNYSIDE } from "assets/sunnyside";
import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";
import { Panel } from "components/ui/Panel";
import { useGame } from "features/game/GameProvider";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { NoticeboardItems } from "features/world/ui/kingdom/KingdomNoticeboard";
import { ITEM_DETAILS } from "features/game/types/images";
import locust from "assets/icons/locust.webp";

export const InsectPlague: React.FC<{
  acknowledge: () => void;
}> = ({ acknowledge }) => {
  const { gameState } = useGame();
  const { t } = useAppTranslation();

  const insectPlaguePositions = useRef<
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

  const hasProtectivePesticide =
    gameState.context.state.calendar.insectPlague?.protected;

  return (
    <>
      <Panel className="relative z-10">
        <div className="p-1">
          <Label type="vibrant" icon={locust} className="mb-2">
            {t("insectPlague.specialEvent")}
          </Label>

          <NoticeboardItems
            items={
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
          />
        </div>
        <Button onClick={acknowledge}>{t("continue")}</Button>
      </Panel>
      <div className="fixed inset-0  overflow-hidden">
        {insectPlaguePositions.current.map(({ top, left, delay }, i) => (
          <img
            key={i}
            src={locust}
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
