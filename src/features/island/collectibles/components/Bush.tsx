import React from "react";

import { SUNNYSIDE } from "assets/sunnyside";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { IslandType } from "features/game/types/game";
import { CollectibleProps } from "../Collectible";

import volcanoBush from "assets/decorations/bush/summer_volcano_bush.webp";

const BUSH_IMAGE: Record<IslandType, string> = {
  basic: SUNNYSIDE.decorations.bush,
  spring: SUNNYSIDE.decorations.springBush,
  desert: SUNNYSIDE.decorations.bush,
  volcano: volcanoBush,
};

export const Bush: React.FC<CollectibleProps> = ({ game }) => {
  return (
    <>
      <img
        src={BUSH_IMAGE[game?.island.type ?? "basic"]}
        style={{
          width: `${PIXEL_SCALE * 24}px`,
          bottom: `${PIXEL_SCALE * 0}px`,
          left: `${PIXEL_SCALE * 4}px`,
        }}
        className="absolute"
        alt="Bush"
      />
    </>
  );
};
