import React from "react";

import { BuildingProduct } from "features/game/types/game";
import { ITEM_DETAILS } from "features/game/types/images";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { setImageWidth } from "lib/images";

interface Props {
  ready: BuildingProduct[];
  leftOffset: number;
}

export const ReadyProcessed: React.FC<Props> = ({ ready, leftOffset }) => {
  if (ready.length === 0) return null;

  return (
    <>
      {ready.map((item, index) => (
        <img
          key={item.readyAt}
          src={ITEM_DETAILS[item.name].image}
          className="absolute z-30 pointer-events-none img-highlight"
          onLoad={(e) => {
            const img = e.currentTarget;
            if (
              !img ||
              !img.complete ||
              !img.naturalWidth ||
              !img.naturalHeight
            ) {
              return;
            }

            const halfWidth = img.naturalWidth / 2;
            img.style.left = `${PIXEL_SCALE * halfWidth * index + leftOffset}px`;
            setImageWidth(img);
          }}
          style={{
            opacity: 0,
            bottom: `-${PIXEL_SCALE * 3.8}px`,
            zIndex: 30 + index,
          }}
        />
      ))}
    </>
  );
};
