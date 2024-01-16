import React from "react";

import { GRID_WIDTH_PX, PIXEL_SCALE } from "features/game/lib/constants";

import dragonfly from "assets/decorations/dragonfly.gif";

import goblinSwimming from "assets/npcs/goblin_swimming.gif";
import cossies from "assets/decorations/cossies.png";
import bearIsland from "assets/land/bear_island.webp";
import abandonedLand from "assets/land/abandoned_land.webp";

import { MapPlacement } from "./MapPlacement";
import { Snorkler } from "./water/Snorkler";
import { SharkBumpkin } from "./water/SharkBumpkin";
import { Arcade } from "features/community/arcade/Arcade";

import { SUNNYSIDE } from "assets/sunnyside";
import { DailyReward } from "./dailyReward/DailyReward";
import { SeasonTeaser } from "./SeasonTeaser";
import { LAND_WIDTH } from "../Land";
import { TravelTeaser } from "./TravelTeaser";
import { DiscordBoat } from "./DiscordBoat";
import { IslandUpgrader } from "./IslandUpgrader";
import { GameState } from "features/game/types/game";

interface Props {
  townCenterBuilt: boolean;
  expansionCount: number;
}

export const WaterComponent: React.FC<Props> = ({
  townCenterBuilt,
  expansionCount,
}) => {
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

      {/* Dragonfly */}
      <MapPlacement x={-4 - offset} y={3} width={1}>
        <img
          style={{
            width: `${PIXEL_SCALE * 13}px`,
            left: `${PIXEL_SCALE * 1}px`,
            bottom: `${PIXEL_SCALE * 4}px`,
          }}
          src={dragonfly}
          className="animate-float"
        />
      </MapPlacement>

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

      {/* Islands */}

      {/* Top right island */}
      <MapPlacement x={7 + offset} y={15 + offset} width={6}>
        <img
          src={bearIsland}
          style={{
            width: `${PIXEL_SCALE * 86}px`,
          }}
        />
        <div
          className="absolute"
          style={{
            top: `${GRID_WIDTH_PX * 2 - PIXEL_SCALE * 1}px`,
            left: `${GRID_WIDTH_PX * 3}px`,
          }}
        >
          <Arcade />
        </div>
      </MapPlacement>

      {/* Bottom island */}
      <SeasonTeaser offset={offset} />

      <TravelTeaser />

      <IslandUpgrader />

      {/* Bottom right island */}
      <MapPlacement x={7 + offset} y={-2 - offset} width={6}>
        {!townCenterBuilt && <DailyReward />}
        <img
          src={abandonedLand}
          style={{
            width: `${PIXEL_SCALE * 46}px`,
          }}
        />
      </MapPlacement>
    </div>
  );
};

export const Water = React.memo(WaterComponent);
