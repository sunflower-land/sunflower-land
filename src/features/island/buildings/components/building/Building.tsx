import React, { useContext, useEffect, useMemo, useState } from "react";

import { BuildingName } from "features/game/types/buildings";
import { Bar, ResizableBar } from "components/ui/ProgressBar";
import useUiRefresher from "lib/utils/hooks/useUiRefresher";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { useSelector } from "@xstate/react";
import { MoveableComponent } from "features/island/collectibles/MovableComponent";
import { MachineState } from "features/game/lib/gameMachine";
import { Context, useGame } from "features/game/GameProvider";
import { BUILDING_COMPONENTS, READONLY_BUILDINGS } from "./BuildingComponents";
import { CookableName } from "features/game/types/consumables";
import { GameState, IslandType } from "features/game/types/game";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { useCountdown } from "lib/utils/hooks/useCountdown";
import { SUNNYSIDE } from "assets/sunnyside";
import { Label } from "components/ui/Label";
import { TimerDisplay } from "features/retreat/components/auctioneer/AuctionDetails";
import { Button } from "components/ui/Button";
import { ITEM_DETAILS } from "features/game/types/images";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { Modal } from "components/ui/Modal";
import confetti from "canvas-confetti";
import { getInstantGems } from "features/game/events/landExpansion/speedUpRecipe";
import { gameAnalytics } from "lib/gameAnalytics";
import tornadoIcon from "assets/icons/tornado.webp";
import { secondsToString } from "lib/utils/time";
import { isBuildingDestroyed } from "features/game/events/landExpansion/triggerTornado";

interface Prop {
  name: BuildingName;
  id: string;
  index: number;
  readyAt: number;
  createdAt: number;
  craftingItemName?: CookableName;
  craftingReadyAt?: number;
  showTimers: boolean;
  x: number;
  y: number;
  island: IslandType;
}

export interface BuildingProps {
  buildingId: string;
  buildingIndex: number;
  craftingItemName?: CookableName;
  craftingReadyAt?: number;
  isBuilt?: boolean;
  onRemove?: () => void;
  island: IslandType;
}

const InProgressBuilding: React.FC<Prop> = ({
  name,
  id,
  index,
  readyAt,
  createdAt,
  showTimers,
  island,
}) => {
  const { gameService, showAnimations } = useContext(Context);

  const BuildingPlaced = BUILDING_COMPONENTS[name];

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
    gameService.send("building.spedUp", {
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
          <Constructing
            name={name}
            createdAt={createdAt}
            readyAt={readyAt}
            onClose={() => setShowModal(false)}
            onInstantBuilt={onSpeedUp}
            state={gameService.getSnapshot().context.state}
          />
        </CloseButtonPanel>
      </Modal>

      <div
        className="w-full h-full cursor-pointer"
        onClick={() => setShowModal(true)}
      >
        <div className="w-full h-full pointer-events-none opacity-50">
          <BuildingPlaced
            buildingId={id}
            buildingIndex={index}
            island={island}
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

const DestroyedBuilding: React.FC<Prop> = ({
  name,
  id,
  index,
  readyAt,
  createdAt,
  showTimers,
  island,
}) => {
  const { gameService, showAnimations } = useContext(Context);

  const BuildingPlaced = BUILDING_COMPONENTS[name];

  const { t } = useAppTranslation();

  const [showModal, setShowModal] = useState(false);

  const totalSeconds = (readyAt - createdAt) / 1000;
  const secondsLeft = (readyAt - Date.now()) / 1000;

  const game = gameService.getSnapshot().context.state;

  return (
    <>
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <CloseButtonPanel onClose={() => setShowModal(false)}>
          <div className="p-2">
            <Label icon={tornadoIcon} type="danger" className="mb-1 -ml-1">
              {t("tornado")}
            </Label>
            <p className="text-sm">
              {t("tornado.building.destroyed.description")}
            </p>
            <Label
              icon={SUNNYSIDE.icons.stopwatch}
              type="transparent"
              className="mt-2 ml-1"
            >
              {`Ready in: ${secondsToString(
                24 * 60 * 60 -
                  (Date.now() - game.calendar.tornado!.triggeredAt) / 1000,
                {
                  length: "medium",
                },
              )}`}
            </Label>
          </div>
        </CloseButtonPanel>
      </Modal>

      <div
        className="w-full h-full cursor-pointer"
        onClick={() => setShowModal(true)}
      >
        <div className="w-full h-full pointer-events-none">
          <BuildingPlaced
            buildingId={id}
            buildingIndex={index}
            island={island}
          />
        </div>
        <img
          src={tornadoIcon}
          alt="tornado"
          className="absolute  right-0 pointer-events-none"
          style={{
            width: `${PIXEL_SCALE * 12}px`,
            top: `${PIXEL_SCALE * -4}px`,
          }}
        />
      </div>
    </>
  );
};

const BuildingComponent: React.FC<Prop> = ({
  name,
  id,
  index,
  readyAt,
  createdAt,
  craftingItemName,
  craftingReadyAt,
  showTimers,
  x,
  y,
  island,
}) => {
  const { gameState } = useGame();
  const BuildingPlaced = BUILDING_COMPONENTS[name];

  const inProgress = readyAt > Date.now();

  const isTornadoed = useMemo(
    () => isBuildingDestroyed({ name, game: gameState.context.state }),
    [gameState.context.state.calendar.tornado],
  );

  useUiRefresher({ active: inProgress });

  if (isTornadoed) {
    return (
      <DestroyedBuilding
        key={id}
        name={name}
        id={id}
        index={index}
        readyAt={readyAt}
        createdAt={createdAt}
        showTimers={showTimers}
        x={x}
        y={y}
        island={island}
      />
    );
  }

  return (
    <>
      {inProgress ? (
        <InProgressBuilding
          key={id}
          name={name}
          id={id}
          index={index}
          readyAt={readyAt}
          createdAt={createdAt}
          showTimers={showTimers}
          x={x}
          y={y}
          island={island}
        />
      ) : (
        <BuildingPlaced
          buildingId={id}
          buildingIndex={index}
          craftingItemName={craftingItemName}
          craftingReadyAt={craftingReadyAt}
          isBuilt
          island={island}
        />
      )}
    </>
  );
};

const isLandscaping = (state: MachineState) => state.matches("landscaping");
const _gameState = (state: MachineState) => state.context.state;

const MoveableBuilding: React.FC<Prop> = (props) => {
  const { gameService } = useContext(Context);
  const gameState = useSelector(gameService, _gameState);

  const landscaping = useSelector(gameService, isLandscaping);
  if (landscaping) {
    const BuildingPlaced = READONLY_BUILDINGS(gameState)[props.name];

    const inProgress = props.readyAt > Date.now();

    // In Landscaping mode, use readonly building
    return (
      <MoveableComponent
        id={props.id}
        index={props.index}
        name={props.name}
        x={props.x}
        y={props.y}
      >
        {inProgress ? (
          <BuildingComponent {...props} />
        ) : (
          <BuildingPlaced buildingId={props.id} {...props} />
        )}
      </MoveableComponent>
    );
  }

  return <BuildingComponent {...props} />;
};

export const Building = React.memo(MoveableBuilding);

export const Constructing: React.FC<{
  state: GameState;
  onClose: () => void;
  onInstantBuilt: (gems: number) => void;
  readyAt: number;
  createdAt: number;
  name: BuildingName;
}> = ({ state, onClose, onInstantBuilt, readyAt, createdAt, name }) => {
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
