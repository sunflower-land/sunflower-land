import React, { useContext } from "react";
import { animated, config, useSpring } from "react-spring";
import { Context } from "features/game/GameProvider";
import bee from "assets/icons/bee.webp";
import { GRID_WIDTH_PX, PIXEL_SCALE } from "features/game/lib/constants";
import { MachineState } from "features/game/lib/gameMachine";
import { useSelector } from "@xstate/react";
import classNames from "classnames";
import { RESOURCE_DIMENSIONS } from "features/game/types/resources";

export type Position = {
  x: number;
  y: number;
};

interface Props {
  hivePosition: Position;
  flowerId: string;
  onAnimationEnd: () => void;
}

const getFlowerById = (id: string) => (state: MachineState) =>
  state.context.state.flowers[id];

export const Bee: React.FC<Props> = ({
  hivePosition,
  flowerId,
  onAnimationEnd,
}) => {
  const { gameService } = useContext(Context);
  const flower = useSelector(gameService, getFlowerById(flowerId));

  const getFlowerPositionRelativeToHive = (): Position => {
    const { x: hiveX, y: hiveY } = hivePosition;
    const { x: flowerX, y: flowerY } = flower;
    const beeWidth = PIXEL_SCALE * 7;
    const xOffsetToFlowerPosition =
      (GRID_WIDTH_PX * RESOURCE_DIMENSIONS["Flower Bed"].width) / 2 -
      beeWidth / 2;
    const flowerHeightOffset = 20;

    let flowerDistanceX = 0;

    if (flowerX < hiveX) {
      flowerDistanceX =
        -(hiveX - flowerX) * GRID_WIDTH_PX + xOffsetToFlowerPosition;
    }

    if (flowerX > hiveX) {
      flowerDistanceX =
        (flowerX - hiveX) * GRID_WIDTH_PX + xOffsetToFlowerPosition;
    }

    let flowerDistanceY = 0;

    if (flowerY < hiveY) {
      flowerDistanceY = (hiveY - flowerY) * GRID_WIDTH_PX;
    }

    if (flowerY > hiveY) {
      flowerDistanceY = -(flowerY - hiveY) * GRID_WIDTH_PX;
    }

    return {
      x: flowerDistanceX,
      y: flowerDistanceY - flowerHeightOffset,
    };
  };

  const flowerPosition = getFlowerPositionRelativeToHive();

  // React Spring animation
  const animation = useSpring({
    from: { transform: `translate(13px, -13px) scale(0)` },
    to: async (next) => {
      await next({
        transform: `translate(13px, -13px) scale(1)`,
        config: {
          duration: 500,
        },
      });
      // Phase 1: Move to the flowerbed
      await next({
        transform: `translate(${flowerPosition.x}px, ${flowerPosition.y}px) scale(1)`,
        config: {
          ...config.molasses,
          duration: 3500,
        },
      });
      // Phase 2: Hover for a second
      await next({
        transform: `translate(${flowerPosition.x}px, ${flowerPosition.y}px) scale(1) scaleX(-1)`,
        config: {
          duration: 1500,
        },
      });
      // Phase 3: Move back to the hive
      await next({
        transform: `translate(13px, -13px) scale(1) scaleX(-1)`,
        config: {
          duration: 3500,
        },
      });
      // Phase 4: Scale back into the hive
      await next({
        transform: `translate(13px, -1px) scale(0) scaleX(-1)`,
        transformOrigin: "center bottom",
        config: { duration: 500 },
      });
      onAnimationEnd(); // Callback when animation is done
    },
  });

  return (
    <animated.div
      style={{
        position: "absolute",
        width: `${PIXEL_SCALE * 7}px`,
        height: `${PIXEL_SCALE * 7}px`,
        ...animation,
      }}
    >
      <img
        src={bee}
        alt="Bee"
        className={classNames("bee-flight", {
          "-scale-x-100": flowerPosition.x > 0,
        })}
        style={{
          width: `${PIXEL_SCALE * 7}px`,
        }}
      />
    </animated.div>
  );
};
