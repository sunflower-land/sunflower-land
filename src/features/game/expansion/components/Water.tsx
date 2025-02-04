import React from "react";

import {
  GRID_WIDTH_PX,
  INITIAL_STOCK,
  PIXEL_SCALE,
  StockableName,
} from "features/game/lib/constants";

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

import { CONFIG } from "lib/config";
import { LaTomatina } from "./LaTomatina";
import { Richie } from "./Richie";
import { RestockBoat } from "./RestockBoat";
import { SHIPMENT_STOCK } from "features/game/events/landExpansion/shipmentRestocked";
import { SEEDS } from "features/game/types/seeds";
import { WORKBENCH_TOOLS, TREASURE_TOOLS } from "features/game/types/tools";
import Decimal from "decimal.js-light";

interface Props {
  expansionCount: number;
  gameState: GameState;
}

export const WaterComponent: React.FC<Props> = ({
  expansionCount,
  gameState,
}) => {
  // As the land gets bigger, push the water decorations out
  const offset = Math.ceil((Math.sqrt(expansionCount) * LAND_WIDTH) / 2);

  const getShipmentAmount = (item: StockableName, amount: number): Decimal => {
    const totalStock = INITIAL_STOCK(gameState)[item];
    const remainingStock = gameState.stock[item] ?? new Decimal(0);
    // If shipment amount will exceed total stock
    if (remainingStock.add(amount).gt(totalStock)) {
      // return the difference between total and remaining stock
      return totalStock.sub(remainingStock);
    } else {
      // else return shipment stock
      return new Decimal(amount);
    }
  };

  const restockTools = Object.entries(SHIPMENT_STOCK)
    .filter((item) => item[0] in { ...WORKBENCH_TOOLS, ...TREASURE_TOOLS })
    .filter(([item, amount]) => {
      const shipmentAmount = getShipmentAmount(item as StockableName, amount);
      return shipmentAmount.gt(0);
    });

  const restockSeeds = Object.entries(SHIPMENT_STOCK)
    .filter((item) => item[0] in SEEDS)
    .filter(([item, amount]) => {
      const shipmentAmount = getShipmentAmount(item as StockableName, amount);
      return shipmentAmount.gt(0);
    });

  const restockIsEmpty = [...restockSeeds, ...restockTools].length <= 0;

  return (
    // Container
    <div
      style={{
        height: "inherit",
      }}
    >
      {/* Decorations */}

      {CONFIG.NETWORK === "mainnet" && <DiscordBoat />}

      {/* Goblin swimming */}
      <MapPlacement x={-6 - offset} y={-1} width={6}>
        <img
          src={SUNNYSIDE.npcs.goblin_swimming}
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
          src={SUNNYSIDE.decorations.cossies}
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
          src={SUNNYSIDE.land.mushroomIsland}
          className="absolute"
          style={{
            width: `${PIXEL_SCALE * 54}px`,
            left: `${PIXEL_SCALE * -3}px`,
            top: 0,
          }}
        />
      </MapPlacement>

      <SeasonTeaser offset={offset} />

      <TravelTeaser />

      <IslandUpgrader gameState={gameState} offset={offset} />

      <Richie />

      {!restockIsEmpty && (
        <RestockBoat
          restockSeeds={restockSeeds}
          restockTools={restockTools}
          getShipmentAmount={getShipmentAmount}
        />
      )}

      <MapPlacement x={-5 - offset} y={2} width={4}>
        <LaTomatina event={gameState.specialEvents.current["La Tomatina"]} />
      </MapPlacement>
    </div>
  );
};

export const Water = React.memo(WaterComponent);
