import React, { useContext, useEffect, useRef, useState } from "react";
import { useActor } from "@xstate/react";
import { Context } from "features/game/GameProvider";
import { GRID_WIDTH_PX, PIXEL_SCALE } from "features/game/lib/constants";
import { MachineInterpreter } from "./landscapingMachine";

import Draggable from "react-draggable";
import { detectCollision } from "./lib/collisionDetection";
import classNames from "classnames";
import { Coordinates } from "../components/MapPlacement";
import {
  BUILDINGS_DIMENSIONS,
  PlaceableName,
} from "features/game/types/buildings";
import {
  ANIMAL_DIMENSIONS,
  COLLECTIBLES_DIMENSIONS,
  CollectibleName,
} from "features/game/types/craftables";
import { READONLY_COLLECTIBLES } from "features/island/collectibles/CollectibleCollection";
import { Chicken } from "features/island/chickens/Chicken";

import { Section } from "lib/utils/hooks/useScrollIntoView";
import { SUNNYSIDE } from "assets/sunnyside";
import { READONLY_RESOURCE_COMPONENTS } from "features/island/resources/Resource";
import { getGameGrid } from "./lib/makeGrid";
import { READONLY_BUILDINGS } from "features/island/buildings/components/building/BuildingComponents";
import { ZoomContext } from "components/ZoomProvider";
import { isBudName } from "features/game/types/buds";
import { CollectibleLocation } from "features/game/types/collectibles";
import { RESOURCE_DIMENSIONS } from "features/game/types/resources";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { IslandType } from "features/game/types/game";
import { DIRT_PATH_VARIANTS } from "features/island/lib/alternateArt";

export const PLACEABLES: (
  island: IslandType,
) => Record<PlaceableName | "Bud", React.FC<any>> = (island) => ({
  Chicken: () => <Chicken x={0} y={0} id="123" />, // Temp id for placing, when placed action will assign a random UUID and the temp one will be overridden.
  ...READONLY_COLLECTIBLES,
  ...READONLY_RESOURCE_COMPONENTS(island),
  ...READONLY_BUILDINGS(island),
  "Dirt Path": () => (
    <img
      src={DIRT_PATH_VARIANTS[island]}
      style={{ width: `${PIXEL_SCALE * 22}px` }}
    />
  ),
});

// TODO - get dynamic bounds for placeable
// const BOUNDS_MIN_X = -15
// const BOUNDS_MAX_X = 5
// const BOUNDS_MIN_Y = -5
// const BOUNDS_MAX_Y = 15

export const getInitialCoordinates = (origin?: Coordinates) => {
  // This container helps us to calculate the scroll pixels as in our application
  // window do not scroll but this container dose
  const pageScrollContainer = document.getElementsByClassName(
    "page-scroll-container",
  )[0];

  const viewportMidPointX =
    window.innerWidth / 2 + pageScrollContainer.scrollLeft;
  const viewportMidPointY =
    window.innerHeight / 2 + pageScrollContainer.scrollTop;

  const land = document
    .getElementById(Section.GenesisBlock)
    ?.getBoundingClientRect();
  let landMidX =
    pageScrollContainer.scrollLeft + (land?.left ?? 0) + (land?.width ?? 0) / 2;
  let landMidY =
    pageScrollContainer.scrollTop + (land?.top ?? 0) + (land?.height ?? 0) / 2;

  if (origin) {
    const xOffset = viewportMidPointX - landMidX;
    const yOffset = viewportMidPointY - landMidY;

    landMidX -= GRID_WIDTH_PX * origin.x - xOffset;
    landMidY += GRID_WIDTH_PX * origin.y + yOffset;
  }

  // This division and then multiplication with GRID_WIDTH_PX has been done as
  // due to a small pixel difference in rounding, the actual placeable square was
  // a bit off from the land square.
  const INITIAL_POSITION_X =
    Math.round((viewportMidPointX - landMidX) / GRID_WIDTH_PX) * GRID_WIDTH_PX;
  const INITIAL_POSITION_Y =
    Math.round((viewportMidPointY - landMidY) / GRID_WIDTH_PX) * GRID_WIDTH_PX;
  return [INITIAL_POSITION_X, INITIAL_POSITION_Y];
};

interface Props {
  location: CollectibleLocation;
}
export const Placeable: React.FC<Props> = ({ location }) => {
  const { scale } = useContext(ZoomContext);

  const nodeRef = useRef(null);
  const { gameService } = useContext(Context);

  const [gameState] = useActor(gameService);
  const [showHint, setShowHint] = useState(true);

  const child = gameService.state.children.landscaping as MachineInterpreter;

  const [machine, send] = useActor(child);
  const { placeable, collisionDetected, origin, coordinates } = machine.context;

  const grid = getGameGrid(gameState.context.state);

  const { t } = useAppTranslation();

  let dimensions = { width: 0, height: 0 };
  if (isBudName(placeable)) {
    dimensions = { width: 1, height: 1 };
  } else if (placeable) {
    dimensions = {
      ...BUILDINGS_DIMENSIONS,
      ...COLLECTIBLES_DIMENSIONS,
      ...ANIMAL_DIMENSIONS,
      ...RESOURCE_DIMENSIONS,
    }[placeable];
  }

  const detect = ({ x, y }: Coordinates) => {
    const collisionDetected = detectCollision({
      state: gameService.state.context.state,
      position: {
        x,
        y,
        width: dimensions.width,
        height: dimensions.height,
      },
      location,
      name: placeable as CollectibleName,
    });

    send({ type: "UPDATE", coordinates: { x, y }, collisionDetected });
  };

  const [DEFAULT_POSITION_X, DEFAULT_POSITION_Y] =
    getInitialCoordinates(origin);

  useEffect(() => {
    const [startingX, startingY] = getInitialCoordinates({ x: 0, y: 0 });

    detect({
      x: Math.round(startingX / GRID_WIDTH_PX),
      y: Math.round(-startingY / GRID_WIDTH_PX),
    });
  }, []);

  useEffect(() => {
    setShowHint(true);
  }, [origin]);

  if (!placeable) {
    return null;
  }

  const Collectible = isBudName(placeable)
    ? PLACEABLES(gameState.context.state.island.type)["Bud"]
    : PLACEABLES(gameState.context.state.island.type)[placeable];

  return (
    <>
      <div
        id="bg-overlay "
        className=" bg-black opacity-40 fixed inset-0"
        style={{
          zIndex: 99,
          height: "200%",
          right: "-1000px",
          left: "-1000px",
          top: "-1000px",
          overflow: "hidden",
          bottom: "1000px",
        }}
      />
      <div className="fixed left-1/2 top-1/2" style={{ zIndex: 100 }}>
        <Draggable
          key={`${origin?.x}-${origin?.y}`}
          defaultPosition={{
            x: DEFAULT_POSITION_X,
            y: DEFAULT_POSITION_Y,
          }}
          nodeRef={nodeRef}
          grid={[GRID_WIDTH_PX * scale.get(), GRID_WIDTH_PX * scale.get()]}
          scale={scale.get()}
          onStart={() => {
            // reset
            send("DRAG");
          }}
          onDrag={(_, data) => {
            const x = Math.round(data.x / GRID_WIDTH_PX);
            const y = Math.round(-data.y / GRID_WIDTH_PX);

            detect({ x, y });
            setShowHint(false);
          }}
          onStop={(_, data) => {
            const x = Math.round(data.x / GRID_WIDTH_PX);
            const y = Math.round(-data.y / GRID_WIDTH_PX);

            detect({ x, y });

            send("DROP");
          }}
        >
          <div
            ref={nodeRef}
            data-prevent-drag-scroll
            className={classNames("flex flex-col items-center", {
              "cursor-grab": !machine.matches({ editing: "dragging" }),
              "cursor-grabbing": machine.matches({ editing: "dragging" }),
            })}
            style={{ pointerEvents: "auto" }}
          >
            {showHint && (
              <div
                className="flex absolute pointer-events-none"
                style={{
                  top: "-35px",
                  width: "135px",
                }}
              >
                <img src={SUNNYSIDE.icons.drag} className="h-6 mr-2" />
                <span className="text-white text-sm">
                  {t("landscape.dragMe")}
                </span>
              </div>
            )}
            <div
              draggable={false}
              className={classNames(
                " w-full h-full relative img-highlight pointer-events-none",
                {
                  "bg-green-background/80": !collisionDetected,
                  "bg-red-background/80": collisionDetected,
                },
              )}
              style={{
                width: `${dimensions.width * GRID_WIDTH_PX}px`,
                height: `${dimensions.height * GRID_WIDTH_PX}px`,
              }}
            >
              <Collectible
                grid={grid}
                coordinates={coordinates}
                id={isBudName(placeable) ? placeable.split("-")[1] : undefined}
                game={gameState.context.state}
              />
            </div>
          </div>
        </Draggable>
      </div>
    </>
  );
};
