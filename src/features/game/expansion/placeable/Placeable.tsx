import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useActor } from "@xstate/react";
import { Context } from "features/game/GameProvider";
import { GRID_WIDTH_PX, PIXEL_SCALE } from "features/game/lib/constants";
import { MachineInterpreter } from "./landscapingMachine";

import Draggable from "react-draggable";
import { detectCollision } from "./lib/collisionDetection";
import classNames from "classnames";
import { Coordinates } from "../components/MapPlacement";
import { BUILDINGS_DIMENSIONS } from "features/game/types/buildings";
import {
  ANIMAL_DIMENSIONS,
  COLLECTIBLES_DIMENSIONS,
  CollectibleName,
} from "features/game/types/craftables";
import { READONLY_COLLECTIBLES } from "features/island/collectibles/CollectibleCollection";

import { Section } from "lib/utils/hooks/useScrollIntoView";
import { SUNNYSIDE } from "assets/sunnyside";
import { READONLY_RESOURCE_COMPONENTS } from "features/island/resources/Resource";
import { getGameGrid } from "./lib/makeGrid";
import { READONLY_BUILDINGS } from "features/island/buildings/components/building/BuildingComponents";
import { ZoomContext } from "components/ZoomProvider";
import { PlaceableLocation } from "features/game/types/collectibles";
import { RESOURCE_DIMENSIONS } from "features/game/types/resources";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { GameState } from "features/game/types/game";
import { DIRT_PATH_VARIANTS } from "features/island/lib/alternateArt";
import { getCurrentBiome, LandBiomeName } from "features/island/biomes/biomes";
import {
  getSortedCollectiblePositions,
  getSortedResourcePositions,
} from "../lib/utils";

export const PLACEABLES = (state: GameState) => {
  const island: GameState["island"] = state.island;
  const biome: LandBiomeName = getCurrentBiome(island);

  return {
    ...READONLY_COLLECTIBLES,
    ...READONLY_RESOURCE_COMPONENTS(),
    ...READONLY_BUILDINGS(state),
    "Dirt Path": () => (
      <img
        src={DIRT_PATH_VARIANTS[biome]}
        style={{ width: `${PIXEL_SCALE * 22}px` }}
      />
    ),
  };
};

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
  location: PlaceableLocation;
}

export const Placeable: React.FC<Props> = ({ location }) => {
  const { scale } = useContext(ZoomContext);

  const nodeRef = useRef<HTMLDivElement>(null);
  const { gameService, showTimers } = useContext(Context);

  const { island, season } = gameService.getSnapshot().context.state;

  const [gameState] = useActor(gameService);
  const [showHint, setShowHint] = useState(true);

  const child = gameService.getSnapshot().children
    .landscaping as MachineInterpreter;

  const [machine, send] = useActor(child);
  const { placeable, collisionDetected, origin, coordinates } = machine.context;

  const cropPositions = getSortedResourcePositions(
    gameState.context.state.crops,
  );
  const collectiblePositions = getSortedCollectiblePositions(
    gameState.context.state.collectibles,
  );
  const grid = getGameGrid({ cropPositions, collectiblePositions });

  const { t } = useAppTranslation();

  let dimensions = { width: 0, height: 0 };
  if (placeable?.name === "Bud") {
    dimensions = { width: 1, height: 1 };
  } else if (placeable?.name === "Pet") {
    dimensions = { width: 2, height: 2 };
  } else if (placeable?.name) {
    dimensions = {
      ...BUILDINGS_DIMENSIONS,
      ...COLLECTIBLES_DIMENSIONS,
      ...ANIMAL_DIMENSIONS,
      ...RESOURCE_DIMENSIONS,
    }[placeable.name];
  }

  const detect = useCallback(
    ({ x, y }: Coordinates) => {
      const collisionDetected = detectCollision({
        state: gameService.getSnapshot().context.state,
        position: { x, y, width: dimensions.width, height: dimensions.height },
        location,
        name: placeable?.name as CollectibleName,
      });

      send({ type: "UPDATE", coordinates: { x, y }, collisionDetected });
    },
    [
      dimensions.height,
      dimensions.width,
      gameService,
      location,
      placeable,
      send,
    ],
  );

  const [DEFAULT_POSITION_X, DEFAULT_POSITION_Y] =
    getInitialCoordinates(origin);

  const [position, setPosition] = useState<Coordinates>({
    x: DEFAULT_POSITION_X,
    y: DEFAULT_POSITION_Y,
  });

  useEffect(() => {
    if (!placeable) return;

    const [startingX, startingY] = getInitialCoordinates(origin);

    detect({
      x: Math.round(startingX / GRID_WIDTH_PX),
      y: Math.round(-startingY / GRID_WIDTH_PX),
    });
    setPosition({ x: startingX, y: startingY });
  }, [placeable, origin, detect]);

  // Arrow/WASD keyboard movement to move the ghost placeable on the grid
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!placeable) return;

      // Only while placing; ignore if typing in inputs
      if (document.activeElement?.tagName === "INPUT") return;

      let deltaX = 0;
      let deltaY = 0;

      if (e.key === "ArrowUp" || e.key === "w") {
        deltaY = 1;
      } else if (e.key === "ArrowDown" || e.key === "s") {
        deltaY = -1;
      } else if (e.key === "ArrowLeft" || e.key === "a") {
        deltaX = -1;
      } else if (e.key === "ArrowRight" || e.key === "d") {
        deltaX = 1;
      } else {
        return;
      }

      const nextGrid = { x: coordinates.x + deltaX, y: coordinates.y + deltaY };
      detect(nextGrid);
      setPosition({
        x: nextGrid.x * GRID_WIDTH_PX,
        y: -nextGrid.y * GRID_WIDTH_PX,
      });
      setShowHint(false);
      e.preventDefault();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [placeable, coordinates.x, coordinates.y, detect]);

  useEffect(() => {
    setShowHint(true);
  }, [origin]);

  if (!placeable) {
    return null;
  }

  const Collectible =
    placeable?.name === "Bud"
      ? PLACEABLES(gameState.context.state)["Bud"]
      : placeable?.name === "Pet"
        ? PLACEABLES(gameState.context.state)["PetNFT"]
        : PLACEABLES(gameState.context.state)[placeable.name];

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
          nodeRef={nodeRef as React.RefObject<HTMLElement>}
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
            setPosition({ x: data.x, y: data.y });
            setShowHint(false);
          }}
          onStop={(_, data) => {
            const x = Math.round(data.x / GRID_WIDTH_PX);
            const y = Math.round(-data.y / GRID_WIDTH_PX);

            detect({ x, y });

            send("DROP");
          }}
          position={position}
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
                className="flex absolute pointer-events-none z-50 bg-[#000000af] p-1 rounded w-max"
                style={{ top: "-35px" }}
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
                buildingId={"123"}
                buildingIndex={0}
                createdAt={0}
                readyAt={0}
                x={0}
                y={0}
                island={island}
                season={season.season}
                grid={grid}
                showTimers={showTimers}
                skills={gameState.context.state.bumpkin.skills}
                id={
                  placeable?.name === "Bud" || placeable?.name === "Pet"
                    ? placeable.id
                    : "123"
                }
                location="farm"
                name={placeable?.name as CollectibleName}
              />
            </div>
          </div>
        </Draggable>
      </div>
    </>
  );
};
