import React, { useContext, useState } from "react";
import { animated, useSpring } from "react-spring";
import { Context } from "features/game/GameProvider";
import bee from "assets/icons/bee.webp";
import { GRID_WIDTH_PX, PIXEL_SCALE } from "features/game/lib/constants";
import { MachineState } from "features/game/lib/gameMachine";
import { useSelector } from "@xstate/react";
import classNames from "classnames";

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
  const [animationPhase, setAnimationPhase] = useState(0);

  const flower = useSelector(gameService, getFlowerById(flowerId));

  const getFlowerPositionRelativeToHive = (): Position => {
    const { x: hiveX, y: hiveY } = hivePosition;
    const { x: flowerX, y: flowerY } = flower;
    const beeWidth = PIXEL_SCALE * 10;
    const offsetToFlowerPosition = GRID_WIDTH_PX * 1.5 - beeWidth / 2;

    let flowerDistanceX = 0;

    if (flowerX < hiveX) {
      flowerDistanceX =
        -(hiveX - flowerX) * GRID_WIDTH_PX + offsetToFlowerPosition;
    }

    if (flowerX > hiveX) {
      flowerDistanceX =
        (flowerX - hiveX) * GRID_WIDTH_PX + offsetToFlowerPosition;
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
      y: flowerDistanceY,
    };
  };

  const flowerPosition = getFlowerPositionRelativeToHive();

  // React Spring animation
  const animation = useSpring({
    from: { transform: `translate(0px, 0px) scale(0)` },
    to: async (next) => {
      await next({
        transform: `translate(0px, 0px) scale(1)`,
        config: {
          duration: 1000,
        },
      });
      // Phase 1: Move to the flowerbed
      await next({
        transform: `translate(${flowerPosition.x}px, ${flowerPosition.y}px) scale(1)`,
        config: {
          duration: 3000,
        },
      });
      // Phase 2: Hover for a second
      await new Promise((resolve) => setTimeout(resolve, 2000));
      // Phase 3: Move back to the hive
      await next({
        transform: `translate(0px, 0px) scale(1)`,
        config: {
          duration: 3000,
        },
      });
      // Phase 4: Scale back into the hive
      await next({
        transform: `translate(0px, 0px) scale(0)`,
        config: { duration: 1000 },
      });
      onAnimationEnd(); // Callback when animation is done
    },
  });

  return (
    <animated.div
      id="BEEEE"
      style={{
        position: "absolute",
        width: `${PIXEL_SCALE * 10}px`,
        height: `${PIXEL_SCALE * 10}px`,
        ...animation,
      }}
    >
      <img
        src={bee}
        alt="Bee"
        className={classNames("animate-float", {
          "-scale-x-100": flowerPosition.x > 0,
        })}
        style={{
          width: `${PIXEL_SCALE * 10}px`,
        }}
      />
    </animated.div>
  );
};
