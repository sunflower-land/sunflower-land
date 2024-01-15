import React, { useContext, useLayoutEffect, useState } from "react";
import beehive from "assets/sfts/beehive.webp";
import honeyDrop from "assets/sfts/honey_drop.webp";
import { PIXEL_SCALE } from "features/game/lib/constants";
import classNames from "classnames";
import { Context } from "features/game/GameProvider";
import { MachineState } from "features/game/lib/gameMachine";
import { useSelector } from "@xstate/react";
import { Bar } from "components/ui/ProgressBar";
import { Beehive as IBeehive } from "features/game/types/game";
import { HONEY_PRODUCTION_TIME } from "features/game/lib/updateBeehives";

interface Props {
  id: string;
}

const getFirstAttachedFlower = (hive: IBeehive) => {
  const sortedFlowers = hive.flowers.sort(
    (a, b) => a.attachedAt - b.attachedAt
  );

  return sortedFlowers[0];
};

const getCurrentHoneyProduced = (hive: IBeehive) => {
  const attachedFlower = getFirstAttachedFlower(hive);

  if (!attachedFlower) return hive.honey.produced;

  const start = attachedFlower.attachedAt;
  const end = Math.min(Date.now(), attachedFlower.attachedUntil);

  return hive.honey.produced + Math.max(end - start, 0);
};

const _beehives = (state: MachineState) => state.context.state.beehives ?? {};
const _landscaping = (state: MachineState) => state.matches("landscaping");

export const Beehive: React.FC<Props> = ({ id }) => {
  const [honeyReady, setHoneyReady] = useState(false);
  const { showTimers, gameService } = useContext(Context);

  const landscaping = useSelector(gameService, _landscaping);
  const beehives = useSelector(gameService, _beehives);
  const hive = beehives[id];

  const attachedFlower = getFirstAttachedFlower(hive);
  const isProducing = attachedFlower && attachedFlower.attachedAt <= Date.now();

  const [honeyProduced, setHoneyProduced] = useState(
    getCurrentHoneyProduced(hive)
  );

  useLayoutEffect(() => {
    let interval: NodeJS.Timeout | undefined;
    const attachedFlower = getFirstAttachedFlower(hive);

    if (!interval && attachedFlower) {
      const { attachedAt, attachedUntil } = attachedFlower;
      // Set interval to update honey produced every second

      interval = setInterval(() => {
        if (attachedAt > Date.now()) return;

        // Increment the honey produced amount by 1 second
        setHoneyProduced(() => {
          const newValue = getCurrentHoneyProduced(hive);

          const hiveFull = newValue >= HONEY_PRODUCTION_TIME;
          const flowerExpired = attachedUntil < Date.now();

          // If max honey produced or flower has fully grown, clear interval
          if (hiveFull || flowerExpired) {
            hiveFull && setHoneyReady(true);
            interval && clearInterval(interval);
          }

          return newValue;
        });
      }, 1000);
    }

    return () => {
      interval && clearInterval(interval);
    };
  }, [hive, hive.flowers]);

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
        alt="Beehive"
        className={classNames(
          "absolute top-0 right-1 transition-transform duration-300",
          {
            "scale-0": !honeyReady,
            "scale-100": honeyReady,
          }
        )}
        style={{
          width: `${PIXEL_SCALE * 7}px`,
        }}
      />
      {/* Progress bar for growing crops */}
      {showTimers && !!attachedFlower && !landscaping && (
        <div
          className="absolute pointer-events-none"
          style={{
            top: `${PIXEL_SCALE * 13}px`,
            width: `${PIXEL_SCALE * 15}px`,
          }}
        >
          {(isProducing || honeyReady) && (
            <Bar
              percentage={(honeyProduced / HONEY_PRODUCTION_TIME) * 100}
              type="progress"
            />
          )}
        </div>
      )}
    </div>
  );
};
