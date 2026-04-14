import React, { useContext } from "react";

import { GRID_WIDTH_PX, PIXEL_SCALE } from "features/game/lib/constants";

import { MapPlacement } from "./MapPlacement";
import { Snorkler } from "./water/Snorkler";
import { SharkBumpkin } from "./water/SharkBumpkin";

import { SUNNYSIDE } from "assets/sunnyside";
import { LAND_WIDTH } from "../Land";
import { TravelTeaser } from "./TravelTeaser";
import { DiscordBoat } from "./DiscordBoat";
import { IslandUpgrader } from "./IslandUpgrader";

import { CONFIG } from "lib/config";
import { LaTomatina } from "./LaTomatina";
import { RestockBoat } from "./RestockBoat";

import fins1 from "assets/decorations/fins_yellow.webp";
import fins2 from "assets/decorations/fins_green.webp";
import fins3 from "assets/decorations/fins2.webp";
import { getActiveCalendarEvent } from "features/game/types/calendar";
import { useVisiting } from "lib/utils/visitUtils";
import { MachineState } from "features/game/lib/gameMachine";
import { Context } from "features/game/GameProvider";
import { useSelector } from "@xstate/react";

interface Props {
  expansionCount: number;
}

const _calendar = (state: MachineState) => state.context.state.calendar;
const _season = (state: MachineState) => state.context.state.season.season;
const _laTomatina = (state: MachineState) =>
  state.context.state.specialEvents.current["La Tomatina"];

export const WaterComponent: React.FC<Props> = ({ expansionCount }) => {
  const { gameService } = useContext(Context);
  // As the land gets bigger, push the water decorations out
  const offset = Math.ceil((Math.sqrt(expansionCount) * LAND_WIDTH) / 2);

  const calendar = useSelector(gameService, _calendar);
  const season = useSelector(gameService, _season);
  const laTomatina = useSelector(gameService, _laTomatina);

  const weather = getActiveCalendarEvent({ calendar });
  const { isVisiting } = useVisiting();

  return (
    // Container
    <div
      style={{
        height: "inherit",
      }}
    >
      {/* Decorations */}

      {season !== "winter" && (
        <>
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

          {/* Marine Marvels when Full Moon */}
          {weather === "fullMoon" && (
            <>
              <MapPlacement x={-7 - offset} y={9} width={2}>
                <img
                  src={fins1}
                  className="absolute z-0 fish-swimming2"
                  style={{
                    width: `${PIXEL_SCALE * 17}px`,
                    left: `${PIXEL_SCALE * -3}px`,
                    top: 0,
                  }}
                />
              </MapPlacement>
              <MapPlacement x={offset + 7} y={2} width={2}>
                <img
                  src={fins2}
                  className="absolute z-0 fish-swimming3"
                  style={{
                    width: `${PIXEL_SCALE * 17}px`,
                    left: `${PIXEL_SCALE * -3}px`,
                    top: 0,
                  }}
                />
              </MapPlacement>
              <MapPlacement x={-6 - offset} y={-9} width={1}>
                <img
                  src={fins3}
                  className="absolute z-0 fish-swimming2"
                  style={{
                    width: `${PIXEL_SCALE * 9}px`,
                    left: `${PIXEL_SCALE * -3}px`,
                    top: 0,
                  }}
                />
              </MapPlacement>
            </>
          )}
        </>
      )}

      {/* Frozen Swimmer with cossies */}
      {season === "winter" ? (
        <MapPlacement x={offset + 7} y={6} width={4}>
          <img
            src={SUNNYSIDE.npcs.frozen_swimmer}
            className="absolute pointer-events-none"
            style={{
              width: `${PIXEL_SCALE * 43}px`,
              transform: "scaleX(-1)",
              zIndex: 2,
            }}
          />
          <img
            src={SUNNYSIDE.decorations.frozen_cossies}
            className="absolute pointer-events-none"
            style={{
              width: `${PIXEL_SCALE * 28}px`,
              transform: "scaleX(-1)",
              top: `${33 * PIXEL_SCALE}px`,
              left: `${9 * PIXEL_SCALE}px`,
              zIndex: 2,
            }}
          />
        </MapPlacement>
      ) : season === "summer" ? (
        <>
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
          <MapPlacement x={-8 - offset} y={-5} width={1}>
            <img
              src={SUNNYSIDE.npcs.swimmer2}
              className="absolute pointer-events-none"
              style={{
                width: `${1 * GRID_WIDTH_PX}px`,
                zIndex: 2,
              }}
            />
            <img
              src={SUNNYSIDE.decorations.cossies2}
              className="absolute pointer-events-none"
              style={{
                width: `${GRID_WIDTH_PX}px`,
                left: `${-18 * PIXEL_SCALE}px`,
                zIndex: 2,
              }}
            />
          </MapPlacement>
          <MapPlacement x={-6 - offset} y={offset - 21} width={1}>
            <img
              src={SUNNYSIDE.npcs.swimmer3}
              className="absolute pointer-events-none z-0"
              style={{
                width: `${1 * GRID_WIDTH_PX}px`,
                zIndex: 2,
              }}
            />
            <img
              src={SUNNYSIDE.decorations.cossies3}
              className="absolute pointer-events-none"
              style={{
                width: `${GRID_WIDTH_PX}px`,
                left: `${12 * PIXEL_SCALE}px`,
                top: `${16 * PIXEL_SCALE}px`,
                transform: "scaleX(-1)",
                zIndex: 2,
              }}
            />
          </MapPlacement>
          <MapPlacement x={-7 - offset} y={-1} width={1}>
            <img
              src={SUNNYSIDE.npcs.swimmer4}
              className="absolute pointer-events-none"
              style={{
                width: `${1 * GRID_WIDTH_PX}px`,
                zIndex: 2,
              }}
            />
            <img
              src={SUNNYSIDE.decorations.cossies4}
              className="absolute pointer-events-none"
              style={{
                width: `${GRID_WIDTH_PX}px`,
                left: `${25 * PIXEL_SCALE}px`,
                top: `${18 * PIXEL_SCALE}px`,
                transform: "scaleX(-1)",
                zIndex: 2,
              }}
            />
          </MapPlacement>
        </>
      ) : (
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
      )}

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

      {!isVisiting && (
        <>
          {CONFIG.NETWORK === "mainnet" && <DiscordBoat />}
          <TravelTeaser />
          <IslandUpgrader offset={offset} />
          <RestockBoat />
          <MapPlacement x={-5 - offset} y={2} width={4}>
            <LaTomatina event={laTomatina} />
          </MapPlacement>
        </>
      )}
    </div>
  );
};

export const Water = React.memo(WaterComponent);
