import React, { useContext } from "react";
import { useSelector } from "@xstate/react";
import { PortalContext } from "../../lib/PortalProvider";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { SUNNYSIDE } from "assets/sunnyside";
import { millisecondsToString } from "lib/utils/time";
import useUiRefresher from "lib/utils/hooks/useUiRefresher";
import { Label } from "components/ui/Label";
import { PortalMachineState } from "../../lib/halloweenMachine";

const _startedAt = (state: PortalMachineState) => state.context.startedAt;

export const HalloweenTimer: React.FC = () => {
  useUiRefresher({ delay: 100 });

  const { portalService } = useContext(PortalContext);

  const startedAt = useSelector(portalService, _startedAt);

  const secondsPassed = !startedAt
    ? 0
    : Math.max(Date.now() - startedAt, 0) / 1000;

  return (
    <Label
      className="absolute"
      icon={SUNNYSIDE.icons.stopwatch}
      type={"info"}
      style={{
        top: `${PIXEL_SCALE * 3}px`,
        right: `${PIXEL_SCALE * 3}px`,
      }}
    >
      {millisecondsToString(secondsPassed, {
        length: "full",
      })}
    </Label>
  );
};
