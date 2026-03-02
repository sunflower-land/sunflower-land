import React, { useContext, useEffect, useState } from "react";

import { BuildingName } from "features/game/types/buildings";
import { Bar, ResizableBar } from "components/ui/ProgressBar";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { useSelector } from "@xstate/react";
import { MoveableComponent } from "features/island/collectibles/MovableComponent";
import { MachineState } from "features/game/lib/gameMachine";
import { Context } from "features/game/GameProvider";
import { BUILDING_COMPONENTS, READONLY_BUILDINGS } from "./BuildingComponents";
import { CookableName } from "features/game/types/consumables";
import { GameState, TemperateSeasonName } from "features/game/types/game";
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
import tsunamiIcon from "assets/icons/tsunami.webp";
import {
  getActiveCalendarEvent,
  SeasonalEventName,
} from "features/game/types/calendar";
import {
  isBuildingUpgradable,
  makeUpgradableBuildingKey,
} from "features/game/events/landExpansion/upgradeBuilding";
import { useNow } from "lib/utils/hooks/useNow";
import { WeatherAffectedModal } from "features/island/plots/components/AffectedModal";

interface Prop {
  name: BuildingName;
  id: string;
  index: number;
  readyAt: number;
  createdAt: number;
  craftingItemName?: CookableName;
  craftingReadyAt?: number;
  x: number;
  y: number;
  island: GameState["island"];
  season: TemperateSeasonName;
}

export interface BuildingProps {
  buildingId: string;
  isBuilt?: boolean;
  island: GameState["island"];
  season: TemperateSeasonName;
}

const _isUpgradable = (name: BuildingName) => (state: MachineState) =>
  isBuildingUpgradable(name) &&
  state.context.state[makeUpgradableBuildingKey(name)].level > 1;

const InProgressBuilding: React.FC<Prop> = ({
  name,
  id,
  index,
  readyAt,
  createdAt,
  island,
  season,
}) => {
  const { gameService, showAnimations, showTimers } = useContext(Context);
  const BuildingPlaced = BUILDING_COMPONENTS[name];

  const now = useNow({ live: true, autoEndAt: readyAt });
  const [showModal, setShowModal] = useState(
    now - createdAt < 1000 ? true : false,
  );

  const totalSeconds = (readyAt - createdAt) / 1000;
  const { totalSeconds: secondsLeft } = useCountdown(readyAt ?? 0);

  const isUpgradable = useSelector(gameService, _isUpgradable(name));

  const onSpeedUp = (gems: number) => {
    if (isUpgradable) {
      gameService.send({ type: "upgrade.spedUp", name });
    } else {
      gameService.send({ type: "building.spedUp", name, id });
    }

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
            season={season}
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

type DestructiveEvent = Exclude<
  SeasonalEventName,
  | "fullMoon"
  | "greatFreeze"
  | "doubleDelivery"
  | "bountifulHarvest"
  | "insectPlague"
  | "sunshower"
  | "fishFrenzy"
>;

const DESTROYED_BUILDING_ICONS: Record<DestructiveEvent, string> = {
  tornado: tornadoIcon,
  tsunami: tsunamiIcon,
};

const DestroyedBuilding: React.FC<
  Prop & {
    calendarEvent: DestructiveEvent;
  }
> = ({ name, id, index, island, calendarEvent, season }) => {
  const { gameService } = useContext(Context);

  const BuildingPlaced = BUILDING_COMPONENTS[name];

  const { t } = useAppTranslation();
  const [showModal, setShowModal] = useState(false);
  const game = gameService.getSnapshot().context.state;

  return (
    <>
      <WeatherAffectedModal
        showModal={showModal}
        setShowModal={setShowModal}
        icon={DESTROYED_BUILDING_ICONS[calendarEvent]}
        title={t(calendarEvent)}
        description={t(`${calendarEvent}.building.destroyed.description`)}
        startedAt={game.calendar[calendarEvent]!.startedAt}
      />

      <div
        className="w-full h-full cursor-pointer"
        onClick={() => setShowModal(true)}
      >
        <div className="w-full h-full pointer-events-none">
          <BuildingPlaced
            buildingId={id}
            buildingIndex={index}
            island={island}
            season={season}
          />
        </div>
        <img
          src={DESTROYED_BUILDING_ICONS[calendarEvent]}
          alt={calendarEvent}
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

const DESTROYED_BUILDINGS: BuildingName[] = [
  "Kitchen",
  "Barn",
  "Greenhouse",
  "Crop Machine",
  "Deli",
];

export function isBuildingDestroyed({
  name,
  calendar,
}: {
  name: BuildingName;
  calendar: GameState["calendar"];
}): DestructiveEvent | false {
  if (!DESTROYED_BUILDINGS.includes(name)) {
    return false;
  }

  const calendarEvent = getActiveCalendarEvent({ calendar });

  if (!calendarEvent) {
    return false;
  }

  if (calendarEvent === "tornado") {
    if (calendar.tornado?.protected) {
      return false;
    }

    return "tornado";
  }

  if (calendarEvent === "tsunami") {
    if (calendar.tsunami?.protected) {
      return false;
    }

    return "tsunami";
  }

  return false;
}

const _destroyedBy = (name: BuildingName) => (state: MachineState) => {
  const calendarEvent = getActiveCalendarEvent({
    calendar: state.context.state.calendar,
  });
  if (!calendarEvent) {
    return false;
  }

  return isBuildingDestroyed({ name, calendar: state.context.state.calendar });
};

const BuildingComponent: React.FC<Prop> = ({
  name,
  id,
  index,
  readyAt,
  createdAt,
  craftingItemName,
  craftingReadyAt,
  x,
  y,
  island,
  season,
}) => {
  const { gameService } = useContext(Context);
  const BuildingPlaced = BUILDING_COMPONENTS[name];
  const now = useNow({ live: true, autoEndAt: readyAt });
  const inProgress = readyAt > now;

  const destroyedBy = useSelector(gameService, _destroyedBy(name));

  if (destroyedBy) {
    return (
      <DestroyedBuilding
        key={id}
        name={name}
        id={id}
        index={index}
        readyAt={readyAt}
        createdAt={createdAt}
        x={x}
        y={y}
        island={island}
        calendarEvent={destroyedBy}
        season={season}
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
          x={x}
          y={y}
          island={island}
          season={season}
        />
      ) : (
        <BuildingPlaced
          buildingId={id}
          buildingIndex={index}
          craftingItemName={craftingItemName}
          craftingReadyAt={craftingReadyAt}
          isBuilt
          island={island}
          season={season}
        />
      )}
    </>
  );
};

const isLandscaping = (state: MachineState) => state.matches("landscaping");
const _island = (state: MachineState) => state.context.state.island;
const _season = (state: MachineState) => state.context.state.season.season;
const _henHouseLevel = (state: MachineState) =>
  state.context.state.henHouse.level;
const _barnLevel = (state: MachineState) => state.context.state.barn.level;

const MoveableBuilding: React.FC<Prop> = (props) => {
  const { gameService } = useContext(Context);
  const island = useSelector(gameService, _island);
  const season = useSelector(gameService, _season);
  const henHouseLevel = useSelector(gameService, _henHouseLevel);
  const barnLevel = useSelector(gameService, _barnLevel);
  const landscaping = useSelector(gameService, isLandscaping);
  const BuildingPlaced = READONLY_BUILDINGS({
    island,
    season,
    henHouseLevel,
    barnLevel,
  })[props.name];

  const now = useNow(); // just capture "now" once
  const inProgress = props.readyAt > now;

  if (landscaping) {
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
          <BuildingPlaced
            buildingId={props.id}
            {...props}
            buildingIndex={props.index}
          />
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
  const { totalSeconds: secondsTillReady } = useCountdown(readyAt ?? 0);

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
