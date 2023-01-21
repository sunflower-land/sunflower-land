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
import { GameState, LandExpansion, PlacedItem } from "../types/game";
import { Placeable } from "./placeable/Placeable";
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
import { IslandTravel } from "features/game/expansion/components/travel/IslandTravel";
import { BumpkinTutorial } from "./BumpkinTutorial";
<<<<<<< HEAD
import { Hud } from "features/island/hud/Hud";
=======
import { Resource } from "features/island/resources/Resource";
import { ResourceName } from "../types/resources";
>>>>>>> 8169b8e1 (Remove resources)

type ExpansionProps = Pick<LandExpansion, "createdAt">;

const getIslandElements = ({
  expansions,
  buildings,
  collectibles,
  chickens,
  resources,
  bumpkinParts,
  isEditing,
}: {
  expansions: LandExpansion[];
  buildings: Partial<Record<BuildingName, PlacedItem[]>>;
  collectibles: Partial<Record<CollectibleName, PlacedItem[]>>;
  chickens: Partial<Record<string, Chicken>>;
  resources: GameState["resources"];
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

  getKeys(resources).map((resourceName) => {
    mapPlacements.push(
      ...getKeys(resources[resourceName]).map((id) => {
        const { x, y, width, height } = resources[resourceName][id];

        const FIELDS: Record<keyof GameState["resources"], ResourceName> = {
          plots: "Crop Plot",
          gold: "Gold Rock",
          iron: "Iron Rock",
          stones: "Stone Rock",
          trees: "Tree",
          fruitPatches: "Fruit Patch",
          boulders: "Boulder",
        };

        const name = FIELDS[resourceName];

        return (
          <MapPlacement
            key={`stone-${id}`}
            x={x}
            y={y}
            height={height}
            width={width}
            isEditing={isEditing}
          >
            <Resource name={name} createdAt={0} readyAt={0} id={id} />
          </MapPlacement>
        );
      })
    );
  });

  return mapPlacements;
};

export const Land: React.FC = () => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);
  const { state } = gameState.context;

  const { expansions, buildings, collectibles, chickens, bumpkin, resources } =
    state;
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
<<<<<<< HEAD
    <>
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
          inventory={gameState.context.state.inventory}
          travelAllowed={!gameState.matches("autosaving")}
          onTravelDialogOpened={() => gameService.send("SAVE")}
          x={boatCoordinates.x}
          y={boatCoordinates.y}
        />
=======
    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
      <div
        className={classNames("relative w-full h-full", {
          "pointer-events-none": gameState.matches("visiting"),
        })}
      >
        <LandBase expandedCount={expandedCount} />
        <UpcomingExpansion gameState={state} />
        <DirtRenderer plots={resources.plots} />
>>>>>>> 8169b8e1 (Remove resources)

<<<<<<< HEAD
        <BumpkinTutorial bumpkinParts={bumpkin?.equipped} />

        {gameState.matches("editing") && <Placeable />}
=======
        <Water level={expandedCount} />

        {/* Sort island elements by y axis */}
        {getIslandElements({
          expansions,
          buildings,
          collectibles,
          chickens,
          resources: gameState.context.state.resources,
          bumpkinParts: gameState.context.state.bumpkin?.equipped,
          isEditing,
        }).sort((a, b) => b.props.y - a.props.y)}
>>>>>>> b67f7712 (Move resources onto root level and tokenise)
      </div>
      <Hud isFarming />
    </>
  );
};
