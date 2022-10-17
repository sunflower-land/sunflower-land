import React, { useContext, useLayoutEffect } from "react";
import { Section, useScrollIntoView } from "lib/utils/hooks/useScrollIntoView";
import { Coordinates, MapPlacement } from "./components/MapPlacement";
import { useActor } from "@xstate/react";
import { Context } from "../GameProvider";
import { getTerrainImageByKey } from "../lib/getTerrainImageByKey";
import { Plot } from "features/island/Plots/Plot";
import {
  ANIMAL_DIMENSIONS,
  COLLECTIBLES_DIMENSIONS,
  getKeys,
} from "../types/craftables";
import { Tree } from "./components/resources/Tree";
import { LandBase } from "./components/LandBase";
import { UpcomingExpansion } from "./components/UpcomingExpansion";
import { LandExpansion } from "../types/game";
import { TerrainPlacement } from "./components/TerrainPlacement";
import { EXPANSION_ORIGINS } from "./lib/constants";
import { Stone } from "./components/resources/Stone";
import { Placeable } from "./placeable/Placeable";
import { BuildingName, BUILDINGS_DIMENSIONS } from "../types/buildings";
import { Building } from "features/island/buildings/components/building/Building";
import { Character } from "features/island/bumpkin/components/Character";
import { Gold } from "./components/resources/Gold";
import { Iron } from "./components/resources/Iron";
import { Chicken } from "features/island/chickens/Chicken";
import { Collectible } from "features/island/collectibles/Collectible";
import { LAND_WIDTH, Water } from "./components/Water";
import { FruitPatch } from "features/island/fruit/FruitPatch";
import { Mine } from "features/island/mines/Mine";
import { IslandTravel } from "./components/IslandTravel";

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

export const Expansion: React.FC<
  ExpansionProps & { expansionIndex: number }
> = ({
  plots,
  trees,
  stones,
  iron,
  gold,
  terrains,
  fruitPatches,
  mines,
  createdAt,
  expansionIndex,
}) => {
  const { x: xOffset, y: yOffset } = EXPANSION_ORIGINS[expansionIndex];

  return (
    <>
      {gold &&
        getKeys(gold).map((index) => {
          const { x, y, width, height } = gold[index];

          return (
            <MapPlacement
              key={`${createdAt}-gold-${index}`}
              x={x + xOffset}
              y={y + yOffset}
              height={height}
              width={width}
            >
              <Gold rockIndex={Number(index)} expansionIndex={expansionIndex} />
            </MapPlacement>
          );
        })}

      {terrains &&
        getKeys(terrains).map((index) => {
          const { x, y, width, height, name } = terrains[index];

          return (
            <TerrainPlacement
              key={`${createdAt}-terrain-${index}`}
              x={x + xOffset}
              y={y + yOffset}
              height={height}
              width={width}
            >
              <img src={getTerrainImageByKey(name)} className="h-full w-full" />
            </TerrainPlacement>
          );
        })}

      {plots &&
        getKeys(plots).map((index) => {
          const { x, y, width, height } = plots[index];

          return (
            <MapPlacement
              key={`${createdAt}-plot-${index}`}
              x={x + xOffset}
              y={y + yOffset}
              height={height}
              width={width}
            >
              <Plot plotIndex={Number(index)} expansionIndex={expansionIndex} />
            </MapPlacement>
          );
        })}

      {trees &&
        getKeys(trees).map((index) => {
          const { x, y, width, height } = trees[index];

          return (
            <MapPlacement
              key={`${createdAt}-tree-${index}`}
              x={x + xOffset}
              y={y + yOffset}
              height={height}
              width={width}
            >
              <Tree treeIndex={Number(index)} expansionIndex={expansionIndex} />
            </MapPlacement>
          );
        })}

      {stones &&
        getKeys(stones).map((index) => {
          const { x, y, width, height } = stones[index];

          return (
            <MapPlacement
              key={`${createdAt}-stone-${index}`}
              x={x + xOffset}
              y={y + yOffset}
              height={height}
              width={width}
            >
              <Stone
                rockIndex={Number(index)}
                expansionIndex={expansionIndex}
              />
            </MapPlacement>
          );
        })}

      {iron &&
        getKeys(iron).map((index) => {
          const { x, y, width, height } = iron[index];

          return (
            <MapPlacement
              key={`${createdAt}-iron-${index}`}
              x={x + xOffset}
              y={y + yOffset}
              height={height}
              width={width}
            >
              <Iron ironIndex={Number(index)} expansionIndex={expansionIndex} />
            </MapPlacement>
          );
        })}

      {fruitPatches &&
        getKeys(fruitPatches).map((index) => {
          const { x, y, width, height, fruit } = fruitPatches[index];

          return (
            <MapPlacement
              key={`${createdAt}-fruit-${index}`}
              x={x + xOffset}
              y={y + yOffset}
              height={height}
              width={width}
            >
              <FruitPatch fruit={fruit?.name} />
            </MapPlacement>
          );
        })}

      {mines &&
        getKeys(mines).map((index) => {
          const { x, y, width, height } = mines[index];

          return (
            <MapPlacement
              key={`${createdAt}-fruit-${index}`}
              x={x + xOffset}
              y={y + yOffset}
              height={height}
              width={width}
            >
              <Mine />
            </MapPlacement>
          );
        })}
    </>
  );
};

export const Land: React.FC = () => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);
  const { state } = gameState.context;

  const { expansions, buildings, collectibles, chickens, bumpkin } = state;
  const level = expansions.length + 1;
  const offset = Math.floor(Math.sqrt(level)) * LAND_WIDTH;

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

        {expansions
          .filter((expansion) => expansion.readyAt < Date.now())
          .map(
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
            ) => (
              <Expansion
                createdAt={createdAt}
                expansionIndex={index}
                key={index}
                stones={stones}
                gold={gold}
                terrains={terrains}
                trees={trees}
                iron={iron}
                plots={plots}
                fruitPatches={fruitPatches}
                mines={mines}
              />
            )
          )}

        {gameState.matches("editing") && <Placeable />}

        {gameState.context.state.bumpkin?.equipped && (
          <MapPlacement x={2} y={-1}>
            <Character
              body={gameState.context.state.bumpkin.equipped.body}
              hair={gameState.context.state.bumpkin.equipped.hair}
              shirt={gameState.context.state.bumpkin.equipped.shirt}
              pants={gameState.context.state.bumpkin.equipped.pants}
            />
          </MapPlacement>
        )}

        <IslandTravel bumpkin={bumpkin} x={offset - 2} y={0} />

        {getKeys(buildings).flatMap((name) => {
          const items = buildings[name];
          return items?.map((building, index) => {
            const { x, y } = building.coordinates;
            const { width, height } = BUILDINGS_DIMENSIONS[name];

            return (
              <MapPlacement
                key={index}
                x={x}
                y={y}
                height={height}
                width={width}
              >
                <Building
                  id={building.id}
                  building={building}
                  name={name as BuildingName}
                />
              </MapPlacement>
            );
          });
        })}

        {getKeys(collectibles).flatMap((name) => {
          const items = collectibles[name];
          return items?.map((collectible, index) => {
            const { x, y } = collectible.coordinates;
            const { width, height } = COLLECTIBLES_DIMENSIONS[name];

            return (
              <MapPlacement
                key={index}
                x={x}
                y={y}
                height={height}
                width={width}
              >
                <Collectible name={name} id={collectible.id} />
              </MapPlacement>
            );
          });
        })}

        {getKeys(chickens)
          // Only show placed chickens (V1 may have ones without coords)
          .filter((index) => chickens[index].coordinates)
          .flatMap((index) => {
            const chicken = chickens[index];
            const { x, y } = chicken.coordinates as Coordinates;
            const { width, height } = ANIMAL_DIMENSIONS.Chicken;

            return (
              <MapPlacement
                key={index}
                x={x}
                y={y}
                height={height}
                width={width}
              >
                <div className="flex relative justify-center w-full h-full">
                  <Chicken index={index} />
                </div>
              </MapPlacement>
            );
          })}
      </div>
    </div>
  );
};
