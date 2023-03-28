import React, { useContext, useEffect, useLayoutEffect, useState } from "react";
import { Section, useScrollIntoView } from "lib/utils/hooks/useScrollIntoView";
import { Coordinates, MapPlacement } from "./components/MapPlacement";
import { useActor } from "@xstate/react";
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
import { CharacterPlayground } from "features/island/bumpkin/components/CharacterPlayground";
import { Collectible } from "features/island/collectibles/Collectible";
import { Water } from "./components/Water";
import { DirtRenderer } from "./components/DirtRenderer";
import classNames from "classnames";
import { Equipped as BumpkinParts } from "../types/bumpkin";
import { Chicken } from "../types/game";
import { Chicken as ChickenElement } from "features/island/chickens/Chicken";
import { BUMPKIN_POSITION } from "features/island/bumpkin/types/character";
import { Hud } from "features/island/hud/Hud";
import { Resource } from "features/island/resources/Resource";
import { IslandTravel } from "./components/travel/IslandTravel";
import { BumpkinTutorial } from "./BumpkinTutorial";
import { Placeable } from "./placeable/Placeable";

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
  bumpkinParts,
  isEditing,
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
  bumpkinParts: BumpkinParts | undefined;
  isEditing?: boolean;
}) => {
  const mapPlacements: Array<JSX.Element> = [];

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
        <CharacterPlayground
          body={bumpkinParts.body}
          hair={bumpkinParts.hair}
          shirt={bumpkinParts.shirt}
          pants={bumpkinParts.pants}
          suit={bumpkinParts.suit}
          hat={bumpkinParts.hat}
          onesie={bumpkinParts.onesie}
          wings={bumpkinParts.wings}
          dress={bumpkinParts.dress}
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
          console.log({ name });
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
            isEditing={isEditing}
          >
            <ChickenElement id={id} />
          </MapPlacement>
        );
      })
  );

  mapPlacements.push(
    ...getKeys(trees).map((id) => {
      const { x, y, width, height } = trees[id];

      return (
        <MapPlacement
          key={`tree-${id}`}
          x={x}
          y={y}
          height={height}
          width={width}
          isEditing={isEditing}
        >
          <Resource name="Tree" createdAt={0} readyAt={0} id={id} />
        </MapPlacement>
      );
    })
  );

  mapPlacements.push(
    ...getKeys(stones).map((id) => {
      const { x, y, width, height } = stones[id];

      return (
        <MapPlacement
          key={`stone-${id}`}
          x={x}
          y={y}
          height={height}
          width={width}
          isEditing={isEditing}
        >
          <Resource name="Stone Rock" createdAt={0} readyAt={0} id={id} />
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
          isEditing={isEditing}
        >
          <Resource name="Iron Rock" createdAt={0} readyAt={0} id={id} />
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
          isEditing={isEditing}
        >
          <Resource name="Gold Rock" createdAt={0} readyAt={0} id={id} />
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
          isEditing={isEditing}
        >
          <Resource name="Fruit Patch" createdAt={0} readyAt={0} id={id} />
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
          isEditing={isEditing}
        >
          <Resource name="Crop Plot" createdAt={0} readyAt={0} id={id} />
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
  } = state;
  const [isEditing, setIsEditing] = useState(false);

  const expansionCount = inventory["Basic Land"]?.toNumber() ?? 3;

  const [scrollIntoView] = useScrollIntoView();

  useLayoutEffect(() => {
    scrollIntoView(Section.GenesisBlock, "auto");
  }, []);

  useEffect(() => {
    setIsEditing(gameState.matches("editing"));
  }, [gameState.value]);

  const boatCoordinates = {
    x: expansionCount >= 7 ? -9 : -2,
    y: expansionCount >= 7 ? -10.5 : -4.5,
  };

  return (
    <>
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <div
          className={classNames("relative w-full h-full", {
            "pointer-events-none": gameState.matches("visiting"),
          })}
        >
          <LandBase expandedCount={expansionCount} />
          <UpcomingExpansion />
          <DirtRenderer plots={crops} />

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
            bumpkinParts: gameState.context.state.bumpkin?.equipped,
            isEditing,
          }).sort((a, b) => b.props.y - a.props.y)}
        </div>
        <IslandTravel
          key="island-travel"
          bumpkin={bumpkin}
          isVisiting={gameState.matches("visiting")}
          inventory={gameState.context.state.inventory}
          travelAllowed={!gameState.matches("autosaving")}
          onTravelDialogOpened={() => gameService.send("SAVE")}
          x={boatCoordinates.x}
          y={boatCoordinates.y}
        />

        <BumpkinTutorial bumpkinParts={bumpkin?.equipped} />

        {gameState.matches("editing") && <Placeable />}
      </div>
      <Hud isFarming />
    </>
  );
};
