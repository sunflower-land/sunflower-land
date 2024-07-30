import React, { useContext, useState } from "react";

import { CollectibleName } from "features/game/types/craftables";
import { TimeLeftPanel } from "components/ui/TimeLeftPanel";
import { Bar } from "components/ui/ProgressBar";
import useUiRefresher from "lib/utils/hooks/useUiRefresher";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { GameGrid } from "features/game/expansion/placeable/lib/makeGrid";
import { useSelector } from "@xstate/react";
import { MoveableComponent } from "./MovableComponent";
import { MachineState } from "features/game/lib/gameMachine";
import { Context } from "features/game/GameProvider";
import { InnerPanel } from "components/ui/Panel";
import { SquareIcon } from "components/ui/SquareIcon";
import { SUNNYSIDE } from "assets/sunnyside";
import { hasMoveRestriction } from "features/game/types/removeables";
import {
  COLLECTIBLE_COMPONENTS,
  READONLY_COLLECTIBLES,
} from "./CollectibleCollection";
import { CollectibleLocation } from "features/game/types/collectibles";
import { GameState } from "features/game/types/game";

export type CollectibleProps = {
  name: CollectibleName;
  id: string;
  readyAt: number;
  createdAt: number;
  x: number;
  y: number;
  grid: GameGrid;
  location: CollectibleLocation;
  game: GameState;
};

type Props = CollectibleProps & {
  showTimers: boolean;
  location: CollectibleLocation;
};

const InProgressCollectible: React.FC<Props> = ({
  name,
  id,
  readyAt,
  createdAt,
  showTimers,
  x,
  y,
  grid,
  location,
  game,
}) => {
  const CollectiblePlaced = COLLECTIBLE_COMPONENTS[name];
  const [showTooltip, setShowTooltip] = useState(false);

  const totalSeconds = (readyAt - createdAt) / 1000;
  const secondsLeft = (readyAt - Date.now()) / 1000;

  return (
    <>
      <div
        className="h-full cursor-pointer"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <div className="w-full h-full pointer-events-none opacity-50">
          <CollectiblePlaced
            key={id}
            createdAt={createdAt}
            id={id}
            name={name}
            readyAt={readyAt}
            x={x}
            y={y}
            grid={grid}
            location={location}
            game={game}
          />
        </div>
        {showTimers && (
          <div
            className="absolute bottom-0 left-1/2"
            style={{
              marginLeft: `${PIXEL_SCALE * -8}px`,
            }}
          >
            <Bar
              percentage={(1 - secondsLeft / totalSeconds) * 100}
              type="progress"
            />
          </div>
        )}
      </div>
      <div
        className="flex justify-center absolute w-full pointer-events-none"
        style={{
          top: `${PIXEL_SCALE * -20}px`,
        }}
      >
        <TimeLeftPanel
          text="Ready in:"
          timeLeft={secondsLeft}
          showTimeLeft={showTooltip}
        />
      </div>
    </>
  );
};

const CollectibleComponent: React.FC<Props> = ({
  name,
  id,
  readyAt,
  createdAt,
  x,
  y,
  showTimers,
  grid,
  location,
  game,
}) => {
  const CollectiblePlaced = COLLECTIBLE_COMPONENTS[name];

  const inProgress = readyAt > Date.now();

  useUiRefresher({ active: inProgress });

  return (
    <div className="h-full">
      {inProgress ? (
        <InProgressCollectible
          key={id}
          name={name}
          id={id}
          createdAt={createdAt}
          readyAt={readyAt}
          x={x}
          y={y}
          showTimers={showTimers}
          grid={grid}
          location={location}
          game={game}
        />
      ) : (
        <CollectiblePlaced
          key={id}
          name={name}
          id={id}
          createdAt={createdAt}
          readyAt={readyAt}
          x={x}
          y={y}
          grid={grid}
          location={location}
          game={game}
        />
      )}
    </div>
  );
};

const getGameState = (state: MachineState) => state.context.state;

const LandscapingCollectible: React.FC<Props> = (props) => {
  const { gameService } = useContext(Context);
  const [showPopover, setShowPopover] = useState(false);
  const gameState = useSelector(gameService, getGameState);

  const CollectiblePlaced = READONLY_COLLECTIBLES[props.name];

  const [isRestricted, restrictionReason] = hasMoveRestriction(
    props.name,
    props.id,
    gameState,
  );
  if (isRestricted) {
    return (
      <div
        className="relative w-full h-full"
        onMouseEnter={() => setShowPopover(true)}
        onMouseLeave={() => setShowPopover(false)}
      >
        {showPopover && (
          <div
            className="flex justify-center absolute w-full pointer-events-none"
            style={{
              top: `${PIXEL_SCALE * -15}px`,
            }}
          >
            <InnerPanel className="absolute whitespace-nowrap w-fit z-50">
              <div className="flex items-center space-x-2 mx-1 p-1">
                <SquareIcon icon={SUNNYSIDE.icons.lock} width={5} />
                <span className="text-xxs mb-0.5">{restrictionReason}</span>
              </div>
            </InnerPanel>
          </div>
        )}
        <CollectiblePlaced {...props} />
      </div>
    );
  }

  return (
    <MoveableComponent {...(props as any)}>
      <CollectiblePlaced {...props} />
    </MoveableComponent>
  );
};

const isLandscaping = (state: MachineState) => state.matches("landscaping");

const MemorizedCollectibleComponent = React.memo(CollectibleComponent);

export const Collectible: React.FC<Props> = (props) => {
  const { gameService } = useContext(Context);
  const landscaping = useSelector(gameService, isLandscaping);

  if (landscaping) {
    return <LandscapingCollectible {...props} />;
  }

  return <MemorizedCollectibleComponent {...props} />;
};
