import React from "react";
import skulls from "assets/decorations/war_skulls.png";
import tombstone from "assets/decorations/war_tombstone.png";
import { GRID_WIDTH_PX } from "features/game/lib/constants";

interface Props {
  amount: number;
}
export const WarSkulls: React.FC<Props> = ({ amount }) => {
  const skullCount = Math.min(amount, 5);
  return (
    <div
      className="absolute flex flex-wrap justify-center"
      style={{
        top: `${GRID_WIDTH_PX * 51}px`,
        left: `${GRID_WIDTH_PX * 11}px`,
        width: `${GRID_WIDTH_PX * 4}px`,
      }}
    >
      {new Array(skullCount).fill(null).map((_, index) => (
        <img
          key={index}
          src={skulls}
          className="mr-2 inline-block"
          style={{
            width: `${GRID_WIDTH_PX * 1}px`,
            height: "fit-content",
            zIndex: index + 1,
            position: "relative",
            bottom: "4px",
          }}
        />
      ))}
    </div>
  );
};

export const WarTombstone: React.FC<Props> = ({ amount }) => {
  const count = Math.min(amount, 5);
  return (
    <div
      className="absolute flex flex-wrap justify-center"
      style={{
        top: `${GRID_WIDTH_PX * 23.5}px`,
        left: `${GRID_WIDTH_PX * 36}px`,
        width: `${GRID_WIDTH_PX * 11}px`,
      }}
    >
      {new Array(count).fill(null).map((_, index) => (
        <img
          key={index}
          src={tombstone}
          className="mr-2 inline-block"
          style={{
            width: `${GRID_WIDTH_PX * 0.9}px`,
            height: "fit-content",
            zIndex: index + 1,
            position: "relative",
            bottom: "4px",
          }}
        />
      ))}
    </div>
  );
};
