import React, { useContext, useState } from "react";
import { useSelector } from "@xstate/react";
import { Context } from "features/game/GameProvider";
import { MachineState } from "features/game/lib/gameMachine";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { Modal } from "components/ui/Modal";
import { WaterTrapModal } from "./WaterTrapModal";
import { CrustaceanCaught } from "./CrustaceanCaught";
import { useNow } from "lib/utils/hooks/useNow";
import { useCountdown } from "lib/utils/hooks/useCountdown";
import { ProgressBar } from "components/ui/ProgressBar";
import { SUNNYSIDE } from "assets/sunnyside";
import classNames from "classnames";
import {
  CRUSTACEAN_CHUM_AMOUNTS,
  CrustaceanChum,
  CrustaceanName,
  WATER_TRAP_ANIMATIONS,
  WaterTrapName,
  CRUSTACEANS,
  caughtCrustacean,
} from "features/game/types/crustaceans";
import { TimerPopover } from "features/island/common/TimerPopover";
import { ITEM_DETAILS } from "features/game/types/images";
import crabSpot1 from "assets/wharf/crab_spot_1.webp";
import crabSpot2 from "assets/wharf/crab_spot_2.webp";
import { getKeys } from "features/game/types/decorations";
import Spritesheet from "components/animation/SpriteAnimator";
import { ZoomContext } from "components/ZoomProvider";
import type { CrabTrap, GameState } from "features/game/types/game";
import { getObjectEntries } from "features/game/expansion/lib/utils";

const _crabTraps: (state: MachineState) => CrabTrap = (state) =>
  state.context.state.crabTraps;
const _isVisiting: (state: MachineState) => boolean = (state) =>
  state.matches("visiting");
const _farmActivity: (state: MachineState) => GameState["farmActivity"] = (
  state,
) => state.context.state.farmActivity;

interface Props {
  id: string;
}

export const WaterTrapSpot: React.FC<Props> = ({ id }) => {
  const { gameService, showTimers } = useContext(Context);
  const { scale } = useContext(ZoomContext);
  const crabTraps = useSelector(gameService, _crabTraps);
  const isVisiting = useSelector(gameService, _isVisiting);
  const farmActivity = useSelector(gameService, _farmActivity);
  const [showChumSelectionModal, setShowChumSelectionModal] = useState(false);
  const [showCatchModal, setShowCatchModal] = useState(false);
  const [showTimerPopover, setShowTimerPopover] = useState(false);
  const [collectedCatch, setCollectedCatch] = useState<
    | {
        item: CrustaceanName;
        amount: number;
      }
    | undefined
  >(undefined);

  const waterTrap = crabTraps.trapSpots?.[id]?.waterTrap;

  const now = useNow({
    live: !!waterTrap,
    autoEndAt: waterTrap?.readyAt,
  });
  const isReady = waterTrap && waterTrap.readyAt <= now;

  const startedAt = waterTrap?.placedAt ?? 0;
  const readyAt = waterTrap?.readyAt ?? 0;
  const { totalSeconds: secondsLeft } = useCountdown(readyAt);
  const totalRunningSeconds = Math.max((readyAt - startedAt) / 1000, 1);
  const elapsedSeconds = Math.max(totalRunningSeconds - secondsLeft, 0);
  const percentage = Math.min(
    (elapsedSeconds / totalRunningSeconds) * 100,
    100,
  );

  const handleClick = () => {
    if (isVisiting) return;

    if (!waterTrap) {
      setShowChumSelectionModal(true);
      return;
    }

    // If trap is ready, collect it
    if (isReady) {
      let caught = waterTrap.caught;

      if (!caught) {
        // backfill the catch if it's not set from previous versions
        caught = caughtCrustacean(waterTrap.type, waterTrap.chum);
      }
      const [caughtItem, caughtAmount] = getObjectEntries(caught)[0];

      gameService.send({
        type: "waterTrap.collected",
        trapId: id,
      });

      setCollectedCatch({
        item: caughtItem as CrustaceanName,
        amount: caughtAmount ?? 1,
      });
      setShowCatchModal(true);
    }
  };

  const place = (waterTrap: WaterTrapName, chum?: CrustaceanChum) => {
    gameService.send({
      trapId: id,
      type: "waterTrap.placed",
      waterTrap,
      chum,
    });
    gameService.send({ type: "SAVE" });
    setShowChumSelectionModal(false);
  };

  const closeCatchModal = () => {
    setShowCatchModal(false);
    setCollectedCatch(undefined);
  };

  const crabSpotImage = Number(id) > 2 ? crabSpot2 : crabSpot1;

  // Get caught item, but hide in UI if it's a first-time discovery
  const caught = waterTrap?.caught ? getKeys(waterTrap.caught)[0] : undefined;
  const caughtItem =
    caught &&
    caught in CRUSTACEANS &&
    (farmActivity[`${caught} Caught`] ?? 0) > 0
      ? caught
      : undefined;

  const placedPotDimensions =
    waterTrap?.type === "Crab Pot"
      ? { width: 13, height: 15 }
      : { width: 15, height: 17 };

  return (
    <>
      <div
        className={classNames(
          "relative w-full h-full cursor-pointer hover:img-highlight",
          {
            "pointer-events-none": isVisiting,
          },
        )}
        onClick={handleClick}
        onMouseEnter={() => {
          if (!isReady) setShowTimerPopover(true);
        }}
        onMouseLeave={() => setShowTimerPopover(false)}
      >
        {!isReady && waterTrap && (
          <div
            className="flex justify-center absolute w-full pointer-events-none"
            style={{ top: `${PIXEL_SCALE * -18}px` }}
          >
            <TimerPopover
              image={
                caughtItem
                  ? ITEM_DETAILS[caughtItem].image
                  : SUNNYSIDE.icons.expression_confused
              }
              description={caughtItem ? caughtItem : ""}
              showPopover={showTimerPopover}
              timeLeft={secondsLeft}
              secondaryImage={
                waterTrap.chum != null
                  ? ITEM_DETAILS[waterTrap.chum].image
                  : undefined
              }
              secondaryDescription={
                waterTrap.chum != null
                  ? `${CRUSTACEAN_CHUM_AMOUNTS[waterTrap.chum]} ${waterTrap.chum}`
                  : undefined
              }
            />
          </div>
        )}
        {isReady && (
          <>
            <img
              src={SUNNYSIDE.fx.sparkle}
              className="absolute w-4 h-4 z-[100]"
            />
            <img
              src={SUNNYSIDE.icons.expression_alerted}
              className="absolute -top-8 right-3.5"
              style={{
                width: `${PIXEL_SCALE * 4}px`,
              }}
            />
          </>
        )}
        <div className="absolute inset-0 flex items-center justify-center">
          {waterTrap ? (
            <Spritesheet
              className="absolute pointer-events-none"
              style={{
                width: `${PIXEL_SCALE * placedPotDimensions.width}px`,
                height: `${PIXEL_SCALE * placedPotDimensions.height}px`,
                imageRendering: "pixelated",
              }}
              image={WATER_TRAP_ANIMATIONS[waterTrap.type]}
              widthFrame={placedPotDimensions.width}
              heightFrame={placedPotDimensions.height}
              zoomScale={scale}
              fps={3}
              steps={2}
              direction="forward"
              autoplay
              loop
            />
          ) : (
            <img
              src={crabSpotImage}
              alt={`Crab Spot ${id}`}
              width={PIXEL_SCALE * 15}
              height={PIXEL_SCALE * 20}
            />
          )}
        </div>
        {showTimers && !isReady && waterTrap && (
          <div
            className="flex justify-center absolute pointer-events-none"
            style={{
              bottom: `${PIXEL_SCALE * 4}px`,
              left: "50%",
              transform: "translateX(-50%)",
            }}
          >
            <ProgressBar
              percentage={percentage}
              type="progress"
              formatLength="short"
              seconds={secondsLeft}
              style={{
                width: `${PIXEL_SCALE * 14}px`,
              }}
            />
          </div>
        )}
      </div>
      <Modal
        show={showChumSelectionModal}
        onHide={() => setShowChumSelectionModal(false)}
      >
        <WaterTrapModal
          waterTrap={waterTrap}
          onPlace={place}
          onClose={() => setShowChumSelectionModal(false)}
        />
      </Modal>
      <Modal show={showCatchModal} onHide={closeCatchModal}>
        <CrustaceanCaught
          collectedCatch={collectedCatch}
          onClose={closeCatchModal}
        />
      </Modal>
    </>
  );
};
