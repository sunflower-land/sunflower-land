import React, { useContext } from "react";

import { GRID_WIDTH_PX, PIXEL_SCALE } from "features/game/lib/constants";

import goblinSwimming from "assets/npcs/goblin_swimming.gif";
import cossies from "assets/decorations/cossies.png";
import mushroomIsland from "assets/land/mushroom_island.png";

import { MapPlacement } from "./MapPlacement";
import { Snorkler } from "./water/Snorkler";
import { SharkBumpkin } from "./water/SharkBumpkin";

import { SUNNYSIDE } from "assets/sunnyside";
import { SeasonTeaser } from "./SeasonTeaser";
import { LAND_WIDTH } from "../Land";
import { TravelTeaser } from "./TravelTeaser";
import { DiscordBoat } from "./DiscordBoat";
import { IslandUpgrader } from "./IslandUpgrader";
import { GameState } from "features/game/types/game";
import { Context } from "features/game/GameProvider";

interface Props {
  townCenterBuilt: boolean;
  expansionCount: number;
  gameState: GameState;
}

export const WaterComponent: React.FC<Props> = ({
  townCenterBuilt,
  expansionCount,
  gameState,
}) => {
  const { showAnimations } = useContext(Context);

  // As the land gets bigger, push the water decorations out
  const offset = Math.ceil((Math.sqrt(expansionCount) * LAND_WIDTH) / 2);

  return (
    // Container
    <div
      style={{
        height: "inherit",
      }}
    >
      {/* Decorations */}

      <DiscordBoat />

      {/* Goblin swimming */}
      <MapPlacement x={-6 - offset} y={-1} width={6}>
        <img
          src={goblinSwimming}
          style={{
            width: `${PIXEL_SCALE * 96}px`,
          }}
        />
      </MapPlacement>

      {/* Snorkler */}
      <Snorkler x={-2} y={offset + 12} />

      {/* Shark bumpkin */}
      <SharkBumpkin x={-8} y={offset + 10} />

      {/* Swimmer with cossies */}
      <MapPlacement x={offset + 7} y={6} width={1}>
        <img
          src={SUNNYSIDE.npcs.swimmer}
          className="absolute pointer-events-none"
          style={{
            width: `${1 * GRID_WIDTH_PX}px`,
            transform: "scaleX(-1)",
            zIndex: 2,
          }}
        />
        <img
          src={cossies}
          className="absolute pointer-events-none"
          style={{
            width: `${GRID_WIDTH_PX}px`,
            transform: "scaleX(-1)",
            left: `${16 * PIXEL_SCALE}px`,
            zIndex: 2,
          }}
        />
      </MapPlacement>

      <MapPlacement x={-20} y={6} width={4}>
        <img
          src={mushroomIsland}
          className="absolute"
          style={{
            width: `${PIXEL_SCALE * 54}px`,
            left: `${PIXEL_SCALE * -3}px`,
            top: 0,
          }}
        />
      </MapPlacement>

      {/* Bottom island */}
      <SeasonTeaser offset={offset} />

      <TravelTeaser />

      <IslandUpgrader gameState={gameState} offset={offset} />
    </div>
  );
};

export const Water = React.memo(WaterComponent);
