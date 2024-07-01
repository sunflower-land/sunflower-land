import { GRID_WIDTH_PX } from "features/game/lib/constants";
import React, { useRef, useState } from "react";
import ScrollContainer from "react-indiana-drag-scroll";

import background from "assets/land/levels/basic/level_1.webp";
import { GameProvider } from "features/game/GameProvider";
import waterMovement from "assets/decorations/water_movement.png";
import { getKeys } from "features/game/types/craftables";
import { Box } from "components/ui/Box";
import { RESOURCES, ResourcePlacer } from "./components/ResourcePlacer";
import {
  Coordinates,
  MapPlacement,
} from "features/game/expansion/components/MapPlacement";
import { Button } from "components/ui/Button";
import { InnerPanel } from "components/ui/Panel";
import { INITIAL_LAYOUTS, Layout } from "./lib/layouts";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

/**
 * A test component for collision detection and resource sizing/dimensions
 */
export const Builder: React.FC = () => {
  const { t } = useAppTranslation();
  const container = useRef(null);

  const [selected, setSelected] = useState<keyof Layout>();

  const [placed, setPlaced] = useState<Layout>({
    plots: [],
    fruitPatches: [],
    gold: [],
    iron: [],
    stones: [],
    crimstones: [],
    sunstones: [],
    trees: [],
    boulder: [],
    flowers: [],
    beehives: [],
    oilReserves: [],
  });

  const [layouts, setLayouts] = useState<Layout[]>(
    Object.values(INITIAL_LAYOUTS),
  );

  const save = () => {
    setLayouts((prev) => [...prev, placed]);
  };

  const loadLayout = (index: number) => {
    setPlaced(layouts[index]);
  };

  const place = (coords: Coordinates) => {
    const OFFSET = {
      x: 0,
      y: 7,
    };
    setPlaced((prev) => ({
      ...prev,
      [selected as keyof Layout]: [
        ...(prev[selected as keyof Layout] ?? []),
        {
          x: coords.x + OFFSET.x,
          y: coords.y + OFFSET.y,
        },
      ],
    }));
    setSelected(undefined);
  };

  const handlePrint = () => {
    const prefix = 1001;
    const identifiedLayouts = layouts.reduce(
      (acc, layout, index) => ({
        ...acc,
        [index + prefix]: layout,
      }),
      {},
    );
    // eslint-disable-next-line no-console
    console.log(JSON.stringify(identifiedLayouts, null, 2));
  };

  // Load data
  return (
    <GameProvider>
      <div className="h-full w-full">
        <div className="absolute w-full h-full z-20">
          <div
            className="relative w-full h-full"
            style={{
              marginTop: "20px",
              left: "4px",
            }}
          >
            {selected && (
              <ResourcePlacer
                name={selected}
                onCancel={() => setSelected(undefined)}
                onPlace={place}
              />
            )}
          </div>
        </div>
        <InnerPanel className="fixed top-0 right-0 w-48 p-2 z-30 flex flex-col items-center">
          <span className="text-white">{t("layouts")}</span>
          {layouts.map((_, index) => (
            <Button key={index} onClick={() => loadLayout(index)}>
              {`Layout ${index + 1}`}
            </Button>
          ))}
        </InnerPanel>
        <div className="absolute bottom-0 flex z-30">
          {getKeys(RESOURCES).map((name) => (
            <Box
              key={name}
              image={RESOURCES[name].icon}
              isSelected={name === selected}
              onClick={() => setSelected(name)}
            />
          ))}
        </div>
        <div className="absolute bottom-24 right-2 flex z-30">
          <Button
            onClick={() =>
              setPlaced({
                plots: [],
                fruitPatches: [],
                gold: [],
                iron: [],
                stones: [],
                crimstones: [],
                sunstones: [],
                trees: [],
                boulder: [],
                beehives: [],
                flowers: [],
                oilReserves: [],
              })
            }
          >
            {t("clear")}
          </Button>
        </div>
        <div className="absolute bottom-12 right-2 flex z-30">
          <Button onClick={handlePrint}>{t("print")}</Button>
        </div>
        <div className="absolute bottom-2 right-2 flex z-30">
          <Button onClick={save}>{t("save")}</Button>
        </div>
        <div className="pointer-events-none">
          <ScrollContainer
            className="relative w-full h-full bg-[#0099db] !overflow-scroll overscroll-none"
            innerRef={container}
          >
            <div
              className="relative flex"
              style={{
                width: `${36 * GRID_WIDTH_PX}px`,
                height: `${36 * GRID_WIDTH_PX}px`,
                pointerEvents: "none",
              }}
            >
              <img
                src={background}
                className="absolute inset-0 w-full h-full z-10"
                style={{
                  marginTop: `${GRID_WIDTH_PX * -10}px`,
                }}
              />
              <div
                className="absolute z-30 "
                style={{
                  width: `${6 * GRID_WIDTH_PX}px`,
                  height: `${6 * GRID_WIDTH_PX}px`,
                  top: `${5 * GRID_WIDTH_PX}px`,
                  left: `${15 * GRID_WIDTH_PX}px`,
                }}
              >
                {getKeys(placed).flatMap((resourceName) => {
                  const resource = RESOURCES[resourceName];
                  const positions = placed[resourceName];

                  const { width, height } = RESOURCES[resourceName].dimensions;

                  return positions.map((coords, index) => {
                    const { x, y } = coords;
                    return (
                      <MapPlacement
                        key={`${resourceName}-${index}`}
                        x={x}
                        y={y}
                        height={height}
                        width={width}
                      >
                        {resource.component({})}
                      </MapPlacement>
                    );
                  });
                })}
              </div>
            </div>
            <div
              className="absolute inset-0 bg-repeat"
              style={{
                width: `${80 * GRID_WIDTH_PX}px`,
                height: `${80 * GRID_WIDTH_PX}px`,
                backgroundImage: `url(${waterMovement})`,
                backgroundSize: "400px",
                imageRendering: "pixelated",
              }}
            />
          </ScrollContainer>
        </div>
      </div>
    </GameProvider>
  );
};
