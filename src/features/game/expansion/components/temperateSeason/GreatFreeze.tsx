import React, { useRef } from "react";
import { SUNNYSIDE } from "assets/sunnyside";
import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";
import { Panel } from "components/ui/Panel";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import greatFreeze from "assets/icons/great-freeze.webp";
import { NoticeboardItems } from "features/world/ui/kingdom/KingdomNoticeboard";
import { ITEM_DETAILS } from "features/game/types/images";
import { MachineState } from "features/game/lib/gameMachine";
import { useGame } from "features/game/GameProvider";
import { useSelector } from "@xstate/react";

const _hasThermalStone = (state: MachineState) =>
  state.context.state.calendar.greatFreeze?.protected;

export const GreatFreeze: React.FC<{
  acknowledge: () => void;
}> = ({ acknowledge }) => {
  const { t } = useAppTranslation();
  const { gameService } = useGame();
  const hasThermalStone = useSelector(gameService, _hasThermalStone);

  const greatFreezePositions = useRef<
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

  return (
    <>
      <Panel className="relative z-10">
        <div className="p-1">
          <Label type="vibrant" icon={greatFreeze} className="mb-2">
            {t("greatFreeze.specialEvent")}
          </Label>

          <NoticeboardItems
            items={
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
          />
        </div>
        <Button onClick={acknowledge}>{t("continue")}</Button>
      </Panel>
      <div className="fixed inset-0  overflow-hidden">
        {greatFreezePositions.current.map(({ top, left, delay }, i) => (
          <img
            key={i}
            src={greatFreeze}
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
