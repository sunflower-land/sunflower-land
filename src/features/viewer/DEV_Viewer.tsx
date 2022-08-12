import { GRID_WIDTH_PX } from "features/game/lib/constants";
import { LandExpansion } from "features/game/types/game";
import React, { ChangeEvent, useState } from "react";

import stone from "src/assets/resources/stone_rock.png";
import soil from "assets/land/soil2.png";
import tree from "src/assets/resources/tree.png";

import { getTerrainImageByKey } from "features/game/lib/getTerrainImageByKey";
import { TerrainPlacement } from "features/game/expansion/components/TerrainPlacement";

export const DEV_Viewer: React.FC = () => {
  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    try {
      const json = JSON.parse(e.target.value);
      setExpansions(json);
    } catch (e) {
      setError(JSON.stringify(e));
    }
  };

  const [expansions, setExpansions] = useState<
    (LandExpansion & { id: string })[]
  >([]);

  const [error, setError] = useState("");

  return (
    <>
      {error && <div>Error: {error}</div>}
      <textarea
        onChange={handleChange}
        className="w-full border-1 border-slate-500"
        placeholder="Enter JSON"
      />
      <div className="h-full w-full flex-col overflow-scroll">
        {Object.values(expansions).map((expansion, i) => {
          return (
            <div className="flex" key={i}>
              <div
                className="border-green-900 bg-green-300 border-1 relative"
                style={{
                  margin: GRID_WIDTH_PX * 1,
                  width: GRID_WIDTH_PX * 6,
                  height: GRID_WIDTH_PX * 6,
                }}
              >
                {expansion.stones &&
                  Object.values(expansion.stones).map((s, i) => (
                    <img
                      key={`stones-${i}`}
                      src={stone}
                      className="absolute"
                      style={{
                        width: (s.width * GRID_WIDTH_PX) / 2,
                        height: s.height * GRID_WIDTH_PX,
                        left: `calc(50% + ${
                          s.x * GRID_WIDTH_PX + GRID_WIDTH_PX / 2
                        }px)`,
                        top: `calc(50% - ${s.y * GRID_WIDTH_PX}px)`,
                      }}
                    />
                  ))}
                {expansion.trees &&
                  Object.values(expansion.trees).map((t, i) => (
                    <img
                      key={`trees-${i}`}
                      src={tree}
                      className="absolute"
                      style={{
                        width: t.width * GRID_WIDTH_PX,
                        height: t.height * GRID_WIDTH_PX,
                        left: `calc(50% + ${t.x * GRID_WIDTH_PX}px)`,
                        top: `calc(50% - ${t.y * GRID_WIDTH_PX}px)`,
                      }}
                    />
                  ))}
                {expansion.terrains &&
                  Object.values(expansion.terrains).map((t, i) => (
                    <TerrainPlacement
                      key={`terrain-${i}`}
                      x={t.x}
                      y={t.y}
                      height={t.height}
                      width={t.width}
                    >
                      <img
                        src={getTerrainImageByKey(t.name)}
                        className="h-full w-full"
                      />
                    </TerrainPlacement>
                  ))}
                {expansion.plots &&
                  Object.values(expansion.plots).map((p, i) => (
                    <img
                      key={`plots-${i}`}
                      src={soil}
                      className="absolute"
                      style={{
                        width: p.width * GRID_WIDTH_PX,
                        height: p.height * GRID_WIDTH_PX * 2,
                        left: `calc(50% + ${p.x * GRID_WIDTH_PX}px)`,
                        top: `calc(50% - ${
                          p.y * GRID_WIDTH_PX + GRID_WIDTH_PX
                        }px)`,
                      }}
                    />
                  ))}
              </div>
              <h2
                className="text-shadow-none text-slate-500 max-w-lg"
                style={{ margin: GRID_WIDTH_PX * 1 }}
              >
                {expansion.id}
              </h2>
              <code
                className="text-sm text-shadow-none text-slate-500 max-w-lg"
                style={{ margin: GRID_WIDTH_PX * 1 }}
              >
                {JSON.stringify(expansion, null, 2)}
              </code>
            </div>
          );
        })}
      </div>
    </>
  );
};
