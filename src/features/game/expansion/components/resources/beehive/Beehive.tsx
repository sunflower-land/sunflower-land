import React, { useContext, useEffect, useRef, useState } from "react";
import beehive from "assets/sfts/beehive.webp";
import honeyDrop from "assets/sfts/honey_drop.webp";
import bee from "assets/icons/bee.webp";
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
import { Bee } from "./Bee";

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
const _currentFlowerId = (state: BeehiveMachineState) =>
  state.context.attachedFlower?.id;
const _showBeeAnimation = (state: BeehiveMachineState) =>
  state.matches("showBeeAnimation");

export const Beehive: React.FC<Props> = ({ id }) => {
  const { showTimers, gameService } = useContext(Context);
  const isInitialMount = useRef(true);
  const [showProducingBee, setShowProducingBee] = useState(false);

  const landscaping = useSelector(gameService, _landscaping);
  const hive = useSelector(gameService, getBeehiveById(id), compareHive);

  const beehiveContext: BeehiveContext = {
    hive,
    attachedFlower: getFirstAttachedFlower(hive),
    honeyProduced: getCurrentHoneyProduced(hive),
    showBeeAnimation: false,
  };

  const beehiveService = useInterpret(beehiveMachine, {
    context: beehiveContext,
    devTools: true,
  }) as unknown as MachineInterpreter;

  const honeyReady = useSelector(beehiveService, _honeyReady);
  const isProducing = useSelector(beehiveService, _isProducing);
  const honeyProduced = useSelector(beehiveService, _honeyProduced);
  const currentFlowerId = useSelector(beehiveService, _currentFlowerId);
  const showBeeAnimation = useSelector(beehiveService, _showBeeAnimation);

  const hasNewFlower = (hive: IBeehive) => {
    const updatedFlowerId = getFirstAttachedFlower(hive)?.id;

    return currentFlowerId !== updatedFlowerId;
  };

  const handleBeeAnimationEnd = () => {
    beehiveService.send("BEE_ANIMATION_DONE");
    setShowProducingBee(true);
  };

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    if (hasNewFlower(hive)) {
      beehiveService.send("NEW_ACTIVE_FLOWER", { updatedHive: hive });
    } else {
      beehiveService.send("UPDATE_HIVE", { updatedHive: hive });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hive, beehiveService]);

  useEffect(() => {
    if (isProducing === undefined) return;

    if (showProducingBee && !isProducing) {
      setShowProducingBee(false);
    }
  }, [isProducing, showProducingBee]);

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
        className={classNames(
          "absolute top-0 right-1 transition-transform duration-700",
          {
            "scale-0": !honeyReady,
            "scale-100": honeyReady,
          }
        )}
        style={{
          width: `${PIXEL_SCALE * 7}px`,
        }}
      />
      {!showBeeAnimation && (
        <img
          src={bee}
          alt="Bee"
          className={classNames("absolute left-1/2 -translate-x-1/2", {
            "animate-enter-hive": !showProducingBee,
            "animate-exit-hive": showProducingBee,
          })}
          style={{
            width: `${PIXEL_SCALE * 7}px`,
          }}
        />
      )}
      {/* Progress bar for honey production */}
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
      {!landscaping && showBeeAnimation && (
        <Bee
          hivePosition={{ x: hive.x, y: hive.y }}
          flowerId={currentFlowerId as string}
          onAnimationEnd={handleBeeAnimationEnd}
        />
      )}
    </div>
  );
};
