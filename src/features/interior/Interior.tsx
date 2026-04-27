import React, {
  useContext,
  useLayoutEffect,
  useMemo,
  type JSX,
} from "react";
import { useSelector } from "@xstate/react";
import { useSearchParams } from "react-router";

import { GRID_WIDTH_PX, PIXEL_SCALE } from "features/game/lib/constants";
import { Context } from "features/game/GameProvider";
import { MachineState } from "features/game/lib/gameMachine";
import { COLLECTIBLES_DIMENSIONS } from "features/game/types/craftables";
import { getKeys, getObjectEntries } from "lib/object";
import { MapPlacement } from "features/game/expansion/components/MapPlacement";
import { Collectible } from "features/island/collectibles/Collectible";
import { getGameGrid } from "features/game/expansion/placeable/lib/makeGrid";
import { Placeable } from "features/game/expansion/placeable/Placeable";
import { Hud } from "features/island/hud/Hud";
import { LandscapingHud } from "features/island/hud/LandscapingHud";
import { Section, useScrollIntoView } from "lib/utils/hooks/useScrollIntoView";
import { NON_COLLIDING_OBJECTS } from "features/game/expansion/placeable/lib/collisionDetection";
import { INTERIOR_CANVAS } from "features/game/expansion/placeable/lib/interiorLayouts";
import {
  INTERIOR_BACKGROUNDS,
  INTERIOR_BACKGROUND_NATIVE,
} from "./lib/interiorBackgrounds";
import { InteriorGridOverlay } from "./components/InteriorGridOverlay";
import { UpgradeButton } from "./components/UpgradeButton";
import { Bud } from "features/island/buds/Bud";
import { PetNFT } from "features/island/pets/PetNFT";
import { FarmHand } from "features/island/farmhand/FarmHand";
import { PlacedBumpkin } from "features/island/bumpkin/components/PlacedBumpkin";

const _landscaping = (state: MachineState) => state.matches("landscaping");
const _bumpkin = (state: MachineState) => state.context.state.bumpkin;
const _buds = (state: MachineState) => state.context.state.buds ?? {};
const _petNFTs = (state: MachineState) => state.context.state.pets?.nfts ?? {};
const _island = (state: MachineState) => state.context.state.island;

const _interiorCollectibles = (state: MachineState) => {
  // Only the ground level is rendered for now. When additional levels are
  // added (upstairs / basement) the active level will be selected here.
  const ground = state.context.state.interior.ground;
  return {
    collectibles: ground.collectibles,
    positions: getObjectEntries(ground.collectibles)
      .flatMap(([name, value]) => value?.map((item) => ({ name, item })))
      .filter(
        (c): c is NonNullable<typeof c> =>
          !!(c && c.item.coordinates !== undefined),
      )
      .map(({ name, item }) => ({
        id: item.id,
        x: item.coordinates!.x,
        y: item.coordinates!.y,
        flipped: item.flipped,
        name,
      })),
  };
};

const _interiorFarmHands = (state: MachineState) => {
  const bumpkins = state.context.state.farmHands.bumpkins;
  return Object.fromEntries(
    Object.entries(bumpkins).filter(
      ([, fh]) => fh.coordinates && fh.location === "interior",
    ),
  );
};

/**
 * The new, isolated interior placement surface — entirely separate from the
 * legacy `home` field. See `interiorLayouts.ts` for the tile-level shape and
 * `placeInteriorItem.ts` / `moveInteriorItem.ts` / `removeInteriorItem.ts` for
 * the reducers.
 *
 * Mounted at /interior.
 */
export const Interior: React.FC = () => {
  const { gameService } = useContext(Context);
  const [params] = useSearchParams();
  const [scrollIntoView] = useScrollIntoView();

  const landscaping = useSelector(gameService, _landscaping);
  const bumpkin = useSelector(gameService, _bumpkin);
  const buds = useSelector(gameService, _buds);
  const petNFTs = useSelector(gameService, _petNFTs);
  const island = useSelector(gameService, _island);

  // Center the canvas in the viewport on mount. GenesisBlock sits at the
  // canvas centre — same anchor MapPlacement uses to render placed items
  // and Placeable uses for its drag-coord origin.
  useLayoutEffect(() => {
    scrollIntoView(Section.GenesisBlock, "auto");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const interiorFarmHands = useSelector(gameService, _interiorFarmHands);
  const { collectibles, positions: interiorPositions } = useSelector(
    gameService,
    _interiorCollectibles,
  );

  // Dev coord overlay is OFF everywhere by default — including testnet/dev.
  // Append `?debug=1` to the URL on any environment to enable it for tuning.
  const debug = params.get("debug") === "1";

  // Interior doesn't need a game grid since we use INTERIOR_LAYOUTS for validity,
  // but the <Collectible> component accepts a grid prop — pass an empty one.
  const gameGrid = useMemo(
    () => getGameGrid({ cropPositions: [], collectiblePositions: [] }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [interiorPositions],
  );

  const canvasWidthPx = INTERIOR_CANVAS.width * GRID_WIDTH_PX;
  const canvasHeightPx = INTERIOR_CANVAS.height * GRID_WIDTH_PX;

  const mapPlacements: Array<JSX.Element> = [];

  mapPlacements.push(
    ...getKeys(collectibles)
      .filter((name) => collectibles[name])
      .flatMap((name, nameIndex) => {
        const items = collectibles[name]!;
        return items
          .filter((c) => c.coordinates)
          .map((c, itemIndex) => {
            const { x, y } = c.coordinates!;
            const { width, height } = COLLECTIBLES_DIMENSIONS[name];

            return (
              <MapPlacement
                key={`interior-collectible-${nameIndex}-${itemIndex}`}
                x={x}
                y={y}
                height={height}
                width={width}
                z={NON_COLLIDING_OBJECTS.includes(name) ? 0 : 1}
              >
                <Collectible
                  location="interior"
                  name={name}
                  id={c.id}
                  readyAt={c.readyAt ?? 0}
                  createdAt={c.createdAt ?? 0}
                  x={x}
                  y={y}
                  grid={gameGrid}
                  flipped={c.flipped}
                  index={itemIndex}
                />
              </MapPlacement>
            );
          });
      }),
  );

  mapPlacements.push(
    ...Object.entries(buds)
      .filter(([, bud]) => !!bud.coordinates && bud.location === "interior")
      .flatMap(([id, bud]) => {
        const { x, y } = bud.coordinates!;
        return (
          <MapPlacement key={`bud-${id}`} x={x} y={y} height={1} width={1}>
            <Bud id={id} x={x} y={y} />
          </MapPlacement>
        );
      }),
  );

  mapPlacements.push(
    ...Object.entries(petNFTs)
      .filter(
        ([, p]) => !!p.coordinates && p.location === "interior",
      )
      .flatMap(([id, p]) => {
        const { x, y } = p.coordinates!;
        return (
          <MapPlacement key={`petNFT-${id}`} x={x} y={y} height={2} width={2}>
            <PetNFT id={id} x={x} y={y} />
          </MapPlacement>
        );
      }),
  );

  mapPlacements.push(
    ...Object.entries(interiorFarmHands).map(([id, farmHand]) => {
      const { x, y } = farmHand.coordinates!;
      return (
        <MapPlacement key={`farmHand-${id}`} x={x} y={y} height={1} width={1}>
          <FarmHand id={id} location="interior" />
        </MapPlacement>
      );
    }),
  );

  if (bumpkin?.coordinates && bumpkin.location === "interior") {
    const { x, y } = bumpkin.coordinates;
    mapPlacements.push(
      <MapPlacement key="bumpkin" x={x} y={y} height={1} width={1}>
        <PlacedBumpkin location="interior" />
      </MapPlacement>,
    );
  }

  return (
    <>
      {/*
        Scrollable viewport. The 24x24 tile canvas is ~1008px square at default
        zoom — bigger than most laptop viewports — so we make the outer
        container scrollable. The inner flex column centers the canvas (and
        exit button) when the viewport has room and lets the user scroll to
        them when it doesn't.
      */}
      {/*
        `page-scroll-container` is the class Placeable.getInitialCoordinates
        reads `scrollLeft`/`scrollTop` from when computing the initial position
        of a placeable. Without it on a scrollable ancestor, clicking a
        collectible to place crashes with "Cannot read properties of undefined".
      */}
      <div
        className="page-scroll-container absolute inset-0 bg-[#181425] overflow-auto"
        style={{ imageRendering: "pixelated" }}
      >
        <div
          className="flex flex-col items-center justify-center"
          style={{
            // `width: fit-content` + `min-width: 100%` = max(canvas, viewport).
            // Same trick on the y-axis. Combined with the parent's overflow:auto
            // this gives us "center when there's room, scroll when there isn't."
            width: "fit-content",
            minWidth: "100%",
            minHeight: "100%",
            padding: "32px 16px",
            boxSizing: "border-box",
            gap: "24px",
          }}
        >
          <div
            className="relative"
            style={{
              width: `${canvasWidthPx}px`,
              height: `${canvasHeightPx}px`,
              flexShrink: 0,
            }}
          >
            {/* Bottom-left anchored background. The asset is 380x320 native px. */}
            <img
              src={INTERIOR_BACKGROUNDS[island.type]}
              className="absolute"
              style={{
                left: 0,
                bottom: 0,
                width: `${INTERIOR_BACKGROUND_NATIVE.width * PIXEL_SCALE}px`,
                height: `${INTERIOR_BACKGROUND_NATIVE.height * PIXEL_SCALE}px`,
                imageRendering: "pixelated",
              }}
            />

            {/*
              Zero-size sentinel at the canvas centre — Placeable.tsx anchors
              its placement coord-system origin here, MapPlacement renders
              placed items relative to the same point (CSS 50%/50%), and
              `scrollIntoView` brings it into the viewport centre on mount.
              All three agree on the same anchor.
            */}
            <div
              id={Section.GenesisBlock}
              className="absolute"
              style={{
                left: "50%",
                top: "50%",
                width: 0,
                height: 0,
              }}
            />

            {debug && <InteriorGridOverlay island={island.type} />}

            {landscaping && <Placeable location="interior" />}

            {/*
              Collectibles are rendered with the default MapPlacement origin —
              i.e. relative to the canvas centre — so their coordinates match
              the canvas-centre convention that `Placeable` uses when storing
              placement coords. The bottom-left-anchored INTERIOR_LAYOUTS data
              gets translated for the layout-mask check inside
              `detectInteriorCollision`; nothing else needs translation here.
            */}
            {mapPlacements.sort((a, b) => b.props.y - a.props.y)}
          </div>

          {/*
            No bottom Exit button on /interior — the bottom-left HUD farm icon
            is the canonical way back to the mainland. (Home / Barn / Greenhouse
            still have their own Exit buttons.)
          */}
        </div>
      </div>

      {!landscaping && <Hud isFarming location="interior" />}
      {landscaping && <LandscapingHud location="interior" />}
      {/* Upgrade button — appears only on volcano with non-maxed level_one. */}
      {!landscaping && <UpgradeButton />}
    </>
  );
};
