import React, { useContext, useLayoutEffect, useMemo } from "react";

import tent from "assets/land/tent_inside.png";
import { GRID_WIDTH_PX } from "features/game/lib/constants";
import { Hud } from "features/island/hud/Hud";
import { Context } from "features/game/GameProvider";
import { useSelector } from "@xstate/react";
import { MachineState } from "features/game/lib/gameMachine";
import {
  COLLECTIBLES_DIMENSIONS,
  getKeys,
} from "features/game/types/craftables";
import { MapPlacement } from "features/game/expansion/components/MapPlacement";
import { Collectible } from "features/island/collectibles/Collectible";
import { getGameGrid } from "features/game/expansion/placeable/lib/makeGrid";
import classNames from "classnames";
import { Section, useScrollIntoView } from "lib/utils/hooks/useScrollIntoView";
import { Placeable } from "features/game/expansion/placeable/Placeable";
import { LandscapingHud } from "features/island/hud/LandscapingHud";

const selectGameState = (state: MachineState) => state.context.state;
const isLandscaping = (state: MachineState) => state.matches("landscaping");

export const Home: React.FC = () => {
  const { gameService, showTimers } = useContext(Context);

  // memorize game grid and only update it when the stringified value changes

  const state = useSelector(gameService, selectGameState);
  const landscaping = useSelector(gameService, isLandscaping);

  const { home } = state;

  const [scrollIntoView] = useScrollIntoView();

  useLayoutEffect(() => {
    scrollIntoView(Section.GenesisBlock, "auto");
  }, []);

  const collectibles = home.collectibles;

  const gameGridValue = getGameGrid({
    crops: {},
    collectibles: home.collectibles,
  });
  const gameGrid = useMemo(() => {
    return gameGridValue;
  }, [JSON.stringify(gameGridValue)]);

  const mapPlacements: Array<JSX.Element> = [];

  // TODO OFFset?
  const gameboardDimensions = {
    x: 84,
    y: 56,
  };

  mapPlacements.push(
    ...getKeys(collectibles)
      .filter((name) => collectibles[name])
      .flatMap((name, nameIndex) => {
        const items = collectibles[name]!;
        return items.map((collectible, itemIndex) => {
          const { readyAt, createdAt, coordinates, id } = collectible;
          const { x, y } = coordinates;
          const { width, height } = COLLECTIBLES_DIMENSIONS[name];

          return (
            <MapPlacement
              key={`collectible-${nameIndex}-${itemIndex}`}
              x={x}
              y={y}
              height={height}
              width={width}
            >
              <Collectible
                name={name}
                id={id}
                readyAt={readyAt}
                createdAt={createdAt}
                showTimers={showTimers}
                x={coordinates.x}
                y={coordinates.y}
                grid={gameGrid}
              />
            </MapPlacement>
          );
        });
      })
  );

  return (
    <>
      <>
        <div
          className="absolute bg-[#181425]"
          style={{
            // dynamic gameboard
            width: `${gameboardDimensions.x * GRID_WIDTH_PX}px`,
            height: `${gameboardDimensions.y * GRID_WIDTH_PX}px`,
            imageRendering: "pixelated",
          }}
        >
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className={classNames("relative w-full h-full", {})}>
              <div
                className={classNames(
                  `w-full h-full top-0 absolute transition-opacity pointer-events-none`,
                  {
                    "opacity-0": !landscaping,
                    "opacity-100": landscaping,
                  }
                )}
                style={{
                  backgroundSize: `${GRID_WIDTH_PX}px ${GRID_WIDTH_PX}px`,
                  backgroundImage: `
            linear-gradient(to right, rgb(255 255 255 / 17%) 1px, transparent 1px),
            linear-gradient(to bottom, rgb(255 255 255 / 17%) 1px, transparent 1px)`,
                }}
              />

              {landscaping && <Placeable />}

              <img
                src={tent}
                id={Section.GenesisBlock}
                style={{
                  width: `${12 * GRID_WIDTH_PX}px`,
                  height: `${12 * GRID_WIDTH_PX}px`,
                }}
              />

              {/* Sort island elements by y axis */}
              {mapPlacements.sort((a, b) => b.props.y - a.props.y)}
            </div>
          </div>
        </div>

        {!landscaping && <Hud isFarming />}
        {landscaping && <LandscapingHud isFarming />}
      </>
    </>
  );
};
