/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { useContext, useLayoutEffect, useMemo } from "react";
import { useSelector } from "@xstate/react";
import classNames from "classnames";

import { Section, useScrollIntoView } from "lib/utils/hooks/useScrollIntoView";
import { MapPlacement } from "./components/MapPlacement";
import { Context } from "../GameProvider";
import { COLLECTIBLES_DIMENSIONS, getKeys } from "../types/craftables";
import { LandBase } from "./components/LandBase";
import { UpcomingExpansion } from "./components/UpcomingExpansion";
import { BUILDINGS_DIMENSIONS, Home } from "../types/buildings";
import { Building } from "features/island/buildings/components/building/Building";
import { Collectible } from "features/island/collectibles/Collectible";
import { Water } from "./components/Water";
import { DirtRenderer } from "./components/DirtRenderer";
import { Hud } from "features/island/hud/Hud";
import { Resource } from "features/island/resources/Resource";
import { Placeable } from "./placeable/Placeable";
import { MachineState } from "../lib/gameMachine";
import { getGameGrid } from "./placeable/lib/makeGrid";
import { LandscapingHud } from "features/island/hud/LandscapingHud";
import { Mushroom } from "features/island/mushrooms/Mushroom";
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
import { getCurrentBiome } from "features/island/biomes/biomes";
import { useVisiting } from "lib/utils/visitUtils";
import {
  getObjectEntries,
  comparePositions,
  getSortedResourcePositions,
  getSortedCollectiblePositions,
} from "./lib/utils";
import { Clutter } from "features/island/clutter/Clutter";
import { PetNFT } from "features/island/pets/PetNFT";
import { WaterTrapSpot } from "features/island/fisherman/WaterTrapSpot";
import { FarmHand } from "features/island/farmhand/FarmHand";

export const LAND_WIDTH = 6;

const isLandscaping = (state: MachineState) => state.matches("landscaping");
const isPaused = (state: MachineState) => !!state.context.paused;
const _island = (state: MachineState) => state.context.state.island;
const _season = (state: MachineState) => state.context.state.season.season;
const _expansionCount = (state: MachineState) =>
  state.context.state.inventory["Basic Land"]?.toNumber() ?? 3;

const _cropPositions = (state: MachineState) => ({
  crops: state.context.state.crops,
  positions: getSortedResourcePositions(state.context.state.crops),
});
const _treePositions = (state: MachineState) => ({
  trees: state.context.state.trees,
  positions: getSortedResourcePositions(state.context.state.trees),
});
const _stonePositions = (state: MachineState) => {
  return {
    stones: state.context.state.stones,
    positions: getSortedResourcePositions(state.context.state.stones),
  };
};
const _goldPositions = (state: MachineState) => {
  return {
    gold: state.context.state.gold,
    positions: getSortedResourcePositions(state.context.state.gold),
  };
};
const _ironPositions = (state: MachineState) => {
  return {
    iron: state.context.state.iron,
    positions: getSortedResourcePositions(state.context.state.iron),
  };
};
const _crimstonePositions = (state: MachineState) => {
  return {
    crimstones: state.context.state.crimstones,
    positions: getSortedResourcePositions(state.context.state.crimstones),
  };
};
const _sunstonePositions = (state: MachineState) => {
  return {
    sunstones: state.context.state.sunstones,
    positions: getSortedResourcePositions(state.context.state.sunstones),
  };
};
const _beehivePositions = (state: MachineState) => {
  return {
    beehives: state.context.state.beehives,
    positions: getSortedResourcePositions(state.context.state.beehives),
  };
};
const _flowerBedPositions = (state: MachineState) => {
  return {
    flowerBeds: state.context.state.flowers.flowerBeds,
    positions: getSortedResourcePositions(
      state.context.state.flowers.flowerBeds,
    ),
  };
};
const _fruitPatchPositions = (state: MachineState) => {
  return {
    fruitPatches: state.context.state.fruitPatches,
    positions: getSortedResourcePositions(state.context.state.fruitPatches),
  };
};
const _oilReservePositions = (state: MachineState) => {
  return {
    oilReserves: state.context.state.oilReserves,
    positions: getSortedResourcePositions(state.context.state.oilReserves),
  };
};
const _lavaPitPositions = (state: MachineState) => {
  return {
    lavaPits: state.context.state.lavaPits,
    positions: getSortedResourcePositions(state.context.state.lavaPits),
  };
};
const _collectiblePositions = (state: MachineState) => {
  return {
    collectibles: state.context.state.collectibles,
    positions: getSortedCollectiblePositions(state.context.state.collectibles),
  };
};
const _buildingPositions = (state: MachineState) => {
  return {
    buildings: state.context.state.buildings,
    positions: getObjectEntries(state.context.state.buildings).flatMap(
      ([, value]) =>
        value
          ?.map((item) => item.coordinates)
          .filter((coords) => coords !== undefined)
          .map((coords) => ({ x: coords.x, y: coords.y })),
    ),
  };
};
const _mushroomPositions = (state: MachineState) => {
  const { mushrooms } = state.context.state.mushrooms ?? {};

  if (!mushrooms) return { positions: [] };

  return {
    mushrooms,
    positions: getObjectEntries(mushrooms).flatMap(([, mushroom]) => {
      return {
        x: mushroom.x,
        y: mushroom.y,
      };
    }),
  };
};

const _clutterPositions = (state: MachineState) => {
  const clutter = state.context.state.socialFarming?.clutter;

  if (!clutter) return { positions: [] };

  return {
    clutter,
    positions: getObjectEntries(clutter.locations).flatMap(([, location]) => {
      return {
        x: location.x,
        y: location.y,
      };
    }),
  };
};
const _budPositions = (state: MachineState) => {
  const buds = state.context.state.buds;

  if (!buds) return { positions: [] };

  return {
    buds,
    positions: getObjectEntries(buds)
      .filter(([, bud]) => !!bud.coordinates)
      .flatMap(([, bud]) => {
        return {
          x: bud.coordinates!.x,
          y: bud.coordinates!.y,
        };
      }),
  };
};

const _petNFTPositions = (state: MachineState) => {
  const nfts = state.context.state.pets?.nfts;

  if (!nfts) return { positions: [] };

  return {
    nfts,
    positions: getObjectEntries(nfts)
      .filter(([, nft]) => !!nft.coordinates)
      .flatMap(([, nft]) => {
        return {
          x: nft.coordinates!.x,
          y: nft.coordinates!.y,
        };
      }),
  };
};

const _farmHandPositions = (state: MachineState) => {
  const bumpkins = state.context.state.farmHands?.bumpkins;

  if (!bumpkins) return { farmHands: {}, positions: [] };

  return {
    farmHands: bumpkins,
    positions: Object.entries(bumpkins).flatMap(([, fh]) => {
      if (!fh.coordinates) return undefined;

      return {
        x: fh.coordinates.x,
        y: fh.coordinates.y,
      };
    }),
  };
};

const _airdropPositions = (state: MachineState) => {
  const airdrops = state.context.state.airdrops;

  if (!airdrops) return { positions: [] };

  return {
    airdrops,
    positions: airdrops
      .filter((airdrop) => !!airdrop.coordinates)
      .map((airdrop) => {
        return {
          x: airdrop.coordinates!.x,
          y: airdrop.coordinates!.y,
        };
      }),
  };
};

const _waterTrapPositions = (state: MachineState) => {
  const waterTraps = state.context.state.crabTraps.trapSpots;

  if (!waterTraps) return { positions: [] };

  return {
    waterTraps,
    positions: getObjectEntries(waterTraps).flatMap(([, waterTrap]) => {
      return {
        x: waterTrap.x,
        y: waterTrap.y,
      };
    }),
  };
};

export const LandComponent: React.FC = () => {
  const { gameService } = useContext(Context);
  const { pathname } = useLocation();

  const showMarketplace = pathname.includes("marketplace");
  const showFlowerDashboard = pathname.includes("flower-dashboard");
  const showEconomyDashboard = pathname.includes("economy-dashboard");
  const showRetentionDashboard = pathname.includes("retention-dashboard");

  const paused = useSelector(gameService, isPaused);
  const island = useSelector(gameService, _island);
  const season = useSelector(gameService, _season);
  const expansionCount = useSelector(gameService, _expansionCount);
  const { crops, positions: cropPositions } = useSelector(
    gameService,
    _cropPositions,
    comparePositions,
  );
  const { trees } = useSelector(gameService, _treePositions, comparePositions);
  const { collectibles, positions: collectiblePositions } = useSelector(
    gameService,
    _collectiblePositions,
  );
  const { buildings } = useSelector(gameService, _buildingPositions);
  const { stones } = useSelector(
    gameService,
    _stonePositions,
    comparePositions,
  );
  const { gold } = useSelector(gameService, _goldPositions, comparePositions);
  const { iron } = useSelector(gameService, _ironPositions, comparePositions);
  const { crimstones } = useSelector(
    gameService,
    _crimstonePositions,
    comparePositions,
  );
  const { sunstones } = useSelector(
    gameService,
    _sunstonePositions,
    comparePositions,
  );
  const { beehives } = useSelector(
    gameService,
    _beehivePositions,
    comparePositions,
  );
  const { flowerBeds } = useSelector(
    gameService,
    _flowerBedPositions,
    comparePositions,
  );
  const { fruitPatches } = useSelector(
    gameService,
    _fruitPatchPositions,
    comparePositions,
  );
  const { oilReserves } = useSelector(
    gameService,
    _oilReservePositions,
    comparePositions,
  );
  const { lavaPits } = useSelector(
    gameService,
    _lavaPitPositions,
    comparePositions,
  );
  const { mushrooms } = useSelector(
    gameService,
    _mushroomPositions,
    comparePositions,
  );

  const { clutter } = useSelector(
    gameService,
    _clutterPositions,
    comparePositions,
  );
  const { buds } = useSelector(gameService, _budPositions, comparePositions);
  const { nfts: petNFTs } = useSelector(
    gameService,
    _petNFTPositions,
    comparePositions,
  );
  const { farmHands } = useSelector(
    gameService,
    _farmHandPositions,
    comparePositions,
  );
  const { airdrops } = useSelector(
    gameService,
    _airdropPositions,
    comparePositions,
  );
  const { waterTraps } = useSelector(
    gameService,
    _waterTrapPositions,
    comparePositions,
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

  // memorize game grid and only update it when the stringified value changes
  const gameGrid = useMemo(() => {
    return getGameGrid({
      cropPositions,
      collectiblePositions,
    });
  }, [cropPositions, collectiblePositions]);

  const { isVisiting: visiting } = useVisiting();

  // New functions
  const cropElements = useMemo(() => {
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
    return getKeys(collectibles)
      .filter((name) => collectibles[name])
      .flatMap((name) => {
        const items = collectibles[name]!;
        return items
          .filter((collectible) => collectible.coordinates)
          .map((collectible, index) => {
            const { readyAt, createdAt, coordinates, id } = collectible;
            const { x, y } = coordinates!;
            const { width, height } = COLLECTIBLES_DIMENSIONS[name];

            return (
              <MapPlacement
                key={`collectible-${name}-${id}`}
                x={x}
                y={y}
                height={height}
                width={width}
                canCollide={NON_COLLIDING_OBJECTS.includes(name) ? false : true}
                isTile={name.includes("Tile")}
                enableOnVisitClick
              >
                <Collectible
                  location="farm"
                  name={name}
                  id={id}
                  readyAt={readyAt ?? 0}
                  createdAt={createdAt ?? 0}
                  x={coordinates!.x}
                  y={coordinates!.y}
                  grid={gameGrid}
                  flipped={collectible.flipped}
                  index={index}
                />
              </MapPlacement>
            );
          });
      });
  }, [collectibles, gameGrid]);

  const buildingElements = useMemo(() => {
    const home = new Set<Home | "Town Center" | "Pet House">([
      "Town Center",
      "Tent",
      "House",
      "Manor",
      "Mansion",
      "Pet House",
    ]);

    return getKeys(buildings)
      .filter((name) => buildings[name])
      .flatMap((name) => {
        const items = buildings[name]!;
        return items
          .filter((building) => building.coordinates !== undefined)
          .map((building, itemIndex) => {
            const { x, y } = building.coordinates!;
            const { width, height } = BUILDINGS_DIMENSIONS[name];

            return (
              <MapPlacement
                key={`building-${name}-${building.id}`}
                x={x}
                y={y}
                height={height}
                width={width}
                enableOnVisitClick={home.has(
                  name as Home | "Town Center" | "Pet House",
                )}
              >
                <Building
                  name={name}
                  id={building.id}
                  index={itemIndex}
                  readyAt={building.readyAt ?? 0}
                  createdAt={building.createdAt ?? 0}
                  x={x}
                  y={y}
                  island={island}
                  season={season}
                />
              </MapPlacement>
            );
          });
      });
  }, [buildings, island, season]);

  const stoneElements = useMemo(() => {
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
    if (!mushrooms) return [];

    return getObjectEntries(mushrooms).flatMap(([id, mushroom]) => {
      return (
        <MapPlacement
          key={`mushroom-${id}`}
          x={mushroom.x}
          y={mushroom.y}
          height={MUSHROOM_DIMENSIONS.height}
          width={MUSHROOM_DIMENSIONS.width}
          z={99999}
        >
          <Mushroom key={`mushroom-${id}`} id={id} name={mushroom.name} />
        </MapPlacement>
      );
    });
  }, [mushrooms]);

  const clutterElements = useMemo(() => {
    if (!visiting || !clutter) {
      return [];
    }

    return <Clutter clutter={clutter} />;
  }, [clutter, visiting]);

  const budElements = useMemo(() => {
    if (!buds) return [];

    return Object.entries(buds)
      .filter(
        ([, bud]) =>
          !!bud.coordinates && (!bud.location || bud.location === "farm"),
      )
      .flatMap(([id, bud]) => {
        const { x, y } = bud.coordinates!;
        return (
          <MapPlacement
            key={`bud-${id}`}
            x={x}
            y={y}
            height={1}
            width={1}
            enableOnVisitClick
          >
            <Bud id={id} x={x} y={y} />
          </MapPlacement>
        );
      });
  }, [buds]);

  const petNFTElements = useMemo(() => {
    if (!petNFTs) return [];
    return Object.entries(petNFTs)
      .filter(
        ([, pet]) =>
          !!pet.coordinates && (!pet.location || pet.location === "farm"),
      )
      .flatMap(([id, pet]) => {
        const { x, y } = pet.coordinates!;
        return (
          <MapPlacement
            key={`pet-${id}`}
            x={x}
            y={y}
            height={2}
            width={2}
            enableOnVisitClick
          >
            <PetNFT id={id} x={x} y={y} />
          </MapPlacement>
        );
      });
  }, [petNFTs]);

  const farmHandElements = useMemo(() => {
    if (!farmHands || Object.keys(farmHands).length === 0) return [];

    return Object.entries(farmHands).flatMap(([id, fh]) => {
      if (!fh.coordinates || fh.location === "home") return [];

      const { x, y } = fh.coordinates;

      return (
        <MapPlacement key={`farmhand-${id}`} x={x} y={y} height={1} width={1}>
          <FarmHand id={id} />
        </MapPlacement>
      );
    });
  }, [farmHands]);

  const airdropElements = useMemo(() => {
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
            >
              <Airdrop key={`airdrop-${airdrop.id}`} airdrop={airdrop} />
            </MapPlacement>
          );
        })
    );
  }, [airdrops]);

  const waterTrapElements = useMemo(() => {
    if (!waterTraps) return [];

    return Object.entries(waterTraps).map(([id, waterTrap]) => {
      return (
        <MapPlacement
          key={`water-trap-${id}`}
          x={waterTrap.x}
          y={waterTrap.y}
          height={1}
          width={1}
        >
          <WaterTrapSpot key={`water-trap-${id}`} id={id} />
        </MapPlacement>
      );
    });
  }, [waterTraps]);

  // Memoize island elements with enhanced performance tracking
  const islandElements = useMemo(() => {
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
      clutterElements,
      budElements,
      petNFTElements,
      farmHandElements,
      airdropElements,
    ].flat();

    const sortedIslandElements = elements.slice().sort((a, b) => {
      // Non-colliding objects (like tiles, rugs) should be at the beginning
      if (a.props.canCollide === false && b.props.canCollide === false) {
        if (a.props.isTile) return -1; // a should be before b

        if (b.props.isTile) return 1; // b should be before a
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
  }, [
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
    clutterElements,
    budElements,
    petNFTElements,
    farmHandElements,
    airdropElements,
    mushroomElements,
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

            {!landscaping && <Water expansionCount={expansionCount} />}
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

        {/* Water trap spots - rendered after Fisherman to ensure they appear on top */}
        {!landscaping && waterTrapElements}

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

      {(showMarketplace ||
        showFlowerDashboard ||
        showEconomyDashboard ||
        showRetentionDashboard) &&
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

export const Land = React.memo(LandComponent);
