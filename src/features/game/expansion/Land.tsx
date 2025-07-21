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
import { BuildingName, BUILDINGS_DIMENSIONS, Home } from "../types/buildings";
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
import { MUSHROOM_DIMENSIONS, RESOURCE_DIMENSIONS } from "../types/resources";
import { GRID_WIDTH_PX, PIXEL_SCALE } from "../lib/constants";
import { Bud } from "features/island/buds/Bud";
import { Fisherman } from "features/island/fisherman/Fisherman";
import { VisitingHud } from "features/island/hud/VisitingHud";
import { Airdrop } from "./components/Airdrop";
import { DynamicClouds } from "./components/DynamicClouds";
import { StaticClouds } from "./components/StaticClouds";
import { BackgroundIslands } from "./components/BackgroundIslands";
import { SUNNYSIDE } from "assets/sunnyside";
import { Outlet, useLocation } from "react-router";
import { createPortal } from "react-dom";
import { NON_COLLIDING_OBJECTS } from "./placeable/lib/collisionDetection";
import { getZIndex } from "./placeable/lib/collisionDetection";

import {
  isBuildingUpgradable,
  makeUpgradableBuildingKey,
  UpgradableBuildingType,
} from "../events/landExpansion/upgradeBuilding";
import { getCurrentBiome } from "features/island/biomes/biomes";
import { useVisiting } from "lib/utils/visitUtils";
import { getObjectEntries } from "./lib/utils";
import { Clutter } from "features/island/clutter/Clutter";

export const LAND_WIDTH = 6;

type IslandElementArgs = {
  game: GameState;
  expansionConstruction?: ExpansionConstruction;
  buildings: Partial<Record<BuildingName, PlacedItem[]>>;
  collectibles: Partial<Record<CollectibleName, PlacedItem[]>>;
  chickens: Partial<Record<string, Chicken>>;
  trees: GameState["trees"];
  stones: GameState["stones"];
  iron: GameState["iron"];
  gold: GameState["gold"];
  crimstones: GameState["crimstones"];
  sunstones: GameState["sunstones"];
  crops: GameState["crops"];
  fruitPatches: GameState["fruitPatches"];
  flowerBeds: GameState["flowers"]["flowerBeds"];
  airdrops: GameState["airdrops"];
  showTimers: boolean;
  grid: GameGrid;
  mushrooms: GameState["mushrooms"]["mushrooms"];
  isFirstRender: boolean;
  buds: GameState["buds"];
  beehives: GameState["beehives"];
  oilReserves: GameState["oilReserves"];
  lavaPits: GameState["lavaPits"];
  clutter: GameState["socialFarming"]["clutter"];
  isVisiting: boolean;
};

const getIslandElements = ({
  game,
  buildings,
  collectibles,
  chickens,
  trees,
  stones,
  iron,
  gold,
  crimstones,
  sunstones,
  fruitPatches,
  flowerBeds,
  crops,
  showTimers,
  grid,
  mushrooms,
  isFirstRender,
  buds,
  airdrops,
  beehives,
  oilReserves,
  lavaPits,
  isVisiting,
  clutter,
}: IslandElementArgs) => {
  const mapPlacements: Array<JSX.Element> = [];

  const home = new Set<Home | "Town Center">([
    "Town Center",
    "Tent",
    "House",
    "Manor",
    "Mansion",
  ]);
  mapPlacements.push(
    ...getKeys(buildings)
      .filter((name) => buildings[name])
      .flatMap((name, nameIndex) => {
        const items = buildings[name]!;
        return items
          .filter((building) => building.coordinates !== undefined)
          .map((building, itemIndex) => {
            const { x, y } = building.coordinates!;
            const { width, height } = BUILDINGS_DIMENSIONS[name];
            const buildingKey = makeUpgradableBuildingKey(
              name as UpgradableBuildingType,
            );

            const readyAt =
              !!isBuildingUpgradable(name) && !!game[buildingKey].upgradeReadyAt
                ? game[buildingKey].upgradeReadyAt
                : building.readyAt;

            const upgradedAt =
              !!isBuildingUpgradable(name) && !!game[buildingKey].upgradedAt
                ? game[buildingKey].upgradedAt
                : building.createdAt;

            return (
              <MapPlacement
                key={`building-${nameIndex}-${itemIndex}`}
                x={x}
                y={y}
                height={height}
                width={width}
                className={classNames({
                  "pointer-events-none": !home.has(name as Home) && isVisiting,
                })}
              >
                <Building
                  name={name}
                  id={building.id}
                  index={itemIndex}
                  readyAt={readyAt}
                  createdAt={upgradedAt}
                  showTimers={showTimers}
                  x={x}
                  y={y}
                  island={game.island}
                  season={game.season.season}
                />
              </MapPlacement>
            );
          });
      }),
  );

  mapPlacements.push(
    ...getKeys(collectibles)
      .filter((name) => collectibles[name])
      .flatMap((name, nameIndex) => {
        const items = collectibles[name]!;

        return items
          .filter((collectible) => collectible.coordinates)
          .map((collectible, itemIndex) => {
            const { readyAt, createdAt, coordinates, id } = collectible;
            const { x, y } = coordinates!;
            const { width, height } = COLLECTIBLES_DIMENSIONS[name];

            return (
              <MapPlacement
                key={`collectible-${nameIndex}-${itemIndex}`}
                x={x}
                y={y}
                z={getZIndex(y, name)}
                height={height}
                width={width}
                canCollide={NON_COLLIDING_OBJECTS.includes(name) ? false : true}
              >
                <Collectible
                  location="farm"
                  name={name}
                  id={id}
                  readyAt={readyAt}
                  createdAt={createdAt}
                  showTimers={showTimers}
                  x={coordinates!.x}
                  y={coordinates!.y}
                  grid={grid}
                  game={game}
                  z={NON_COLLIDING_OBJECTS.includes(name) ? 0 : "unset"}
                />
              </MapPlacement>
            );
          });
      }),
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
            className={classNames({ "pointer-events-none": isVisiting })}
          >
            <ChickenElement key={`chicken-${id}`} id={id} x={x} y={y} />
          </MapPlacement>
        );
      }),
  );

  mapPlacements.push(
    ...getObjectEntries(trees)
      .filter(([, tree]) => tree.x !== undefined && tree.y !== undefined)
      .map(([id, tree], index) => {
        const { x, y } = tree;

        return (
          <MapPlacement
            key={`trees-${id}`}
            x={x!}
            y={y!}
            {...RESOURCE_DIMENSIONS.Tree}
            className={classNames({ "pointer-events-none": isVisiting })}
          >
            <Resource
              key={`tree-${id}`}
              name="Tree"
              createdAt={0}
              readyAt={0}
              id={id}
              index={index}
              x={x!}
              y={y!}
            />
          </MapPlacement>
        );
      }),
  );

  mapPlacements.push(
    ...getObjectEntries(stones)
      .filter(([, stone]) => stone.x !== undefined && stone.y !== undefined)
      .map(([id, stone], index) => {
        const { x, y } = stone;

        return (
          <MapPlacement
            key={`stones-${id}`}
            x={x!}
            y={y!}
            {...RESOURCE_DIMENSIONS["Stone Rock"]}
            className={classNames({ "pointer-events-none": isVisiting })}
          >
            <Resource
              key={`stone-${id}`}
              name="Stone Rock"
              createdAt={0}
              readyAt={0}
              id={id}
              index={index}
              x={x!}
              y={y!}
            />
          </MapPlacement>
        );
      }),
  );

  mapPlacements.push(
    ...getObjectEntries(iron)
      .filter(([, iron]) => iron.x !== undefined && iron.y !== undefined)
      .map(([id, iron], index) => {
        const { x, y } = iron;

        return (
          <MapPlacement
            key={`iron-${id}`}
            x={x!}
            y={y!}
            {...RESOURCE_DIMENSIONS["Iron Rock"]}
            className={classNames({ "pointer-events-none": isVisiting })}
          >
            <Resource
              key={`iron-${id}`}
              name="Iron Rock"
              createdAt={0}
              readyAt={0}
              id={id}
              index={index}
              x={x!}
              y={y!}
            />
          </MapPlacement>
        );
      }),
  );

  mapPlacements.push(
    ...getObjectEntries(gold)
      .filter(([, gold]) => gold.x !== undefined && gold.y !== undefined)
      .map(([id, gold], index) => {
        const { x, y } = gold;

        return (
          <MapPlacement
            key={`gold-${id}`}
            x={x!}
            y={y!}
            {...RESOURCE_DIMENSIONS["Gold Rock"]}
            className={classNames({ "pointer-events-none": isVisiting })}
          >
            <Resource
              key={`gold-${id}`}
              name="Gold Rock"
              createdAt={0}
              readyAt={0}
              id={id}
              index={index}
              x={x!}
              y={y!}
            />
          </MapPlacement>
        );
      }),
  );

  mapPlacements.push(
    ...getObjectEntries(crimstones)
      .filter(
        ([, crimstone]) =>
          crimstone.x !== undefined && crimstone.y !== undefined,
      )
      .map(([id, crimstone], index) => {
        const { x, y } = crimstone;

        return (
          <MapPlacement
            key={`crimstone-${id}`}
            x={x!}
            y={y!}
            {...RESOURCE_DIMENSIONS["Crimstone Rock"]}
            className={classNames({ "pointer-events-none": isVisiting })}
          >
            <Resource
              key={`crimstone-${id}`}
              name="Crimstone Rock"
              createdAt={0}
              readyAt={0}
              id={id}
              index={index}
              x={x!}
              y={y!}
            />
          </MapPlacement>
        );
      }),
  );

  mapPlacements.push(
    ...getObjectEntries(sunstones)
      .filter(
        ([, sunstone]) => sunstone.x !== undefined && sunstone.y !== undefined,
      )
      .map(([id, sunstone], index) => {
        const { x, y } = sunstone;

        return (
          <MapPlacement
            key={`ruby-${id}`}
            x={x!}
            y={y!}
            {...RESOURCE_DIMENSIONS["Sunstone Rock"]}
            className={classNames({ "pointer-events-none": isVisiting })}
          >
            <Resource
              key={`ruby-${id}`}
              name="Sunstone Rock"
              createdAt={0}
              readyAt={0}
              id={id}
              index={index}
              x={x!}
              y={y!}
            />
          </MapPlacement>
        );
      }),
  );

  mapPlacements.push(
    ...getObjectEntries(oilReserves)
      .filter(
        ([, oilReserve]) =>
          oilReserve.x !== undefined && oilReserve.y !== undefined,
      )
      .map(([id, oilReserve], index) => {
        const { x, y } = oilReserve;

        return (
          <MapPlacement
            key={`oil-reserve-${id}`}
            x={x!}
            y={y!}
            {...RESOURCE_DIMENSIONS["Oil Reserve"]}
            className={classNames({ "pointer-events-none": isVisiting })}
          >
            <Resource
              name="Oil Reserve"
              createdAt={0}
              readyAt={0}
              id={id}
              index={index}
              x={x!}
              y={y!}
            />
          </MapPlacement>
        );
      }),
  );

  mapPlacements.push(
    ...getObjectEntries(lavaPits)
      .filter(
        ([, lavaPit]) => lavaPit.x !== undefined && lavaPit.y !== undefined,
      )
      .map(([id, lavaPit], index) => {
        const { x, y } = lavaPit;

        return (
          <MapPlacement
            key={`oil-reserve-${id}`}
            x={x!}
            y={y!}
            {...RESOURCE_DIMENSIONS["Lava Pit"]}
            className={classNames({ "pointer-events-none": isVisiting })}
          >
            <Resource
              name="Lava Pit"
              createdAt={0}
              readyAt={0}
              id={id}
              index={index}
              x={x!}
              y={y!}
            />
          </MapPlacement>
        );
      }),
  );

  mapPlacements.push(
    ...getObjectEntries(fruitPatches)
      .filter(
        ([, fruitPatch]) =>
          fruitPatch.x !== undefined && fruitPatch.y !== undefined,
      )
      .map(([id, fruitPatch], index) => {
        const { x, y } = fruitPatch;

        return (
          <MapPlacement
            key={`fruitPatches-${id}`}
            x={x!}
            y={y!}
            {...RESOURCE_DIMENSIONS["Fruit Patch"]}
            className={classNames({ "pointer-events-none": isVisiting })}
          >
            <Resource
              name="Fruit Patch"
              createdAt={0}
              readyAt={0}
              id={id}
              index={index}
              x={x!}
              y={y!}
            />
          </MapPlacement>
        );
      }),
  );

  mapPlacements.push(
    ...getObjectEntries(crops)
      .filter(([, crop]) => crop.x !== undefined && crop.y !== undefined)
      .map(([id, crop], index) => {
        const { x, y } = crop;

        return (
          <MapPlacement
            key={`crops-${id}`}
            x={x!}
            y={y!}
            {...RESOURCE_DIMENSIONS["Crop Plot"]}
            className={classNames({ "pointer-events-none": isVisiting })}
          >
            <Resource
              name="Crop Plot"
              createdAt={0}
              readyAt={0}
              id={id}
              index={index}
              x={x!}
              y={y!}
            />
          </MapPlacement>
        );
      }),
  );

  mapPlacements.push(
    ...getObjectEntries(flowerBeds)
      .filter(
        ([, flowerBed]) =>
          flowerBed.x !== undefined && flowerBed.y !== undefined,
      )
      .map(([id, flowerBed], index) => {
        const { x, y } = flowerBed;

        return (
          <MapPlacement
            key={`flowers-${id}`}
            x={x!}
            y={y!}
            {...RESOURCE_DIMENSIONS["Flower Bed"]}
            className={classNames({ "pointer-events-none": isVisiting })}
          >
            <Resource
              name="Flower Bed"
              createdAt={0}
              readyAt={0}
              id={id}
              index={index}
              x={x!}
              y={y!}
            />
          </MapPlacement>
        );
      }),
  );

  {
    mushrooms &&
      mapPlacements.push(
        ...getKeys(mushrooms).flatMap((id) => {
          const { x, y, name } = mushrooms[id]!;

          return (
            <MapPlacement
              key={`mushroom-${id}`}
              x={x}
              y={y}
              height={MUSHROOM_DIMENSIONS.height}
              width={MUSHROOM_DIMENSIONS.width}
              className={classNames({ "pointer-events-none": isVisiting })}
            >
              <Mushroom
                key={`mushroom-${id}`}
                id={id}
                isFirstRender={isFirstRender}
                name={name}
              />
            </MapPlacement>
          );
        }),
      );
  }

  {
    clutter &&
      mapPlacements.push(
        ...getKeys(clutter.locations).flatMap((id) => {
          const { x, y } = clutter.locations[id];

          return (
            <MapPlacement
              key={`clutter-${id}`}
              x={x}
              y={y}
              height={1}
              width={1}
              className={classNames({ "pointer-events-none": !isVisiting })}
            >
              <Clutter
                key={`clutter-${id}`}
                id={id}
                isFirstRender={isFirstRender}
                type={clutter.locations[id].type}
              />
            </MapPlacement>
          );
        }),
      );
  }

  {
    buds &&
      mapPlacements.push(
        ...getKeys(buds)
          .filter(
            (budId) =>
              !!buds[budId].coordinates &&
              (!buds[budId].location || buds[budId].location === "farm"),
          )
          .flatMap((id) => {
            const { x, y } = buds[id]!.coordinates!;

            return (
              <MapPlacement key={`bud-${id}`} x={x} y={y} height={1} width={1}>
                <Bud id={String(id)} x={x} y={y} />
              </MapPlacement>
            );
          }),
      );
  }

  if (!!airdrops && airdrops?.length > 0) {
    mapPlacements.push(
      ...airdrops
        // Only show placed chickens (V1 may have ones without coords)
        .filter((airdrop) => airdrop?.coordinates)
        .map((airdrop) => {
          const { x, y } = airdrop.coordinates as Coordinates;

          return (
            <MapPlacement
              key={`airdrop-${airdrop.id}`}
              x={x}
              y={y}
              height={1}
              width={1}
              className={classNames({ "pointer-events-none": isVisiting })}
            >
              <Airdrop key={`airdrop-${airdrop.id}`} airdrop={airdrop} />
            </MapPlacement>
          );
        }),
    );
  }

  mapPlacements.push(
    ...getObjectEntries(beehives)
      .filter(
        ([, beehive]) => beehive.x !== undefined && beehive.y !== undefined,
      )
      .map(([id, beehive], index) => {
        const { x, y } = beehive;

        return (
          <MapPlacement
            key={`beehive-${id}`}
            x={x!}
            y={y!}
            {...RESOURCE_DIMENSIONS.Beehive}
            className={classNames({ "pointer-events-none": isVisiting })}
          >
            <Resource
              name="Beehive"
              createdAt={0}
              readyAt={0}
              id={id}
              index={index}
              x={x!}
              y={y!}
            />
          </MapPlacement>
        );
      }),
  );

  return mapPlacements;
};

const selectGameState = (state: MachineState) => state.context.state;
const isLandscaping = (state: MachineState) => state.matches("landscaping");
const isPaused = (state: MachineState) => !!state.context.paused;
const _islandType = (state: MachineState) => state.context.state.island.type;
const _season = (state: MachineState) => state.context.state.season.season;

export const Land: React.FC = () => {
  const { gameService, showTimers } = useContext(Context);

  const paused = useSelector(gameService, isPaused);

  const { pathname } = useLocation();
  const state = useSelector(gameService, selectGameState);
  const islandType = useSelector(gameService, _islandType);
  const season = useSelector(gameService, _season);
  const showMarketplace = pathname.includes("marketplace");
  const showFlowerDashboard = pathname.includes("flower-dashboard");

  const {
    expansionConstruction,
    buildings,
    collectibles,
    chickens,
    inventory,
    trees,
    stones,
    iron,
    gold,
    crimstones,
    sunstones,
    crops,
    fruitPatches,
    flowers: { flowerBeds },
    mushrooms,
    buds,
    airdrops,
    beehives,
    oilReserves,
    island,
    lavaPits,
    socialFarming,
  } = state;

  const landscaping = useSelector(gameService, isLandscaping);
  const { isVisiting: visiting } = useVisiting();

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
          backgroundImage: `url(${season === "winter" ? SUNNYSIDE.decorations.frozenOcean : islandType === "volcano" ? SUNNYSIDE.decorations.darkOcean : SUNNYSIDE.decorations.ocean})`,
          backgroundSize: `${64 * PIXEL_SCALE}px`,
          imageRendering: "pixelated",
        }}
      >
        <BackgroundIslands
          width={gameboardDimensions.x * GRID_WIDTH_PX}
          height={gameboardDimensions.y * GRID_WIDTH_PX}
        />

        <DynamicClouds
          width={gameboardDimensions.x * GRID_WIDTH_PX}
          height={gameboardDimensions.y * GRID_WIDTH_PX}
        />

        <StaticClouds
          width={gameboardDimensions.x * GRID_WIDTH_PX}
          height={gameboardDimensions.y * GRID_WIDTH_PX}
        />

        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="relative w-full h-full">
            <LandBase
              island={island}
              season={season}
              expandedCount={expansionCount}
            />
            <DirtRenderer biome={getCurrentBiome(island)} grid={gameGrid} />

            {!landscaping && (
              <Water expansionCount={expansionCount} gameState={state} />
            )}
            {!landscaping && <UpcomingExpansion />}

            <div
              className={classNames(
                `w-full h-full top-0 absolute transition-opacity pointer-events-none`,
                {
                  "opacity-0": !landscaping,
                  "opacity-100": landscaping,
                },
              )}
              style={{
                backgroundSize: `${GRID_WIDTH_PX}px ${GRID_WIDTH_PX}px`,
                backgroundImage: `
            linear-gradient(to right, rgb(255 255 255 / 17%) 1px, transparent 1px),
            linear-gradient(to bottom, rgb(255 255 255 / 17%) 1px, transparent 1px)`,
              }}
            />

            {/* Sort island elements by y axis */}
            {!paused &&
              getIslandElements({
                game: state,
                expansionConstruction,
                buildings,
                collectibles,
                chickens,
                trees,
                stones,
                iron,
                gold,
                crimstones,
                sunstones,
                fruitPatches,
                flowerBeds,
                crops,
                showTimers: showTimers,
                grid: gameGrid,
                mushrooms: mushrooms?.mushrooms,
                isFirstRender,
                buds,
                airdrops,
                beehives,
                oilReserves,
                lavaPits,
                isVisiting: visiting,
                clutter: socialFarming?.clutter,
              }).sort((a, b) => {
                if (a.props.canCollide === false) {
                  return -1;
                }

                if (b.props.y > a.props.y) {
                  return 1;
                }
                if (a.props.y > b.props.y) {
                  return -1;
                }

                return 0;
              })}
          </div>

          {landscaping && <Placeable location="farm" />}
        </div>

        {!landscaping && <Fisherman />}

        {/* Background darkens in landscaping */}
        <div
          className={classNames(
            "absolute w-full h-full bg-black -z-10  transition-opacity pointer-events-none",
            {
              "opacity-0": !landscaping,
              "opacity-50": landscaping,
            },
          )}
        />
      </div>

      {landscaping && <LandscapingHud location="farm" />}

      {visiting && <VisitingHud />}

      {!landscaping && !visiting && <Hud isFarming={true} location="farm" />}

      {(showMarketplace || showFlowerDashboard) &&
        createPortal(
          <div
            data-html2canvas-ignore="true"
            aria-label="Hud"
            className="fixed inset-safe-area pointer-events-none z-10"
          >
            <div
              onMouseDown={(e) => e.stopPropagation()}
              onMouseUp={(e) => e.stopPropagation()}
              onTouchStart={(e) => e.stopPropagation()}
              onTouchEnd={(e) => e.stopPropagation()}
              className="pointer-events-auto w-full h-full"
            >
              <Outlet />
            </div>
          </div>,
          document.body,
        )}
    </>
  );
};
