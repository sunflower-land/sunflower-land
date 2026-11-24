import React, { useContext, useEffect, useState } from "react";

import type { BuildingName } from "features/game/types/buildings";
import { Bar, ResizableBar } from "components/ui/ProgressBar";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { useSelector } from "@xstate/react";
import { MoveableComponent } from "features/island/collectibles/MovableComponent";
import type { MachineState } from "features/game/lib/gameMachine";
import { Context } from "features/game/GameProvider";
import { BUILDING_COMPONENTS, READONLY_BUILDINGS } from "./BuildingComponents";
import type { CookableName } from "features/game/types/consumables";
import type { GameState, TemperateSeasonName } from "features/game/types/game";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { useCountdown } from "lib/utils/hooks/useCountdown";
import { SUNNYSIDE } from "assets/sunnyside";
import { Label } from "components/ui/Label";
import { TimerDisplay } from "features/retreat/components/auctioneer/AuctionDetails";
import { Button } from "components/ui/Button";
import {
  ITEM_DETAILS,
  getTranslatedItemName,
} from "features/game/types/images";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { Modal } from "components/ui/Modal";
import confetti from "canvas-confetti";
import { useSpeedUpPayment } from "features/game/lib/useSpeedUpPayment";
import { SpeedUpPaymentSelector } from "features/game/components/SpeedUpPaymentSelector";
import { gameAnalytics } from "lib/gameAnalytics";
import tornadoIcon from "assets/icons/tornado.webp";
import tsunamiIcon from "assets/icons/tsunami.webp";
import {
  getActiveCalendarEvent,
  type SeasonalEventName,
} from "features/game/types/calendar";
import {
  isBuildingUpgradable,
  makeUpgradableBuildingKey,
} from "features/game/events/landExpansion/upgradeBuilding";
import { useNow } from "lib/utils/hooks/useNow";
import { WeatherAffectedModal } from "features/island/plots/components/AffectedModal";
import { hasFeatureAccess } from "lib/flags";
import { isBuildingDisabled } from "features/game/lib/weatherTornado";

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

  const onSpeedUp = (
    cost: number,
    paymentMethod: "gems" | "coins" = "gems",
  ) => {
    if (isUpgradable) {
      gameService.send("upgrade.spedUp", { name, paymentMethod });
    } else {
      gameService.send("building.spedUp", { name, id, paymentMethod });
    }

    gameAnalytics.trackSink({
      currency: paymentMethod === "coins" ? "Coins" : "Gem",
      amount: cost,
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
  const tornado = getStoredTornado(game);

  return (
    <>
      <WeatherAffectedModal
        showModal={showModal}
        setShowModal={setShowModal}
        icon={DESTROYED_BUILDING_ICONS[calendarEvent]}
        title={t(calendarEvent)}
        description={t(`${calendarEvent}.building.destroyed.description`)}
        startedAt={tornado?.startAt ?? game.calendar[calendarEvent]!.startedAt}
        endAt={tornado?.endAt}
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

/**
 * The Tornado the stored pick belongs to, with the Weather flag on. Its pick
 * lists the buildings it disables.
 */
function getStoredTornado(game: GameState) {
  if (!hasFeatureAccess(game, "WEATHER")) return undefined;

  const pick = game.weather?.tornado;
  if (!pick) return undefined;

  return game.weather?.forecast.find(
    (event) => event.name === "tornado" && event.startAt === pick.startAt,
  );
}

/**
 * Whether the building can't be used because of a weather event. With the
 * Weather flag on, that's the Tornado disabling it (`now` matters); otherwise
 * the calendar's Tornado or Tsunami.
 */
export function isBuildingDestroyed({
  name,
  id,
  game,
  now,
}: {
  name: BuildingName;
  id?: string;
  game: GameState;
  now: number;
}): DestructiveEvent | false {
  if (hasFeatureAccess(game, "WEATHER")) {
    return isBuildingDisabled({ game, name, id, now }) ? "tornado" : false;
  }

  const { calendar } = game;

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

const _destroyedBy =
  (name: BuildingName, id: string, now: number) => (state: MachineState) =>
    isBuildingDestroyed({ name, id, game: state.context.state, now });

/** When the Tornado ends, while its pick holds this building. */
const _tornadoEndAt =
  (name: BuildingName, id: string) => (state: MachineState) => {
    const game = state.context.state;
    const picked = game.weather?.tornado?.buildings.some(
      (building) => building.name === name && building.id === id,
    );
    if (!picked) return undefined;

    return getStoredTornado(game)?.endAt;
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

  // Ticks only while the Tornado's pick holds this building, so it opens again
  // the moment the Tornado ends.
  const tornadoEndAt = useSelector(gameService, _tornadoEndAt(name, id));
  const tornadoNow = useNow({
    live: tornadoEndAt !== undefined,
    autoEndAt: tornadoEndAt,
  });
  const destroyedBy = useSelector(
    gameService,
    _destroyedBy(name, id, tornadoNow),
  );

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
const _pigpenLevel = (state: MachineState) => state.context.state.pigpen.level;

const MoveableBuilding: React.FC<Prop> = (props) => {
  const { gameService } = useContext(Context);
  const island = useSelector(gameService, _island);
  const season = useSelector(gameService, _season);
  const henHouseLevel = useSelector(gameService, _henHouseLevel);
  const barnLevel = useSelector(gameService, _barnLevel);
  const pigpenLevel = useSelector(gameService, _pigpenLevel);
  const landscaping = useSelector(gameService, isLandscaping);
  const BuildingPlaced = READONLY_BUILDINGS({
    island,
    season,
    henHouseLevel,
    barnLevel,
    pigpenLevel,
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
  onInstantBuilt: (cost: number, paymentMethod?: "gems" | "coins") => void;
  readyAt: number;
  createdAt: number;
  name: BuildingName;
}> = ({ state, onClose, onInstantBuilt, readyAt, createdAt, name }) => {
  const { t } = useAppTranslation();
  const totalSeconds = (readyAt - createdAt) / 1000;
  const { totalSeconds: secondsTillReady } = useCountdown(readyAt ?? 0);

  const { days: _days, ...ready } = useCountdown(readyAt ?? 0);

  const payment = useSpeedUpPayment({ readyAt, game: state });
  const cost =
    payment.paymentMethod === "coins" ? payment.coinCost : payment.gemCost;
  const costIcon =
    payment.paymentMethod === "coins"
      ? SUNNYSIDE.ui.coins
      : ITEM_DETAILS.Gem.image;

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
        <Label type="default" icon={SUNNYSIDE.icons.stopwatch}>
          {t("crafting.inProgress")}
        </Label>
        <p className="text-sm my-2">
          {t("crafting.readySoon", { name: getTranslatedItemName(name) })}
        </p>
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
        <SpeedUpPaymentSelector payment={payment} />
      </div>

      <div className="flex">
        <Button className="mr-1" onClick={onClose}>
          {t("close")}
        </Button>
        <Button
          disabled={!payment.canAfford}
          className="relative ml-1"
          onClick={() => onInstantBuilt(cost, payment.paymentMethod)}
        >
          {t("gems.speedUp")}
          {!payment.canPayWithCoins && (
            <Label
              type={payment.canAfford ? "default" : "danger"}
              icon={costIcon}
              className="flex absolute right-0 top-0.5"
            >
              {cost}
            </Label>
          )}
        </Button>
      </div>
    </>
  );
};
