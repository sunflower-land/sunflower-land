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
import {
  GameState,
  LandExpansion,
  LandExpansionRock,
  PlacedItem,
} from "../types/game";
import { EXPANSION_ORIGINS } from "./lib/constants";
import { Stone } from "./components/resources/Stone";
import { Placeable } from "./placeable/Placeable";
import { BuildingName, BUILDINGS_DIMENSIONS } from "../types/buildings";
import { Building } from "features/island/buildings/components/building/Building";
import { CharacterPlayground } from "features/island/bumpkin/components/CharacterPlayground";
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
import { Hud } from "features/island/hud/Hud";

type ExpansionProps = Pick<LandExpansion, "createdAt">;

const getExpansions = (
  expansionProps: ExpansionProps,
  expansionIndex: number,
  isEditing?: boolean
) => {
  const { x: xOffset, y: yOffset } = EXPANSION_ORIGINS[expansionIndex];

  const mapPlacements: Array<JSX.Element> = [];

  if (expansionProps?.fruitPatches) {
    mapPlacements.push(
      ...getKeys(expansionProps.fruitPatches).map((index: number) => {
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
            <FruitPatch
              fruitPatchIndex={Number(index)}
              expansionIndex={expansionIndex}
            />
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

  mapPlacements.push(
    ...expansions
      .filter((expansion) => expansion.readyAt < Date.now())
      .flatMap(({ createdAt }, index) =>
        getExpansions(
          {
            createdAt: createdAt,
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

  mapPlacements.push(
    ...getKeys(resources.iron).map((id) => {
      const { x, y, width, height } = resources.iron![id] as LandExpansionRock;

      return (
        <MapPlacement
          key={`stone-${id}`}
          x={x}
          y={y}
          height={height}
          width={width}
          isEditing={isEditing}
        >
          <Iron id={id} />
        </MapPlacement>
      );
    })
  );

  mapPlacements.push(
    ...getKeys(resources.trees).map((id) => {
      const { x, y, width, height } = resources.trees![id];

      console.log({ x, y, width, height });
      return (
        <MapPlacement
          key={`tree-${id}`}
          x={x}
          y={y}
          height={height}
          width={width}
          isEditing={isEditing}
        >
          <Tree id={id} />
        </MapPlacement>
      );
    })
  );

  if (resources?.plots) {
    mapPlacements.push(
      ...getKeys(resources.plots).map((id) => {
        const { x, y, width, height } = resources.plots![id];

        return (
          <MapPlacement
            key={`plot-${id}`}
            x={x}
            y={y}
            height={height}
            width={width}
            isEditing={isEditing}
          >
            <Plot id={id} />
          </MapPlacement>
        );
      })
    );
  }

  mapPlacements.push(
    ...getKeys(resources.stones).map((id) => {
      const { x, y, width, height } = resources.stones![
        id
      ] as LandExpansionRock;

      return (
        <MapPlacement
          key={`stone-${id}`}
          x={x}
          y={y}
          height={height}
          width={width}
          isEditing={isEditing}
        >
          <Stone id={id} />
        </MapPlacement>
      );
    })
  );

  mapPlacements.push(
    ...getKeys(resources.gold).map((id) => {
      const { x, y, width, height } = resources.gold![id];

      return (
        <MapPlacement
          key={`gold-${id}`}
          x={x}
          y={y}
          height={height}
          width={width}
          isEditing={isEditing}
        >
          <Gold id={id} />
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
