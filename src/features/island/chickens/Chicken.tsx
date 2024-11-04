import { useInterpret, useSelector } from "@xstate/react";
import React, { useContext, useState } from "react";
import classNames from "classnames";

import { Context } from "features/game/GameProvider";

import Spritesheet from "components/animation/SpriteAnimator";
import {
  CHICKEN_TIME_TO_EGG,
  PIXEL_SCALE,
  POPOVER_TIME_MS,
} from "features/game/lib/constants";
import Decimal from "decimal.js-light";
import { Bar } from "components/ui/ProgressBar";
import { InnerPanel } from "components/ui/Panel";
import { secondsToString } from "lib/utils/time";
import {
  ChickenContext,
  chickenMachine,
  MachineInterpreter as ChickenMachineInterpreter,
  MachineState as ChickenMachineState,
} from "features/farming/animals/chickenMachine";
import { MutantAnimalModal } from "features/farming/animals/components/MutantAnimalModal";
import { getWheatRequiredToFeed } from "features/game/events/landExpansion/feedChicken";
import { SUNNYSIDE } from "assets/sunnyside";
import { CROP_LIFECYCLE } from "../plots/lib/plant";
import {
  Chicken as ChickenType,
  GameState,
  MutantChicken,
} from "features/game/types/game";
import { isCollectibleBuilt } from "features/game/lib/collectibleBuilt";
import { MachineState as GameMachineState } from "features/game/lib/gameMachine";
import { MoveableComponent } from "../collectibles/MovableComponent";
import { ZoomContext } from "components/ZoomProvider";
import { isLocked } from "features/game/events/landExpansion/moveChicken";
import { SquareIcon } from "components/ui/SquareIcon";
import { gameAnalytics } from "lib/gameAnalytics";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { useSound } from "lib/utils/hooks/useSound";
import { hasFeatureAccess } from "lib/flags";

const getPercentageComplete = (fedAt?: number) => {
  if (!fedAt) return 0;

  const timePassedSinceFed = Date.now() - fedAt;

  if (timePassedSinceFed >= CHICKEN_TIME_TO_EGG) return 100;

  return Math.ceil((timePassedSinceFed / CHICKEN_TIME_TO_EGG) * 100);
};

const selectTimeToEgg = (state: ChickenMachineState) => state.context.timeToEgg;
const selectTimeElapsed = (state: ChickenMachineState) =>
  state.context.timeElapsed;

interface TimeToEggProps {
  service: ChickenMachineInterpreter;
  showTimeToEgg: boolean;
}

const TimeToEgg = ({ showTimeToEgg, service }: TimeToEggProps) => {
  const timeToEgg = useSelector(service, selectTimeToEgg);
  const timeElapsed = useSelector(service, selectTimeElapsed);
  const { t } = useAppTranslation();

  return (
    <InnerPanel
      className={classNames(
        "ml-10 transition-opacity absolute whitespace-nowrap bottom-5 w-fit left-1 z-50 pointer-events-none",
        {
          "opacity-100": showTimeToEgg,
          "opacity-0": !showTimeToEgg,
        },
      )}
    >
      <div className="flex flex-col text-xxs ml-2 mr-2">
        <div className="flex flex-1 items-center justify-center">
          <img src={SUNNYSIDE.resource.egg} className="w-4 mr-1" />
          <span>{t("egg")}</span>
        </div>
        <span className="flex-1 font-secondary">
          {secondsToString(timeToEgg - timeElapsed, {
            length: "medium",
          })}
        </span>
      </div>
    </InnerPanel>
  );
};

const HasWheat = (inventoryWheatCount: Decimal, game: GameState) => {
  const wheatRequired = getWheatRequiredToFeed(game);

  // has enough wheat to feed chickens

  if (wheatRequired.lte(0)) return true;

  return inventoryWheatCount.gte(wheatRequired);
};

const isHungry = (state: ChickenMachineState) => state.matches("hungry");
const isEating = (state: ChickenMachineState) => state.matches("eating");
const isSleeping = (state: ChickenMachineState) =>
  state.matches({ fed: "sleeping" });
const isHappy = (state: ChickenMachineState) => state.matches({ fed: "happy" });
const isEggReady = (state: ChickenMachineState) => state.matches("eggReady");
const isEggLaid = (state: ChickenMachineState) => state.matches("eggLaid");
const selectInventoryWheatCount = (state: GameMachineState) =>
  state.context.state.inventory.Wheat ?? new Decimal(0);
const selectGame = (state: GameMachineState) => state.context.state;

const compareChicken = (prev: ChickenType, next: ChickenType) => {
  return JSON.stringify(prev) === JSON.stringify(next);
};
const compareGame = (prev: GameState, next: GameState) =>
  isCollectibleBuilt({ name: "Gold Egg", game: prev }) ===
    isCollectibleBuilt({ name: "Gold Egg", game: next }) &&
  isCollectibleBuilt({ name: "Fat Chicken", game: prev }) ===
    isCollectibleBuilt({ name: "Fat Chicken", game: next });

interface Props {
  id: string;
  x: number;
  y: number;
}

const PlaceableChicken: React.FC<Props> = ({ id }) => {
  const { scale } = useContext(ZoomContext);
  const { gameService, shortcutItem, showTimers } = useContext(Context);

  const chickens = ["chicken_1", "chicken_2"] as const;
  const chickenSound = useSound(
    chickens[Math.floor(Math.random() * chickens.length)],
  );
  const chickenCollects = ["chicken_collect_1", "chicken_collect_2"] as const;
  const chickenCollectSound = useSound(
    chickenCollects[Math.floor(Math.random() * chickenCollects.length)],
  );
  const no = useSound("no");
  const { t } = useAppTranslation();
  const chicken = useSelector(
    gameService,
    (state) => state.context.state.chickens[id],
    compareChicken,
  );
  const game = useSelector(gameService, selectGame, compareGame);
  const inventoryWheatCount = useSelector(
    gameService,
    selectInventoryWheatCount,
    (prev: Decimal, next: Decimal) =>
      HasWheat(prev, game) === HasWheat(next, game),
  );

  const percentageComplete = getPercentageComplete(chicken?.fedAt);

  const chickenContext: Partial<ChickenContext> = chicken;

  // useInterpret returns a static reference (to just the interpreted machine) which will not rerender when its state changes
  const chickenService = useInterpret(chickenMachine, {
    // If chicken is already brewing an egg then add that to the chicken machine context
    context: chickenContext,
  }) as unknown as ChickenMachineInterpreter;

  // As per xstate docs:
  // To use a piece of state from the service inside a render, use the useSelector(...) hook to subscribe to it
  const hungry = useSelector(chickenService, isHungry);
  const eating = useSelector(chickenService, isEating);
  const sleeping = useSelector(chickenService, isSleeping);
  const happy = useSelector(chickenService, isHappy);
  const eggReady = useSelector(chickenService, isEggReady);
  const eggLaid = useSelector(chickenService, isEggLaid);

  const eggIsBrewing = happy || sleeping;
  const showEggProgress =
    showTimers && chicken && !eating && !eggLaid && !hungry;
  const interactible = hungry || eggReady || eggLaid;

  // Popover is to indicate when player has no wheat or when wheat is not selected.
  const [showPopover, setShowPopover] = useState(false);
  const [showDeprecatedPopover, setShowDeprecatedPopover] = useState(false);
  const [showTimeToEgg, setShowTimeToEgg] = useState(false);
  const [showMutantModal, setShowMutantModal] = useState(false);

  const handleMouseEnter = () => {
    eggIsBrewing && setShowTimeToEgg(true);
  };

  const handleMouseLeave = () => {
    setShowTimeToEgg(false);
  };

  const handleClick = async () => {
    if (eggReady) {
      chickenSound.play();

      chickenService.send("LAY");
      return;
    }

    if (eggLaid) {
      chickenCollectSound.play();
      handleCollect();
      return;
    }

    if (hasFeatureAccess(game, "ANIMAL_BUILDINGS")) {
      setShowDeprecatedPopover(true);
      await new Promise((resolve) => setTimeout(resolve, POPOVER_TIME_MS * 2));
      setShowDeprecatedPopover(false);
      return;
    }

    if (hungry) {
      feed();
      return;
    }
  };

  const feed = async () => {
    if (!isCollectibleBuilt({ name: "Gold Egg", game })) {
      const hasWheat = HasWheat(inventoryWheatCount, game);

      if (!hasWheat) {
        no.play();
        setShowPopover(true);
        await new Promise((resolve) => setTimeout(resolve, POPOVER_TIME_MS));
        setShowPopover(false);
        return;
      }

      shortcutItem("Wheat");
    }

    chickenSound.play();

    const {
      context: {
        state: { chickens, bumpkin },
      },
    } = gameService.send("chicken.fed", {
      id,
    });

    const chicken = chickens[id];

    chickenService.send("FEED", {
      fedAt: chicken.fedAt,
    });
  };

  const handleCollect = () => {
    if (chicken.reward) {
      setShowMutantModal(true);
      return;
    }

    collectEgg();
  };

  const handleContinue = () => {
    setShowMutantModal(false);
    collectEgg();
  };

  const collectEgg = () => {
    const newState = gameService.send("chicken.collectEgg", {
      id,
    });

    if (!newState.matches("hoarding")) {
      chickenService.send("COLLECT");
    }

    if (newState.context.state.bumpkin?.activity?.["Egg Collected"] === 1) {
      gameAnalytics.trackMilestone({
        event: "Tutorial:EggCollected:Completed",
      });
    }
  };

  return (
    <>
      <div
        className={classNames("w-full h-full relative", {
          "cursor-pointer hover:img-highlight": interactible,
        })}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="relative pointer-events-none">
          {hungry && (
            <>
              <img
                src={SUNNYSIDE.animals.chickenShadow}
                className="absolute"
                style={{
                  width: `${PIXEL_SCALE * 13}px`,
                  top: `${PIXEL_SCALE * 10}px`,
                  left: `${PIXEL_SCALE * 1}px`,
                }}
              />
              <img
                src={SUNNYSIDE.animals.hungryChicken}
                alt="hungry-chicken"
                style={{
                  width: `${PIXEL_SCALE * 16}px`,
                  top: `${PIXEL_SCALE * -5}px`,
                  left: `${PIXEL_SCALE * 2}px`,
                }}
                className="absolute"
              />
              <img
                src={SUNNYSIDE.icons.cancel}
                className={classNames("transition-opacity absolute z-20", {
                  "opacity-100": showPopover,
                  "opacity-0": !showPopover,
                })}
                style={{
                  width: `${PIXEL_SCALE * 8}px`,
                  top: `${PIXEL_SCALE * 8}px`,
                  left: `${PIXEL_SCALE * 4}px`,
                }}
              />
              <img
                src={CROP_LIFECYCLE.Wheat.crop}
                className={classNames("transition-opacity absolute z-10", {
                  "opacity-100": showPopover,
                  "opacity-0": !showPopover,
                })}
                style={{
                  width: `${PIXEL_SCALE * 8}px`,
                  top: `${PIXEL_SCALE * 5}px`,
                  left: `${PIXEL_SCALE * 9}px`,
                }}
              />
            </>
          )}
          {eating && (
            <>
              <img
                src={SUNNYSIDE.animals.wheatOnGround}
                alt="wheat-on-ground"
                className="absolute display-block"
                style={{
                  width: `${PIXEL_SCALE * 126}px`,
                  imageRendering: "pixelated",
                }}
              />
              <Spritesheet
                className="absolute"
                style={{
                  width: `${PIXEL_SCALE * 32}px`,
                  top: `${PIXEL_SCALE * -9}px`,
                  left: `${PIXEL_SCALE * -7}px`,
                  imageRendering: "pixelated",
                }}
                image={SUNNYSIDE.animals.walkingChickenSheet}
                widthFrame={32}
                heightFrame={32}
                zoomScale={scale}
                fps={10}
                steps={50}
                direction={`forward`}
                autoplay={true}
                loop={true}
              />
            </>
          )}
          {happy && (
            <>
              <img
                src={SUNNYSIDE.animals.chickenShadow}
                className="absolute"
                style={{
                  width: `${PIXEL_SCALE * 13}px`,
                  top: `${PIXEL_SCALE * 10}px`,
                  left: `${PIXEL_SCALE * 1}px`,
                }}
              />
              <img
                src={SUNNYSIDE.animals.happyChicken}
                alt="happy-chicken"
                className="absolute"
                style={{
                  width: `${PIXEL_SCALE * 16}px`,
                  top: `${PIXEL_SCALE * -6}px`,
                  left: `${PIXEL_SCALE * 2}px`,
                }}
              />
            </>
          )}
          {sleeping && (
            <>
              <img
                src={SUNNYSIDE.animals.chickenShadow}
                className="absolute"
                style={{
                  width: `${PIXEL_SCALE * 13}px`,
                  top: `${PIXEL_SCALE * 10}px`,
                  left: `${PIXEL_SCALE * 1}px`,
                }}
              />
              <img
                src={SUNNYSIDE.animals.sleepingChicken}
                alt="sleeping-chicken"
                className="absolute"
                style={{
                  transformOrigin: "top left",
                  scale: "calc(19/16)",
                  width: `${PIXEL_SCALE * 16}px`,
                  top: `${PIXEL_SCALE * -8}px`,
                  left: `${PIXEL_SCALE * 1}px`,
                }}
              />
            </>
          )}
          {eggReady && (
            <>
              <img
                src={SUNNYSIDE.animals.chickenShadow}
                className="absolute"
                style={{
                  width: `${PIXEL_SCALE * 13}px`,
                  top: `${PIXEL_SCALE * 10}px`,
                  left: `${PIXEL_SCALE * 1}px`,
                }}
              />
              <Spritesheet
                className="absolute"
                style={{
                  width: `${PIXEL_SCALE * 17}px`,
                  top: `${PIXEL_SCALE * -16}px`,
                  left: `${PIXEL_SCALE * 1}px`,
                  imageRendering: "pixelated",
                }}
                image={SUNNYSIDE.animals.layingEggSheet}
                widthFrame={17}
                heightFrame={31}
                zoomScale={scale}
                fps={3}
                steps={21}
                endAt={7}
                direction={`forward`}
                autoplay={true}
                loop={true}
              />
            </>
          )}
          {eggLaid && (
            <>
              <img
                src={SUNNYSIDE.animals.chickenShadow}
                className="absolute"
                style={{
                  width: `${PIXEL_SCALE * 13}px`,
                  top: `${PIXEL_SCALE * 10}px`,
                  left: `${PIXEL_SCALE * 1}px`,
                }}
              />
              <Spritesheet
                image={SUNNYSIDE.animals.layingEggSheet}
                className="absolute"
                style={{
                  width: `${PIXEL_SCALE * 17}px`,
                  top: `${PIXEL_SCALE * -16}px`,
                  left: `${PIXEL_SCALE * 1}px`,
                  imageRendering: "pixelated",
                }}
                widthFrame={17}
                heightFrame={31}
                zoomScale={scale}
                fps={20}
                steps={21}
                direction={`forward`}
                autoplay={true}
                loop={false}
              />
            </>
          )}
        </div>
      </div>

      <InnerPanel
        className={classNames(
          "ml-10 transition-opacity absolute whitespace-nowrap bottom-5 w-fit left-1 z-50 pointer-events-none",
          {
            "opacity-100": showDeprecatedPopover,
            "opacity-0": !showDeprecatedPopover,
          },
        )}
      >
        <div className="flex flex-col text-xxs ml-2 mr-2">
          <span className="flex-1 font-secondary">
            {t("chickens.deprecated.1")}
          </span>
          <span className="flex-1 font-secondary">
            {t("chickens.deprecated.2")}
          </span>
        </div>
      </InnerPanel>
      <TimeToEgg showTimeToEgg={showTimeToEgg} service={chickenService} />
      {showEggProgress && (
        <div
          className="absolute pointer-events-none"
          style={{
            width: `${PIXEL_SCALE * 15}px`,
            top: `${PIXEL_SCALE * 14}px`,
          }}
        >
          <Bar percentage={percentageComplete} type="progress" />
        </div>
      )}
      {showMutantModal && (
        <MutantAnimalModal
          show={showMutantModal}
          mutant={chicken.reward?.items?.[0].name as MutantChicken}
          onContinue={handleContinue}
        />
      )}
    </>
  );
};

const isLandscaping = (state: GameMachineState) => state.matches("landscaping");
const _collectibles = (state: GameMachineState) =>
  state.context.state.collectibles;
const _chickens = (state: GameMachineState) => state.context.state.chickens;
const _bumpkin = (state: GameMachineState) => state.context.state.bumpkin;

const LockedChicken: React.FC<Props> = (props) => {
  const [showPopover, setShowPopover] = useState(false);
  const { t } = useAppTranslation();

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
              <span className="text-xxs mb-0.5">{t("aoe.locked")}</span>
            </div>
          </InnerPanel>
        </div>
      )}
      <div className="relative">
        <PlaceableChicken {...props} />
      </div>
    </div>
  );
};

const MoveableChicken: React.FC<Props> = (props) => {
  return (
    <MoveableComponent
      name="Chicken"
      x={props.x}
      y={props.y}
      id={props.id}
      index={0}
    >
      <PlaceableChicken {...props} />
    </MoveableComponent>
  );
};

const LandscapingChicken: React.FC<Props> = (props) => {
  const { gameService } = useContext(Context);

  const collectibles = useSelector(gameService, _collectibles);
  const chickens = useSelector(gameService, _chickens);
  const bumpkin = useSelector(gameService, _bumpkin);

  if (isLocked(chickens[props.id], collectibles, Date.now(), bumpkin)) {
    return <LockedChicken {...props} />;
  }

  return <MoveableChicken {...props} />;
};

const ChickenComponent: React.FC<Props> = (props) => {
  const { gameService } = useContext(Context);
  const landscaping = useSelector(gameService, isLandscaping);

  if (landscaping) return <LandscapingChicken {...props} />;

  return <PlaceableChicken {...props} />;
};

export const Chicken = React.memo(ChickenComponent);
