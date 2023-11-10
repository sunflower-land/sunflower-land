import React, { useContext, useLayoutEffect, useMemo } from "react";
import { useSelector } from "@xstate/react";
import classNames from "classnames";

import { Section, useScrollIntoView } from "lib/utils/hooks/useScrollIntoView";
import { Coordinates, MapPlacement } from "./components/MapPlacement";
import { Context } from "../GameProvider";
import {
  ANIMAL_DIMENSIONS,
  CollectibleName,
  COLLECTIBLES_DIMENSIONS,
  getKeys,
} from "../types/craftables";
import { LandBase } from "./components/LandBase";
import { UpcomingExpansion } from "./components/UpcomingExpansion";
import { GameState, ExpansionConstruction, PlacedItem } from "../types/game";
import { BuildingName, BUILDINGS_DIMENSIONS } from "../types/buildings";
import { Building } from "features/island/buildings/components/building/Building";
import { Collectible } from "features/island/collectibles/Collectible";
import { Water } from "./components/Water";
import { DirtRenderer } from "./components/DirtRenderer";
import { Chicken } from "../types/game";
import { Chicken as ChickenElement } from "features/island/chickens/Chicken";
import { Hud } from "features/island/hud/Hud";
import { Resource } from "features/island/resources/Resource";
import { Placeable } from "./placeable/Placeable";
import { MachineState } from "../lib/gameMachine";
import { GameGrid, getGameGrid } from "./placeable/lib/makeGrid";
import { LandscapingHud } from "features/island/hud/LandscapingHud";
import { Mushroom } from "features/island/mushrooms/Mushroom";
import { useFirstRender } from "lib/utils/hooks/useFirstRender";
import { MUSHROOM_DIMENSIONS } from "../types/resources";
import { GRID_WIDTH_PX, PIXEL_SCALE } from "../lib/constants";
import ocean from "assets/decorations/ocean.webp";
import { Bud } from "features/island/buds/Bud";
import { hasFeatureAccess } from "lib/flags";
import { Fisherman } from "features/island/fisherman/Fisherman";
import { VisitingHud } from "features/island/hud/VisitingHud";

export const LAND_WIDTH = 6;

const getIslandElements = ({
  buildings,
  collectibles,
  chickens,
  trees,
  stones,
  iron,
  gold,
  fruitPatches,
  crops,
  showTimers,
  grid,
  mushrooms,
  isFirstRender,
  buds,
}: {
  expansionConstruction?: ExpansionConstruction;
  buildings: Partial<Record<BuildingName, PlacedItem[]>>;
  collectibles: Partial<Record<CollectibleName, PlacedItem[]>>;
  chickens: Partial<Record<string, Chicken>>;
  trees: GameState["trees"];
  stones: GameState["stones"];
  iron: GameState["iron"];
  gold: GameState["gold"];
  crops: GameState["crops"];
  fruitPatches: GameState["fruitPatches"];
  showTimers: boolean;
  grid: GameGrid;
  mushrooms: GameState["mushrooms"]["mushrooms"];
  isFirstRender: boolean;
  buds: GameState["buds"];
}) => {
  const mapPlacements: Array<JSX.Element> = [];

  mapPlacements.push(
    ...getKeys(buildings)
      .filter((name) => buildings[name])
      .flatMap((name, nameIndex) => {
        const items = buildings[name]!;
        return items.map((building, itemIndex) => {
          const { x, y } = building.coordinates;
          const { width, height } = BUILDINGS_DIMENSIONS[name];

          return (
            <MapPlacement
              key={`building-${nameIndex}-${itemIndex}`}
              x={x}
              y={y}
              height={height}
              width={width}
            >
              <Building
                name={name}
                id={building.id}
                readyAt={building.readyAt}
                createdAt={building.createdAt}
                craftingItemName={building.crafting?.name}
                craftingReadyAt={building.crafting?.readyAt}
                showTimers={showTimers}
                x={x}
                y={y}
              />
            </MapPlacement>
          );
        });
      })
  );

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
                grid={grid}
              />
            </MapPlacement>
          );
        });
      })
  );

  mapPlacements.push(
    ...getKeys(chickens)
      // Only show placed chickens (V1 may have ones without coords)
      .filter((id) => chickens[id]?.coordinates)
      .flatMap((id) => {
        const chicken = chickens[id]!;
        const { x, y } = chicken.coordinates as Coordinates;
        const { width, height } = ANIMAL_DIMENSIONS.Chicken;

        return (
          <MapPlacement
            key={`chicken-${id}`}
            x={x}
            y={y}
            height={height}
            width={width}
          >
            <ChickenElement key={`chicken-${id}`} id={id} x={x} y={y} />
          </MapPlacement>
        );
      })
  );

  mapPlacements.push(
    ...getKeys(trees).map((id) => {
      const { x, y, width, height } = trees[id];

      return (
        <MapPlacement
          key={`trees-${id}`}
          x={x}
          y={y}
          height={height}
          width={width}
        >
          <Resource
            key={`tree-${id}`}
            name="Tree"
            createdAt={0}
            readyAt={0}
            id={id}
            x={x}
            y={y}
          />
        </MapPlacement>
      );
    })
  );

  mapPlacements.push(
    ...getKeys(stones).map((id) => {
      const { x, y, width, height } = stones[id];

      return (
        <MapPlacement
          key={`stones-${id}`}
          x={x}
          y={y}
          height={height}
          width={width}
        >
          <Resource
            key={`stone-${id}`}
            name="Stone Rock"
            createdAt={0}
            readyAt={0}
            id={id}
            x={x}
            y={y}
          />
        </MapPlacement>
      );
    })
  );

  mapPlacements.push(
    ...getKeys(iron).map((id) => {
      const { x, y, width, height } = iron[id];

      return (
        <MapPlacement
          key={`iron-${id}`}
          x={x}
          y={y}
          height={height}
          width={width}
        >
          <Resource
            key={`iron-${id}`}
            name="Iron Rock"
            createdAt={0}
            readyAt={0}
            id={id}
            x={x}
            y={y}
          />
        </MapPlacement>
      );
    })
  );

  mapPlacements.push(
    ...getKeys(gold).map((id) => {
      const { x, y, width, height } = gold[id];

      return (
        <MapPlacement
          key={`gold-${id}`}
          x={x}
          y={y}
          height={height}
          width={width}
        >
          <Resource
            key={`gold-${id}`}
            name="Gold Rock"
            createdAt={0}
            readyAt={0}
            id={id}
            x={x}
            y={y}
          />
        </MapPlacement>
      );
    })
  );

  mapPlacements.push(
    ...getKeys(fruitPatches).map((id) => {
      const { x, y, width, height } = fruitPatches[id];

      return (
        <MapPlacement
          key={`fruitPatches-${id}`}
          x={x}
          y={y}
          height={height}
          width={width}
        >
          <Resource
            name="Fruit Patch"
            createdAt={0}
            readyAt={0}
            id={id}
            x={x}
            y={y}
          />
        </MapPlacement>
      );
    })
  );

  mapPlacements.push(
    ...getKeys(crops).map((id) => {
      const { x, y, width, height } = crops[id];

      return (
        <MapPlacement
          key={`crops-${id}`}
          x={x}
          y={y}
          height={height}
          width={width}
        >
          <Resource
            name="Crop Plot"
            createdAt={0}
            readyAt={0}
            id={id}
            x={x}
            y={y}
          />
        </MapPlacement>
      );
    })
  );

  {
    mushrooms &&
      mapPlacements.push(
        ...getKeys(mushrooms).flatMap((id) => {
          const { x, y } = mushrooms[id]!;

          return (
            <MapPlacement
              key={`mushroom-${id}`}
              x={x}
              y={y}
              height={MUSHROOM_DIMENSIONS.height}
              width={MUSHROOM_DIMENSIONS.width}
            >
              <Mushroom
                key={`mushroom-${id}`}
                id={id}
                isFirstRender={isFirstRender}
              />
            </MapPlacement>
          );
        })
      );
  }

  {
    buds &&
      mapPlacements.push(
        ...getKeys(buds)
          .filter((budId) => !!buds[budId].coordinates)
          .flatMap((id) => {
            const { x, y } = buds[id]!.coordinates!;

            return (
              <MapPlacement key={`bud-${id}`} x={x} y={y} height={1} width={1}>
                <Bud id={String(id)} x={x} y={y} />
              </MapPlacement>
            );
          })
      );
  }

  return mapPlacements;
};

const selectGameState = (state: MachineState) => state.context.state;
const isAutosaving = (state: MachineState) => state.matches("autosaving");
const isLandscaping = (state: MachineState) => state.matches("landscaping");
const isVisiting = (state: MachineState) => state.matches("visiting");

export const Land: React.FC = () => {
  const { gameService, showTimers } = useContext(Context);

  const state = useSelector(gameService, selectGameState);
  const {
    expansionConstruction,
    buildings,
    collectibles,
    chickens,
    inventory,
    bumpkin,
    trees,
    stones,
    iron,
    gold,
    crops,
    fruitPatches,
    mushrooms,
    buds,
  } = state;
  const autosaving = useSelector(gameService, isAutosaving);
  const landscaping = useSelector(gameService, isLandscaping);
  const visiting = useSelector(gameService, isVisiting);

  const expansionCount = inventory["Basic Land"]?.toNumber() ?? 3;

  // As the land gets bigger, expand the gameboard
  // The distance between the edge of the gameboard and the edge of island should remain roughly the same for higher expansions
  const gameboardSizeOffset =
    Math.ceil((Math.sqrt(expansionCount) * LAND_WIDTH) / 2) * 2; // make sure this is even
  const gameboardDimensions = {
    x: 84 + gameboardSizeOffset,
    y: 56 + gameboardSizeOffset,
  };

  const [scrollIntoView] = useScrollIntoView();

  useLayoutEffect(() => {
    scrollIntoView(Section.GenesisBlock, "auto");
  }, []);

  const isFirstRender = useFirstRender();

  const boatCoordinates = () => {
    if (expansionCount < 7) {
      return { x: -2, y: -4.5 };
    }
    if (expansionCount >= 7 && expansionCount < 21) {
      return { x: -9, y: -10.5 };
    } else {
      return { x: -16, y: -16.5 };
    }
  };

  // memorize game grid and only update it when the stringified value changes
  const gameGridValue = getGameGrid({ crops, collectibles });
  const gameGrid = useMemo(() => {
    return gameGridValue;
  }, [JSON.stringify(gameGridValue)]);

  return (
    <>
      <div
        className="absolute"
        style={{
          // dynamic gameboard
          width: `${gameboardDimensions.x * GRID_WIDTH_PX}px`,
          height: `${gameboardDimensions.y * GRID_WIDTH_PX}px`,
          backgroundImage: `url(${ocean})`,
          backgroundSize: `${64 * PIXEL_SCALE}px`,
          imageRendering: "pixelated",
        }}
      >
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <div
            className={classNames("relative w-full h-full", {
              "pointer-events-none": visiting,
            })}
          >
            <LandBase expandedCount={expansionCount} />
            <DirtRenderer grid={gameGrid} />

            {!landscaping && (
              <Water
                expansionCount={expansionCount}
                townCenterBuilt={(buildings["Town Center"]?.length ?? 0) >= 1}
              />
            )}
            {!landscaping && <UpcomingExpansion />}

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

            {/* Sort island elements by y axis */}
            {getIslandElements({
              expansionConstruction,
              buildings,
              collectibles,
              chickens,
              trees,
              stones,
              iron,
              gold,
              fruitPatches,
              crops,
              showTimers: showTimers,
              grid: gameGrid,
              mushrooms: mushrooms?.mushrooms,
              isFirstRender,
              buds,
            }).sort((a, b) => b.props.y - a.props.y)}
          </div>

          {landscaping && <Placeable />}
        </div>

        {!landscaping && hasFeatureAccess(state, "FISHING") && <Fisherman />}

        {/* Background darkens in landscaping */}
        <div
          className={classNames(
            "absolute w-full h-full bg-black -z-10  transition-opacity pointer-events-none",
            {
              "opacity-0": !landscaping,
              "opacity-50": landscaping,
            }
          )}
        />
      </div>

      {landscaping && <LandscapingHud isFarming />}

      {!landscaping && visiting && (
        <div className="absolute z-20">
          <VisitingHud />
        </div>
      )}

      {!landscaping && !visiting && <Hud isFarming={true} />}
    </>
  );
};
