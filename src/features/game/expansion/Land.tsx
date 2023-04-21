import React, { useContext, useLayoutEffect } from "react";
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
import { IslandTravel } from "./components/travel/IslandTravel";
import { Placeable } from "./placeable/Placeable";
import { getShortcuts } from "features/farming/hud/lib/shortcuts";
import { MachineState } from "../lib/gameMachine";
import { GameGrid, getGameGrid } from "./placeable/lib/makeGrid";
import { LandscapingHud } from "features/island/hud/LandscapingHud";
import { Mushroom } from "features/island/mushrooms/Mushroom";
import { useFirstRender } from "lib/utils/hooks/useFirstRender";
import { MUSHROOM_DIMENSIONS } from "../types/resources";

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
  isRustyShovelSelected,
  showTimers,
  grid,
  mushrooms,
  isFirstRender,
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
  isRustyShovelSelected: boolean;
  showTimers: boolean;
  grid: GameGrid;
  mushrooms: GameState["mushrooms"]["mushrooms"];
  isFirstRender: boolean;
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
                isRustyShovelSelected={isRustyShovelSelected}
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
                isRustyShovelSelected={isRustyShovelSelected}
                showTimers={showTimers}
                x={coordinates.x}
                y={coordinates.x}
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
            <ChickenElement key={`chicken-${id}`} id={id} />
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
            coordinates={{ x, y }}
            name="Tree"
            createdAt={0}
            readyAt={0}
            id={id}
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
            coordinates={{ x, y }}
            name="Stone Rock"
            createdAt={0}
            readyAt={0}
            id={id}
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
            coordinates={{ x, y }}
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
            coordinates={{ x, y }}
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
            coordinates={{ x, y }}
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
            coordinates={{ x, y }}
          />
        </MapPlacement>
      );
    })
  );

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

  return mapPlacements;
};

const selectGameState = (state: MachineState) => state.context.state;
const isAutosaving = (state: MachineState) => state.matches("autosaving");
const isLandscaping = (state: MachineState) => state.matches("landscaping");
const isVisiting = (state: MachineState) => state.matches("visiting");

export const Land: React.FC = () => {
  const { gameService, showTimers } = useContext(Context);

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
  } = useSelector(gameService, selectGameState);
  const autosaving = useSelector(gameService, isAutosaving);
  const landscaping = useSelector(gameService, isLandscaping);
  const visiting = useSelector(gameService, isVisiting);

  const expansionCount = inventory["Basic Land"]?.toNumber() ?? 3;

  const [scrollIntoView] = useScrollIntoView();

  useLayoutEffect(() => {
    scrollIntoView(Section.GenesisBlock, "auto");
  }, []);

  const isFirstRender = useFirstRender();

  const boatCoordinates = {
    x: expansionCount >= 7 ? -9 : -2,
    y: expansionCount >= 7 ? -10.5 : -4.5,
  };

  const shortcuts = getShortcuts();

  const gameGrid = getGameGrid({
    crops,
    collectibles,
  });

  return (
    <>
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <div
          className={classNames("relative w-full h-full", {
            "pointer-events-none": visiting,
          })}
        >
          <LandBase expandedCount={expansionCount} />
          <UpcomingExpansion />
          <DirtRenderer grid={gameGrid} />
          <Water level={expansionCount} />

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
            isRustyShovelSelected: shortcuts[0] === "Rusty Shovel",
            showTimers: showTimers,
            grid: gameGrid,
            mushrooms: mushrooms.mushrooms,
            isFirstRender,
          }).sort((a, b) => b.props.y - a.props.y)}
        </div>
        <IslandTravel
          bumpkin={bumpkin}
          isVisiting={visiting}
          inventory={inventory}
          travelAllowed={!autosaving}
          onTravelDialogOpened={() => gameService.send("SAVE")}
          x={boatCoordinates.x}
          y={boatCoordinates.y}
        />

        {landscaping && <Placeable />}
      </div>
      {landscaping ? <LandscapingHud isFarming /> : <Hud isFarming />}
    </>
  );
};
