import React, { useContext, useEffect, useState } from "react";
import { useSelector } from "@xstate/react";
import { PortalContext } from "../../lib/PortalProvider";
import { SUNNYSIDE } from "assets/sunnyside";
import { secondsToString } from "lib/utils/time";
import { Label } from "components/ui/Label";
import { PortalMachineState } from "../../lib/halloweenMachine";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { DURATION_GAME_OVER_WITHOUT_LAMPS_SECONDS } from "../../HalloweenConstants";

const _lamps = (state: PortalMachineState) => state.context.lamps;
const _isPlaying = (state: PortalMachineState) => state.matches("playing");

export const HalloweenTimeDead: React.FC = () => {
  const { t } = useAppTranslation();

  const { portalService } = useContext(PortalContext);

  const lamps = useSelector(portalService, _lamps);
  const isPlaying = useSelector(portalService, _isPlaying);

  const [timeLeft, setTimeLeft] = useState(
    DURATION_GAME_OVER_WITHOUT_LAMPS_SECONDS,
  );

  useEffect(() => {
    if (lamps === 0) {
      const intervalId = setInterval(() => {
        setTimeLeft((prevTimeLeft) => {
          const newTimeLeft = prevTimeLeft - 1;
          if (newTimeLeft <= 0) {
            portalService.send("DEAD_LAMP", { lamps: 1 });
            clearInterval(intervalId);
          }

          return newTimeLeft;
        });
      }, 1000);

      return () => clearInterval(intervalId);
    } else {
      setTimeLeft(DURATION_GAME_OVER_WITHOUT_LAMPS_SECONDS);
    }
  }, [lamps]);

  return (
    <>
      {lamps === 0 && isPlaying && (
        <Label
          className="space-x-2 text-xs"
          icon={SUNNYSIDE.decorations.skull}
          type={"dead"}
        >
          {t("halloween.lose", {
            time: secondsToString(timeLeft, {
              length: "full",
            }),
          })}
        </Label>
      )}
    </>
  );
};
