import { Label } from "components/ui/Label";
import { Panel } from "components/ui/Panel";
import bountifulHarvest from "assets/icons/bountiful_harvest_icon.webp";
import React, { useCallback, useRef, useState } from "react";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { NoticeboardItems } from "features/world/ui/kingdom/KingdomNoticeboard";
import { Button } from "components/ui/Button";
import { ITEM_DETAILS } from "features/game/types/images";
import { SUNNYSIDE } from "assets/sunnyside";
import { useEventOver } from "./CalendarEvent";

export const BountifulHarvest: React.FC<{
  acknowledge: () => void;
  handleAFK: () => void;
}> = ({ acknowledge, handleAFK }) => {
  const { t } = useAppTranslation();
  const [eventOver, setEventOver] = useState(false);

  const bountifulHarvestOver = useCallback(
    () => setEventOver(true),
    [setEventOver],
  );
  useEventOver({ setEventOver: bountifulHarvestOver });

  const bountifulHarvestPositions = useRef<
    {
      top: number;
      left: number;
      delay: number;
    }[]
  >(
    [...Array(30)].map(() => ({
      top: Math.random() * 100,
      left: Math.random() * 100,
      delay: Math.random() * 2,
    })),
  );
  return (
    <>
      <Panel className="relative z-10">
        <div className="p-1">
          <div className="flex flex-row justify-between">
            <Label type="vibrant" icon={bountifulHarvest} className="mb-2">
              {t("bountifulHarvest.specialEvent")}
            </Label>
            {eventOver && (
              <Label type="danger" icon={SUNNYSIDE.icons.stopwatch}>
                {`Event Over`}
              </Label>
            )}
          </div>
          <NoticeboardItems
            items={[
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
          />
        </div>
        <Button onClick={eventOver ? handleAFK : acknowledge}>
          {t("continue")}
        </Button>
      </Panel>
      <div className="fixed inset-0  overflow-hidden">
        {bountifulHarvestPositions.current.map(({ top, left, delay }, i) => (
          <img
            key={i}
            src={bountifulHarvest}
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
