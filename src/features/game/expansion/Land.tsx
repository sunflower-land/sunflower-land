import React, { useLayoutEffect } from "react";
import genesisBlock from "assets/land/levels/1.png";
import { GRID_WIDTH_PX } from "../lib/constants";
import { Section, useScrollIntoView } from "lib/utils/hooks/useScrollIntoView";
import smallStone from "assets/resources/small_stone.png";
import smallBush from "assets/resources/green_bush.png";
import tree from "assets/resources/tree.png";
import { MapPlacement, Position } from "./components/MapPlacement";

type MapItemName = "Bush" | "Tree" | "Stone";

interface MapItem {
  [index: number]: Position;
}
export interface Land {
  level: number;
  resources: Record<Partial<MapItemName>, MapItem>;
}

export const Land: React.FC<Land> = ({ resources }) => {
  const [scrollIntoView] = useScrollIntoView();

  useLayoutEffect(() => {
    scrollIntoView(Section.GenesisBlock, "auto");
  }, []);

  return (
    <div
      style={{ width: `${GRID_WIDTH_PX * 8}px` }}
      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
    >
      <div id="lexi" className="relative w-full h-full">
        <img
          id="genesisBlock"
          src={genesisBlock}
          alt="land"
          className="w-full"
        />
        {/* Example placement of trees */}
        {Object.values(resources.Tree).map(({ x, y, width, height }, index) => (
          <MapPlacement key={index} x={x} y={y} height={height} width={width}>
            <img src={tree} className="h-full w-full" />
          </MapPlacement>
        ))}
        {/* Example placement of bush */}
        {Object.values(resources.Bush).map(({ x, y, width, height }, index) => (
          <MapPlacement key={index} x={x} y={y} height={height} width={width}>
            <img src={smallBush} className="h-full w-full" />
          </MapPlacement>
        ))}
        {/* Example placement of stones */}
        {Object.values(resources.Stone).map(
          ({ x, y, width, height }, index) => (
            <MapPlacement key={index} x={x} y={y} height={height} width={width}>
              <img src={smallStone} className="h-full w-full" />
            </MapPlacement>
          )
        )}
      </div>
    </div>
  );
};
