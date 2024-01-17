import React, { useContext, useEffect, useRef } from "react";
import beehive from "assets/sfts/beehive.webp";
import honeyDrop from "assets/sfts/honey_drop.webp";
import { PIXEL_SCALE } from "features/game/lib/constants";
import classNames from "classnames";
import { Context } from "features/game/GameProvider";
import { MachineState } from "features/game/lib/gameMachine";
import { useInterpret, useSelector } from "@xstate/react";
import { Bar } from "components/ui/ProgressBar";
import { Beehive as IBeehive } from "features/game/types/game";
import { HONEY_PRODUCTION_TIME } from "features/game/lib/updateBeehives";
import {
  BeehiveContext,
  BeehiveMachineState,
  MachineInterpreter,
  beehiveMachine,
  getCurrentHoneyProduced,
  getFirstAttachedFlower,
} from "./beehiveMachine";

interface Props {
  id: string;
}
// gameService
const getBeehiveById = (id: string) => (state: MachineState) => {
  return state.context.state.beehives[id];
};
const compareHive = (prevHive: IBeehive, nextHive: IBeehive) => {
  return JSON.stringify(prevHive) === JSON.stringify(nextHive);
};

const _landscaping = (state: MachineState) => state.matches("landscaping");

// beehiveService
const _honeyReady = (state: BeehiveMachineState) => state.matches("honeyReady");
const _isProducing = (state: BeehiveMachineState) => state.context.isProducing;
const _honeyProduced = (state: BeehiveMachineState) =>
  state.context.honeyProduced;

export const Beehive: React.FC<Props> = ({ id }) => {
  const { showTimers, gameService } = useContext(Context);
  const isInitialMount = useRef(true);

  const landscaping = useSelector(gameService, _landscaping);
  const hive = useSelector(gameService, getBeehiveById(id), compareHive);

  const beehiveContext: BeehiveContext = {
    hive,
    attachedFlower: getFirstAttachedFlower(hive),
    honeyProduced: getCurrentHoneyProduced(hive),
  };

  const beehiveService = useInterpret(beehiveMachine, {
    context: beehiveContext,
    devTools: true,
  }) as unknown as MachineInterpreter;

  const honeyReady = useSelector(beehiveService, _honeyReady);
  const isProducing = useSelector(beehiveService, _isProducing);
  const honeyProduced = useSelector(beehiveService, _honeyProduced);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    beehiveService.send("UPDATE_HIVE", { updatedHive: hive });
  }, [hive, beehiveService]);

  return (
    <div>
      <img
        src={beehive}
        alt="Beehive"
        className="absolute bottom-0"
        style={{
          width: `${PIXEL_SCALE * 16}px`,
        }}
      />
      <img
        src={honeyDrop}
        alt="Honey Drop"
        className={classNames("absolute top-0 right-1 transition-transform", {
          "scale-0": !honeyReady,
          "scale-100": honeyReady,
        })}
        style={{
          width: `${PIXEL_SCALE * 7}px`,
        }}
      />
      {/* Progress bar for growing crops */}
      {showTimers && !landscaping && (
        <div
          className="absolute pointer-events-none"
          style={{
            top: `${PIXEL_SCALE * 13.2}px`,
            width: `${PIXEL_SCALE * 15}px`,
          }}
        >
          <Bar
            percentage={(honeyProduced / HONEY_PRODUCTION_TIME) * 100}
            type="quantity"
          />
        </div>
      )}
    </div>
  );
};
