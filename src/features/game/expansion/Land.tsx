import React, { useContext, useLayoutEffect } from "react";
import { Section, useScrollIntoView } from "lib/utils/hooks/useScrollIntoView";
import { Coordinates, MapPlacement } from "./components/MapPlacement";
import { useActor } from "@xstate/react";
import { Context } from "../GameProvider";
import { Plot } from "features/island/Plots/Plot";
import {
  ANIMAL_DIMENSIONS,
  CollectibleName,
  COLLECTIBLES_DIMENSIONS,
  getKeys,
} from "../types/craftables";
import { Tree } from "./components/resources/Tree";
import { LandBase } from "./components/LandBase";
import { UpcomingExpansion } from "./components/UpcomingExpansion";
import { LandExpansion, PlacedItem } from "../types/game";
import { EXPANSION_ORIGINS } from "./lib/constants";
import { Stone } from "./components/resources/Stone";
import { Placeable } from "./placeable/Placeable";
import { BuildingName, BUILDINGS_DIMENSIONS } from "../types/buildings";
import { Building } from "features/island/buildings/components/building/Building";
import { Character } from "features/island/bumpkin/components/Character";
import { Gold } from "./components/resources/Gold";
import { Iron } from "./components/resources/Iron";
import { Collectible } from "features/island/collectibles/Collectible";
import { Water } from "./components/Water";
import pirateGoblin from "assets/npcs/pirate_goblin.gif";
import { FruitPatch } from "features/island/fruit/FruitPatch";
import { Mine } from "features/island/mines/Mine";
import { IslandTravel } from "./components/IslandTravel";
import { PIXEL_SCALE } from "../lib/constants";
import { Bumpkin, Chicken } from "../types/game";
import { Chicken as ChickenElement } from "features/island/chickens/Chicken";
import { BumpkinParts } from "../types/bumpkin";

type ExpansionProps = Pick<
  LandExpansion,
  | "plots"
  | "trees"
  | "terrains"
  | "stones"
  | "iron"
  | "gold"
  | "createdAt"
  | "fruitPatches"
  | "mines"
>;

const getExpansions = (
  expansionProps: ExpansionProps,
  expansionIndex: number
) => {
  const { x: xOffset, y: yOffset } = EXPANSION_ORIGINS[expansionIndex];

  const mapPlacements: Array<JSX.Element> = [];

  if (expansionProps?.gold) {
    mapPlacements.push(
      ...getKeys(expansionProps.gold).map((index) => {
        const { x, y, width, height } = expansionProps.gold![index];

        return (
          <MapPlacement
            key={`${expansionProps.createdAt}-gold-${Number(index)}`}
            x={x + xOffset}
            y={y + yOffset}
            height={height}
            width={width}
          >
            <Gold rockIndex={Number(index)} expansionIndex={expansionIndex} />
          </MapPlacement>
        );
      })
    );
  }

  if (expansionProps?.plots) {
    mapPlacements.push(
      ...getKeys(expansionProps.plots).map((index) => {
        const { x, y, width, height } = expansionProps.plots![index];

        return (
          <MapPlacement
            key={`${expansionProps.createdAt}-plot-${Number(index)}`}
            x={x + xOffset}
            y={y + yOffset}
            height={height}
            width={width}
          >
            <Plot plotIndex={Number(index)} expansionIndex={expansionIndex} />
          </MapPlacement>
        );
      })
    );
  }

  if (expansionProps?.trees) {
    mapPlacements.push(
      ...getKeys(expansionProps.trees).map((index) => {
        const { x, y, width, height } = expansionProps.trees![index];

        return (
          <MapPlacement
            key={`${expansionProps.createdAt}-tree-${Number(index)}`}
            x={x + xOffset}
            y={y + yOffset}
            height={height}
            width={width}
          >
            <Tree treeIndex={Number(index)} expansionIndex={expansionIndex} />
          </MapPlacement>
        );
      })
    );
  }

  if (expansionProps?.stones) {
    mapPlacements.push(
      ...getKeys(expansionProps.stones).map((index) => {
        const { x, y, width, height } = expansionProps.stones![index];

        return (
          <MapPlacement
            key={`${expansionProps.createdAt}-stone-${Number(index)}`}
            x={x + xOffset}
            y={y + yOffset}
            height={height}
            width={width}
          >
            <Stone rockIndex={Number(index)} expansionIndex={expansionIndex} />
          </MapPlacement>
        );
      })
    );
  }

  if (expansionProps?.iron) {
    mapPlacements.push(
      ...getKeys(expansionProps.iron).map((index) => {
        const { x, y, width, height } = expansionProps.iron![index];

        return (
          <MapPlacement
            key={`${expansionProps.createdAt}-iron-${Number(index)}`}
            x={x + xOffset}
            y={y + yOffset}
            height={height}
            width={width}
          >
            <Iron ironIndex={Number(index)} expansionIndex={expansionIndex} />
          </MapPlacement>
        );
      })
    );
  }

  if (expansionProps?.fruitPatches) {
    mapPlacements.push(
      ...getKeys(expansionProps.fruitPatches).map((index) => {
        const { x, y, width, height, fruit } =
          expansionProps.fruitPatches![index];

        return (
          <MapPlacement
            key={`${expansionProps.createdAt}-fruit-${Number(index)}`}
            x={x + xOffset}
            y={y + yOffset}
            height={height}
            width={width}
          >
            <FruitPatch fruit={fruit?.name} />
          </MapPlacement>
        );
      })
    );
  }

  if (expansionProps?.mines) {
    mapPlacements.push(
      ...getKeys(expansionProps.mines).map((index) => {
        const { x, y, width, height } = expansionProps.mines![index];

        return (
          <MapPlacement
            key={`${expansionProps.createdAt}-mine-${Number(index)}`}
            x={x + xOffset}
            y={y + yOffset}
            height={height}
            width={width}
          >
            <Mine />
          </MapPlacement>
        );
      })
    );
  }

  return mapPlacements;
};

const getIslandElements = ({
  islandLevel,
  expansions,
  buildings,
  collectibles,
  chickens,
  bumpkin,
  bumpkinParts,
}: {
  islandLevel: number;
  expansions: LandExpansion[];
  buildings: Partial<Record<BuildingName, PlacedItem[]>>;
  collectibles: Partial<Record<CollectibleName, PlacedItem[]>>;
  chickens: Partial<Record<number, Chicken>>;
  bumpkin: Bumpkin | undefined;
  bumpkinParts: BumpkinParts | undefined;
}) => {
  const boatCordinates = {
    x: islandLevel > 7 ? -9 : -2,
    y: islandLevel > 7 ? -10.5 : -4.5,
  };

  const pirateCordinates = {
    x: islandLevel > 7 ? -8.4 : -1.4,
    y: islandLevel > 7 ? -8 : -2,
  };

  const mapPlacements: Array<JSX.Element> = [];

  mapPlacements.push(
    ...expansions
      .filter((expansion) => expansion.readyAt < Date.now())
      .flatMap(
        (
          {
            stones,
            gold,
            terrains,
            iron,
            trees,
            plots,
            createdAt,
            fruitPatches,
            mines,
          },
          index
        ) =>
          getExpansions(
            {
              createdAt: createdAt,
              stones: stones,
              gold: gold,
              terrains: terrains,
              trees: trees,
              iron: iron,
              plots: plots,
              fruitPatches: fruitPatches,
              mines: mines,
            },
            index
          )
      )
  );

  if (bumpkinParts) {
    mapPlacements.push(
      <MapPlacement x={2} y={-1}>
        <Character
          body={bumpkinParts.body}
          hair={bumpkinParts.hair}
          shirt={bumpkinParts.shirt}
          pants={bumpkinParts.pants}
        />
      </MapPlacement>
    );
  }

  mapPlacements.push(
    <MapPlacement x={pirateCordinates.x} y={pirateCordinates.y}>
      <img
        src={pirateGoblin}
        className="relative top-8"
        style={{
          width: `${25 * PIXEL_SCALE}px`,
        }}
      />
    </MapPlacement>
  );

  mapPlacements.push(
    <IslandTravel bumpkin={bumpkin} x={boatCordinates.x} y={boatCordinates.y} />
  );

  mapPlacements.push(
    ...getKeys(buildings)
      .filter((name) => buildings[name])
      .flatMap((name) => {
        const items = buildings[name]!;
        return items.map((building, index) => {
          const { x, y } = building.coordinates;
          const { width, height } = BUILDINGS_DIMENSIONS[name];

          return (
            <MapPlacement key={index} x={x} y={y} height={height} width={width}>
              <Building
                id={building.id}
                building={building}
                name={name as BuildingName}
              />
            </MapPlacement>
          );
        });
      })
  );

  mapPlacements.push(
    ...getKeys(collectibles)
      .filter((name) => collectibles[name])
      .flatMap((name) => {
        const items = collectibles[name]!;
        return items.map((collectible, index) => {
          const { x, y } = collectible.coordinates;
          const { width, height } = COLLECTIBLES_DIMENSIONS[name];

          return (
            <MapPlacement key={index} x={x} y={y} height={height} width={width}>
              <Collectible name={name} id={collectible.id} />
            </MapPlacement>
          );
        });
      })
  );

  mapPlacements.push(
    ...getKeys(chickens)
      // Only show placed chickens (V1 may have ones without coords)
      .filter((index) => chickens[index]?.coordinates)
      .flatMap((index) => {
        const chicken = chickens[index]!;
        const { x, y } = chicken.coordinates as Coordinates;
        const { width, height } = ANIMAL_DIMENSIONS.Chicken;

        return (
          <MapPlacement key={index} x={x} y={y} height={height} width={width}>
            <div className="flex relative justify-center w-full h-full">
              <ChickenElement index={index} />
            </div>
          </MapPlacement>
        );
      })
  );

  return mapPlacements;
};

export const Land: React.FC = () => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);
  const { state } = gameState.context;

  const { expansions, buildings, collectibles, chickens, bumpkin } = state;
  const level = expansions.length + 1;

  const [scrollIntoView] = useScrollIntoView();

  useLayoutEffect(() => {
    scrollIntoView(Section.GenesisBlock, "auto");
  }, []);

  return (
    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
      <div className="absolute z-0 w-full h-full">
        <Water level={level} />
      </div>
      <div className="relative w-full h-full">
        <LandBase expansions={expansions} />
        <UpcomingExpansion gameState={state} />

        {/* Sort island elements by y axis */}
        {getIslandElements({
          islandLevel: level,
          expansions,
          buildings,
          collectibles,
          chickens,
          bumpkin,
          bumpkinParts: gameState.context.state.bumpkin?.equipped,
        }).sort((a, b) => b.props.y - a.props.y)}

        {gameState.matches("editing") && <Placeable />}
      </div>
    </div>
  );
};
