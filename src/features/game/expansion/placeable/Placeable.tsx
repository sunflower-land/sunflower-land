import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useActor, useSelector } from "@xstate/react";
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
import { GameState, TemperateSeasonName } from "features/game/types/game";
import { DIRT_PATH_VARIANTS } from "features/island/lib/alternateArt";
import { getCurrentBiome, LandBiomeName } from "features/island/biomes/biomes";
import {
  getSortedCollectiblePositions,
  getSortedResourcePositions,
} from "../lib/utils";
import { MachineState } from "features/game/lib/gameMachine";
import { FarmHand } from "features/island/farmhand/FarmHand";

type PlaceableArgs = {
  island: GameState["island"];
  season: TemperateSeasonName;
  henHouseLevel: number;
  barnLevel: number;
  placeableId?: string;
};

export const PLACEABLES = (args: PlaceableArgs) => {
  const { island, season, henHouseLevel, barnLevel, placeableId } = args;
  const biome: LandBiomeName = getCurrentBiome(island);

  return {
    ...READONLY_COLLECTIBLES,
    ...READONLY_RESOURCE_COMPONENTS({
      season,
      island,
    }),
    ...READONLY_BUILDINGS({ island, season, henHouseLevel, barnLevel }),
    FarmHand: () => <FarmHand id={placeableId ?? ""} />,
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

const _island = (state: MachineState) => state.context.state.island;
const _season = (state: MachineState) => state.context.state.season.season;
const _henHouseLevel = (state: MachineState) =>
  state.context.state.henHouse.level;
const _barnLevel = (state: MachineState) => state.context.state.barn.level;
const _crops = (state: MachineState) => state.context.state.crops;
const _collectibles = (state: MachineState) => state.context.state.collectibles;
const _landscapingMachine = (state: MachineState) =>
  state.children.landscaping as MachineInterpreter;
const _bumpkin = (state: MachineState) => state.context.state.bumpkin;

export const Placeable: React.FC<Props> = ({ location }) => {
  const { scale } = useContext(ZoomContext);
  const { gameService, showTimers } = useContext(Context);

  const island = useSelector(gameService, _island);
  const season = useSelector(gameService, _season);
  const henHouseLevel = useSelector(gameService, _henHouseLevel);
  const barnLevel = useSelector(gameService, _barnLevel);
  const crops = useSelector(gameService, _crops);
  const collectibles = useSelector(gameService, _collectibles);
  const bumpkin = useSelector(gameService, _bumpkin);
  const landscapingMachine = useSelector(gameService, _landscapingMachine);

  const [machine, send] = useActor(landscapingMachine);
  const { placeable, collisionDetected, origin, coordinates } = machine.context;

  const nodeRef = useRef<HTMLDivElement>(null);

  const hintResetToken = useMemo(
    () => Symbol(`origin-${origin?.x ?? "none"}-${origin?.y ?? "none"}`),
    [origin],
  );

  const [dismissedToken, setDismissedToken] = useState<symbol | null>(null);

  const showHint = dismissedToken !== hintResetToken;

  const hideHint = useCallback(() => {
    setDismissedToken((current) => {
      if (current === hintResetToken) {
        return current;
      }

      return hintResetToken;
    });
  }, [hintResetToken]);

  const cropPositions = getSortedResourcePositions(crops);
  const collectiblePositions = getSortedCollectiblePositions(collectibles);
  const grid = getGameGrid({ cropPositions, collectiblePositions });

  const { t } = useAppTranslation();

  let dimensions = { width: 0, height: 0 };
  if (placeable?.name === "Bud") {
    dimensions = { width: 1, height: 1 };
  } else if (placeable?.name === "Pet") {
    dimensions = { width: 2, height: 2 };
  } else if (placeable?.name === "FarmHand") {
    dimensions = { width: 1, height: 1 };
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

  useEffect(() => {
    if (!placeable) return;

    const [startingX, startingY] = getInitialCoordinates(origin);

    detect({
      x: Math.round(startingX / GRID_WIDTH_PX),
      y: Math.round(-startingY / GRID_WIDTH_PX),
    });
  }, [placeable, origin, detect]);

  const position = useMemo<Coordinates>(
    () => ({
      x: coordinates.x * GRID_WIDTH_PX,
      y: -coordinates.y * GRID_WIDTH_PX,
    }),
    [coordinates.x, coordinates.y],
  );

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
      hideHint();
      e.preventDefault();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [placeable, coordinates.x, coordinates.y, detect, hideHint]);

  if (!placeable) return null;

  const Collectible = PLACEABLES({
    island,
    season,
    henHouseLevel,
    barnLevel,
    placeableId: placeable.id,
  })[placeable.name];

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
            send({ type: "DRAG" });
          }}
          onDrag={(_, data) => {
            const x = Math.round(data.x / GRID_WIDTH_PX);
            const y = Math.round(-data.y / GRID_WIDTH_PX);

            detect({ x, y });
            hideHint();
          }}
          onStop={(_, data) => {
            const x = Math.round(data.x / GRID_WIDTH_PX);
            const y = Math.round(-data.y / GRID_WIDTH_PX);

            detect({ x, y });

            send({ type: "DROP" });
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
                index={0}
                buildingId={"123"}
                buildingIndex={0}
                createdAt={0}
                readyAt={0}
                x={0}
                y={0}
                island={island}
                season={season}
                grid={grid}
                showTimers={showTimers}
                skills={bumpkin.skills}
                id={placeable.id ?? "123"}
                location={location}
                name={placeable?.name as CollectibleName}
              />
            </div>
          </div>
        </Draggable>
      </div>
    </>
  );
};
