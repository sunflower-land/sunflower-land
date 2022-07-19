import React, { useContext, useLayoutEffect } from "react";
import { Section, useScrollIntoView } from "lib/utils/hooks/useScrollIntoView";
import { MapPlacement } from "./components/MapPlacement";
import { useActor } from "@xstate/react";
import { Context } from "../GameProvider";
import { getTerrainImageByKey } from "../lib/getTerrainImageByKey";
import { getKeys } from "../types/craftables";
import { Plot } from "features/farming/crops/components/landExpansion/Plot";
import { Pebble } from "./components/resources/Pebble";
import { Shrub } from "./components/resources/Shrub";
import { Tree } from "features/farming/crops/components/landExpansion/Tree";
import { LandBase } from "./components/LandBase";

export const Land: React.FC = () => {
  const { gameService } = useContext(Context);
  const [
    {
      context: { state },
    },
  ] = useActor(gameService);
  const { pebbles, shrubs, terrains, plots, trees, level } = state;

  const [scrollIntoView] = useScrollIntoView();

  useLayoutEffect(() => {
    scrollIntoView(Section.GenesisBlock, "auto");
  }, []);

  return (
    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
      <div className="relative w-full h-full">
        <LandBase level={level} />

        {/* Example placement of shrub */}
        {getKeys(shrubs).map((index) => {
          const { x, y, width, height } = shrubs[index];

          return (
            <MapPlacement key={index} x={x} y={y} height={height} width={width}>
              <Shrub shrubIndex={0} />
            </MapPlacement>
          );
        })}

        {/* Example placement of pebbles */}
        {getKeys(pebbles).map((index) => {
          const { x, y, width, height } = pebbles[index];

          return (
            <MapPlacement key={index} x={x} y={y} height={height} width={width}>
              <Pebble pebbleIndex={0} />
            </MapPlacement>
          );
        })}

        {/* Example placement of terrains */}
        {getKeys(terrains).map((index) => {
          const { x, y, width, height, name } = terrains[index];

          return (
            <MapPlacement key={index} x={x} y={y} height={height} width={width}>
              <img src={getTerrainImageByKey(name)} className="h-full w-full" />
            </MapPlacement>
          );
        })}
        {/* Example placement of plots */}
        {getKeys(plots).map((index) => {
          const { x, y, width, height } = plots[index];

          return (
            <MapPlacement key={index} x={x} y={y} height={height} width={width}>
              <Plot index={Number(index)} />
            </MapPlacement>
          );
        })}

        {getKeys(trees).map((index) => {
          const { x, y, width, height } = trees[index];

          return (
            <MapPlacement key={index} x={0} y={0} height={height} width={width}>
              <Tree treeIndex={index} />
            </MapPlacement>
          );
        })}
      </div>
    </div>
  );
};
