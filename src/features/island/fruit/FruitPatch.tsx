import React from "react";

import appleTree from "assets/fruit/apple/apple_tree.png";
import blueberryBush from "assets/fruit/blueberry/blueberry_bush.png";
import orangeTree from "assets/fruit/orange/orange_tree.png";

import fruitPatch from "assets/fruit/fruit_patch.png";
import { PIXEL_SCALE } from "features/game/lib/constants";

export type FruitName = "Apple" | "Orange" | "Blueberry";

const fruits: Record<FruitName, React.FC> = {
  Apple: () => (
    <img
      src={appleTree}
      className="absolute"
      style={{
        width: `${PIXEL_SCALE * 26}px`,
        bottom: `${PIXEL_SCALE * 4}px`,
        left: `${PIXEL_SCALE * 3}px`,
      }}
    />
  ),
  Blueberry: () => (
    <img
      src={blueberryBush}
      className="absolute"
      style={{
        width: `${PIXEL_SCALE * 25}px`,
        bottom: `${PIXEL_SCALE * 8}px`,
        left: `${PIXEL_SCALE * 3}px`,
      }}
    />
  ),
  Orange: () => (
    <img
      src={orangeTree}
      className="absolute"
      style={{
        width: `${PIXEL_SCALE * 26}px`,
        bottom: `${PIXEL_SCALE * 8}px`,
        left: `${PIXEL_SCALE * 3}px`,
      }}
    />
  ),
};

interface Props {
  fruit?: FruitName;
}
export const FruitPatch: React.FC<Props> = ({ fruit }) => {
  return (
    <div className="relative w-full h-full">
      <img
        src={fruitPatch}
        className="absolute"
        style={{
          width: `${PIXEL_SCALE * 30}px`,
          left: `${PIXEL_SCALE * 1}px`,
          top: `${PIXEL_SCALE * 1}px`,
        }}
      />
      {fruit && fruits[fruit]({})}
    </div>
  );
};
