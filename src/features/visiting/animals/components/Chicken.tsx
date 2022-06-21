import React from "react";
import happyChicken from "assets/animals/chickens/happy.gif";
import { ChickenPosition } from "features/game/types/game";

interface Props {
  index: number;
  position: ChickenPosition;
}

export const Chicken: React.FC<Props> = ({ index, position }) => {
  return (
    <div
      className="absolute"
      style={{
        right: position.right,
        top: position.top,
      }}
    >
      <div className="relative w-16 h-16" style={{ zIndex: index }}>
        <img
          src={happyChicken}
          alt="happy-chicken"
          className="absolute w-16 h-16"
        />
      </div>
    </div>
  );
};
