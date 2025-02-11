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
import {
  NON_COLLIDING_OBJECTS,
  pickEmptyPosition,
} from "./placeable/lib/collisionDetection";
import { EXPANSION_ORIGINS, LAND_SIZE } from "./lib/constants";

import Decimal from "decimal.js-light";
import { RecipeItemName } from "../lib/crafting";
import {
  canDiscoverRecipe,
  RECIPE_UNLOCKS,
} from "../events/landExpansion/discoverRecipe";
import { RecipeStack } from "features/island/recipes/RecipeStack";

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
};

const getRecipeLocation = (game: GameState, level: number) => {
  const expansionBoundaries = {
    x: EXPANSION_ORIGINS[level - 1].x - LAND_SIZE / 2,
    y: EXPANSION_ORIGINS[level - 1].y + LAND_SIZE / 2,
    width: LAND_SIZE,
    height: LAND_SIZE,
  };

  return pickEmptyPosition({
    bounding: expansionBoundaries,
    gameState: game,
  });
};

const findRecipeLocation = (
  game: GameState,
  recipe: RecipeItemName,
  level: number,
  direction: 1 | -1,
): (Coordinates & { recipe: RecipeItemName }) | null => {
  if (
    !level ||
    level <= 0 ||
    (game.inventory["Basic Land"] ?? new Decimal(0)).lt(level)
  ) {
    return null;
  }

  const location = getRecipeLocation(game, level);
  if (location) return { ...location, recipe };

  const nextLevel = level + direction;

  return findRecipeLocation(game, recipe, nextLevel, direction);
};

// Recursive function to find the recipe locations
const getRecipeLocations = (game: GameState) => {
  return getKeys(RECIPE_UNLOCKS)
    .filter((recipe) => !game.craftingBox.recipes[recipe])
    .filter((recipe) => canDiscoverRecipe(game, recipe))
    .map((recipe) => {
      const recipeUnlock = RECIPE_UNLOCKS[recipe];
      return (
        findRecipeLocation(
          game,
          recipe,
          Math.min(
            recipeUnlock!.expansion,
            game.inventory["Basic Land"]?.toNumber() ?? 0,
          ),
          1,
        ) ||
        findRecipeLocation(
          game,
          recipe,
          Math.min(
            recipeUnlock!.expansion,
            game.inventory["Basic Land"]?.toNumber() ?? 0,
          ),
          -1,
        )
      );
    })
    .filter(Boolean) as (Coordinates & { recipe: RecipeItemName })[];
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
}: IslandElementArgs) => {
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
                index={itemIndex}
                readyAt={building.readyAt}
                createdAt={building.createdAt}
                craftingItemName={building.crafting?.name}
                craftingReadyAt={building.crafting?.readyAt}
                showTimers={showTimers}
                x={x}
                y={y}
                island={game.island.type}
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
              canCollide={NON_COLLIDING_OBJECTS.includes(name) ? false : true}
            >
              <Collectible
                location="farm"
                name={name}
                id={id}
                readyAt={readyAt}
                createdAt={createdAt}
                showTimers={showTimers}
                x={coordinates.x}
                y={coordinates.y}
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
          >
            <ChickenElement key={`chicken-${id}`} id={id} x={x} y={y} />
          </MapPlacement>
        );
      }),
  );

  mapPlacements.push(
    ...getKeys(trees).map((id, index) => {
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
            index={index}
            x={x}
            y={y}
          />
        </MapPlacement>
      );
    }),
  );

  mapPlacements.push(
    ...getKeys(stones).map((id, index) => {
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
            index={index}
            x={x}
            y={y}
          />
        </MapPlacement>
      );
    }),
  );

  mapPlacements.push(
    ...getKeys(iron).map((id, index) => {
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
            index={index}
            x={x}
            y={y}
          />
        </MapPlacement>
      );
    }),
  );

  mapPlacements.push(
    ...getKeys(gold).map((id, index) => {
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
            index={index}
            x={x}
            y={y}
          />
        </MapPlacement>
      );
    }),
  );

  mapPlacements.push(
    ...getKeys(crimstones).map((id, index) => {
      const { x, y, width, height } = crimstones[id];

      return (
        <MapPlacement
          key={`crimstone-${id}`}
          x={x}
          y={y}
          height={height}
          width={width}
        >
          <Resource
            key={`crimstone-${id}`}
            name="Crimstone Rock"
            createdAt={0}
            readyAt={0}
            id={id}
            index={index}
            x={x}
            y={y}
          />
        </MapPlacement>
      );
    }),
  );

  mapPlacements.push(
    ...getKeys(sunstones).map((id, index) => {
      const { x, y, width, height } = sunstones[id];

      return (
        <MapPlacement
          key={`ruby-${id}`}
          x={x}
          y={y}
          height={height}
          width={width}
        >
          <Resource
            key={`ruby-${id}`}
            name="Sunstone Rock"
            createdAt={0}
            readyAt={0}
            id={id}
            index={index}
            x={x}
            y={y}
          />
        </MapPlacement>
      );
    }),
  );

  mapPlacements.push(
    ...getKeys(oilReserves).map((id, index) => {
      const { x, y, width, height } = oilReserves[id];

      return (
        <MapPlacement
          key={`oil-reserve-${id}`}
          x={x}
          y={y}
          height={height}
          width={width}
        >
          <Resource
            name="Oil Reserve"
            createdAt={0}
            readyAt={0}
            id={id}
            index={index}
            x={x}
            y={y}
          />
        </MapPlacement>
      );
    }),
  );

  mapPlacements.push(
    ...getKeys(lavaPits).map((id, index) => {
      const { x, y, width, height } = lavaPits[id];

      return (
        <MapPlacement
          key={`oil-reserve-${id}`}
          x={x}
          y={y}
          height={height}
          width={width}
        >
          <Resource
            name="Lava Pit"
            createdAt={0}
            readyAt={0}
            id={id}
            index={index}
            x={x}
            y={y}
          />
        </MapPlacement>
      );
    }),
  );

  mapPlacements.push(
    ...getKeys(fruitPatches).map((id, index) => {
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
            index={index}
            x={x}
            y={y}
          />
        </MapPlacement>
      );
    }),
  );

  mapPlacements.push(
    ...getKeys(crops).map((id, index) => {
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
            index={index}
            x={x}
            y={y}
          />
        </MapPlacement>
      );
    }),
  );

  mapPlacements.push(
    ...getKeys(flowerBeds).map((id, index) => {
      const { x, y, width, height } = flowerBeds[id];

      return (
        <MapPlacement
          key={`flowers-${id}`}
          x={x}
          y={y}
          height={height}
          width={width}
        >
          <Resource
            name="Flower Bed"
            createdAt={0}
            readyAt={0}
            id={id}
            index={index}
            x={x}
            y={y}
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
            >
              <Airdrop key={`airdrop-${airdrop.id}`} airdrop={airdrop} />
            </MapPlacement>
          );
        }),
    );
  }

  mapPlacements.push(
    ...getKeys(beehives).map((id, index) => {
      const { x, y, width, height } = beehives[id];

      return (
        <MapPlacement
          key={`beehive-${id}`}
          x={x}
          y={y}
          height={height}
          width={width}
        >
          <Resource
            name="Beehive"
            createdAt={0}
            readyAt={0}
            id={id}
            index={index}
            x={x}
            y={y}
          />
        </MapPlacement>
      );
    }),
  );

  const recipeLocations = getRecipeLocations(game);
  // Group recipes by location, to stop them overlapping
  const recipeGroups = recipeLocations.reduce(
    (groups, recipe) => {
      const key = `${recipe.x},${recipe.y}`;
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(recipe);
      return groups;
    },
    {} as Record<
      string,
      (Coordinates & {
        recipe: RecipeItemName;
      })[]
    >,
  );

  Object.entries(recipeGroups).forEach(([key, recipes]) => {
    const [x, y] = key.split(",").map(Number);
    mapPlacements.push(
      <MapPlacement
        key={`recipe-group-${key}`}
        x={x}
        y={y}
        height={1}
        width={1}
      >
        <RecipeStack
          key={`recipe-${recipes}`}
          recipes={recipes.map((r) => r.recipe)}
        />
      </MapPlacement>,
    );
  });

  return mapPlacements;
};

const selectGameState = (state: MachineState) => state.context.state;
const isLandscaping = (state: MachineState) => state.matches("landscaping");
const isVisiting = (state: MachineState) => state.matches("visiting");
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
  } = state;

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
          <div
            className={classNames("relative w-full h-full", {
              "pointer-events-none": visiting,
            })}
          >
            <LandBase type={island.type} expandedCount={expansionCount} />
            <DirtRenderer island={island.type} grid={gameGrid} />

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

      {!landscaping && visiting && (
        <div className="absolute z-20">
          <VisitingHud />
        </div>
      )}

      {!landscaping && !visiting && <Hud isFarming={true} location="farm" />}

      {showMarketplace &&
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
