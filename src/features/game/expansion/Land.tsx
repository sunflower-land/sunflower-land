import React, { useContext, useEffect, useLayoutEffect, useState } from "react";
import { Section, useScrollIntoView } from "lib/utils/hooks/useScrollIntoView";
import { Coordinates, MapPlacement } from "./components/MapPlacement";
import { useActor } from "@xstate/react";
import { Context } from "../GameProvider";
import { Plot } from "features/island/plots/Plot";
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
import { FruitPatch } from "features/island/fruit/FruitPatch";
import { Boulder } from "features/island/boulder/Boulder";
import { DirtRenderer } from "./components/DirtRenderer";
import classNames from "classnames";
import { Equipped as BumpkinParts } from "../types/bumpkin";
import { Chicken } from "../types/game";
import { Chicken as ChickenElement } from "features/island/chickens/Chicken";
import { BUMPKIN_POSITION } from "features/island/bumpkin/types/character";
import { IslandTravel } from "features/game/expansion/components/travel/IslandTravel";
import { BumpkinTutorial } from "./BumpkinTutorial";

type ExpansionProps = Pick<
  LandExpansion,
  | "plots"
  | "trees"
  | "stones"
  | "iron"
  | "gold"
  | "createdAt"
  | "fruitPatches"
  | "boulders"
>;

const getExpansions = (
  expansionProps: ExpansionProps,
  expansionIndex: number,
  isEditing?: boolean
) => {
  const { x: xOffset, y: yOffset } = EXPANSION_ORIGINS[expansionIndex];

  const mapPlacements: Array<JSX.Element> = [];

  if (expansionProps?.gold) {
    mapPlacements.push(
      ...getKeys(expansionProps.gold).map((index) => {
        const { x, y, width, height } = expansionProps.gold![index];

        return (
          <MapPlacement
            key={`${expansionIndex}-gold-${index}`}
            x={x + xOffset}
            y={y + yOffset}
            height={height}
            width={width}
            isEditing={isEditing}
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
            key={`${expansionIndex}-plot-${index}`}
            x={x + xOffset}
            y={y + yOffset}
            height={height}
            width={width}
            isEditing={isEditing}
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
            key={`${expansionIndex}-tree-${index}`}
            x={x + xOffset}
            y={y + yOffset}
            height={height}
            width={width}
            isEditing={isEditing}
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
            key={`${expansionIndex}-stone-${index}`}
            x={x + xOffset}
            y={y + yOffset}
            height={height}
            width={width}
            isEditing={isEditing}
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
            key={`${expansionIndex}-iron-${index}`}
            x={x + xOffset}
            y={y + yOffset}
            height={height}
            width={width}
            isEditing={isEditing}
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
            key={`${expansionIndex}-fruit-${index}`}
            x={x + xOffset}
            y={y + yOffset}
            height={height}
            width={width}
            isEditing={isEditing}
          >
            <FruitPatch fruit={fruit?.name} />
          </MapPlacement>
        );
      })
    );
  }

  if (expansionProps?.boulders) {
    mapPlacements.push(
      ...getKeys(expansionProps.boulders).map((index) => {
        const { x, y, width, height } = expansionProps.boulders![index];

        return (
          <MapPlacement
            key={`${expansionIndex}-boulder-${index}`}
            x={x + xOffset}
            y={y + yOffset}
            height={height}
            width={width}
            isEditing={isEditing}
          >
            <Boulder />
          </MapPlacement>
        );
      })
    );
  }

  return mapPlacements;
};

const getIslandElements = ({
  expansions,
  buildings,
  collectibles,
  chickens,
  bumpkinParts,
  isEditing,
}: {
  expansions: LandExpansion[];
  buildings: Partial<Record<BuildingName, PlacedItem[]>>;
  collectibles: Partial<Record<CollectibleName, PlacedItem[]>>;
  chickens: Partial<Record<number, Chicken>>;
  bumpkinParts: BumpkinParts | undefined;
  isEditing?: boolean;
}) => {
  const mapPlacements: Array<JSX.Element> = [];

  mapPlacements.push(
    ...expansions
      .filter((expansion) => expansion.readyAt < Date.now())
      .flatMap(
        (
          {
            stones,
            gold,
            iron,
            trees,
            plots,
            createdAt,
            fruitPatches,
            boulders,
          },
          index
        ) =>
          getExpansions(
            {
              createdAt: createdAt,
              stones: stones,
              gold: gold,
              trees: trees,
              iron: iron,
              plots: plots,
              fruitPatches: fruitPatches,
              boulders: boulders,
            },
            index,
            isEditing
          )
      )
  );

  if (bumpkinParts) {
    mapPlacements.push(
      <MapPlacement
        key="bumpkin-parts"
        x={BUMPKIN_POSITION.x}
        y={BUMPKIN_POSITION.y}
        width={2}
        height={2}
        isEditing={isEditing}
      >
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
              isEditing={isEditing}
            >
              <Building building={building} name={name as BuildingName} />
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
              isEditing={isEditing}
            >
              <Collectible
                name={name}
                id={id}
                readyAt={readyAt}
                createdAt={createdAt}
              />
            </MapPlacement>
          );
        });
      })
  );

  mapPlacements.push(
    ...getKeys(chickens)
      // Only show placed chickens (V1 may have ones without coords)
      .filter((index) => chickens[index]?.coordinates)
      .flatMap((index, nameIndex) => {
        const chicken = chickens[index]!;
        const { x, y } = chicken.coordinates as Coordinates;
        const { width, height } = ANIMAL_DIMENSIONS.Chicken;

        return (
          <MapPlacement
            key={`chicken-${nameIndex}`}
            x={x}
            y={y}
            height={height}
            width={width}
            isEditing={isEditing}
          >
            <ChickenElement index={index} />
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
  const [isEditing, setIsEditing] = useState(false);

  let expandedCount = expansions.length;
  const latestLand = expansions[expansions.length - 1];
  // Land is still being built show previous layout
  if (latestLand.readyAt > Date.now()) {
    expandedCount -= 1;
  }

  const [scrollIntoView] = useScrollIntoView();

  useLayoutEffect(() => {
    scrollIntoView(Section.GenesisBlock, "auto");
  }, []);

  useEffect(() => {
    setIsEditing(gameState.matches("editing"));
  }, [gameState.value]);

  const boatCoordinates = {
    x: expandedCount >= 7 ? -9 : -2,
    y: expandedCount >= 7 ? -10.5 : -4.5,
  };

  return (
    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
      <div
        className={classNames("relative w-full h-full", {
          "pointer-events-none": gameState.matches("visiting"),
        })}
      >
        <LandBase expandedCount={expandedCount} />
        <UpcomingExpansion gameState={state} />
        <DirtRenderer
          expansions={expansions.filter((e) => e.readyAt < Date.now())}
        />

        <Water level={expandedCount} />

        {/* Sort island elements by y axis */}
        {getIslandElements({
          expansions,
          buildings,
          collectibles,
          chickens,
          bumpkinParts: gameState.context.state.bumpkin?.equipped,
          isEditing,
        }).sort((a, b) => b.props.y - a.props.y)}
      </div>
      <IslandTravel
        key="island-travel"
        bumpkin={bumpkin}
        isVisiting={gameState.matches("visiting")}
        isTravelAllowed={!gameState.matches("autosaving")}
        onTravelDialogOpened={() => gameService.send("SAVE")}
        x={boatCoordinates.x}
        y={boatCoordinates.y}
      />

      <BumpkinTutorial bumpkinParts={bumpkin?.equipped} />

      {gameState.matches("editing") && <Placeable />}
    </div>
  );
};
