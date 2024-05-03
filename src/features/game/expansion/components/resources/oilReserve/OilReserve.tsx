import React, { useContext } from "react";
import { RecoveredOilReserve } from "./components/RecoveredOilReserve";
import { Context } from "features/game/GameProvider";
import { MachineState } from "features/game/lib/gameMachine";
import { OilReserve as IOilReserve } from "features/game/types/game";
import { useSelector } from "@xstate/react";
import Decimal from "decimal.js-light";
import { getTimeLeft } from "lib/utils/time";
import {
  OIL_RESERVE_RECOVERY_TIME,
  canDrillOilReserve,
} from "features/game/events/landExpansion/drillOilReserve";
import useUiRefresher from "lib/utils/hooks/useUiRefresher";
import { RecoveringOilReserve } from "./components/RecoveringOilReserve";
import { DepletedOilReserve } from "./components/DepletedOilReserve";

interface Props {
  id: string;
}

const _reserve = (id: string) => (state: MachineState) =>
  state.context.state.oilReserves[id];
const _drills = (state: MachineState) =>
  state.context.state.inventory["Oil Drill"] ?? new Decimal(0);

const compareResource = (prev: IOilReserve, next: IOilReserve) => {
  return JSON.stringify(prev) === JSON.stringify(next);
};

export const OilReserve: React.FC<Props> = ({ id }) => {
  const { gameService } = useContext(Context);

  const reserve = useSelector(gameService, _reserve(id), compareResource);
  const drills = useSelector(gameService, _drills);
  const timeLeft = getTimeLeft(
    reserve.oil.drilledAt,
    OIL_RESERVE_RECOVERY_TIME
  );
  const ready = canDrillOilReserve(reserve);
  const halfReady = !ready && timeLeft < OIL_RESERVE_RECOVERY_TIME / 2;

  useUiRefresher({ active: !ready });

  const handleDrill = () => {
    if (!ready || drills.lessThan(1)) return;

    gameService.send({
      type: "oilReserve.drilled",
      id,
    });
  };

  return (
    <div className="relative w-full h-full flex justify-center items-center">
      {ready && (
        <RecoveredOilReserve hasDrill={drills.gte(1)} onDrill={handleDrill} />
      )}
      {halfReady && <RecoveringOilReserve />}
      {!ready && !halfReady && <DepletedOilReserve timeLeft={timeLeft} />}
    </div>
  );
};
