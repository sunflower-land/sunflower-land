import React, { useContext, useEffect, useState } from "react";
import { useSelector } from "@xstate/react";
import { PortalContext } from "../../lib/PortalProvider";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { Label } from "components/ui/Label";
import { PortalMachineState } from "../../lib/halloweenMachine";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { Box } from "components/ui/Box";
import Decimal from "decimal.js-light";
import { ITEM_DETAILS } from "features/game/types/images";
import { ProgressBar } from "components/ui/ProgressBar";
import {
  DURATION_LAMP_SECONDS,
  LAMP_USAGE_MULTIPLIER_INTERVAL,
  MAX_LAMP_USAGE_MULTIPLIER,
  MAX_PLAYER_LAMPS,
} from "../../HalloweenConstants";

const _lamps = (state: PortalMachineState) => state.context.lamps;
const _score = (state: PortalMachineState) => state.context.score;

export const HalloweenInventory: React.FC = () => {
  const { t } = useAppTranslation();

  const { portalService } = useContext(PortalContext);

  const lamps = useSelector(portalService, _lamps);
  const score = useSelector(portalService, _score);

  const increaseFactor = Math.min(
    Math.floor(score / LAMP_USAGE_MULTIPLIER_INTERVAL),
    MAX_LAMP_USAGE_MULTIPLIER,
  );

  const [timeLeft, setTimeLeft] = useState(DURATION_LAMP_SECONDS);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (lamps > 0) {
      const intervalId = setInterval(() => {
        setTimeLeft((prevTimeLeft) => {
          const newTimeLeft = prevTimeLeft - (1 + increaseFactor);
          setProgress((newTimeLeft / DURATION_LAMP_SECONDS) * 100);

          if (newTimeLeft <= 0 && lamps > 0) {
            portalService.send("DEAD_LAMP", { lamps: 1 });
            setProgress(100);
            return DURATION_LAMP_SECONDS;
          } else if (newTimeLeft <= 0 && lamps === 0) {
            clearInterval(intervalId);
          }

          return newTimeLeft;
        });
      }, 1000);

      return () => clearInterval(intervalId);
    }
  }, [lamps]);

  return (
    <div
      className="absolute flex flex-col items-center"
      style={{
        top: `${PIXEL_SCALE * 3}px`,
        right: `${PIXEL_SCALE * 3}px`,
      }}
    >
      <Label type={"default"}>{t("halloween.inventory")}</Label>

      <div className="relative flex flex-col items-center">
        <Box
          countLabelType={lamps === MAX_PLAYER_LAMPS ? "danger" : "default"}
          count={new Decimal(lamps)}
          image={ITEM_DETAILS["Lamp Front"].image}
        />
        {!!lamps && (
          <ProgressBar
            className="w-[42px] h-[18.375px] absolute -bottom-1"
            percentage={progress}
            type="progress"
            formatLength="short"
          />
        )}
      </div>

      {!!increaseFactor && (
        <Label type={"danger"} className="mt-1">
          {t("halloween.lampWear", { multiplier: increaseFactor + 1 })}
        </Label>
      )}
    </div>
  );
};
