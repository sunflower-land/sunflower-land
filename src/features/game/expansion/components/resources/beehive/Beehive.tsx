import React, { useContext, useEffect, useState } from "react";
import beehive from "assets/sfts/beehive.webp";
import honeyDrop from "assets/sfts/honey_drop.webp";
import { PIXEL_SCALE } from "features/game/lib/constants";
import classNames from "classnames";
import { Context } from "features/game/GameProvider";
import { MachineState } from "features/game/lib/gameMachine";
import { useSelector } from "@xstate/react";
import { Bar, LiveProgressBar } from "components/ui/ProgressBar";

interface Props {
  id: string;
}

const _beehives = (state: MachineState) => state.context.state.beehives ?? {};

export const Beehive: React.FC<Props> = ({ id }) => {
  const [honeyReady, setHoneyReady] = useState(false);
  const { showTimers, gameService } = useContext(Context);
  const beehives = useSelector(gameService, _beehives);

  const hive = beehives[id];

  useEffect(() => {
    setTimeout(() => setHoneyReady(true), 3000);
  }, []);

  const flowerGrowing = hive.flower && hive.flower.readyAt > Date.now();

  const getProgressEndAt = () => {
    // Do some math to figure out when what the end at will be
  };

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
      {/* Progres bar for growing crops */}
      {showTimers && (flowerGrowing || honeyReady) && (
        <div
          className="absolute pointer-events-none"
          style={{
            top: `${PIXEL_SCALE * 13}px`,
            width: `${PIXEL_SCALE * 15}px`,
          }}
        >
          {!!hive.flower && flowerGrowing && (
            <LiveProgressBar
              key={`${hive.id}-progress`}
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              startAt={hive.flower.attachedAt}
              endAt={Date.now() + 10 * 60}
              formatLength="short"
              onComplete={() => setHoneyReady(true)}
            />
          )}
          {honeyReady && <Bar percentage={100} type="progress" />}
        </div>
      )}
    </div>
  );
};
