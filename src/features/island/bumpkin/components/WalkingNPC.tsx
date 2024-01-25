import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { animated } from "@react-spring/web";

import { NPC, NPCProps } from "./NPC";
import { GRID_WIDTH_PX } from "features/game/lib/constants";
import { useSpring } from "react-spring";
import { Coordinates } from "features/game/expansion/components/MapPlacement";
import {
  emptyPositions,
  pickEmptyPosition,
} from "features/game/expansion/placeable/lib/collisionDetection";
import { Context } from "features/game/GameProvider";

export const WalkingNPC: React.FC<NPCProps> = ({ parts: bumpkinParts }) => {
  const { gameService } = useContext(Context);

  const [to, setTo] = useState<Coordinates>({ x: 2, y: -4 });
  const [from, setFrom] = useState<Coordinates>({ x: 6, y: -4 });

  const onRest = useCallback(async () => {
    // Chill out for a bit
    await new Promise((res) => setTimeout(res, 1000));

    setFrom(to);

    const positions = emptyPositions({
      // Full map bounding
      bounding: {
        height: 100,
        width: 100,
        x: -50,
        y: 50,
      },
      gameState: gameService.state.context.state,
    });

    const positionsOnAxis = positions.filter(
      (position) =>
        position.x === to.x ||
        (position.y === to.y && position.x !== from.x && position.y !== from.y)
    );

    const random = Math.floor(Math.random() * positionsOnAxis.length);
    const nextPosition = positionsOnAxis[random];
    setTo(nextPosition);

    console.log({ to, from, nextPosition });
  }, [to]);

  const CONSTANT_SPEED = 0.005; // Constant speed

  const distance = useMemo(
    () => Math.sqrt(Math.pow(to.x - from.x, 2) + Math.pow(to.y - from.y, 2)),
    [to, from]
  );

  const duration = distance / CONSTANT_SPEED;

  const walkingProps = useSpring({
    from: {
      top: `calc(50% - ${GRID_WIDTH_PX * from.y}px)`,
      left: `calc(50% + ${GRID_WIDTH_PX * from.x}px)`,
    },
    to: {
      top: `calc(50% - ${GRID_WIDTH_PX * to.y}px)`,
      left: `calc(50% + ${GRID_WIDTH_PX * to.x}px)`,
    },
    onRest,
    config: {
      duration, // Adjust the multiplier as needed
    },
  });

  return (
    <animated.div className="absolute" style={walkingProps}>
      <NPC key={JSON.stringify(bumpkinParts)} parts={bumpkinParts} />
    </animated.div>
  );
};
