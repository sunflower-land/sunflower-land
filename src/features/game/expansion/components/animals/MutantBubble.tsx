import { SUNNYSIDE } from "assets/sunnyside";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { AnimalType } from "features/game/types/animals";
import { MutantAnimal } from "features/game/types/game";
import { ITEM_DETAILS } from "features/game/types/images";
import React from "react";

export const MutantBubble: React.FC<{
  mutantName: MutantAnimal;
  animalType?: AnimalType;
}> = ({ mutantName, animalType }) => {
  return (
    <div
      className="absolute inline-flex justify-center items-center z-10 pointer-events-none"
      style={{
        top: `${PIXEL_SCALE * (animalType === "Chicken" ? 15 : 18)}px`,
        right: `${PIXEL_SCALE * (animalType === "Chicken" ? 2 : 0)}px`,
        borderImage: `url(${SUNNYSIDE.ui.speechBorder})`,
        borderStyle: "solid",
        borderTopWidth: `${PIXEL_SCALE * 2}px`,
        borderRightWidth: `${PIXEL_SCALE * 2}px`,
        borderBottomWidth: `${PIXEL_SCALE * 4}px`,
        borderLeftWidth: `${PIXEL_SCALE * 5}px`,
        borderImageSlice: "2 2 4 5 fill",
        imageRendering: "pixelated",
        borderImageRepeat: "stretch",
      }}
    >
      <div
        className="flex items-center justify-center"
        style={{
          marginLeft: `-${PIXEL_SCALE * 3}px`,
          width: `${PIXEL_SCALE * 6}px`,
        }}
      >
        <img src={ITEM_DETAILS[mutantName]?.image} className="h-4" />
      </div>
    </div>
  );
};
