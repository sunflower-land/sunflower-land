import React from "react";
import { BuildingProduct } from "features/game/types/game";
import { ITEM_DETAILS } from "features/game/types/images";
import classNames from "classnames";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { setImageWidth } from "lib/images";

interface Props {
  readyRecipes: BuildingProduct[];
  leftOffset: number;
}

export const ReadyRecipes: React.FC<Props> = ({ readyRecipes, leftOffset }) => {
  if (readyRecipes.length === 0) return null;

  return (
    <>
      {readyRecipes.map((recipe, index) => (
        <img
          key={recipe.readyAt}
          src={ITEM_DETAILS[recipe.name].image}
          className={classNames("absolute z-30 pointer-events-none")}
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
