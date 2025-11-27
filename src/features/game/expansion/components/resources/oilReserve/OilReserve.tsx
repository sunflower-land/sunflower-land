import React, { useContext, useState } from "react";
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
  getOilDropAmount,
  getRequiredOilDrillAmount,
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
const selectGame = (state: MachineState) => state.context.state;

const compareResource = (prev: IOilReserve, next: IOilReserve) => {
  return JSON.stringify(prev) === JSON.stringify(next);
};

export const OilReserve: React.FC<Props> = ({ id }) => {
  const { gameService } = useContext(Context);
  const [drilling, setDrilling] = useState(false);
  const [oilHarvested, setOilHarvested] = useState(0);

  const state = useSelector(gameService, selectGame);
  const reserve = useSelector(gameService, _reserve(id), compareResource);
  const drills = useSelector(gameService, _drills);
  const timeLeft = getTimeLeft(
    reserve.oil.drilledAt,
    OIL_RESERVE_RECOVERY_TIME,
  );
  const ready = canDrillOilReserve(reserve);
  const halfReady = !ready && timeLeft < OIL_RESERVE_RECOVERY_TIME / 2;

  useUiRefresher({ active: !ready });

  const handleDrill = async () => {
    const requiredDrillAmount = getRequiredOilDrillAmount(state).amount;
    if (!ready || drills.lessThan(requiredDrillAmount)) return;
    const { amount: oilDropAmount } = getOilDropAmount(state, reserve);

    const newState = gameService.send({ type: "oilReserve.drilled", id });

    if (!newState.matches("hoarding")) {
      setDrilling(true);
      setOilHarvested((oilHarvested) => oilHarvested + oilDropAmount);

      await new Promise((res) => setTimeout(res, 2000));
      setDrilling(false);
    }
  };
  const hasDrill = drills.gte(getRequiredOilDrillAmount(state).amount);

  return (
    <div className="relative w-full h-full flex justify-center items-center">
      {ready && (
        <RecoveredOilReserve hasDrill={hasDrill} onDrill={handleDrill} />
      )}
      {halfReady && <RecoveringOilReserve timeLeft={timeLeft} />}
      {!ready && !halfReady && (
        <DepletedOilReserve
          drilling={drilling}
          oilAmount={oilHarvested}
          timeLeft={timeLeft}
          onOilTransitionEnd={() => setOilHarvested(0)}
        />
      )}
    </div>
  );
};
