import React, { useContext } from "react";
import { animated, config, useSpring } from "react-spring";
import { Context } from "features/game/GameProvider";
import bee from "assets/icons/bee.webp";
import { GRID_WIDTH_PX, PIXEL_SCALE } from "features/game/lib/constants";
import { MachineState } from "features/game/lib/gameMachine";
import { useSelector } from "@xstate/react";
import { RESOURCE_DIMENSIONS } from "features/game/types/resources";
import { FlowerBed } from "features/game/types/game";

interface Props {
  hiveX: number;
  hiveY: number;
  flowerId: string;
  onAnimationEnd: () => void;
}

const getFlowerBedById = (id: string) => (state: MachineState) => {
  return state.context.state.flowers.flowerBeds[id];
};
const compareFlowerBed = (
  prevFlowerBed: FlowerBed,
  nextFlowerBed: FlowerBed,
) => {
  return JSON.stringify(prevFlowerBed) === JSON.stringify(nextFlowerBed);
};

const BeeComponent: React.FC<Props> = ({
  hiveX,
  hiveY,
  flowerId,
  onAnimationEnd,
}) => {
  const { gameService } = useContext(Context);
  const flower = useSelector(
    gameService,
    getFlowerBedById(flowerId),
    compareFlowerBed,
  );
  const { x: flowerX, y: flowerY } = flower;

  const getFlowerPositionRelativeToHive = (): {
    x: number;
    y: number;
    distance: number;
  } => {
    const beeWidth = PIXEL_SCALE * 7;
    const xOffsetToFlowerPosition =
      (GRID_WIDTH_PX * RESOURCE_DIMENSIONS["Flower Bed"].width) / 2 -
      beeWidth / 2;
    const flowerHeightOffset = 20;

    let flowerDistanceX = 0;

    if (flowerX <= hiveX) {
      flowerDistanceX =
        -(hiveX - flowerX) * GRID_WIDTH_PX + xOffsetToFlowerPosition;
    }

    if (flowerX > hiveX) {
      flowerDistanceX =
        (flowerX - hiveX) * GRID_WIDTH_PX + xOffsetToFlowerPosition;
    }

    let flowerDistanceY = 0;

    if (flowerY <= hiveY) {
      flowerDistanceY = (hiveY - flowerY) * GRID_WIDTH_PX;
    }

    if (flowerY > hiveY) {
      flowerDistanceY = -(flowerY - hiveY) * GRID_WIDTH_PX;
    }

    return {
      x: flowerDistanceX,
      y: flowerDistanceY - flowerHeightOffset,
      distance: Math.sqrt(flowerDistanceX ** 2 + flowerDistanceY ** 2),
    };
  };

  const getBeeDirection = () => {
    // Bee default direction is right: 1
    // Above or above right or right
    if (flowerX >= hiveX && flowerY >= hiveY) return -1;

    // Above left or left
    if (flowerX < hiveX && flowerY >= hiveY) return 1;

    // Below or below right
    if (flowerX >= hiveX && flowerY < hiveY) return -1;

    // Below left
    if (flowerX < hiveX && flowerY < hiveY) return 1;

    return 1;
  };

  const getFlightDuration = (distance: number) => {
    const perfectSpeed = 200 / 3.5; // Speed in pixels per second

    const durationInSeconds = distance / perfectSpeed; // Duration in seconds
    const durationInMilliseconds = durationInSeconds * 1000; // Convert to milliseconds

    return durationInMilliseconds;
  };

  const flowerPosition = getFlowerPositionRelativeToHive();
  const initialBeeDirection = getBeeDirection();
  const finalBeeDirection = -initialBeeDirection;

  // React Spring animation
  const animation = useSpring({
    from: {
      transform: `translate(13px, -13px) scale(0) scaleX(${initialBeeDirection})`,
    },
    to: async (next) => {
      const flightDuration = getFlightDuration(flowerPosition.distance);

      await next({
        transform: `translate(13px, -13px) scale(1) scaleX(${initialBeeDirection})`,
        config: {
          duration: 500,
        },
      });
      // Phase 1: Move to the flowerbed
      await next({
        transform: `translate(${flowerPosition.x}px, ${flowerPosition.y}px) scale(1) scaleX(${initialBeeDirection})`,
        config: {
          ...config.slow,
          duration: flightDuration,
        },
      });
      // Phase 2: Hover for a second
      await new Promise((resolve) => setTimeout(resolve, 1000));
      // Phase 3: Turn around
      await next({
        transform: `translate(${flowerPosition.x}px, ${flowerPosition.y}px) scale(1) scaleX(${finalBeeDirection})`,
        config: {
          duration: 1,
        },
      });
      // Phase 4: Move back to the hive
      await next({
        transform: `translate(13px, -13px) scale(1) scaleX(${finalBeeDirection})`,
        config: {
          ...config.slow,
          duration: flightDuration,
        },
      });
      // Phase 5: Scale back into the hive
      await next({
        transform: `translate(13px, -1px) scale(0) scaleX(${finalBeeDirection})`,
        transformOrigin: "center bottom",
        config: { duration: 500 },
      });
      onAnimationEnd(); // Callback when animation is done
    },
  });

  return (
    <animated.div
      className="absolute z-50 pointer-events-none"
      style={{
        width: `${PIXEL_SCALE * 7}px`,
        height: `${PIXEL_SCALE * 7}px`,
        ...animation,
      }}
    >
      <img
        src={bee}
        alt="Bee"
        className="bee-flight"
        style={{
          width: `${PIXEL_SCALE * 7}px`,
        }}
      />
    </animated.div>
  );
};

export const Bee = React.memo(BeeComponent);
