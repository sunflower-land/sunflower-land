import React, { useContext } from "react";
import { useSelector } from "@xstate/react";

import { PortalContext } from "../../lib/PortalProvider";
import { SUNNYSIDE } from "assets/sunnyside";
import useUiRefresher from "lib/utils/hooks/useUiRefresher";
import { Label } from "components/ui/Label";
import { PortalMachineState } from "../../lib/Machine";
import { secondsToString } from "lib/utils/time";
import { GAME_SECONDS } from "../../Constants";
import { EventBus } from "../../lib/EventBus";

const _endAt = (state: PortalMachineState) => state.context.endAt;

export const Timer: React.FC = () => {
  useUiRefresher({ delay: 100 });

  const { portalService } = useContext(PortalContext);
  const endAt = useSelector(portalService, _endAt);

  const secondsLeft = !endAt
    ? GAME_SECONDS
    : Math.max(endAt - Date.now(), 0) / 1000;

  if (secondsLeft <= 0) {
    EventBus.emit("timer-game-over");
    return <></>;
  }

  return (
    <>
      <Label icon={SUNNYSIDE.icons.stopwatch} type={"info"}>
        {secondsToString(secondsLeft, { length: "full" })}
      </Label>
    </>
  );
};
