import React, { useContext, useEffect, useState } from "react";

import { CollectibleName } from "features/game/types/craftables";
import { Bar, ResizableBar } from "components/ui/ProgressBar";
import useUiRefresher from "lib/utils/hooks/useUiRefresher";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { GameGrid } from "features/game/expansion/placeable/lib/makeGrid";
import { useSelector } from "@xstate/react";
import { MoveableComponent } from "./MovableComponent";
import { MachineState } from "features/game/lib/gameMachine";
import { Context } from "features/game/GameProvider";
import { SUNNYSIDE } from "assets/sunnyside";
import {
  COLLECTIBLE_COMPONENTS,
  READONLY_COLLECTIBLES,
} from "./CollectibleCollection";
import { PlaceableLocation } from "features/game/types/collectibles";
import { GameState } from "features/game/types/game";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { useCountdown } from "lib/utils/hooks/useCountdown";
import { Label } from "components/ui/Label";
import { TimerDisplay } from "features/retreat/components/auctioneer/AuctionDetails";
import { Button } from "components/ui/Button";
import { ITEM_DETAILS } from "features/game/types/images";
import { Modal } from "components/ui/Modal";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import confetti from "canvas-confetti";
import { getInstantGems } from "features/game/events/landExpansion/speedUpRecipe";
import { gameAnalytics } from "lib/gameAnalytics";
import classNames from "classnames";

export type CollectibleProps = {
  name: CollectibleName;
  id: string;
  readyAt: number;
  createdAt: number;
  x: number;
  y: number;
  grid: GameGrid;
  location: PlaceableLocation;
  z?: number | string;
  flipped?: boolean;
};

type Props = CollectibleProps & {
  showTimers: boolean;
  location: PlaceableLocation;
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
}) => {
  const { gameService, showAnimations } = useContext(Context);
  const CollectiblePlaced = COLLECTIBLE_COMPONENTS[name];

  const [showModal, setShowModal] = useState(false);

  const totalSeconds = (readyAt - createdAt) / 1000;
  const secondsLeft = (readyAt - Date.now()) / 1000;

  useEffect(() => {
    // Just built, open up building state
    if (Date.now() - createdAt < 1000) {
      setShowModal(true);
    }
  }, []);

  const onSpeedUp = (gems: number) => {
    gameService.send("collectible.spedUp", {
      name,
      id,
    });

    gameAnalytics.trackSink({
      currency: "Gem",
      amount: gems,
      item: "Instant Build",
      type: "Fee",
    });

    setShowModal(false);
    if (showAnimations) confetti();
  };

  return (
    <>
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <CloseButtonPanel onClose={() => setShowModal(false)}>
          <Building
            name={name}
            createdAt={createdAt}
            readyAt={readyAt}
            onClose={() => setShowModal(false)}
            onInstantBuilt={onSpeedUp}
            state={game}
          />
        </CloseButtonPanel>
      </Modal>
      <div className="h-full cursor-pointer" onClick={() => setShowModal(true)}>
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
  z,
  flipped,
}) => {
  const CollectiblePlaced = COLLECTIBLE_COMPONENTS[name];

  const inProgress = readyAt > Date.now();

  useUiRefresher({ active: inProgress });

  return (
    <div
      className={classNames("h-full", {
        flipped: flipped,
      })}
      style={{ zIndex: z }}
    >
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

const LandscapingCollectible: React.FC<Props> = (props) => {
  const CollectiblePlaced = READONLY_COLLECTIBLES[props.name];

  return (
    <MoveableComponent {...(props as any)}>
      <div
        className={classNames({
          flipped: props.flipped,
        })}
        style={{ zIndex: props.z }}
      >
        <CollectiblePlaced {...props} />
      </div>
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

export const Building: React.FC<{
  onClose: () => void;
  onInstantBuilt: (gems: number) => void;
  readyAt: number;
  createdAt: number;
  name: CollectibleName;
}> = ({ onClose, onInstantBuilt, readyAt, createdAt, name }) => {
  const { gameService } = useContext(Context);
  const state = useSelector(gameService, (state) => state.context.state);
  const { t } = useAppTranslation();
  const totalSeconds = (readyAt - createdAt) / 1000;
  const secondsTillReady = (readyAt - Date.now()) / 1000;

  const { days, ...ready } = useCountdown(readyAt ?? 0);

  const gems = getInstantGems({
    readyAt: readyAt as number,
    game: state,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      if (Date.now() > readyAt) {
        onClose();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <div className="p-1 ">
        <Label
          type="default"
          icon={SUNNYSIDE.icons.stopwatch}
        >{`In progress`}</Label>
        <p className="text-sm my-2">{t("crafting.readySoon", { name })}</p>
        <div className="flex items-center mb-1">
          <div>
            <div className="relative flex flex-col w-full">
              <div className="flex items-center gap-x-1">
                <ResizableBar
                  percentage={(1 - secondsTillReady! / totalSeconds) * 100}
                  type="progress"
                />
                <TimerDisplay time={ready} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex">
        <Button className="mr-1" onClick={onClose}>
          {t("close")}
        </Button>
        <Button
          disabled={!state.inventory.Gem?.gte(gems)}
          className="relative ml-1"
          onClick={() => onInstantBuilt(gems)}
        >
          {t("gems.speedUp")}
          <Label
            type={state.inventory.Gem?.gte(gems) ? "default" : "danger"}
            icon={ITEM_DETAILS.Gem.image}
            className="flex absolute right-0 top-0.5"
          >
            {gems}
          </Label>
        </Button>
      </div>
    </>
  );
};
