import React, { useContext, useLayoutEffect, useMemo, useRef } from "react";
import { useSelector } from "@xstate/react";
import classNames from "classnames";

import { Section, useScrollIntoView } from "lib/utils/hooks/useScrollIntoView";
import { MapPlacement } from "./components/MapPlacement";
import { Context } from "../GameProvider";
import {
  ANIMAL_DIMENSIONS,
  COLLECTIBLES_DIMENSIONS,
  getKeys,
} from "../types/craftables";
import { LandBase } from "./components/LandBase";
import { UpcomingExpansion } from "./components/UpcomingExpansion";
import { BUILDINGS_DIMENSIONS, Home } from "../types/buildings";
import { Building } from "features/island/buildings/components/building/Building";
import { Collectible } from "features/island/collectibles/Collectible";
import { Water } from "./components/Water";
import { DirtRenderer } from "./components/DirtRenderer";
import { Chicken as ChickenElement } from "features/island/chickens/Chicken";
import { Hud } from "features/island/hud/Hud";
import { Resource } from "features/island/resources/Resource";
import { Placeable } from "./placeable/Placeable";
import { MachineState } from "../lib/gameMachine";
import { getGameGrid } from "./placeable/lib/makeGrid";
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

import {
  isBuildingUpgradable,
  makeUpgradableBuildingKey,
  UpgradableBuildingType,
} from "../events/landExpansion/upgradeBuilding";
import { getCurrentBiome } from "features/island/biomes/biomes";
import { useVisiting } from "lib/utils/visitUtils";
import { getObjectEntries } from "./lib/utils";
import { Clutter } from "features/island/clutter/Clutter";
import {
  LandPerformanceDashboard,
  useLandPerformanceTracking,
} from "./performance/IslandElementsProfiler";
import { HudContainer } from "components/ui/HudContainer";

export const LAND_WIDTH = 6;

const _loggedInFarmState = (state: MachineState) =>
  state.context.visitorState ?? state.context.state;
const isLandscaping = (state: MachineState) => state.matches("landscaping");
const isPaused = (state: MachineState) => !!state.context.paused;
const _island = (state: MachineState) => state.context.state.island;
const _season = (state: MachineState) => state.context.state.season.season;
const _expansionCount = (state: MachineState) =>
  state.context.state.inventory["Basic Land"]?.toNumber() ?? 3;

// new selector
const _cropPositions = (state: MachineState) => ({
  crops: state.context.state.crops,
  cropPositions: getObjectEntries(state.context.state.crops)
    .filter(([, crop]) => crop.x !== undefined && crop.y !== undefined)
    .map(([id, crop]) => ({ id, x: crop.x, y: crop.y })),
});
const _treePositions = (state: MachineState) => ({
  trees: state.context.state.trees,
  treePositions: getObjectEntries(state.context.state.trees)
    .filter(([, tree]) => tree.x !== undefined && tree.y !== undefined)
    .map(([id, tree]) => ({ id, x: tree.x, y: tree.y })),
});
const _collectiblePositions = (state: MachineState) => {
  return {
    collectibles: state.context.state.collectibles,
    collectiblePositions: getObjectEntries(state.context.state.collectibles)
      .flatMap(([_, value]) => value?.map((item) => item.coordinates))
      .filter((coords) => coords !== undefined) // Filter out undefined
      .map((coords) => ({ x: coords.x, y: coords.y })),
  };
};
const _buildingPositions = (state: MachineState) => {
  return {
    buildings: state.context.state.buildings,
    buildingPositions: getObjectEntries(state.context.state.buildings).flatMap(
      ([_, value]) =>
        value
          ?.map((item) => item.coordinates)
          .filter((coords) => coords !== undefined) // Filter out undefined
          .map((coords) => ({ x: coords.x, y: coords.y })),
    ),
  };
};
const _stonePositions = (state: MachineState) => {
  return {
    stones: state.context.state.stones,
    stonePositions: getObjectEntries(state.context.state.stones)
      .filter(([, stone]) => stone.x !== undefined && stone.y !== undefined)
      .map(([id, stone]) => ({ id, x: stone.x, y: stone.y })),
  };
};
const _goldPositions = (state: MachineState) => {
  return {
    gold: state.context.state.gold,
    goldPositions: getObjectEntries(state.context.state.gold)
      .filter(([, gold]) => gold.x !== undefined && gold.y !== undefined)
      .map(([id, gold]) => ({ id, x: gold.x, y: gold.y })),
  };
};
const _ironPositions = (state: MachineState) => {
  return {
    iron: state.context.state.iron,
    ironPositions: getObjectEntries(state.context.state.iron)
      .filter(([, iron]) => iron.x !== undefined && iron.y !== undefined)
      .map(([id, iron]) => ({ id, x: iron.x, y: iron.y })),
  };
};
const _crimstonePositions = (state: MachineState) => {
  return {
    crimstones: state.context.state.crimstones,
    crimstonePositions: getObjectEntries(state.context.state.crimstones)
      .filter(
        ([, crimstone]) =>
          crimstone.x !== undefined && crimstone.y !== undefined,
      )
      .map(([id, crimstone]) => ({ id, x: crimstone.x, y: crimstone.y })),
  };
};
const _sunstonePositions = (state: MachineState) => {
  return {
    sunstones: state.context.state.sunstones,
    sunstonePositions: getObjectEntries(state.context.state.sunstones)
      .filter(
        ([, sunstone]) => sunstone.x !== undefined && sunstone.y !== undefined,
      )
      .map(([id, sunstone]) => ({ id, x: sunstone.x, y: sunstone.y })),
  };
};
const _beehivePositions = (state: MachineState) => {
  return {
    beehives: state.context.state.beehives,
    beehivePositions: getObjectEntries(state.context.state.beehives)
      .filter(
        ([, beehive]) => beehive.x !== undefined && beehive.y !== undefined,
      )
      .map(([id, beehive]) => ({ id, x: beehive.x, y: beehive.y })),
  };
};
const _flowerBedPositions = (state: MachineState) => {
  return {
    flowerBeds: state.context.state.flowers.flowerBeds,
    flowerBedPositions: getObjectEntries(state.context.state.flowers.flowerBeds)
      .filter(
        ([, flowerBed]) =>
          flowerBed.x !== undefined && flowerBed.y !== undefined,
      )
      .map(([id, flowerBed]) => ({ id, x: flowerBed.x, y: flowerBed.y })),
  };
};
const _fruitPatchPositions = (state: MachineState) => {
  return {
    fruitPatches: state.context.state.fruitPatches,
    fruitPatchPositions: getObjectEntries(state.context.state.fruitPatches)
      .filter(
        ([, fruitPatch]) =>
          fruitPatch.x !== undefined && fruitPatch.y !== undefined,
      )
      .map(([id, fruitPatch]) => ({ id, x: fruitPatch.x, y: fruitPatch.y })),
  };
};
const _oilReservePositions = (state: MachineState) => {
  return {
    oilReserves: state.context.state.oilReserves,
    oilReservePositions: getObjectEntries(state.context.state.oilReserves)
      .filter(
        ([, oilReserve]) =>
          oilReserve.x !== undefined && oilReserve.y !== undefined,
      )
      .map(([id, oilReserve]) => ({ id, x: oilReserve.x, y: oilReserve.y })),
  };
};
const _lavaPitPositions = (state: MachineState) => {
  return {
    lavaPits: state.context.state.lavaPits,
    lavaPitPositions: getObjectEntries(state.context.state.lavaPits)
      .filter(
        ([, lavaPit]) => lavaPit.x !== undefined && lavaPit.y !== undefined,
      )
      .map(([id, lavaPit]) => ({ id, x: lavaPit.x, y: lavaPit.y })),
  };
};

const _mushroomPositions = (state: MachineState) => {
  const { mushrooms } = state.context.state.mushrooms ?? {};

  if (!mushrooms) return { mushroomPositions: [] };

  return {
    mushrooms,
    mushroomPositions: getObjectEntries(mushrooms).flatMap(([_, mushroom]) => {
      return {
        x: mushroom.x,
        y: mushroom.y,
      };
    }),
  };
};
const _oldChickenPositions = (state: MachineState) => {
  return {
    chickens: state.context.state.chickens,
    chickenPositions: getObjectEntries(state.context.state.chickens)
      .filter(([_, chicken]) => chicken.coordinates !== undefined)
      .flatMap(([_, chicken]) => {
        return {
          x: chicken.coordinates!.x,
          y: chicken.coordinates!.y,
        };
      }),
  };
};
const _clutterPositions = (state: MachineState) => {
  const clutter = state.context.state.socialFarming?.clutter;

  if (!clutter) return { clutterPositions: [] };

  return {
    clutter,
    clutterPositions: getObjectEntries(clutter.locations).flatMap(
      ([_, location]) => {
        return {
          x: location.x,
          y: location.y,
        };
      },
    ),
  };
};
const _budPositions = (state: MachineState) => {
  const buds = state.context.state.buds;

  if (!buds) return { budPositions: [] };

  return {
    buds,
    budPositions: getObjectEntries(buds)
      .filter(([_, bud]) => !!bud.coordinates)
      .flatMap(([_, bud]) => {
        return {
          x: bud.coordinates!.x,
          y: bud.coordinates!.y,
        };
      }),
  };
};
const _airdropPositions = (state: MachineState) => {
  const airdrops = state.context.state.airdrops;

  if (!airdrops) return { airdropPositions: [] };

  return {
    airdrops,
    airdropPositions: airdrops
      .filter((airdrop) => !!airdrop.coordinates)
      .map((airdrop) => {
        return {
          x: airdrop.coordinates!.x,
          y: airdrop.coordinates!.y,
        };
      }),
  };
};

export const Land: React.FC = () => {
  console.log("🔄 Land component re-rendered at:", new Date().toISOString());
  const { gameService, showTimers } = useContext(Context);

  const paused = useSelector(gameService, isPaused);

  const { pathname } = useLocation();

  const island = useSelector(gameService, _island);
  const season = useSelector(gameService, _season);
  const showMarketplace = pathname.includes("marketplace");
  const showFlowerDashboard = pathname.includes("flower-dashboard");
  const loggedInFarmState = useSelector(gameService, _loggedInFarmState);
  const expansionCount = useSelector(gameService, _expansionCount);
  const { crops } = useSelector(gameService, _cropPositions, (prev, next) => {
    return (
      JSON.stringify(prev.cropPositions) === JSON.stringify(next.cropPositions)
    );
  });
  const { trees } = useSelector(gameService, _treePositions, (prev, next) => {
    return (
      JSON.stringify(prev.treePositions) === JSON.stringify(next.treePositions)
    );
  });
  const { collectibles } = useSelector(
    gameService,
    _collectiblePositions,
    (prev, next) => {
      return (
        JSON.stringify(prev.collectiblePositions) ===
        JSON.stringify(next.collectiblePositions)
      );
    },
  );
  const { buildings } = useSelector(
    gameService,
    _buildingPositions,
    (prev, next) => {
      return (
        JSON.stringify(prev.buildingPositions) ===
        JSON.stringify(next.buildingPositions)
      );
    },
  );
  const { stones } = useSelector(gameService, _stonePositions, (prev, next) => {
    return (
      JSON.stringify(prev.stonePositions) ===
      JSON.stringify(next.stonePositions)
    );
  });
  const { gold } = useSelector(gameService, _goldPositions, (prev, next) => {
    return (
      JSON.stringify(prev.goldPositions) === JSON.stringify(next.goldPositions)
    );
  });
  const { iron } = useSelector(gameService, _ironPositions, (prev, next) => {
    return (
      JSON.stringify(prev.ironPositions) === JSON.stringify(next.ironPositions)
    );
  });
  const { crimstones } = useSelector(
    gameService,
    _crimstonePositions,
    (prev, next) => {
      return (
        JSON.stringify(prev.crimstonePositions) ===
        JSON.stringify(next.crimstonePositions)
      );
    },
  );
  const { sunstones } = useSelector(
    gameService,
    _sunstonePositions,
    (prev, next) => {
      return (
        JSON.stringify(prev.sunstonePositions) ===
        JSON.stringify(next.sunstonePositions)
      );
    },
  );
  const { beehives } = useSelector(
    gameService,
    _beehivePositions,
    (prev, next) => {
      return (
        JSON.stringify(prev.beehivePositions) ===
        JSON.stringify(next.beehivePositions)
      );
    },
  );
  const { flowerBeds } = useSelector(
    gameService,
    _flowerBedPositions,
    (prev, next) => {
      return (
        JSON.stringify(prev.flowerBedPositions) ===
        JSON.stringify(next.flowerBedPositions)
      );
    },
  );
  const { fruitPatches } = useSelector(
    gameService,
    _fruitPatchPositions,
    (prev, next) => {
      return (
        JSON.stringify(prev.fruitPatchPositions) ===
        JSON.stringify(next.fruitPatchPositions)
      );
    },
  );
  const { oilReserves } = useSelector(
    gameService,
    _oilReservePositions,
    (prev, next) => {
      return (
        JSON.stringify(prev.oilReservePositions) ===
        JSON.stringify(next.oilReservePositions)
      );
    },
  );
  const { lavaPits } = useSelector(
    gameService,
    _lavaPitPositions,
    (prev, next) => {
      return (
        JSON.stringify(prev.lavaPitPositions) ===
        JSON.stringify(next.lavaPitPositions)
      );
    },
  );
  const { mushrooms } = useSelector(
    gameService,
    _mushroomPositions,
    (prev, next) => {
      return (
        JSON.stringify(prev.mushroomPositions) ===
        JSON.stringify(next.mushroomPositions)
      );
    },
  );
  const { chickens } = useSelector(
    gameService,
    _oldChickenPositions,
    (prev, next) => {
      return (
        JSON.stringify(prev.chickenPositions) ===
        JSON.stringify(next.chickenPositions)
      );
    },
  );
  const { clutter } = useSelector(
    gameService,
    _clutterPositions,
    (prev, next) => {
      return (
        JSON.stringify(prev.clutterPositions) ===
        JSON.stringify(next.clutterPositions)
      );
    },
  );
  const { buds } = useSelector(gameService, _budPositions, (prev, next) => {
    return (
      JSON.stringify(prev.budPositions) === JSON.stringify(next.budPositions)
    );
  });
  const { airdrops } = useSelector(
    gameService,
    _airdropPositions,
    (prev, next) => {
      return (
        JSON.stringify(prev.airdropPositions) ===
        JSON.stringify(next.airdropPositions)
      );
    },
  );
  const landscaping = useSelector(gameService, isLandscaping);

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

  // Calculate element count
  const elementCount = useMemo(() => {
    return (
      Object.values(buildings).flat().length +
      Object.values(collectibles).flat().length +
      Object.keys(chickens).length +
      Object.keys(trees).length +
      Object.keys(stones).length +
      Object.keys(iron).length +
      Object.keys(gold).length +
      Object.keys(crimstones).length +
      Object.keys(sunstones).length +
      Object.keys(crops).length +
      Object.keys(fruitPatches).length +
      Object.keys(flowerBeds).length +
      Object.keys(mushrooms?.mushrooms || {}).length +
      Object.keys(buds || {}).length +
      (airdrops?.length || 0) +
      Object.keys(beehives).length +
      Object.keys(oilReserves).length +
      Object.keys(lavaPits).length
    );
  }, [
    buildings,
    chickens,
    trees,
    stones,
    collectibles,
    iron,
    gold,
    crimstones,
    sunstones,
    crops,
    fruitPatches,
    flowerBeds,
    mushrooms,
    buds,
    airdrops,
    beehives,
    oilReserves,
    lavaPits,
  ]);

  // Enhanced performance tracking
  const {
    metrics,
    changeLog,
    isDashboardVisible,
    setIsDashboardVisible,
    startTracking,
    endTracking,
  } = useLandPerformanceTracking(elementCount, gameService);

  // New
  const cropRenderCount = useRef(0);
  const treeRenderCount = useRef(0);
  const collectibleRenderCount = useRef(0);
  const buildingRenderCount = useRef(0);
  const stoneRenderCount = useRef(0);
  const ironRenderCount = useRef(0);
  const goldRenderCount = useRef(0);
  const crimstoneRenderCount = useRef(0);
  const sunstoneRenderCount = useRef(0);
  const beehiveRenderCount = useRef(0);
  const flowerBedRenderCount = useRef(0);
  const fruitPatchRenderCount = useRef(0);
  const oilReserveRenderCount = useRef(0);
  const lavaPitRenderCount = useRef(0);
  const mushroomRenderCount = useRef(0);
  const chickenRenderCount = useRef(0);
  const clutterRenderCount = useRef(0);
  const budRenderCount = useRef(0);
  const airdropRenderCount = useRef(0);

  const { isVisiting: visiting } = useVisiting();

  // New functions
  const cropElements = useMemo(() => {
    cropRenderCount.current++;
    console.log(`�� Crops rendered ${cropRenderCount.current} times`);
    return getObjectEntries(crops)
      .filter(([, crop]) => crop.x !== undefined && crop.y !== undefined)
      .map(([id, crop], index) => {
        const { x, y } = crop;

        return (
          <MapPlacement
            key={`crops-${id}`}
            x={x!}
            y={y!}
            {...RESOURCE_DIMENSIONS["Crop Plot"]}
            className={classNames({ "pointer-events-none": visiting })}
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
      });
  }, [crops]);

  const treeElements = useMemo(() => {
    treeRenderCount.current++;
    console.log(`�� Trees rendered ${treeRenderCount.current} times`);
    return getObjectEntries(trees)
      .filter(([, tree]) => tree.x !== undefined && tree.y !== undefined)
      .map(([id, tree], index) => {
        const { x, y } = tree;

        return (
          <MapPlacement
            key={`trees-${id}`}
            x={x!}
            y={y!}
            {...RESOURCE_DIMENSIONS.Tree}
            className={classNames({ "pointer-events-none": visiting })}
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
      });
  }, [trees]);

  const collectibleElements = useMemo(() => {
    collectibleRenderCount.current++;
    console.log(
      `🌿 Collectibles rendered ${collectibleRenderCount.current} times`,
    );
    return getKeys(collectibles)
      .filter((name) => collectibles[name])
      .flatMap((name, nameIndex) => {
        const items = collectibles[name]!;
        return items
          .filter((collectible) => collectible.coordinates)
          .map((collectible) => {
            const { readyAt, createdAt, coordinates, id } = collectible;
            const { x, y } = coordinates!;
            const { width, height } = COLLECTIBLES_DIMENSIONS[name];

            return (
              <MapPlacement
                key={`collectible-${nameIndex}-${x}-${y}`}
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
                  x={coordinates!.x}
                  y={coordinates!.y}
                  grid={gameGrid}
                  // z={NON_COLLIDING_OBJECTS.includes(name) ? 0 : "unset"}
                  flipped={collectible.flipped}
                />
              </MapPlacement>
            );
          });
      });
  }, [collectibles]);

  const buildingElements = useMemo(() => {
    buildingRenderCount.current++;
    console.log(`�� Buildings rendered ${buildingRenderCount.current} times`);
    const home = new Set<Home | "Town Center">([
      "Town Center",
      "Tent",
      "House",
      "Manor",
      "Mansion",
    ]);

    return getKeys(buildings)
      .filter((name) => buildings[name])
      .flatMap((name, nameIndex) => {
        const items = buildings[name]!;
        const game = state;
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
                key={`building-${nameIndex}-${x}-${y}`}
                x={x}
                y={y}
                height={height}
                width={width}
                className={classNames({
                  "pointer-events-none": !home.has(name as Home) && visiting,
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
                  island={island}
                  season={season}
                />
              </MapPlacement>
            );
          });
      });
  }, [buildings]);

  const stoneElements = useMemo(() => {
    stoneRenderCount.current++;
    console.log(`�� Stones rendered ${stoneRenderCount.current} times`);
    return getObjectEntries(stones)
      .filter(([, stone]) => stone.x !== undefined && stone.y !== undefined)
      .map(([id, stone], index) => {
        const { x, y } = stone;

        return (
          <MapPlacement
            key={`stones-${id}`}
            x={x!}
            y={y!}
            {...RESOURCE_DIMENSIONS["Stone Rock"]}
            className={classNames({ "pointer-events-none": visiting })}
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
      });
  }, [stones]);

  const goldElements = useMemo(() => {
    goldRenderCount.current++;
    console.log(`�� Gold rendered ${goldRenderCount.current} times`);
    return getObjectEntries(gold)
      .filter(([, gold]) => gold.x !== undefined && gold.y !== undefined)
      .map(([id, gold], index) => {
        const { x, y } = gold;

        return (
          <MapPlacement
            key={`gold-${id}`}
            x={x!}
            y={y!}
            {...RESOURCE_DIMENSIONS["Gold Rock"]}
            className={classNames({ "pointer-events-none": visiting })}
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
      });
  }, [gold]);

  const ironElements = useMemo(() => {
    ironRenderCount.current++;
    console.log(`�� Iron rendered ${ironRenderCount.current} times`);
    return getObjectEntries(iron)
      .filter(([, iron]) => iron.x !== undefined && iron.y !== undefined)
      .map(([id, iron], index) => {
        const { x, y } = iron;

        return (
          <MapPlacement
            key={`iron-${id}`}
            x={x!}
            y={y!}
            {...RESOURCE_DIMENSIONS["Iron Rock"]}
            className={classNames({ "pointer-events-none": visiting })}
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
      });
  }, [iron]);

  const crimstoneElements = useMemo(() => {
    crimstoneRenderCount.current++;
    console.log(`�� Crimstones rendered ${crimstoneRenderCount.current} times`);
    return getObjectEntries(crimstones)
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
            className={classNames({ "pointer-events-none": visiting })}
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
      });
  }, [crimstones]);

  const sunstoneElements = useMemo(() => {
    sunstoneRenderCount.current++;
    console.log(`�� Sunstones rendered ${sunstoneRenderCount.current} times`);
    return getObjectEntries(sunstones)
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
            className={classNames({ "pointer-events-none": visiting })}
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
      });
  }, [sunstones]);

  const beehiveElements = useMemo(() => {
    beehiveRenderCount.current++;
    console.log(`�� Beehives rendered ${beehiveRenderCount.current} times`);
    return getObjectEntries(beehives)
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
            className={classNames({ "pointer-events-none": visiting })}
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
      });
  }, [beehives]);

  const flowerBedElements = useMemo(() => {
    flowerBedRenderCount.current++;
    console.log(
      `�� Flower Beds rendered ${flowerBedRenderCount.current} times`,
    );
    return getObjectEntries(flowerBeds)
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
            className={classNames({ "pointer-events-none": visiting })}
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
      });
  }, [flowerBeds]);

  const fruitPatchElements = useMemo(() => {
    fruitPatchRenderCount.current++;
    console.log(
      `�� Fruit Patches rendered ${fruitPatchRenderCount.current} times`,
    );
    return getObjectEntries(fruitPatches)
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
            className={classNames({ "pointer-events-none": visiting })}
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
      });
  }, [fruitPatches]);

  const oilReserveElements = useMemo(() => {
    oilReserveRenderCount.current++;
    console.log(
      `�� Oil Reserves rendered ${oilReserveRenderCount.current} times`,
    );
    return getObjectEntries(oilReserves)
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
            className={classNames({ "pointer-events-none": visiting })}
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
      });
  }, [oilReserves]);

  const lavaPitElements = useMemo(() => {
    lavaPitRenderCount.current++;
    console.log(`�� Lava Pits rendered ${lavaPitRenderCount.current} times`);
    return getObjectEntries(lavaPits)
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
            className={classNames({ "pointer-events-none": visiting })}
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
      });
  }, [lavaPits]);

  const mushroomElements = useMemo(() => {
    mushroomRenderCount.current++;
    console.log(`�� Mushrooms rendered ${mushroomRenderCount.current} times`);
    if (!mushrooms) return [];

    return getObjectEntries(mushrooms).flatMap(([id, mushroom]) => {
      return (
        <MapPlacement
          key={`mushroom-${id}`}
          x={mushroom.x}
          y={mushroom.y}
          height={MUSHROOM_DIMENSIONS.height}
          width={MUSHROOM_DIMENSIONS.width}
          className={classNames({ "pointer-events-none": visiting })}
        >
          <Mushroom
            key={`mushroom-${id}`}
            id={id}
            isFirstRender={isFirstRender}
            name={mushroom.name}
          />
        </MapPlacement>
      );
    });
  }, [mushrooms]);

  const chickenElements = useMemo(() => {
    chickenRenderCount.current++;
    console.log(`�� Chickens rendered ${chickenRenderCount.current} times`);
    return (
      getObjectEntries(chickens)
        // Only show placed chickens (V1 may have ones without coords)
        .filter(([_, chicken]) => chicken.coordinates !== undefined)
        .flatMap(([id, chicken]) => {
          const { x, y } = chicken.coordinates!;
          const { width, height } = ANIMAL_DIMENSIONS.Chicken;

          return (
            <MapPlacement
              key={`chicken-${id}`}
              x={x}
              y={y}
              height={height}
              width={width}
              className={classNames({ "pointer-events-none": visiting })}
            >
              <ChickenElement key={`chicken-${id}`} id={id} x={x} y={y} />
            </MapPlacement>
          );
        })
    );
  }, [chickens]);

  const clutterElements = useMemo(() => {
    clutterRenderCount.current++;
    console.log(`�� Clutter rendered ${clutterRenderCount.current} times`);

    if (!visiting || !clutter) return [];

    return <Clutter clutter={clutter} />;
  }, [clutter, visiting]);

  const budElements = useMemo(() => {
    budRenderCount.current++;
    console.log(`�� Buds rendered ${budRenderCount.current} times`);

    if (!buds) return [];

    return getObjectEntries(buds)
      .filter(
        ([_, bud]) =>
          !!bud.coordinates && (!bud.location || bud.location === "farm"),
      )
      .flatMap(([id, bud]) => {
        const { x, y } = bud.coordinates!;
        return (
          <MapPlacement key={`bud-${id}`} x={x} y={y} height={1} width={1}>
            <Bud id={String(id)} x={x} y={y} />
          </MapPlacement>
        );
      });
  }, [buds]);

  const airdropElements = useMemo(() => {
    airdropRenderCount.current++;
    console.log(`�� Airdrops rendered ${airdropRenderCount.current} times`);
    if (!airdrops) return [];

    return (
      airdrops
        // Only show placed chickens (V1 may have ones without coords)
        .filter((airdrop) => !!airdrop.coordinates)
        .map((airdrop) => {
          const { x, y } = airdrop.coordinates!;

          return (
            <MapPlacement
              key={`airdrop-${airdrop.id}`}
              x={x}
              y={y}
              height={1}
              width={1}
              className={classNames({ "pointer-events-none": visiting })}
            >
              <Airdrop key={`airdrop-${airdrop.id}`} airdrop={airdrop} />
            </MapPlacement>
          );
        })
    );
  }, [airdrops]);

  // Memoize island elements with enhanced performance tracking
  const islandElements = useMemo(() => {
    startTracking();

    // Determine what changed for better tracking
    const recentChange = changeLog[changeLog.length - 1];
    const changedFields = recentChange?.changedFields || [];
    const trigger =
      recentChange?.trigger === "positional" ? "positional" : "non-positional";

    // Use setTimeout to ensure the tracking happens after render
    setTimeout(() => endTracking(changedFields, trigger), 0);

    const elements = [
      cropElements,
      treeElements,
      collectibleElements,
      buildingElements,
      stoneElements,
      goldElements,
      ironElements,
      crimstoneElements,
      sunstoneElements,
      beehiveElements,
      flowerBedElements,
      fruitPatchElements,
      oilReserveElements,
      lavaPitElements,
      mushroomElements,
      chickenElements,
      clutterElements,
      budElements,
      airdropElements,
    ].flat();

    const sortedIslandElements = elements.sort((a, b) => {
      // Non-colliding objects (like tiles, rugs) should be at the beginning
      if (a.props.canCollide === false && b.props.canCollide === false) {
        if (a.props.children.props.name.includes("Tile")) {
          return -1; // a should be before b
        }

        if (b.props.children.props.name.includes("Tile")) {
          return 1; // b should be before a
        }
      }

      if (a.props.canCollide === false && b.props.canCollide !== false) {
        return -1; // a should be before b
      }

      if (b.props.canCollide === false && a.props.canCollide !== false) {
        return 1; // b should be before a
      }

      // For all other elements, sort by y position (higher y values first)
      return b.props.y - a.props.y;
    });

    return sortedIslandElements;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    chickens,
    fruitPatches,
    flowerBeds,
    showTimers,
    gameGrid,
    mushrooms,
    isFirstRender,
    buds,
    airdrops,
    beehives,
    oilReserves,
    lavaPits,
    visiting,
    landscaping,
    loggedInFarmState,

    // new elements
    cropElements,
    treeElements,
    collectibleElements,
    buildingElements,
    stoneElements,
    goldElements,
    ironElements,
    crimstoneElements,
    sunstoneElements,
    beehiveElements,
    flowerBedElements,
    fruitPatchElements,
    oilReserveElements,
    lavaPitElements,
  ]);

  return (
    <>
      <div
        className="absolute"
        style={{
          // dynamic gameboard
          width: `${gameboardDimensions.x * GRID_WIDTH_PX}px`,
          height: `${gameboardDimensions.y * GRID_WIDTH_PX}px`,
          backgroundImage: `url(${season === "winter" ? SUNNYSIDE.decorations.frozenOcean : island.type === "volcano" ? SUNNYSIDE.decorations.darkOcean : SUNNYSIDE.decorations.ocean})`,
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
            {!paused && islandElements.map((element) => element)}
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

      {/* Enhanced Performance Dashboard - only in development */}

      <HudContainer>
        <div style={{ pointerEvents: "auto" }}>
          <LandPerformanceDashboard
            changeLog={changeLog}
            metrics={metrics}
            isVisible={isDashboardVisible}
            onToggle={() => setIsDashboardVisible(!isDashboardVisible)}
          />
        </div>
      </HudContainer>

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
